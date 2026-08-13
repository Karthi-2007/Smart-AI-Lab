import React, { useState, useEffect } from 'react';
import { Wrench, CheckCircle, Trash2, Eye, X } from 'lucide-react';
import { adminService } from '../../../services/adminService';
import toast from 'react-hot-toast';
import Pagination from '../../common/Pagination';

const MaintenanceTable = ({ search, onMaintenanceLoaded }) => {
  const [maintenance, setMaintenance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailMaintenance, setDetailMaintenance] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchMaintenance();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const fetchMaintenance = async () => {
    setLoading(true);
    try {
      const res = await adminService.getMaintenance();
      const body = res?.data || res;
      let list = [];
      if (body) {
        if (body.success && body.data) {
          list = body.data.content || body.data;
        } else {
          list = body.content || body;
        }
      }
      const dataArray = Array.isArray(list) ? list : [];
      setMaintenance(dataArray);
      if (onMaintenanceLoaded) onMaintenanceLoaded(dataArray);
    } catch (error) {
      toast.error('Failed to load maintenance records');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (id) => {
    try {
      await adminService.completeMaintenance(id);
      setMaintenance(prev => prev.map(m => m.maintenanceId === id ? { ...m, status: 'Completed' } : m));
      toast.success('Maintenance completed!');
      fetchMaintenance();
    } catch (error) {
      toast.error('Could not complete maintenance.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this maintenance task?')) {
      try {
        await adminService.deleteMaintenance(id);
        setMaintenance(prev => prev.filter(m => m.maintenanceId !== id));
        toast.success('Maintenance task deleted!');
        fetchMaintenance();
      } catch (error) {
        toast.error('Could not delete maintenance.');
      }
    }
  };

  const filtered = maintenance.filter(m => {
    if (!search) return true;
    const term = search.toLowerCase();
    const eqName = typeof m.equipment === 'object' ? m.equipment?.name : (m.equipment || '');
    return (
      eqName.toLowerCase().includes(term) ||
      (m.technician || '').toLowerCase().includes(term) ||
      (m.status || '').toLowerCase().includes(term) ||
      String(m.maintenanceId || '').toLowerCase().includes(term)
    );
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Scheduled': return <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-500/20 text-orange-400">Scheduled</span>;
      case 'In Progress': return <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">In Progress</span>;
      case 'Completed': return <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">Completed</span>;
      case 'Cancelled': return <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400">Cancelled</span>;
      default: return <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-500/20 text-slate-400">{status || 'Scheduled'}</span>;
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-12 bg-slate-800 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
        <Wrench className="w-16 h-16 text-slate-700 mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">No Maintenance Found</h3>
        <p className="text-slate-400">No records match your criteria.</p>
      </div>
    );
  }

  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead className="bg-slate-800">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">ID</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Equipment</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Scheduled Date</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Technician</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Type</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Status</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {paginated.map((item, idx) => {
              const mId = item.maintenanceId || idx;
              const eqName = typeof item.equipment === 'object' ? item.equipment?.name : (item.equipment || 'N/A');
              return (
                <tr key={mId} className="hover:bg-slate-800/50 transition">
                  <td className="px-6 py-4 text-sm text-slate-300 font-mono">#{mId}</td>
                  <td className="px-6 py-4 text-sm text-white font-medium">{eqName}</td>
                  <td className="px-6 py-4 text-sm text-slate-300">{item.scheduledDate || '-'}</td>
                  <td className="px-6 py-4 text-sm text-slate-300">{item.technician || '-'}</td>
                  <td className="px-6 py-4 text-sm text-slate-300">{item.type || 'Preventive'}</td>
                  <td className="px-6 py-4">{getStatusBadge(item.status)}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {item.status !== 'Completed' && (
                        <button onClick={() => handleComplete(mId)} className="p-2 hover:bg-slate-700 rounded-lg transition" title="Mark Completed">
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        </button>
                      )}
                      <button onClick={() => setDetailMaintenance(item)} className="p-2 hover:bg-slate-700 rounded-lg transition" title="View Details">
                        <Eye className="w-5 h-5 text-slate-400" />
                      </button>
                      <button onClick={() => handleDelete(mId)} className="p-2 hover:bg-slate-700 rounded-lg transition" title="Delete Task">
                        <Trash2 className="w-5 h-5 text-red-400" />
                      </button>
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

      {/* Maintenance Details Modal */}
      {detailMaintenance && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200 text-left">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800 mb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Wrench className="w-5 h-5 text-orange-500" />
                Maintenance Details
              </h3>
              <button onClick={() => setDetailMaintenance(null)} className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Task ID:</span>
                <span className="font-mono text-white">#{detailMaintenance.maintenanceId}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Equipment:</span>
                <span className="font-semibold text-white">{typeof detailMaintenance.equipment === 'object' ? detailMaintenance.equipment?.name : (detailMaintenance.equipment || 'N/A')}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Scheduled Date:</span>
                <span className="text-white">{detailMaintenance.scheduledDate || '-'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Technician:</span>
                <span className="text-white">{detailMaintenance.technician || 'Assigned Staff'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Maintenance Type:</span>
                <span className="text-white">{detailMaintenance.type || 'Preventive'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Status:</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${detailMaintenance.status === 'Completed' ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'}`}>
                  {detailMaintenance.status || 'Scheduled'}
                </span>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button onClick={() => setDetailMaintenance(null)} className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-medium transition">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaintenanceTable;