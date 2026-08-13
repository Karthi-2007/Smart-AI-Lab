import { useEffect, useState } from "react";
import {
  AlertTriangle, Search, Loader2, CheckCircle,
  Clock, XCircle, Eye, RefreshCw,
} from "lucide-react";
import { adminService } from "../../services/adminService";
import toast from "react-hot-toast";
import Pagination from "../common/Pagination";

const STATUS_MAP = {
  open: { label: "Open", cls: "bg-red-500/20 text-red-400" },
  pending: { label: "Pending", cls: "bg-orange-500/20 text-orange-400" },
  "in progress": { label: "In Progress", cls: "bg-blue-500/20 text-blue-400" },
  resolved: { label: "Resolved", cls: "bg-green-500/20 text-green-400" },
};

const statusStyle = (s) => {
  const key = s?.toLowerCase();
  return STATUS_MAP[key] || { label: s || "Unknown", cls: "bg-slate-700 text-slate-400" };
};

const FILTERS = ["All", "Open", "Pending", "In Progress", "Resolved"];

const ManageFaults = () => {
  const [faults, setFaults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [updatingId, setUpdatingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchFaults = async () => {
    setLoading(true);
    try {
      const res = await adminService.getFaults();
      const body = res?.data || res;
      let list = [];
      if (body) {
        if (body.success && body.data) {
          list = body.data.content || body.data;
        } else {
          list = body.content || body;
        }
      }
      setFaults(Array.isArray(list) ? list : []);
    } catch {
      toast.error("Could not load fault reports.");
      setFaults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFaults(); }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  const handleStatusUpdate = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      await adminService.updateFaultStatus(id, newStatus);
      setFaults(prev =>
        prev.map(f => f.id === id ? { ...f, status: newStatus } : f)
      );
      toast.success(`Fault marked as ${newStatus}.`);
    } catch {
      toast.error("Could not update fault status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleResolve = async (id) => {
    setUpdatingId(id);
    try {
      await adminService.resolveFault(id);
      setFaults(prev =>
        prev.map(f => f.id === id ? { ...f, status: "Resolved" } : f)
      );
      toast.success("Fault resolved!");
    } catch {
      toast.error("Could not resolve fault.");
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = faults.filter(f => {
    const matchSearch = !search ||
      f.equipmentName?.toLowerCase().includes(search.toLowerCase()) ||
      f.reportedBy?.toLowerCase().includes(search.toLowerCase()) ||
      f.description?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" ||
      f.status?.toLowerCase() === statusFilter.toLowerCase();
    return matchSearch && matchStatus;
  });

  // Stats
  const open = faults.filter(f => f.status?.toLowerCase() === "open").length;
  const inProgress = faults.filter(f => f.status?.toLowerCase() === "in progress").length;
  const resolved = faults.filter(f => f.status?.toLowerCase() === "resolved").length;
  const total = faults.length;

  const stats = [
    { label: "Total Reports", value: total, icon: AlertTriangle, color: "bg-slate-600" },
    { label: "Open", value: open, icon: XCircle, color: "bg-red-500" },
    { label: "In Progress", value: inProgress, icon: Clock, color: "bg-blue-500" },
    { label: "Resolved", value: resolved, icon: CheckCircle, color: "bg-green-500" },
  ];

  const paginatedFaults = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6 md:space-y-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold">Fault Reports</h1>
          <p className="text-slate-400 mt-2">Track and resolve equipment fault reports.</p>
        </div>
        <button
          onClick={fetchFaults}
          disabled={loading}
          className="bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm transition"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 animate-pulse">
              <div className="h-4 bg-slate-700 rounded w-1/2 mb-3" />
              <div className="h-8 bg-slate-700 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 card-hover">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-slate-400 text-sm">{label}</p>
                  <h2 className="text-3xl font-bold mt-2">{value}</h2>
                </div>
                <div className={`${color} p-4 rounded-xl`}>
                  <Icon size={22} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search equipment, reporter..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-orange-500 transition text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                statusFilter === f
                  ? "bg-orange-500 text-white"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 size={36} className="animate-spin text-orange-500" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-slate-900 border border-slate-800 rounded-2xl">
          <AlertTriangle size={48} className="mx-auto mb-4 text-slate-600" />
          <p className="text-slate-400 text-lg">
            {search || statusFilter !== "All" ? "No matching fault reports." : "No fault reports found."}
          </p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-slate-800">
                <tr>
                  {["Report ID", "Equipment", "Lab", "Description", "Reported By", "Date", "Status", "Actions"].map(h => (
                    <th key={h} className="px-5 py-4 text-left text-sm font-semibold text-slate-300">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {paginatedFaults.map(fault => {
                  const { label, cls } = statusStyle(fault.status);
                  const isUpdating = updatingId === fault.id;
                  const isResolved = fault.status?.toLowerCase() === "resolved";

                  return (
                    <tr key={fault.id} className="hover:bg-slate-800/50 transition">
                      <td className="px-5 py-4 text-sm text-slate-400 font-mono">#{fault.id}</td>
                      <td className="px-5 py-4 font-medium">{fault.equipmentName || `Equipment #${fault.equipmentId}`}</td>
                      <td className="px-5 py-4 text-sm text-slate-400">{fault.labName || "—"}</td>
                      <td className="px-5 py-4 text-sm text-slate-300 max-w-[200px] truncate" title={fault.description}>
                        {fault.description || "—"}
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-400">{fault.reportedBy || "—"}</td>
                      <td className="px-5 py-4 text-sm text-slate-400">
                        {fault.reportedAt ? new Date(fault.reportedAt).toLocaleDateString('en-IN') : "—"}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${cls}`}>{label}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {!isResolved && (
                            <>
                              {fault.status?.toLowerCase() === "open" && (
                                <button
                                  onClick={() => handleStatusUpdate(fault.id, "In Progress")}
                                  disabled={isUpdating}
                                  className="text-blue-400 hover:text-blue-300 transition text-xs px-2 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 disabled:opacity-50"
                                >
                                  {isUpdating ? <Loader2 size={12} className="animate-spin" /> : "In Progress"}
                                </button>
                              )}
                              <button
                                onClick={() => handleResolve(fault.id)}
                                disabled={isUpdating}
                                className="text-green-400 hover:text-green-300 transition text-xs px-2 py-1 rounded-lg bg-green-500/10 hover:bg-green-500/20 disabled:opacity-50"
                              >
                                {isUpdating ? <Loader2 size={12} className="animate-spin" /> : "Resolve"}
                              </button>
                            </>
                          )}
                          {isResolved && (
                            <span className="text-xs text-slate-500 italic">No action</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <Pagination
            currentPage={currentPage}
            totalItems={filtered.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

export default ManageFaults;
