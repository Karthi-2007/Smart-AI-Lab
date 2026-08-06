const PrimaryButton = ({
  children,
  type = "button",
  className = "",
  ...props
}) => {
  return (
    <button
      type={type}
      className={`px-6 py-3 rounded-xl font-bold text-white shadow-lg transition-all duration-300 active:scale-95 ${className}`}
      style={{ background: '#cc6926' }}
      onMouseEnter={e => e.currentTarget.style.background = '#a8531a'}
      onMouseLeave={e => e.currentTarget.style.background = '#cc6926'}
      {...props}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;