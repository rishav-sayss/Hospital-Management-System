import { useState } from "react";
import { adminCreateDoctor } from "../../api/docterapi.js"

const emptyForm = {
  name: "",
  specialization: "",
  location: "",
  experience: "",
  qualifications: "",
  consultationFee: "",
  rating: "",
  totalPatients: "",
  successRate: "",
  email: "",
  password: "",
  about: "",
};

export const useAdminCreateDoctor = () => {
  const [form, setForm] = useState(emptyForm);
  const [isAvailable, setIsAvailable] = useState(true);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  // Slots are collected locally as a flat list, then grouped by date on submit
  const [scheduleSlots, setScheduleSlots] = useState([]); // [{ date, time }]
  const [slotDate, setSlotDate] = useState("");
  const [slotHour, setSlotHour] = useState("09");
  const [slotMinute, setSlotMinute] = useState("00");
  const [slotPeriod, setSlotPeriod] = useState("AM");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const setField = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleImageChange = (file) => {
    setImageFile(file || null);
    setImagePreview(file ? URL.createObjectURL(file) : "");
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
  };

  const addSlot = () => {
    if (!slotDate) return;
    const time = `${slotHour}:${slotMinute} ${slotPeriod}`;
    // Skip an exact duplicate (same date + time already queued)
    setScheduleSlots((prev) =>
      prev.some((s) => s.date === slotDate && s.time === time) ? prev : [...prev, { date: slotDate, time }]
    );
  };

  const removeSlot = (index) => setScheduleSlots((prev) => prev.filter((_, i) => i !== index));

  // Turns the flat [{date, time}] list into the [{date, slots:[{time}]}] shape the backend expects
  const buildSchedulePayload = () => {
    const byDate = {};
    scheduleSlots.forEach(({ date, time }) => {
      if (!byDate[date]) byDate[date] = [];
      byDate[date].push({ time });
    });
    return Object.entries(byDate).map(([date, slots]) => ({ date, slots }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setSubmitting(true);

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      formData.append("isAvailable", isAvailable);
      formData.append("schedule", JSON.stringify(buildSchedulePayload()));
      if (imageFile) formData.append("image", imageFile);

      await adminCreateDoctor(formData);

      setForm(emptyForm);
      setIsAvailable(true);
      removeImage();
      setScheduleSlots([]);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Could not create doctor");
    } finally {
      setSubmitting(false);
    }
  };

  return {
    form,
    setField,
    isAvailable,
    setIsAvailable,
    imageFile,
    imagePreview,
    handleImageChange,
    removeImage,
    scheduleSlots,
    addSlot,
    removeSlot,
    slotDate,
    setSlotDate,
    slotHour,
    setSlotHour,
    slotMinute,
    setSlotMinute,
    slotPeriod,
    setSlotPeriod,
    submitting,
    error,
    success,
    submit,
  };
};