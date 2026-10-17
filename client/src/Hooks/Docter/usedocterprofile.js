import { useEffect, useState } from "react";
import {
  getMyDoctorProfile,
  updateMyDoctorProfile,
  addScheduleDate,
  deleteScheduleDate,
  addScheduleSlot,
  deleteScheduleSlot,
} from "../../api/docterapi.js";
import { useAuth } from "../../Context/Authcontext.jsx";
import { compressImage } from "../../utils/Compressimage.js";
// Fields the doctor can actually edit on the Doctor document itself — kept in
// one place so the form and the save handler can't drift apart.
// "name" is handled separately below since it lives on the User document, not here.
// rating/successRate/totalPatients are NOT editable here: the backend doesn't
// accept changes to those from a doctor, so the page shows them read-only.
const EDITABLE_FIELDS = ["specialization", "qualifications", "experience", "location", "consultationFee"];

export const useDoctorProfile = () => {
  const { refreshUser } = useAuth();

  const [doctor, setDoctor] = useState(null);
  const [form, setForm] = useState(null); // a working copy the inputs are bound to
  const [about, setAbout] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Schedule-specific UI state
  const [newDate, setNewDate] = useState("");
  const [newSlotTimes, setNewSlotTimes] = useState({}); // { "2026-02-15": "11:00 AM" }
  const [scheduleBusy, setScheduleBusy] = useState(false);

  const applyDoctor = (d) => {
    setDoctor(d);
    setForm({
      name: d.user?.name || "",
      ...Object.fromEntries(EDITABLE_FIELDS.map((f) => [f, d[f] ?? ""])),
    });
    setAbout(d.about || "");
    setIsAvailable(d.isAvailable);
  };

  const loadProfile = async () => {
    setLoading(true);
    setError("");
    try {
      applyDoctor(await getMyDoctorProfile());
    } catch {
      setError("Could not load your profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const setField = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const toggleAvailable = async () => {
    const next = !isAvailable;
    setIsAvailable(next); // optimistic — flips immediately, backend call happens quietly after
    try {
      await updateMyDoctorProfile({ isAvailable: next });
    } catch {
      setIsAvailable(!next); // revert if the save failed
    }
  };

  const saveProfile = async (e) => {
    e?.preventDefault();
    setSaving(true);
    setSaved(false);
    setError("");
    try {
      const updated = await updateMyDoctorProfile({
        ...form,
        experience: Number(form.experience),
        consultationFee: Number(form.consultationFee),
        about,
      });
      // clg("Updated doctor profile:", updated);
      applyDoctor(updated);
      await refreshUser(); // in case "name" changed, keep the Navbar/Dashboard greeting in sync
      setSaved(true);
    } catch {
      setError("Could not save your profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const resetToServer = () => doctor && applyDoctor(doctor);

  // Uploads a new profile photo immediately — the doctor doesn't need to hit
  // "Save Profile" for this, it takes effect as soon as a file is picked
  const changePhoto = async (file) => {
    if (!file) return;
    setUploadingPhoto(true);
    setError("");
    try {
     const small = await compressImage(file);
      const formData = new FormData();
      formData.append("image", small);

      const updated = await updateMyDoctorProfile(formData);
      console.log("Updated doctor profile with new photo:", updated);
      applyDoctor(updated);
    } catch {
      setError("Could not upload your photo. Please try again.");
    } finally {
      setUploadingPhoto(false);
    }
  };

  // ---- Schedule & Availability ----
  const handleAddDate = async () => {
    if (!newDate) return;
    setScheduleBusy(true);
    try {
      const schedule = await addScheduleDate(newDate);
      setDoctor((prev) => ({ ...prev, schedule }));
      setNewDate("");
    } catch (err) {
      alert(err.response?.data?.message || "Could not add date");
    } finally {
      setScheduleBusy(false);
    }
  };

  const handleDeleteDate = async (date) => {
    setScheduleBusy(true);
    try {
      const schedule = await deleteScheduleDate(date);
      setDoctor((prev) => ({ ...prev, schedule }));
    } catch (err) {
      alert(err.response?.data?.message || "Could not remove this date");
    } finally {
      setScheduleBusy(false);
    }
  };

  const setSlotTimeInput = (date, time) => setNewSlotTimes((prev) => ({ ...prev, [date]: time }));

  const handleAddSlot = async (date) => {
    const time = newSlotTimes[date];
    if (!time) return;
    setScheduleBusy(true);
    try {
      const schedule = await addScheduleSlot(date, time);
      setDoctor((prev) => ({ ...prev, schedule }));
      setSlotTimeInput(date, "");
    } catch (err) {
      alert(err.response?.data?.message || "Could not add slot");
    } finally {
      setScheduleBusy(false);
    }
  };

  const handleDeleteSlot = async (date, time) => {
    setScheduleBusy(true);
    try {
      const schedule = await deleteScheduleSlot(date, time);
      setDoctor((prev) => ({ ...prev, schedule }));
    } catch (err) {
      alert(err.response?.data?.message || "Could not remove this slot (it may already be booked)");
    } finally {
      setScheduleBusy(false);
    }
  };

  return {
    doctor,
    form,
    about,
    setAbout,
    isAvailable,
    loading,
    error,
    saving,
    saved,
    uploadingPhoto,
    setField,
    toggleAvailable,
    saveProfile,
    resetToServer,
    changePhoto,
    schedule: doctor?.schedule || [],
    newDate,
    setNewDate,
    newSlotTimes,
    setSlotTimeInput,
    scheduleBusy,
    handleAddDate,
    handleDeleteDate,
    handleAddSlot,
    handleDeleteSlot,
  };
};