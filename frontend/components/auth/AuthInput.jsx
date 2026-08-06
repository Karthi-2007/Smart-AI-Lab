const AuthInput = ({
  label,
  type = "text",
  placeholder,
  ...props
}) => {
  return (
    <div>

      <label className="block mb-2 font-medium text-slate-300">

        {label}

      </label>

      <input
        type={type}
        placeholder={placeholder}
        className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 transition"
        {...props}
      />

    </div>
  );
};

export default AuthInput;