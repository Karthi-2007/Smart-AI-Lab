const SecondaryButton = ({
  children,
  type = "button",
  className = "",
  ...props
}) => {
  return (
    <button
      type={type}
      className={`px-6 py-3 rounded-xl border border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white transition-all duration-300 font-semibold ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default SecondaryButton;