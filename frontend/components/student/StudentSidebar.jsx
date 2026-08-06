import {
  LayoutDashboard,
  FlaskConical,
  Package,
  CalendarDays,
  History,
  Bell,
  User,
  Settings,
  LogOut,
  X,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const menu = [
  {
    name: "Dashboard",
    path: "/student/dashboard",
    icon: LayoutDashboard,
  },

  {
    name: "Equipment",
    path: "/student/equipment",
    icon: Package,
  },

  {
    name: "Book Equipment",
    path: "/student/book-equipment",
    icon: FlaskConical,
  },

  {
    name: "My Bookings",
    path: "/student/bookings",
    icon: CalendarDays,
  },

  {
    name: "Usage History",
    path: "/student/usage",
    icon: History,
  },

  {
    name: "Fault Reports",
    path: "/student/fault-reports",
    icon: FlaskConical,
  },

  {
    name: "Notifications",
    path: "/student/notifications",
    icon: Bell,
  },

  {
    name: "Profile",
    path: "/student/profile",
    icon: User,
  },

  {
    name: "Settings",
    path: "/student/settings",
    icon: Settings,
  },
];

const StudentSidebar = ({ onClose }) => {
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
        <h1 className="text-lg font-black text-white flex items-center gap-2">
          <span className="w-2 h-5 bg-[#cc6926] rounded-full" />
          SmartLab <span className="text-[#cc6926]">AI</span>
        </h1>
        {onClose && (
          <button onClick={onClose} className="md:hidden text-slate-300 hover:text-white transition">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Menu */}
      <nav className="flex-1 px-4 py-5 space-y-1 overflow-y-auto">
        {menu.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
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
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default StudentSidebar;