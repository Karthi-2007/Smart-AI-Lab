const PrimaryButton = ({
  children,
  type = "button",
  className = "",
  ...props
}) => {
  return (
    <button
      type={type}
      className={`px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 transition-all duration-300 font-semibold text-white shadow-lg shadow-orange-500/30 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;