import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart3, TrendingUp, Calendar, CheckCircle, Clock,
  XCircle, Laptop, Download, Loader2, Sparkles, FileText, FileSpreadsheet, Printer
} from 'lucide-react';
import toast from 'react-hot-toast';
import { facultyService } from '../../services/facultyService';

export default function FacultyReports() {
  const [summary, setSummary] = useState(null);
  const [equipmentUsage, setEquipmentUsage] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const [sumRes, usageRes, analyticsRes, bookingRes] = await Promise.all([
        facultyService.getReportSummary().catch(() => ({ data: {} })),
        facultyService.getEquipmentUsageReport().catch(() => ({ data: {} })),
        facultyService.getAnalyticsReport().catch(() => ({ data: {} })),
        facultyService.getBookings().catch(() => ({ data: [] }))
      ]);

      setSummary(sumRes?.data || {});
      setEquipmentUsage(usageRes?.data || {});
      setAnalytics(analyticsRes?.data || {});
      setBookings(bookingRes?.data || []);
    } catch (err) {
      toast.error('Failed to load reports data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReports(); }, []);

  const bookingStats = useMemo(() => {
    return {
      total: bookings.length,
      pending: bookings.filter(b => b.status?.toUpperCase() === 'PENDING').length,
      approved: bookings.filter(b => b.status?.toUpperCase() === 'APPROVED').length,
      rejected: bookings.filter(b => b.status?.toUpperCase() === 'REJECTED').length,
      completed: bookings.filter(b => b.status?.toUpperCase() === 'COMPLETED').length,
    };
  }, [bookings]);

  /* ── Export CSV Function ────────────────────────────────────────── */
  const handleExportCSV = () => {
    if (!bookings || bookings.length === 0) {
      toast.error('No booking records available to export');
      return;
    }

    const headers = ['Booking ID', 'Student Name', 'Student Email', 'Equipment', 'Date', 'Time Slot', 'Status', 'Purpose'];
    const rows = bookings.map(b => [
      b.bookingId || '',
      `"${(b.student?.name || 'Student').replace(/"/g, '""')}"`,
      `"${(b.student?.email || '').replace(/"/g, '""')}"`,
      `"${(b.equipment?.name || 'Equipment').replace(/"/g, '""')}"`,
      `"${b.date || ''}"`,
      `"${b.timeSlot || ''}"`,
      `"${b.status || 'Pending'}"`,
      `"${(b.purpose || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `SmartLab_Report_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success('Successfully exported Booking Reports to CSV!');
  };

  /* ── Export Full JSON Summary ─────────────────────────────────── */
  const handleExportJSON = () => {
    const reportData = {
      generatedAt: new Date().toISOString(),
      summaryStats: bookingStats,
      systemSummary: summary,
      equipmentUsage,
      analytics,
      bookings
    };

    const jsonString = JSON.stringify(reportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `SmartLab_Analytics_Full_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success('Analytics Report exported as JSON!');
  };

  /* ── Print Report ─────────────────────────────────────────────── */
  const handlePrint = () => {
    window.print();
  };

  const getStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case 'APPROVED':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20';
      case 'PENDING':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/20';
      case 'REJECTED':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/20';
      case 'COMPLETED':
        return 'bg-sky-500/15 text-sky-400 border-sky-500/20';
      default:
        return 'bg-slate-700 text-slate-300 border-slate-600';
    }
  };

  return (
    <div className="space-y-7 max-w-7xl mx-auto print:p-0 print:space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-orange-500" />
            Analytics & Reports
          </h1>
          <p className="text-slate-400 text-sm mt-1">Real-time metrics, lab equipment utilization, and booking insights</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-all text-sm shadow-lg shadow-orange-500/20"
          >
            <FileSpreadsheet className="w-4 h-4" /> Export CSV
          </button>
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl font-medium transition-all text-sm"
          >
            <FileText className="w-4 h-4 text-sky-400" /> Export JSON
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl font-medium transition-all text-sm"
            title="Print Report"
          >
            <Printer className="w-4 h-4 text-slate-400" /> Print
          </button>
        </div>
      </div>

      {/* Printable Header */}
      <div className="hidden print:block text-slate-900 border-b pb-4 mb-4">
        <h1 className="text-2xl font-bold">SmartLab AI - Analytics & Booking Report</h1>
        <p className="text-sm text-gray-600">Generated on {new Date().toLocaleString()}</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
            <p className="text-slate-400 text-sm">Generating analytics & fetching report metrics...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Booking Distribution Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { label: 'Total Requests', value: bookingStats.total, icon: Calendar, color: 'from-orange-500/20 to-amber-500/10 border-orange-500/20', text: 'text-orange-400' },
              { label: 'Pending', value: bookingStats.pending, icon: Clock, color: 'from-amber-500/20 to-yellow-500/10 border-amber-500/20', text: 'text-amber-400' },
              { label: 'Approved', value: bookingStats.approved, icon: CheckCircle, color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/20', text: 'text-emerald-400' },
              { label: 'Rejected', value: bookingStats.rejected, icon: XCircle, color: 'from-rose-500/20 to-pink-500/10 border-rose-500/20', text: 'text-rose-400' },
              { label: 'Completed', value: bookingStats.completed, icon: TrendingUp, color: 'from-sky-500/20 to-blue-500/10 border-sky-500/20', text: 'text-sky-400' },
            ].map(({ label, value, icon: Icon, color, text }) => (
              <div key={label} className={`bg-gradient-to-br ${color} border rounded-2xl p-5 relative overflow-hidden`}>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</p>
                  <Icon className={`w-5 h-5 ${text}`} />
                </div>
                <p className="text-3xl font-bold text-white mt-3">{value}</p>
              </div>
            ))}
          </div>

          {/* Dynamic Summary Cards */}
          {summary && Object.keys(summary).length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-orange-400" />
                System Summary Indicators
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {Object.entries(summary).map(([key, val]) => (
                  <div key={key} className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4">
                    <p className="text-xs text-slate-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                    <p className="text-xl font-bold text-white mt-1">{String(val)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Bookings Activity Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-white">Recent Booking Activity Log</h2>
                <p className="text-xs text-slate-400 mt-0.5">Full audit trail of laboratory equipment reservations</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-slate-800 text-slate-300 text-xs font-mono rounded-lg border border-slate-700">
                  {bookings.length} Records
                </span>
                <button
                  onClick={handleExportCSV}
                  className="px-3 py-1 bg-orange-500/15 hover:bg-orange-500/25 text-orange-400 text-xs font-medium rounded-lg border border-orange-500/20 transition-colors flex items-center gap-1 print:hidden"
                >
                  <Download className="w-3.5 h-3.5" /> CSV
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-800/50 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-4 font-medium">Booking ID</th>
                    <th className="px-6 py-4 font-medium">Student Name</th>
                    <th className="px-6 py-4 font-medium">Equipment Requested</th>
                    <th className="px-6 py-4 font-medium">Date & Slot</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {bookings.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                        No booking activities recorded yet
                      </td>
                    </tr>
                  ) : (
                    bookings.map((b) => (
                      <tr key={b.bookingId} className="hover:bg-slate-800/30 transition-colors text-slate-300">
                        <td className="px-6 py-4 font-mono text-xs text-slate-400">#{b.bookingId}</td>
                        <td className="px-6 py-4 font-medium text-white">{b.student?.name || 'Student'}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Laptop className="w-4 h-4 text-orange-400" />
                            <span>{b.equipment?.name || 'Equipment'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-400">
                          {b.date || 'N/A'} {b.timeSlot ? `(${b.timeSlot})` : ''}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(b.status)}`}>
                            {b.status || 'Pending'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}