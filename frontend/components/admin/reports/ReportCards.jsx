import {
  Users,
  UserCog,
  Package,
  ClipboardList,
  Wrench,
  FlaskConical,
  Download,
} from "lucide-react";

const reports = [
  {
    title: "Student Report",
    description: "Generate complete student records",
    icon: Users,
    color: "bg-blue-500",
  },
  {
    title: "Faculty Report",
    description: "Faculty information and activities",
    icon: UserCog,
    color: "bg-green-500",
  },
  {
    title: "Equipment Report",
    description: "Equipment inventory and availability",
    icon: Package,
    color: "bg-orange-500",
  },
  {
    title: "Booking Report",
    description: "Laboratory booking history",
    icon: ClipboardList,
    color: "bg-purple-500",
  },
  {
    title: "Maintenance Report",
    description: "Maintenance schedules and costs",
    icon: Wrench,
    color: "bg-red-500",
  },
  {
    title: "Laboratory Report",
    description: "Laboratory utilization summary",
    icon: FlaskConical,
    color: "bg-cyan-500",
  },
];

const ReportCards = () => {
  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

      {reports.map((report, index) => {

        const Icon = report.icon;

        return (
          <div
            key={index}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-orange-500 transition"
          >

            <div
              className={`w-16 h-16 ${report.color} rounded-2xl flex items-center justify-center mb-5`}
            >
              <Icon size={30} className="text-white" />
            </div>

            <h2 className="text-xl font-bold">
              {report.title}
            </h2>

            <p className="text-slate-400 mt-2">
              {report.description}
            </p>

            <button className="mt-6 bg-orange-500 hover:bg-orange-600 px-5 py-3 rounded-xl flex items-center gap-2 font-semibold">
              <Download size={18} />
              Generate Report
            </button>

          </div>
        );

      })}

    </div>
  );
};

export default ReportCards;