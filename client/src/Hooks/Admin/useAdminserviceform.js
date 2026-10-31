import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { getServiceById , createService, updateService } from "../../api/adminapi.js";

const emptyForm = { name: "", price: "", category: "", description: "" };

// One hook for both modes: pass a serviceId to edit that service, or nothing to create a new one
export const useAdminServiceForm = (serviceId) => {
  const isEdit = Boolean(serviceId);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form, setForm] = useState(emptyForm);
  const [isActive, setIsActive] = useState(true);

  const [instructions, setInstructions] = useState([]);
  const [instructionDraft, setInstructionDraft] = useState("");

  const [existingImageUrl, setExistingImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [loading, setLoading] = useState(isEdit);
  const [loadError, setLoadError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Edit mode: load the service once and pre-fill the form.
  // Plain fetch (not React Query) on purpose — a form must always start from fresh
  // data, never from a cached copy that could overwrite what the admin is typing.
  useEffect(() => {
    if (!isEdit) return;
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setLoadError("");
      try {
        const s = await getServiceById(serviceId);
        if (cancelled) return;
        setForm({ name: s.name, price: s.price, category: s.category || "", description: s.description });
        setIsActive(s.isActive);
        setInstructions(s.preTestInstructions || []);
        setExistingImageUrl(s.image?.url || "");
      } catch (err) {
        if (!cancelled) setLoadError(err.response?.status === 404 ? "Service not found" : "Could not load this service");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [serviceId, isEdit]);

  const setField = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleImageChange = (file) => {
    setImageFile(file || null);
    setImagePreview(file ? URL.createObjectURL(file) : "");
  };

  // Drops only a newly picked file — falls back to the saved image (if any)
  const clearNewImage = () => {
    setImageFile(null);
    setImagePreview("");
  };

  const addInstruction = () => {
    const text = instructionDraft.trim();
    if (!text || instructions.includes(text)) return;
    setInstructions((prev) => [...prev, text]);
    setInstructionDraft("");
  };

  const removeInstruction = (index) => setInstructions((prev) => prev.filter((_, i) => i !== index));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      // Lists can't travel in form-data, so it goes as a JSON string (the backend parses it)
      formData.append("preTestInstructions", JSON.stringify(instructions));
      if (isEdit) formData.append("isActive", isActive);
      if (imageFile) formData.append("image", imageFile);

      if (isEdit) {
        await updateService(serviceId, formData);
      } else {
        await createService(formData);
      }

      // The list and the Service Dashboard are cached — mark them stale so they show the change
      queryClient.invalidateQueries({ queryKey: ["admin", "services"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "services-overview"] });
      navigate("/admin/services");
    } catch (err) {
      setError(err.response?.data?.message || "Could not save the service");
    } finally {
      setSubmitting(false);
    }
  };

  return {
    isEdit,
    form,
    setField,
    isActive,
    setIsActive,
    instructions,
    instructionDraft,
    setInstructionDraft,
    addInstruction,
    removeInstruction,
    previewSrc: imagePreview || existingImageUrl,
    hasNewImage: Boolean(imageFile),
    imageName: imageFile?.name || "",
    handleImageChange,
    clearNewImage,
    loading,
    loadError,
    submitting,
    error,
    submit,
  };
};