const ProfileField = ({
  label,
  name,
  value,
  onChange,
  placeholder = "",
  type = "text",
  readOnly = false,
  icon: Icon,
}) => {
  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-semibold text-teal-900 mb-2">
        {Icon && (
          <span className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center">
            <Icon className="w-4 h-4 text-slate-500" />
          </span>
        )}

        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition
          ${
            readOnly
              ? "cursor-not-allowed bg-slate-100"
              : "focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
          }`}
      />
    </div>
  );
};

export default ProfileField;