import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarCheck,
  FlaskConical,
  Monitor,
  Wrench,
  BarChart3,
  Bell,
  User,
  Settings,
  LogOut,
  QrCode,
  X,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const menuItems = [
  { name: "Dashboard", path: "/faculty/dashboard", icon: LayoutDashboard },
  { name: "Booking Requests", path: "/faculty/bookings", icon: CalendarCheck },
  { name: "QR Pass Monitor", path: "/faculty/qr-monitor", icon: QrCode },
  { name: "Laboratories", path: "/faculty/labs", icon: FlaskConical },
  { name: "Equipment", path: "/faculty/equipment", icon: Monitor },
  { name: "Maintenance", path: "/faculty/maintenance", icon: Wrench },
  { name: "Reports", path: "/faculty/reports", icon: BarChart3 },
  { name: "Notifications", path: "/faculty/notifications", icon: Bell },
  { name: "Profile", path: "/faculty/profile", icon: User },
  { name: "Settings", path: "/faculty/settings", icon: Settings },
];

const FacultySidebar = ({ onClose }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside className="w-72 bg-[#0b2545] border-r border-[#163760] flex flex-col h-full text-slate-100">
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-[#163760]">
        <div>
          <h1 className="text-lg font-black text-white flex items-center gap-2">
            <span className="w-2 h-5 bg-[#cc6926] rounded-full" />
            SmartLab <span className="text-[#cc6926]">AI</span>
          </h1>
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider pl-4">Faculty Portal</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="md:hidden text-slate-300 hover:text-white transition">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Menu */}
      <nav className="flex-1 px-4 py-5 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? "bg-[#cc6926] text-white shadow-md shadow-black/10"
                    : "text-slate-300 hover:bg-[#163760] hover:text-white"
                }`
              }
            >
              <Icon size={16} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-[#163760] p-4 bg-[#081e3a]/40">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-red-400 hover:text-red-300 text-xs font-bold transition w-full"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default FacultySidebar;