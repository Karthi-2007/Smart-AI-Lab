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
    <aside className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col h-full">

      {/* Logo */}
      <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-orange-500">SmartLab AI</h1>
        {onClose && (
          <button onClick={onClose} className="md:hidden text-slate-400 hover:text-white transition">
            <X size={22} />
          </button>
        )}
      </div>

      {/* Menu */}

      <nav className="flex-1 px-5 py-6 space-y-2 overflow-y-auto">

        {menu.map((item) => {

          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 rounded-xl transition
                ${
                  isActive
                    ? "bg-orange-500 text-white"
                    : "text-slate-300 hover:bg-slate-800"
                }`
              }
            >

              <Icon size={20} />

              {item.name}

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

export default StudentSidebar;