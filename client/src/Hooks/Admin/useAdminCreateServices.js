
import { useEffect, useState } from "react";
import { createService } from "../../api/adminapi.js";

const initialForm = {
  name: "",
  price: "",
  category: "",
  description: "",
};

export const useCreateService = () => {
  const [form, setForm] = useState(initialForm);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [instructions, setInstructions] = useState([""]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      if (preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5 MB.");
      e.target.value = "";
      return;
    }

    setError("");
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImage(null);
    setPreview("");
  };

  const updateInstruction = (index, value) => {
    setInstructions((prev) =>
      prev.map((item, i) => (i === index ? value : item))
    );
  };

  const addInstruction = () => {
    setInstructions((prev) => [...prev, ""]);
  };

  const removeInstruction = (index) => {
    setInstructions((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  const resetForm = () => {
    setForm({ ...initialForm });
    setImage(null);
    setPreview("");
    setInstructions([""]);
    setMessage("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!form.name.trim() || !form.description.trim()) {
      setError("Service name and description are required.");
      return;
    }

    if (
      form.price === "" ||
      !Number.isFinite(Number(form.price)) ||
      Number(form.price) < 0
    ) {
      setError("Please enter a valid price.");
      return;
    }

    const formData = new FormData();

    formData.append("name", form.name.trim());
    formData.append("price", form.price);
    formData.append("category", form.category.trim());
    formData.append("description", form.description.trim());

    const cleanInstructions = instructions
      .map((item) => item.trim())
      .filter(Boolean);

    formData.append(
      "preTestInstructions",
      JSON.stringify(cleanInstructions)
    );

    if (image) {
      formData.append("image", image);
    }

    try {
      setLoading(true);

      await createService(formData);

      resetForm();
      setMessage("Service created successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not create service."
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    preview,
    instructions,
    loading,
    message,
    error,
    handleChange,
    handleImage,
    removeImage,
    updateInstruction,
    addInstruction,
    removeInstruction,
    resetForm,
    handleSubmit,
  };
};
