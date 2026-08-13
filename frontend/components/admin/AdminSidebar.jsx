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
  Bell,
  QrCode,
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
        name: "QR Pass Monitor",
        path: "/admin/qr-monitor",
        icon: QrCode,
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
        name: "Notifications",
        path: "/admin/notifications",
        icon: Bell,
      },
      {
        name: "Contact Messages",
        path: "/admin/contact-messages",
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

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-5">
        {menuSections.map((section) => (
          <div key={section.title} className="mb-6">
            <h3 className="text-[10px] uppercase tracking-widest text-[#cc6926] font-extrabold mb-3 px-2">
              {section.title}
            </h3>

            <div className="space-y-1">
              {section.items.map((item) => {
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
            </div>
          </div>
        ))}
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

export default AdminSidebar;