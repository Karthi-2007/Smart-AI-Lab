const SectionTitle = ({ title, subtitle }) => {
  return (
    <div className="text-center mb-14">

      <h2 className="text-4xl font-bold">
        {title}
      </h2>

      <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
        {subtitle}
      </p>

    </div>
  );
};

export default SectionTitle;