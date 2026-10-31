import { Link, useParams } from "react-router-dom";
import { FilePlus2, Pencil, X, Plus, ListChecks, Stethoscope } from "lucide-react";
import { useAdminServiceForm } from "../../Hooks/Admin/useAdminserviceform.js";

const inputClass =
  "w-full rounded-full border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500";

// Serves two routes: /admin/services/add (no :id) and /admin/services/:id/edit
const Adminserviceform = () => {
  const { id } = useParams();
  const {
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
    previewSrc,
    hasNewImage,
    imageName,
    handleImageChange,
    clearNewImage,
    loading,
    loadError,
    submitting,
    error,
    submit,
  } = useAdminServiceForm(id);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/70 to-white px-3 sm:px-6 py-6 sm:py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-teal-800 mb-6">
          {isEdit ? <Pencil className="w-6 h-6" /> : <FilePlus2 className="w-6 h-6" />}
          {isEdit ? "Edit Service" : "Add Service"}
        </h1>

        {loading && <p className="text-slate-500">Loading service...</p>}

        {loadError && (
          <div>
            <p className="text-rose-600 mb-3">{loadError}</p>
            <Link to="/admin/services" className="text-sm font-medium text-teal-700 underline">
              Back to services
            </Link>
          </div>
        )}

        {!loading && !loadError && (
          <form
            onSubmit={submit}
            className="rounded-2xl sm:rounded-3xl bg-white border border-slate-100 shadow-sm p-5 sm:p-8 space-y-6"
          >
            {/* Image */}
            <div>
              <p className="text-sm text-slate-600 mb-2">Service Image</p>
              <div className="flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600 cursor-pointer hover:border-slate-300 transition-colors max-w-full">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageChange(e.target.files?.[0])}
                  />
                  <span className="truncate">Choose File {imageName || "No file chosen"}</span>
                </label>

                <div className="relative w-16 h-16 shrink-0">
                  <div className="w-16 h-16 rounded-xl bg-teal-50 ring-2 ring-teal-200 overflow-hidden flex items-center justify-center">
                    {previewSrc ? (
                      <img src={previewSrc} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Stethoscope className="w-6 h-6 text-teal-400" />
                    )}
                  </div>
                  {hasNewImage && (
                    <button
                      type="button"
                      onClick={clearNewImage}
                      aria-label="Discard the new image"
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input placeholder="Service Name" required value={form.name} onChange={setField("name")} className={inputClass} />
              <input
                placeholder="Price (₹)"
                type="number"
                min="0"
                required
                value={form.price}
                onChange={setField("price")}
                className={inputClass}
              />
              <input
                placeholder="Category (e.g. Diagnostic)"
                value={form.category}
                onChange={setField("category")}
                className={`${inputClass} ${isEdit ? "" : "sm:col-span-2"}`}
              />
              {/* A brand-new service always starts Available, so this only matters when editing */}
              {isEdit && (
                <select
                  value={isActive ? "available" : "unavailable"}
                  onChange={(e) => setIsActive(e.target.value === "available")}
                  className={inputClass}
                >
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              )}
            </div>

            <textarea
              placeholder="About this service"
              rows={4}
              required
              value={form.description}
              onChange={setField("description")}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none"
            />

            {/* Pre-test instructions */}
            <div className="rounded-2xl bg-emerald-50/60 border border-emerald-100 p-4 sm:p-5">
              <h2 className="flex items-center gap-2 font-bold text-teal-800 mb-1">
                <ListChecks className="w-4 h-4" /> Pre-Test Instructions
              </h2>
              <p className="text-xs text-slate-500 mb-4">Optional — shown to patients before they book.</p>

              <div className="flex gap-2">
                <input
                  value={instructionDraft}
                  onChange={(e) => setInstructionDraft(e.target.value)}
                  onKeyDown={(e) => {
                    // Enter adds the line instead of submitting the whole form
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addInstruction();
                    }
                  }}
                  placeholder="e.g. Avoid caffeine 1 hour before"
                  className="flex-1 min-w-0 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
                <button
                  type="button"
                  onClick={addInstruction}
                  disabled={!instructionDraft.trim()}
                  className="flex items-center gap-1.5 rounded-full bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white text-sm font-semibold px-4 py-2 transition-colors shrink-0"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>

              {instructions.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {instructions.map((line, i) => (
                    <li
                      key={`${line}-${i}`}
                      className="flex items-center justify-between gap-3 rounded-xl bg-white border border-teal-100 px-3 py-2 text-sm text-teal-900"
                    >
                      <span className="min-w-0 break-words">{line}</span>
                      <button
                        type="button"
                        onClick={() => removeInstruction(i)}
                        aria-label="Remove instruction"
                        className="text-rose-500 hover:text-rose-700 shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {error && (
              <p className="text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-4 py-3">{error}</p>
            )}

            <div className="flex flex-col-reverse sm:flex-row gap-3">
              {isEdit && (
                <Link
                  to="/admin/services"
                  className="sm:flex-1 text-center rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-sm py-3 transition-colors"
                >
                  Cancel
                </Link>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="sm:flex-1 rounded-full bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-semibold text-sm py-3 transition-colors"
              >
                {submitting ? "Saving..." : isEdit ? "Save Changes" : "Create Service"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Adminserviceform;