
import { useCreateService } from "../../Hooks/Admin/useAdminCreateServices.js";

export default function AddService() {
  const {
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
  } = useCreateService();

  const labelClass =
    "mb-2 block text-sm font-medium text-emerald-900";

  const inputClass =
    "w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50";

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 px-4 py-6 sm:px-6 lg:px-8">
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-5xl rounded-3xl border border-white bg-white/95 p-5 shadow-xl shadow-emerald-900/5 sm:p-8 lg:p-10"
      >
        {/* Heading and actions */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-emerald-800 sm:text-4xl">
              Add Service
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Create a beautiful service card for your patients.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={resetForm}
              disabled={loading}
              className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Reset
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-200 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Saving..." : "✓ Save Service"}
            </button>
          </div>
        </div>

        {/* Success and error messages */}
        {message && (
          <div
            role="status"
            className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800"
          >
            {message}
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-7 md:grid-cols-[250px_minmax(0,1fr)] lg:grid-cols-[275px_minmax(0,1fr)]">
          {/* Image upload section */}
          <section>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
              <div className="flex aspect-square items-center justify-center overflow-hidden rounded-xl border border-emerald-100 bg-white">
                {preview ? (
                  <img
                    src={preview}
                    alt="Service preview"
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div className="px-5 text-center">
                    <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-3xl text-emerald-700">
                      +
                    </div>
                    <p className="text-sm font-medium text-slate-600">
                      Service image
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      PNG or JPG, up to 5 MB
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-center gap-2">
                <label className="flex flex-1 cursor-pointer items-center justify-center rounded-full border border-emerald-200 bg-white px-3 py-3 text-center text-sm font-medium text-slate-700 transition hover:bg-emerald-50">
                  + {preview ? "Replace Image" : "Upload Image"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImage}
                    className="hidden"
                  />
                </label>

                {preview && (
                  <button
                    type="button"
                    onClick={removeImage}
                    aria-label="Remove image"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-red-100 bg-white text-xl text-red-500 hover:bg-red-50"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          </section>

          {/* Service form fields */}
          <section className="min-w-0 space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className={labelClass}>
                  Service name *
                </label>
                <input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. General Consultation"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label htmlFor="price" className={labelClass}>
                  Price (₹) *
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="e.g. 499"
                  className={inputClass}
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="category" className={labelClass}>
                  Category
                </label>
                <input
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="e.g. Consultation or Laboratory"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className={labelClass}>
                About this service *
              </label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Write a short description..."
                rows={4}
                className={`${inputClass} resize-y`}
                required
              />
            </div>

            {/* Pre-test instructions */}
            <div className="pt-1">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-sm font-medium text-emerald-900">
                  Pre-test Instructions
                </h2>

                <button
                  type="button"
                  onClick={addInstruction}
                  className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-800 transition hover:bg-emerald-100"
                >
                  + Add
                </button>
              </div>

              <div className="space-y-3">
                {instructions.map((instruction, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 rounded-2xl border border-slate-100 bg-white p-2 sm:gap-3 sm:p-3"
                  >
                    <span className="w-6 shrink-0 text-center text-sm font-semibold text-emerald-700">
                      {index + 1}.
                    </span>

                    <input
                      value={instruction}
                      onChange={(e) =>
                        updateInstruction(index, e.target.value)
                      }
                      placeholder={`Instruction ${index + 1}`}
                      aria-label={`Instruction ${index + 1}`}
                      className="min-w-0 flex-1 rounded-xl border border-emerald-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-300"
                    />

                    {instructions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeInstruction(index)}
                        aria-label={`Remove instruction ${index + 1}`}
                        className="rounded-lg px-2 py-1 text-lg text-red-400 transition hover:bg-red-50 hover:text-red-600"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile bottom actions */}
            <div className="flex flex-col-reverse gap-3 border-t border-emerald-50 pt-5 sm:hidden">
              <button
                type="button"
                onClick={resetForm}
                disabled={loading}
                className="w-full rounded-full border border-slate-200 px-6 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Reset
              </button>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 px-7 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-100 disabled:opacity-60"
              >
                {loading ? "Saving..." : "✓ Save Service"}
              </button>
            </div>
          </section>
        </div>
      </form>
    </main>
  );
}
