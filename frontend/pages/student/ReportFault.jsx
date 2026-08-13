import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { studentService } from '../../services/studentService';
import { toast } from 'react-hot-toast';
import { AlertCircle, FileText, Loader2 } from 'lucide-react';
import Pagination from '../../components/common/Pagination';

export default function ReportFault() {
  const { user } = useAuth();
  const [equipments, setEquipments] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    equipmentId: '',
    issueDescription: '',
    priority: 'Low'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const paginatedReports = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return reports.slice(start, start + itemsPerPage);
  }, [reports, currentPage]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [bookingsRes, faultRes] = await Promise.all([
          studentService.getMyBookings(user.id),
          studentService.getMyFaultReports(user.id)
        ]);
        
        const bookingsBody = bookingsRes?.data || bookingsRes;
        let bookingsList = [];
        if (bookingsBody) {
          if (bookingsBody.success && bookingsBody.data) {
            bookingsList = bookingsBody.data.content || bookingsBody.data;
          } else {
            bookingsList = bookingsBody.content || bookingsBody;
          }
        }
        const dataBookings = Array.isArray(bookingsList) ? bookingsList : [];
        
        // Extract unique equipment from student's bookings
        const uniqueEqsMap = new Map();
        dataBookings.forEach(booking => {
          if (booking.equipment) {
            const eqId = booking.equipment.equipmentId || booking.equipment.id;
            if (eqId) {
              uniqueEqsMap.set(eqId, booking.equipment);
            }
          }
        });
        const userBookedEquipments = Array.from(uniqueEqsMap.values());
        
        const faultBody = faultRes?.data || faultRes;
        let faultList = [];
        if (faultBody) {
          if (faultBody.success && faultBody.data) {
            faultList = faultBody.data;
          } else {
            faultList = faultBody;
          }
        }
        setEquipments(userBookedEquipments);
        setReports(Array.isArray(faultList) ? faultList : []);
      } catch (error) {
        toast.error('Failed to load data.');
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) {
      fetchData();
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.equipmentId || !formData.issueDescription) {
      toast.error('Please fill in all required fields.');
      return;
    }
    try {
      setSubmitting(true);
      const currentStudentId = Number(user?.id || user?.userId || 1);
      await studentService.reportFault({
        studentId: currentStudentId,
        equipmentId: Number(formData.equipmentId),
        reportedBy: { studentId: currentStudentId },
        equipment: { equipmentId: Number(formData.equipmentId) },
        description: formData.issueDescription,
        issueDescription: formData.issueDescription,
        priority: formData.priority
      });
      toast.success('Fault reported successfully.');
      setFormData({ equipmentId: '', issueDescription: '', priority: 'Low' });
      // Refresh reports
      const updatedRes = await studentService.getMyFaultReports(user.id);
      const updatedBody = updatedRes?.data || updatedRes;
      let updatedList = [];
      if (updatedBody) {
        if (updatedBody.success && updatedBody.data) {
          updatedList = updatedBody.data;
        } else {
          updatedList = updatedBody;
        }
      }
      setReports(Array.isArray(updatedList) ? updatedList : []);
      setCurrentPage(1);
    } catch (error) {
      toast.error('Failed to report fault.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelFault = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this fault report?')) return;
    try {
      await studentService.cancelFaultReport(id);
      toast.success('Fault report cancelled successfully.');
      setReports(prev => prev.map(r => (r.faultId === id || r.id === id) ? { ...r, status: 'Cancelled' } : r));
    } catch (err) {
      toast.error('Failed to cancel fault report.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <AlertCircle className="w-6 h-6 text-orange-500" />
          Report Equipment Fault
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-400 text-sm font-medium mb-1">Equipment *</label>
            <select
              value={formData.equipmentId}
              onChange={(e) => setFormData({ ...formData, equipmentId: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500"
            >
              <option value="">Select Equipment</option>
              {equipments.map((eq) => {
                const eqId = eq.equipmentId || eq.id;
                return <option key={eqId} value={eqId}>{eq.name} (#{eqId})</option>;
              })}
            </select>
          </div>

          <div>
            <label className="block text-slate-400 text-sm font-medium mb-1">Issue Description *</label>
            <textarea
              value={formData.issueDescription}
              onChange={(e) => setFormData({ ...formData, issueDescription: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500 h-32 resize-none"
              placeholder="Describe the issue in detail..."
            />
          </div>

          <div>
            <label className="block text-slate-400 text-sm font-medium mb-1">Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
              Submit Report
            </button>
          </div>
        </form>
      </div>

      <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <FileText className="w-6 h-6 text-orange-500" />
          My Fault Reports
        </h2>

        {reports.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            No fault reports found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="py-4 px-4 text-slate-400 font-medium text-sm">Date</th>
                  <th className="py-4 px-4 text-slate-400 font-medium text-sm">Equipment</th>
                  <th className="py-4 px-4 text-slate-400 font-medium text-sm">Priority</th>
                  <th className="py-4 px-4 text-slate-400 font-medium text-sm">Status</th>
                  <th className="py-4 px-4 text-slate-400 font-medium text-sm">Description</th>
                  <th className="py-4 px-4 text-slate-400 font-medium text-sm text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedReports.map((report, index) => {
                  const faultId = report.faultId || report.id || report._id || index;
                  return (
                    <tr key={faultId} className="border-b border-slate-800 last:border-0 hover:bg-slate-800/50">
                      <td className="py-4 px-4 text-white text-sm">
                        {report.reportedAt ? new Date(report.reportedAt).toLocaleDateString() : (report.createdAt ? new Date(report.createdAt).toLocaleDateString() : new Date().toLocaleDateString())}
                      </td>
                      <td className="py-4 px-4 text-white text-sm">
                        {report.equipment?.name || report.equipment?.id || 'Unknown'}
                      </td>
                      <td className="py-4 px-4 text-sm">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          report.priority === 'High' ? 'bg-red-500/10 text-red-500' :
                          report.priority === 'Medium' ? 'bg-yellow-500/10 text-yellow-500' :
                          'bg-blue-500/10 text-blue-500'
                        }`}>
                          {report.priority || 'Low'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          report.status === 'Open' ? 'bg-orange-500/10 text-orange-500' :
                          report.status === 'In Progress' ? 'bg-yellow-500/10 text-yellow-500' :
                          report.status === 'Cancelled' ? 'bg-slate-500/10 text-slate-400 border border-slate-500/20' :
                          'bg-green-500/10 text-green-500'
                        }`}>
                          {report.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-400 text-sm max-w-xs truncate" title={report.description}>
                        {report.description || report.issueDescription}
                      </td>
                      <td className="py-4 px-4 text-sm text-right">
                        {report.status?.toLowerCase() === 'open' && (
                          <button
                            onClick={() => handleCancelFault(faultId)}
                            className="px-3 py-1.5 text-xs font-medium text-red-500 hover:text-white border border-red-500/50 hover:bg-red-500 rounded-lg transition-colors whitespace-nowrap"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <Pagination
          currentPage={currentPage}
          totalItems={reports.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}