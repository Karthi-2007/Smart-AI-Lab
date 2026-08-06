import React, { useState, useEffect } from "react";
import { QrCode, Search, Download, Camera, CheckCircle2, Clock, AlertCircle, Eye, ShieldCheck, User, Package, Calendar } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";
import QRCodeCard from "../booking/QRCodeCard";
import QRScannerModal from "./QRScannerModal";

const QRMonitorView = ({ portalTitle = "QR Access Pass Monitor" }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedPass, setSelectedPass] = useState(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  useEffect(() => {
    fetchPassData();
  }, []);

  const fetchPassData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/business/bookings").catch(() => ({ data: [] }));
      const list = Array.isArray(res?.data || res) ? (res?.data || res) : [];
      setBookings(list);
    } catch (err) {
      toast.error("Failed to load pass monitor data");
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter((item) => {
    const term = searchQuery.toLowerCase();
    const studentName = typeof item.student === "object" ? (item.student?.name || "") : (item.studentName || "");
    const equipName = typeof item.equipment === "object" ? (item.equipment?.name || "") : (item.equipment || "");
    const passCode = `SMARTLAB-BOOKING-${item.bookingId || item.id || ""}`;

    const matchesSearch =
      studentName.toLowerCase().includes(term) ||
      equipName.toLowerCase().includes(term) ||
      passCode.toLowerCase().includes(term) ||
      String(item.bookingId || item.id || "").includes(term);

    const matchesFilter =
      statusFilter === "All" ? true : (item.status || "").toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesFilter;
  });

  const totalPasses = bookings.length;
  const approvedPasses = bookings.filter((b) => (b.status || "").toLowerCase() === "approved").length;
  const pendingPasses = bookings.filter((b) => (b.status || "").toLowerCase() === "pending").length;
  const completedPasses = bookings.filter((b) => (b.status || "").toLowerCase() === "completed").length;

  const handleExportCSV = () => {
    if (filteredBookings.length === 0) {
      toast.error("No pass records to export");
      return;
    }

    const headers = ["Pass Code,Student Name,Equipment,Reserved Date,Time Slot,Status,Generated Timestamp\n"];
    const rows = filteredBookings.map((b) => {
      const pCode = `SMARTLAB-BOOKING-${b.bookingId || b.id}`;
      const sName = typeof b.student === "object" ? (b.student?.name || "Karthikeyan RKS") : (b.studentName || "Karthikeyan RKS");
      const eName = typeof b.equipment === "object" ? (b.equipment?.name || "Equipment") : (b.equipment || "Equipment");
      const dateStr = b.date || "N/A";
      const slotStr = b.timeSlot || "N/A";
      const statusStr = b.status || "Pending";
      const timeStr = b.bookedAt || new Date().toISOString();
      return `"${pCode}","${sName}","${eName}","${dateStr}","${slotStr}","${statusStr}","${timeStr}"\n`;
    });

    const blob = new Blob([headers.concat(rows).join("")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `SmartLab_QR_Pass_Audit_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("QR Pass audit report exported as CSV!");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <QrCode className="w-7 h-7 text-orange-500" />
            <span>{portalTitle}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time tracking of student & faculty QR entry passes, check-ins, and lab access authorizations
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsScannerOpen(true)}
            className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-semibold text-xs rounded-2xl transition shadow-lg flex items-center gap-2"
          >
            <Camera className="w-4 h-4" />
            <span>Launch Live Scanner</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-2xl transition border border-slate-700 flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-orange-400" />
            <span>Export Pass Log</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">Total QR Passes</span>
            <QrCode className="w-5 h-5 text-orange-400" />
          </div>
          <p className="text-2xl font-extrabold text-white mt-2">{totalPasses}</p>
          <span className="text-[10px] text-slate-500">Generated reservations</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">Active Valid Passes</span>
            <CheckCircle2 className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-2xl font-extrabold text-green-400 mt-2">{approvedPasses}</p>
          <span className="text-[10px] text-slate-500">Approved for lab entry</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">Pending Verification</span>
            <Clock className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-2xl font-extrabold text-amber-400 mt-2">{pendingPasses}</p>
          <span className="text-[10px] text-slate-500">Awaiting faculty approval</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">Completed Sessions</span>
            <ShieldCheck className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-2xl font-extrabold text-purple-400 mt-2">{completedPasses}</p>
          <span className="text-[10px] text-slate-500">Checked-out & returned</span>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {["All", "Approved", "Pending", "Completed"].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
                statusFilter === tab
                  ? "bg-orange-500 text-white shadow-md"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student, equipment, or pass ID..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 outline-none focus:border-orange-500 transition"
          />
        </div>
      </div>

      {/* Access Pass Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 min-w-[750px]">
            <thead className="bg-slate-800/60 text-slate-400 uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Pass ID</th>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Equipment</th>
                <th className="px-6 py-4">Reserved Date & Slot</th>
                <th className="px-6 py-4">Pass Status</th>
                <th className="px-6 py-4 text-right">Inspect Pass</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4"><div className="h-4 bg-slate-800 rounded w-24"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-slate-800 rounded w-32"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-slate-800 rounded w-36"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-slate-800 rounded w-28"></div></td>
                      <td className="px-6 py-4"><div className="h-6 bg-slate-800 rounded-full w-20"></div></td>
                      <td className="px-6 py-4 text-right"><div className="h-8 bg-slate-800 rounded w-20 ml-auto"></div></td>
                    </tr>
                  ))
              ) : filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    <QrCode className="w-10 h-10 mx-auto mb-3 text-slate-700" />
                    <p className="text-base font-semibold text-slate-400">No QR Entry Passes Found</p>
                    <p className="text-xs text-slate-500 mt-1">No reservations match your search or status filter.</p>
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => {
                  const bId = booking.bookingId || booking.id;
                  const passCode = `SMARTLAB-BOOKING-${bId}`;
                  const sName =
                    typeof booking.student === "object"
                      ? booking.student?.name || booking.studentName || "Student"
                      : booking.studentName || "Student";
                  const sRegNo =
                    typeof booking.student === "object"
                      ? booking.student?.regNo || booking.studentRegNo || "REG-N/A"
                      : booking.studentRegNo || "REG-N/A";
                  const eName =
                    typeof booking.equipment === "object"
                      ? booking.equipment?.name || "Equipment"
                      : booking.equipment || "Equipment";

                  return (
                    <tr key={bId} className="hover:bg-slate-800/40 transition">
                      <td className="px-6 py-4 font-mono text-white font-semibold">#{bId}</td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-white">{sName}</div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {sRegNo}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-200">{eName}</td>
                      <td className="px-6 py-4">
                        <div className="text-slate-200">{booking.date || "Today"}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{booking.timeSlot || "Scheduled Session"}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                            booking.status === "Approved"
                              ? "bg-green-500/10 text-green-400 border border-green-500/30"
                              : booking.status === "Completed"
                              ? "bg-purple-500/10 text-purple-400 border border-purple-500/30"
                              : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                          }`}
                        >
                          {booking.status || "Pending"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedPass(booking)}
                          className="px-3.5 py-1.5 bg-orange-500/10 hover:bg-orange-500 hover:text-white text-orange-400 border border-orange-500/30 font-semibold rounded-xl transition flex items-center gap-1.5 ml-auto text-xs"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View QR</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect QR Pass Modal */}
      {selectedPass && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200 relative text-center">
            <button
              onClick={() => setSelectedPass(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-xl hover:bg-slate-800"
            >
              <Eye className="w-5 h-5 hidden" /> ✕
            </button>

            <h3 className="text-xl font-bold text-white mb-1">Equipment Access Pass</h3>
            <p className="text-xs text-slate-400 mb-6">Generated Scannable Access QR Code</p>

            <QRCodeCard value={`SMARTLAB-BOOKING-${selectedPass.bookingId || selectedPass.id || "PASS"}`} />

            <div className="mt-6 p-4 bg-slate-800/60 rounded-2xl text-xs text-left space-y-1.5 border border-slate-700/60">
              <p className="text-slate-300">
                <span className="text-slate-500 font-medium">Student:</span>{" "}
                {typeof selectedPass.student === "object"
                  ? selectedPass.student?.name || selectedPass.studentName || "Student"
                  : selectedPass.studentName || "Student"}
              </p>
              <p className="text-slate-300">
                <span className="text-slate-500 font-medium">Equipment:</span>{" "}
                {typeof selectedPass.equipment === "object"
                  ? selectedPass.equipment?.name
                  : selectedPass.equipment || "Lab Hardware"}
              </p>
              <p className="text-slate-300">
                <span className="text-slate-500 font-medium">Slot & Date:</span> {selectedPass.date} ({selectedPass.timeSlot})
              </p>
              <p className="text-slate-300">
                <span className="text-slate-500 font-medium">Status:</span>{" "}
                <span className="font-bold text-orange-400 uppercase">{selectedPass.status || "PENDING"}</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Live Camera Scanner */}
      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onVerificationSuccess={fetchPassData}
      />
    </div>
  );
};

export default QRMonitorView;
