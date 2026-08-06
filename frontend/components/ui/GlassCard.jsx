// KCE-themed card: white bg, orange hover border, navy shadow
const GlassCard = ({ children, className = "" }) => {
  return (
    <div
      className={`bg-white border border-slate-200 rounded-2xl p-6 shadow-md hover:shadow-xl hover:border-[#cc6926]/50 hover:-translate-y-1 transition-all duration-300 ${className}`}
    >
      {children}
    </div>
  );
};

export default GlassCard;