import { useEffect, useState } from "react";
import { CalendarDays, CheckCircle, Clock, Package } from "lucide-react";
import { studentService } from "../../services/studentService";
import { useAuth } from "../../hooks/useAuth";

const DashboardStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.userId) { setLoading(false); return; }
      try {
        const bookings = await studentService.getMyBookings(user.userId);
        const total = bookings?.length ?? 0;
        const active = bookings?.filter(b => b.status === "Approved" || b.status === "Pending").length ?? 0;
        const completed = bookings?.filter(b => b.status === "Completed").length ?? 0;
        const uniqueEquip = new Set(bookings?.map(b => b.equipmentId)).size;
        setStats({ total, active, completed, uniqueEquip });
      } catch {
        setStats({ total: 0, active: 0, completed: 0, uniqueEquip: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user]);

  const cards = [
    { title: "Total Bookings", value: stats?.total ?? 0, icon: CalendarDays, color: "bg-blue-500" },
    { title: "Active Bookings", value: stats?.active ?? 0, icon: Clock, color: "bg-orange-500" },
    { title: "Completed", value: stats?.completed ?? 0, icon: CheckCircle, color: "bg-green-500" },
    { title: "Equipment Used", value: stats?.uniqueEquip ?? 0, icon: Package, color: "bg-purple-500" },
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
      {cards.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.title} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 card-hover">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-slate-400 text-sm">{item.title}</p>
                <h2 className="text-3xl font-bold mt-2">{item.value}</h2>
              </div>
              <div className={`${item.color} p-4 rounded-xl`}>
                <Icon size={24} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;