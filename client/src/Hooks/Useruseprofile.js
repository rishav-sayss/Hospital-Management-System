import { useState } from "react";
import { useAuth } from "../Context/Authcontext.jsx";
import { updateMeRequest, changePasswordRequest } from "../api/Authapi.js";

export const useUserProfile = () => {
  const { user, refreshUser } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [savingName, setSavingName] = useState(false);
  const [nameSaved, setNameSaved] = useState(false);
  const [nameError, setNameError] = useState("");

  const saveName = async (e) => {
    e.preventDefault();
    setSavingName(true);
    setNameSaved(false);
    setNameError("");
    try {
      await updateMeRequest(name);
      await refreshUser();
      setNameSaved(true);
    } catch (err) {
      setNameError(err.response?.data?.message || "Could not update your name");
    } finally {
      setSavingName(false);
    }
  };

  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const setPasswordField = (field) => (e) =>
    setPasswordForm((prev) => ({ ...prev, [field]: e.target.value }));

  const savePassword = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSaved(false);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New password and confirmation don't match");
      return;
    }

    setSavingPassword(true);
    try {
      await changePasswordRequest(passwordForm.currentPassword, passwordForm.newPassword);
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setPasswordSaved(true);
    } catch (err) {
      setPasswordError(err.response?.data?.message || "Could not change your password");
    } finally {
      setSavingPassword(false);
    }
  };

  return {
    user,
    name,
    setName,
    savingName,
    nameSaved,
    nameError,
    saveName,
    passwordForm,
    setPasswordField,
    savingPassword,
    passwordSaved,
    passwordError,
    savePassword,
  };
};