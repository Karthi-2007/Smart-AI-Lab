import React, { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import api from "../../services/api";

const priorityColor = {
  High: "text-red-400 bg-red-500/20 border border-red-500/30",
  Medium: "text-yellow-400 bg-yellow-500/20 border border-yellow-500/30",
  Low: "text-green-400 bg-green-500/20 border border-green-500/30",
};

const statusColor = {
  Pending: "text-red-400",
  Open: "text-red-400",
  "In Progress": "text-orange-400",
  Resolved: "text-green-400",
};

const RecentFaultReports = () => {
  const [faults, setFaults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFaults();
  }, []);

  const fetchFaults = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/business/faults").catch(() => ({ data: [] }));
      const list = Array.isArray(res?.data || res) ? (res?.data || res) : [];
      setFaults(list.slice(0, 4));
    } catch (err) {
      console.warn("Could not load recent faults:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <AlertTriangle className="text-orange-500 w-6 h-6" />
        <h2 className="text-xl font-bold text-white">Recent Fault Reports</h2>
      </div>

      <div className="space-y-4">
        {loading ? (
          Array(3)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="bg-slate-800 rounded-xl p-4 animate-pulse space-y-2">
                <div className="h-4 bg-slate-700 rounded w-1/2"></div>
                <div className="h-3 bg-slate-700 rounded w-1/3"></div>
              </div>
            ))
        ) : faults.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-6">No fault reports recorded.</p>
        ) : (
          faults.map((fault) => {
            const reporterName =
              typeof fault.reportedBy === "object"
                ? fault.reportedBy?.name || "Student"
                : fault.reportedByName || (typeof fault.reportedBy === "string" ? fault.reportedBy : "Student");
            const equipName =
              typeof fault.equipment === "object"
                ? fault.equipment?.name || "Lab Equipment"
                : fault.equipment || "Lab Equipment";
            const priority = fault.priority || "Medium";
            const status = fault.status || "Open";

            return (
              <div key={fault.faultId || fault.id} className="bg-slate-800/80 border border-slate-700/50 rounded-xl p-4 hover:bg-slate-800 transition">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-white text-sm">{equipName}</h3>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${priorityColor[priority] || priorityColor.Medium}`}>
                    {priority}
                  </span>
                </div>

                <p className="text-slate-400 mt-2 text-xs">
                  Reported by: <span className="text-white font-medium">{reporterName}</span>
                </p>

                <p className={`mt-1 text-xs font-semibold ${statusColor[status] || "text-slate-300"}`}>
                  Status: {status}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default RecentFaultReports;