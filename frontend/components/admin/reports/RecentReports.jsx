import {
  Download,
  FileText,
} from "lucide-react";

const reports = [
  {
    id: 1,
    title: "Student Report - CSE",
    date: "05 Jul 2026",
    type: "PDF",
  },
  {
    id: 2,
    title: "Equipment Inventory",
    date: "04 Jul 2026",
    type: "Excel",
  },
  {
    id: 3,
    title: "Booking Summary",
    date: "03 Jul 2026",
    type: "PDF",
  },
  {
    id: 4,
    title: "Maintenance Report",
    date: "02 Jul 2026",
    type: "Excel",
  },
];

const RecentReports = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

      <h2 className="text-2xl font-bold mb-6">

        Recent Reports

      </h2>

      <div className="space-y-4">

        {reports.map((report) => (

          <div
            key={report.id}
            className="flex justify-between items-center bg-slate-800 rounded-xl p-4"
          >

            <div className="flex items-center gap-4">

              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">

                <FileText size={22} />

              </div>

              <div>

                <h3 className="font-semibold">

                  {report.title}

                </h3>

                <p className="text-sm text-slate-400">

                  {report.date} • {report.type}

                </p>

              </div>

            </div>

            <button className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg flex items-center gap-2">

              <Download size={18} />

              Download

            </button>

          </div>

        ))}

      </div>

    </div>
  );
};

export default RecentReports;