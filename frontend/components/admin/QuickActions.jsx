import {
  Plus,
  UserPlus,
  CalendarPlus,
  Wrench,
  Package,
  Building2,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

const actions = [
  {
    title: "Add Equipment",
    description: "Register new laboratory equipment",
    icon: Package,
    color: "bg-orange-500",
    path: "/admin/equipment",
  },
  {
    title: "Add Student",
    description: "Create a new student record",
    icon: UserPlus,
    color: "bg-blue-500",
    path: "/admin/students",
  },
  {
    title: "Create Booking",
    description: "Book equipment for students",
    icon: CalendarPlus,
    color: "bg-green-500",
    path: "/admin/bookings",
  },
  {
    title: "Schedule Maintenance",
    description: "Plan maintenance activities",
    icon: Wrench,
    color: "bg-red-500",
    path: "/admin/maintenance",
  },
  {
    title: "Manage Laboratories",
    description: "Create and manage laboratories",
    icon: Building2,
    color: "bg-purple-500",
    path: "/admin/laboratories",
  },
  {
    title: "More Actions",
    description: "View all admin operations",
    icon: Plus,
    color: "bg-slate-600",
    path: "/admin/dashboard",
  },
];

const QuickActions = () => {

  const navigate = useNavigate();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

      <h2 className="text-xl font-bold mb-6">

        Quick Actions

      </h2>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">

        {actions.map((action, index) => {

          const Icon = action.icon;

          return (

            <button
              key={index}
              onClick={() => navigate(action.path)}
              className="group bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-orange-500 rounded-xl p-5 transition-all duration-300 text-left"
            >

              <div
                className={`w-14 h-14 ${action.color} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition`}
              >

                <Icon
                  size={28}
                  className="text-white"
                />

              </div>

              <h3 className="text-lg font-semibold">

                {action.title}

              </h3>

              <p className="text-slate-400 text-sm mt-2">

                {action.description}

              </p>

            </button>

          );

        })}

      </div>

    </div>
  );
};

export default QuickActions;