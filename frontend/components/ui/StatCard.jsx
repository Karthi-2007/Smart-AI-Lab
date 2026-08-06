import GlassCard from "./GlassCard";

const StatCard = ({ number, title }) => {
  return (
    <GlassCard className="text-center">
      <h2 className="text-4xl font-bold text-orange-500">
        {number}
      </h2>

      <p className="mt-3 text-slate-300">
        {title}
      </p>
    </GlassCard>
  );
};

export default StatCard;