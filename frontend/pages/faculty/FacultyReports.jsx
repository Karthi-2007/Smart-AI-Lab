import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart3, AlertTriangle, CheckCircle, Clock, XCircle, Wrench,
  Search, Filter, Eye, Download, Loader2, FileSpreadsheet, FileText,
  Printer, User, Laptop, FlaskConical, ShieldAlert, RefreshCw, X, ChevronRight, MessageSquare, UserCheck
} from 'lucide-react';
import toast from 'react-hot-toast';
import { facultyService } from '../../services/facultyService';

export default function FacultyReports() {
  const [summary, setSummary] = useState({
    totalFaults: 0,
    openFaults: 0,
    inProgressFaults: 0,
    resolvedFaults: 0,
    criticalHighFaults: 0,
    pendingReviewFaults: 0
  });
  const [faultReports, setFaultReports] = useState([]);
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedPriority, setSelectedPriority] = useState('ALL');
  const [selectedLabId, setSelectedLabId] = useState('ALL');

  // Modal State
  const [selectedFault, setSelectedFault] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionAssignee, setActionAssignee] = useState('');
  const [actionReason, setActionReason] = useState('');
  const [actionStatus, setActionStatus] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Load My Labs once for filter dropdown
  useEffect(() => {
    facultyService.getMyLabs()
      .then(res => {
        const body = res?.data || res;
        const labList = body?.data?.content || body?.data || (Array.isArray(body) ? body : []);
        setLabs(labList);
      })
      .catch(() => {});
  }, []);

  // Fetch Faculty-Specific Summary & Fault Reports from Backend
  const fetchFacultyFaultData = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (selectedStatus !== 'ALL') params.status = selectedStatus;
      if (selectedPriority !== 'ALL') params.priority = selectedPriority;
      if (selectedLabId !== 'ALL') params.laboratoryId = selectedLabId;

      const [summaryRes, reportsRes] = await Promise.all([
        facultyService.getFacultyFaultSummary().catch(() => ({ data: {} })),
        facultyService.getFacultyFaultReports(params).catch(() => ({ data: [] }))
      ]);

      const sumBody = summaryRes?.data?.data || summaryRes?.data || summaryRes || {};
      setSummary({
        totalFaults: sumBody.totalFaults || 0,
        openFaults: sumBody.openFaults || 0,
        inProgressFaults: sumBody.inProgressFaults || 0,
        resolvedFaults: sumBody.resolvedFaults || 0,
        criticalHighFaults: sumBody.criticalHighFaults || 0,
        pendingReviewFaults: sumBody.pendingReviewFaults || 0
      });

      const repBody = reportsRes?.data || reportsRes;
      let list = [];
      if (repBody) {
        if (repBody.success && repBody.data) {
          list = repBody.data.content || repBody.data;
        } else if (Array.isArray(repBody.content)) {
          list = repBody.content;
        } else if (Array.isArray(repBody)) {
          list = repBody;
        }
      }
      setFaultReports(Array.isArray(list) ? list : []);
    } catch (err) {
      toast.error('Failed to load faculty fault reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacultyFaultData();
  }, [searchTerm, selectedStatus, selectedPriority, selectedLabId]);

  /* ── Export CSV Function ────────────────────────────────────────── */
  const handleExportCSV = () => {
    if (!faultReports || faultReports.length === 0) {
      toast.error('No fault records available to export');
      return;
    }

    const headers = ['Fault ID', 'Student Name', 'Reg Number', 'Equipment', 'Equipment ID', 'Laboratory', 'Severity', 'Status', 'Reported Date', 'Description'];
    const rows = faultReports.map(f => [
      f.faultId || '',
      `"${(f.reportedBy?.name || 'Student').replace(/"/g, '""')}"`,
      `"${(f.reportedBy?.registerNumber || 'N/A').replace(/"/g, '""')}"`,
      `"${(f.equipment?.name || 'Equipment').replace(/"/g, '""')}"`,
      f.equipment?.equipmentId || '',
      `"${(f.equipment?.laboratory?.name || 'Laboratory').replace(/"/g, '""')}"`,
      `"${f.priority || 'Low'}"`,
      `"${f.status || 'Reported'}"`,
      `"${f.reportedAt ? new Date(f.reportedAt).toLocaleDateString() : ''}"`,
      `"${(f.description || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Faculty_Student_Fault_Reports_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success('Successfully exported Student Fault Reports to CSV!');
  };

  /* ── Export Full JSON Summary ─────────────────────────────────── */
  const handleExportJSON = () => {
    const reportData = {
      generatedAt: new Date().toISOString(),
      summaryMetrics: summary,
      faultReportsCount: faultReports.length,
      faultReports: faultReports
    };

    const jsonString = JSON.stringify(reportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Faculty_Student_Fault_Reports_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success('Fault Reports exported as JSON!');
  };

  const handlePrint = () => {
    window.print();
  };

  const getStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case 'RESOLVED':
      case 'CLOSED':
      case 'COMPLETED':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20';
      case 'IN PROGRESS':
      case 'ASSIGNED':
      case 'UNDER REVIEW':
        return 'bg-sky-500/15 text-sky-400 border-sky-500/20';
      case 'OPEN':
      case 'REPORTED':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/20';
      case 'REJECTED':
      case 'CANCELLED':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/20';
      default:
        return 'bg-slate-700 text-slate-300 border-slate-600';
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority?.toUpperCase()) {
      case 'CRITICAL':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30 font-bold';
      case 'HIGH':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'MEDIUM':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'LOW':
      default:
        return 'bg-slate-700/60 text-slate-300 border-slate-600/50';
    }
  };

  // Open Fault Details Modal
  const handleViewFaultDetails = (fault) => {
    setSelectedFault(fault);
    setActionAssignee('');
    setActionReason('');
    setActionStatus(fault.status || 'Reported');
    setIsModalOpen(true);
  };

  // Handle Faculty Actions
  const handleAssignTechnician = async () => {
    if (!actionAssignee.trim()) {
      toast.error('Please enter a technician / assignee name');
      return;
    }
    setActionLoading(true);
    try {
      await facultyService.assignFaultTechnician(selectedFault.faultId, actionAssignee.trim());
      toast.success(`Fault assigned to ${actionAssignee.trim()}`);
      setIsModalOpen(false);
      fetchFacultyFaultData();
    } catch (err) {
      toast.error('Failed to assign technician');
    } finally {
      setActionLoading(false);
    }
  };

  const handleResolveFault = async () => {
    setActionLoading(true);
    try {
      await facultyService.resolveFaultPost(selectedFault.faultId);
      toast.success('Fault report marked as Resolved');
      setIsModalOpen(false);
      fetchFacultyFaultData();
    } catch (err) {
      toast.error('Failed to resolve fault report');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectFault = async () => {
    setActionLoading(true);
    try {
      await facultyService.rejectFaultPost(selectedFault.faultId, actionReason.trim() || 'Not reproducible / Rejected by faculty');
      toast.success('Fault report rejected');
      setIsModalOpen(false);
      fetchFacultyFaultData();
    } catch (err) {
      toast.error('Failed to reject fault report');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!actionStatus) return;
    setActionLoading(true);
    try {
      await facultyService.updateFaultStatus(selectedFault.faultId, actionStatus);
      toast.success(`Fault status updated to ${actionStatus}`);
      setIsModalOpen(false);
      fetchFacultyFaultData();
    } catch (err) {
      toast.error('Failed to update status');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-7 max-w-7xl mx-auto print:p-0 print:space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-orange-500" />
            Faculty Fault Reports & Lab Overview
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Department-scoped student fault submissions, equipment health, and resolution management
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={fetchFacultyFaultData}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl font-medium transition-all text-sm"
            title="Refresh Reports Data"
          >
            <RefreshCw className="w-4 h-4 text-orange-400" /> Refresh
          </button>
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
        <h1 className="text-2xl font-bold">SmartLab AI - Student Fault Reports Summary</h1>
        <p className="text-sm text-gray-600">Department Fault Audit Trail • Generated on {new Date().toLocaleString()}</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
            <p className="text-slate-400 text-sm">Loading department student fault reports...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Summary Indicator Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            {[
              { label: 'Total Student Faults', value: summary.totalFaults, icon: AlertTriangle, color: 'from-orange-500/20 to-amber-500/10 border-orange-500/20', text: 'text-orange-400' },
              { label: 'Open Faults', value: summary.openFaults, icon: Clock, color: 'from-amber-500/20 to-yellow-500/10 border-amber-500/20', text: 'text-amber-400' },
              { label: 'In Progress', value: summary.inProgressFaults, icon: Wrench, color: 'from-sky-500/20 to-blue-500/10 border-sky-500/20', text: 'text-sky-400' },
              { label: 'Resolved', value: summary.resolvedFaults, icon: CheckCircle, color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/20', text: 'text-emerald-400' },
              { label: 'Critical / High', value: summary.criticalHighFaults, icon: ShieldAlert, color: 'from-rose-500/20 to-pink-500/10 border-rose-500/20', text: 'text-rose-400' },
              { label: 'Pending Review', value: summary.pendingReviewFaults, icon: Eye, color: 'from-purple-500/20 to-indigo-500/10 border-purple-500/20', text: 'text-purple-400' },
            ].map(({ label, value, icon: Icon, color, text }) => (
              <div key={label} className={`bg-gradient-to-br ${color} border rounded-2xl p-4 relative overflow-hidden`}>
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">{label}</p>
                  <Icon className={`w-4 h-4 ${text}`} />
                </div>
                <p className="text-2xl font-bold text-white mt-2">{value}</p>
              </div>
            ))}
          </div>

          {/* Filter & Search Toolbar */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 print:hidden">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search student, register no, equipment, or fault ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700/60 rounded-xl text-white placeholder-slate-400 text-sm focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Status Filter */}
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3.5 py-2.5 bg-slate-800 border border-slate-700/60 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-orange-500 cursor-pointer"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="Open">Open / Reported</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Cancelled">Cancelled</option>
                </select>

                {/* Severity / Priority Filter */}
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="px-3.5 py-2.5 bg-slate-800 border border-slate-700/60 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-orange-500 cursor-pointer"
                >
                  <option value="ALL">All Severities</option>
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>

                {/* Laboratory Filter */}
                <select
                  value={selectedLabId}
                  onChange={(e) => setSelectedLabId(e.target.value)}
                  className="px-3.5 py-2.5 bg-slate-800 border border-slate-700/60 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-orange-500 cursor-pointer"
                >
                  <option value="ALL">All Laboratories</option>
                  {labs.map(lab => (
                    <option key={lab.laboratoryId || lab.id} value={lab.laboratoryId || lab.id}>
                      {lab.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Student Fault Reports Section */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-400" />
                  Student Fault Reports
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Actual student-submitted fault logs for equipment in your department's laboratories
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-slate-800 text-slate-300 text-xs font-mono rounded-lg border border-slate-700">
                  {faultReports.length} Records
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
                    <th className="px-6 py-4 font-medium">Fault ID</th>
                    <th className="px-6 py-4 font-medium">Student Name</th>
                    <th className="px-6 py-4 font-medium">Equipment Name</th>
                    <th className="px-6 py-4 font-medium">Laboratory</th>
                    <th className="px-6 py-4 font-medium">Problem Description</th>
                    <th className="px-6 py-4 font-medium">Severity</th>
                    <th className="px-6 py-4 font-medium">Reported Date</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium text-right print:hidden">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {faultReports.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="px-6 py-12 text-center text-slate-500">
                        No student fault reports found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    faultReports.map((f) => {
                      const studentName = f.reportedBy?.name || 'Student';
                      const regNo = f.reportedBy?.registerNumber || f.reportedBy?.studentId || '';
                      const equipName = f.equipment?.name || 'Equipment';
                      const labName = f.equipment?.laboratory?.name || 'Laboratory';
                      const reportedDate = f.reportedAt ? new Date(f.reportedAt).toLocaleDateString() : 'N/A';

                      return (
                        <tr key={f.faultId} className="hover:bg-slate-800/40 transition-colors text-slate-300">
                          <td className="px-6 py-4 font-mono text-xs text-orange-400 font-medium">
                            #F-{f.faultId}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 text-xs font-semibold">
                                {studentName.charAt(0)}
                              </div>
                              <div>
                                <p className="font-medium text-white text-sm">{studentName}</p>
                                {regNo && <p className="text-[11px] text-slate-500 font-mono">Reg: {regNo}</p>}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Laptop className="w-4 h-4 text-orange-400" />
                              <span className="text-slate-200 font-medium">{equipName}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-300">
                            <div className="flex items-center gap-1.5">
                              <FlaskConical className="w-3.5 h-3.5 text-sky-400" />
                              <span>{labName}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 max-w-xs truncate text-xs text-slate-300" title={f.description}>
                            {f.description || 'No description provided'}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getPriorityBadge(f.priority)}`}>
                              {f.priority || 'Low'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-400">
                            {reportedDate}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(f.status)}`}>
                              {f.status || 'Reported'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right print:hidden">
                            <button
                              onClick={() => handleViewFaultDetails(f)}
                              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5 ml-auto"
                            >
                              <Eye className="w-3.5 h-3.5 text-orange-400" /> Details
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
        </>
      )}

      {/* Fault Report Details & Action Modal */}
      {isModalOpen && selectedFault && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900 z-10">
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="w-5 h-5 text-orange-400" />
                <h3 className="text-lg font-bold text-white">Student Fault Report Details</h3>
                <span className="px-2.5 py-0.5 bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-mono rounded-md">
                  #F-{selectedFault.faultId}
                </span>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Student & Equipment Info Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-4 space-y-2">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-orange-400" /> Student Information
                  </p>
                  <p className="text-sm font-bold text-white">{selectedFault.reportedBy?.name || 'Student'}</p>
                  <p className="text-xs text-slate-300">Reg No: {selectedFault.reportedBy?.registerNumber || selectedFault.reportedBy?.studentId || 'N/A'}</p>
                  <p className="text-xs text-slate-400">Email: {selectedFault.reportedBy?.email || 'N/A'}</p>
                </div>

                <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-4 space-y-2">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Laptop className="w-3.5 h-3.5 text-sky-400" /> Equipment & Lab
                  </p>
                  <p className="text-sm font-bold text-white">{selectedFault.equipment?.name || 'Equipment'}</p>
                  <p className="text-xs text-slate-300">Equipment ID: {selectedFault.equipment?.equipmentId || 'N/A'}</p>
                  <p className="text-xs text-slate-400">Laboratory: {selectedFault.equipment?.laboratory?.name || 'Main Lab'}</p>
                </div>
              </div>

              {/* Problem Description & Status */}
              <div className="bg-slate-800/30 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">Severity Level:</span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getPriorityBadge(selectedFault.priority)}`}>
                    {selectedFault.priority || 'Low'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">Current Status:</span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(selectedFault.status)}`}>
                    {selectedFault.status || 'Reported'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Reported Date:</span>
                  <span>{selectedFault.reportedAt ? new Date(selectedFault.reportedAt).toLocaleString() : 'N/A'}</span>
                </div>
                <div className="pt-2 border-t border-slate-800">
                  <p className="text-xs font-semibold text-slate-400 mb-1">Problem Description:</p>
                  <p className="text-sm text-slate-200 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                    {selectedFault.description || 'No detailed description provided.'}
                  </p>
                </div>
              </div>

              {/* Faculty Actions Section */}
              <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-5 space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-orange-400" />
                  Faculty Management Actions
                </h4>

                {/* Assign Technician Action */}
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-medium text-slate-300">Assign Technician / Person</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Technician name..."
                      value={actionAssignee}
                      onChange={(e) => setActionAssignee(e.target.value)}
                      className="flex-1 px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-orange-500"
                    />
                    <button
                      onClick={handleAssignTechnician}
                      disabled={actionLoading}
                      className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-semibold transition-colors disabled:opacity-50"
                    >
                      Assign
                    </button>
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-700/60">
                  <button
                    onClick={handleResolveFault}
                    disabled={actionLoading}
                    className="flex-1 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 disabled:opacity-50"
                  >
                    <CheckCircle className="w-4 h-4" /> Mark as Resolved
                  </button>

                  <button
                    onClick={handleRejectFault}
                    disabled={actionLoading}
                    className="flex-1 px-4 py-2.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    <XCircle className="w-4 h-4" /> Reject Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}