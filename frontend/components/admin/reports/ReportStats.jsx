import {
  FileText,
  Download,
  Calendar,
  Database,
} from "lucide-react";

const stats = [
  {
    title: "Generated Reports",
    value: "126",
    icon: FileText,
    color: "bg-orange-500",
  },
  {
    title: "Downloads",
    value: "874",
    icon: Download,
    color: "bg-green-500",
  },
  {
    title: "Today's Reports",
    value: "18",
    icon: Calendar,
    color: "bg-blue-500",
  },
  {
    title: "Data Sources",
    value: "8",
    icon: Database,
    color: "bg-purple-500",
  },
];

const ReportStats = () => {
  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

      {stats.map((item, index) => {

        const Icon = item.icon;

        return (

          <div
            key={index}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
          >

            <div className="flex justify-between items-center">

              <div>

                <p className="text-slate-400">

                  {item.title}

                </p>

                <h2 className="text-3xl font-bold mt-3">

                  {item.value}

                </h2>

              </div>

              <div
                className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center`}
              >

                <Icon
                  size={30}
                  className="text-white"
                />

              </div>

            </div>

          </div>

        );

      })}

    </div>
  );
};

export default ReportStats;