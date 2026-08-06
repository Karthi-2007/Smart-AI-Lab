const GlassCard = ({ children, className = "" }) => {
  return (
    <div
      className={`bg-slate-800/60 backdrop-blur-lg border border-slate-700 rounded-2xl p-6 shadow-xl ${className}`}
    >
      {children}
    </div>
  );
};

export default GlassCard;