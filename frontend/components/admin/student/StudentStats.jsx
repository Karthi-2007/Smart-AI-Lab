import { Users, UserCheck, UserX, UserMinus } from "lucide-react";

/**
 * Shows derived stats from the student list passed from parent.
 * props: students (array), loading (bool)
 */
const StudentStats = ({ students = [], loading = false }) => {
  const total = students.length;
  const activated = students.filter(s => s.status?.toUpperCase() === "ACTIVE").length;
  const pending = students.filter(s => s.status?.toUpperCase() === "PENDING").length;
  const unactivated = students.filter(s => {
    const st = (s.status || "").toUpperCase();
    return st === "INACTIVE" || st === "UNACTIVATED" || st === "DISABLED" || st === "REJECTED" || st === "INACTIVE_USER";
  }).length;

  const stats = [
    { title: "Total Students", value: total, icon: Users, color: "bg-blue-500" },
    { title: "Activated", value: activated, icon: UserCheck, color: "bg-green-500" },
    { title: "Pending", value: pending, icon: UserX, color: "bg-orange-500" },
    { title: "Unactivated", value: unactivated, icon: UserMinus, color: "bg-purple-500" },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 animate-pulse">
            <div className="h-4 bg-slate-700 rounded w-1/2 mb-4" />
            <div className="h-8 bg-slate-700 rounded w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {stats.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.title} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 card-hover">
            <div className="flex justify-between">
              <div>
                <p className="text-slate-400 text-sm">{item.title}</p>
                <h2 className="text-3xl font-bold mt-2">{item.value}</h2>
              </div>
              <div className={`${item.color} p-4 rounded-xl self-start`}>
                <Icon size={24} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StudentStats;