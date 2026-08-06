const Badge = ({ children }) => {
  return (
    <span className="px-4 py-1 rounded-full bg-orange-500/20 text-orange-400 text-sm font-medium">
      {children}
    </span>
  );
};

export default Badge;