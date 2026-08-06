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
    <aside className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col h-full">

      {/* Logo */}
      <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-orange-500">SmartLab AI</h1>
          <p className="text-xs text-slate-400 mt-0.5">Faculty Portal</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="md:hidden text-slate-400 hover:text-white transition">
            <X size={22} />
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
                `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                  isActive
                    ? "bg-orange-500 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-slate-800 p-5">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-red-400 hover:text-red-300 transition"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default FacultySidebar;