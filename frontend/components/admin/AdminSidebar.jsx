import {
  LayoutDashboard,
  Users,
  UserCog,
  Building2,
  FlaskConical,
  Package,
  ClipboardList,
  Wrench,
  BrainCircuit,
  FileText,
  Settings,
  LogOut,
  Mail,
  X,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const menuSections = [
  {
    title: "Dashboard",
    items: [
      {
        name: "Dashboard",
        path: "/admin/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },

  {
    title: "User Management",
    items: [
      {
        name: "Students",
        path: "/admin/students",
        icon: Users,
      },
      {
        name: "Faculty",
        path: "/admin/faculty",
        icon: UserCog,
      },
    ],
  },

  {
    title: "Laboratory Management",
    items: [
      {
        name: "Departments",
        path: "/admin/departments",
        icon: Building2,
      },
      {
        name: "Laboratories",
        path: "/admin/laboratories",
        icon: FlaskConical,
      },
      {
        name: "Equipment",
        path: "/admin/equipment",
        icon: Package,
      },
    ],
  },

  {
    title: "Booking Management",
    items: [
      {
        name: "Bookings",
        path: "/admin/bookings",
        icon: ClipboardList,
      },
      {
        name: "Maintenance",
        path: "/admin/maintenance",
        icon: Wrench,
      },
    ],
  },

  {
    title: "AI & Reports",
    items: [
      {
        name: "AI Analytics",
        path: "/admin/analytics",
        icon: BrainCircuit,
      },
      {
        name: "Reports",
        path: "/admin/reports",
        icon: FileText,
      },
    ],
  },

  {
    title: "System",
    items: [
      {
        name: "Contact Messages",
        path: "/admin/settings",
        icon: Mail,
      },
      {
        name: "Settings",
        path: "/admin/settings",
        icon: Settings,
      },
    ],
  },
];

const AdminSidebar = ({ onClose }) => {
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

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-5">
        {menuSections.map((section) => (
          <div key={section.title} className="mb-8">
            <h3 className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-3 px-2">
              {section.title}
            </h3>

            <div className="space-y-2">
              {section.items.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                        isActive
                          ? "bg-orange-500 text-white"
                          : "text-slate-300 hover:bg-slate-800"
                      }`
                    }
                  >
                    <Icon size={20} />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
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

export default AdminSidebar;