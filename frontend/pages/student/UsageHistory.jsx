import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { studentService } from '../../services/studentService';
import { toast } from 'react-hot-toast';
import { History, Download, Loader2 } from 'lucide-react';

export default function UsageHistory() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const res = await studentService.getMyBookings(user.id);
        const data = res?.data || res || [];
        const list = Array.isArray(data) ? data : [];
        const completed = list.filter(b => b.status?.toLowerCase() === 'completed');
        setHistory(completed);
      } catch (error) {
        toast.error('Failed to load usage history.');
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) {
      fetchHistory();
    }
  }, [user]);

  const handleExportCSV = () => {
    if (history.length === 0) {
      toast.error('No data to export.');
      return;
    }
    
    // Basic CSV generation
    const headers = ['Date,Equipment,Duration,Status\n'];
    const rows = history.map(h => {
      const date = new Date(h.date || h.createdAt || Date.now()).toLocaleDateString();
      const eq = h.equipment?.name || h.equipmentId || 'Unknown';
      const dur = h.duration || 'N/A';
      return `${date},${eq},${dur},${h.status}\n`;
    });
    
    const csvContent = "data:text/csv;charset=utf-8," + headers.concat(rows).join("");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "usage_history.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Exported to CSV successfully.');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-4">
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <History className="w-6 h-6 text-orange-500" />
            Lab Usage History
          </h2>
          <p className="text-slate-400 mt-1 text-sm">View all your completed lab sessions and equipment usage.</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm border border-slate-700"
        >
          <Download className="w-4 h-4" />
          Export to CSV
        </button>
      </div>

      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
        {history.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            No completed sessions found in your history.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-800/50">
                  <th className="py-4 px-6 text-slate-400 font-medium text-sm">Date</th>
                  <th className="py-4 px-6 text-slate-400 font-medium text-sm">Equipment</th>
                  <th className="py-4 px-6 text-slate-400 font-medium text-sm">Time Slot</th>
                  <th className="py-4 px-6 text-slate-400 font-medium text-sm">Duration</th>
                  <th className="py-4 px-6 text-slate-400 font-medium text-sm">Status</th>
                </tr>
              </thead>
              <tbody>
                {history.map((record) => (
                  <tr key={record.id} className="border-b border-slate-800 last:border-0 hover:bg-slate-800/30">
                    <td className="py-4 px-6 text-white text-sm">
                      {new Date(record.date || record.createdAt || Date.now()).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-white text-sm">
                      <div className="font-medium">{record.equipment?.name || record.equipmentId || 'Equipment'}</div>
                      <div className="text-xs text-slate-400">{record.equipment?.type || 'Type Unknown'}</div>
                    </td>
                    <td className="py-4 px-6 text-slate-300 text-sm">
                      {record.startTime} - {record.endTime}
                    </td>
                    <td className="py-4 px-6 text-slate-300 text-sm">
                      {record.duration || 'N/A'}
                    </td>
                    <td className="py-4 px-6 text-sm">
                      <span className="px-2 py-1 rounded text-xs font-medium bg-green-500/10 text-green-500">
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}