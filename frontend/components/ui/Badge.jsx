const Badge = ({ children }) => {
  return (
    <span
      className="px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider"
      style={{ background: "rgba(204,105,38,0.12)", color: "#cc6926", border: "1px solid rgba(204,105,38,0.3)" }}
    >
      {children}
    </span>
  );
};

export default Badge;