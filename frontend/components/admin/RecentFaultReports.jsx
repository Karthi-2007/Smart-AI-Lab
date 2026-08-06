import { AlertTriangle } from "lucide-react";

const faults = [
  {
    id: 1,
    equipment: "Digital Oscilloscope",
    reportedBy: "Karthikeyan S S",
    priority: "High",
    status: "Pending",
  },
  {
    id: 2,
    equipment: "Arduino Mega Kit",
    reportedBy: "Rahul",
    priority: "Medium",
    status: "In Progress",
  },
  {
    id: 3,
    equipment: "3D Printer",
    reportedBy: "Priya",
    priority: "Low",
    status: "Resolved",
  },
];

const priorityColor = {
  High: "text-red-400 bg-red-500/20",
  Medium: "text-yellow-400 bg-yellow-500/20",
  Low: "text-green-400 bg-green-500/20",
};

const statusColor = {
  Pending: "text-red-400",
  "In Progress": "text-orange-400",
  Resolved: "text-green-400",
};

const RecentFaultReports = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

      <div className="flex items-center gap-3 mb-6">

        <AlertTriangle className="text-orange-500" />

        <h2 className="text-xl font-bold">
          Recent Fault Reports
        </h2>

      </div>

      <div className="space-y-4">

        {faults.map((fault) => (

          <div
            key={fault.id}
            className="bg-slate-800 rounded-xl p-4 hover:bg-slate-700 transition"
          >

            <div className="flex justify-between items-center">

              <h3 className="font-semibold">

                {fault.equipment}

              </h3>

              <span
                className={`text-xs px-3 py-1 rounded-full ${priorityColor[fault.priority]}`}
              >
                {fault.priority}
              </span>

            </div>

            <p className="text-slate-400 mt-2 text-sm">

              Reported by: {fault.reportedBy}

            </p>

            <p className={`mt-2 font-medium ${statusColor[fault.status]}`}>

              {fault.status}

            </p>

          </div>

        ))}

      </div>

    </div>
  );
};

export default RecentFaultReports;