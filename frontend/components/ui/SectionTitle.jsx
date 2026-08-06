// KCE SectionTitle: orange label, navy heading, accent line
const SectionTitle = ({ title, subtitle, label, dark = false }) => {
  return (
    <div className="text-center mb-12 relative z-10">
      {label && (
        <p className="text-xs font-extrabold uppercase tracking-widest mb-2" style={{ color: "#cc6926" }}>
          {label}
        </p>
      )}
      <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight animate-fade-in" style={{ color: dark ? "#ffffff" : "#0b2545" }}>
        {title}
      </h2>
      {/* KCE accent line */}
      <div className="mx-auto mt-3 mb-4" style={{
        width: "3rem", height: "4px", borderRadius: "2px",
        background: "linear-gradient(90deg, #cc6926, #e07a32)"
      }} />
      {subtitle && (
        <p className={`mt-2 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed ${dark ? "text-slate-300" : "text-slate-600"}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionTitle;