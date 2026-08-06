import React, { useState } from 'react';
import { PlusCircle, Wrench, X } from 'lucide-react';
import MaintenanceTable from './maintenance/MaintenanceTable';
import MaintenanceStats from './maintenance/MaintenanceStats';
import { adminService } from '../../services/adminService';
import toast from 'react-hot-toast';

const ManageMaintenance = () => {
  const [search, setSearch] = useState('');
  const [maintenance, setMaintenance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ equipment: '', scheduledDate: '', technician: '', type: 'Preventive' });

  const handleMaintenanceLoaded = (data) => {
    setMaintenance(data);
    setLoading(false);
  };

  const handleAddMaintenance = async (e) => {
    e.preventDefault();
    try {
      await adminService.scheduleMaintenance(formData);
      toast.success('Maintenance scheduled successfully!');
      setIsModalOpen(false);
      // Let the table refetch or force it to, simple page reload for simplicity since we don't have a refetch trigger
      window.location.reload(); 
    } catch (error) {
      toast.error('Failed to schedule maintenance.');
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Maintenance Management</h1>
          <p className="text-slate-400">Schedule and track equipment maintenance</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-3 rounded-xl transition flex items-center gap-2"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Add Maintenance</span>
        </button>
      </div>

      <MaintenanceStats maintenance={maintenance} loading={loading} />

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search maintenance by equipment, technician..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition text-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select 
          className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 outline-none focus:border-orange-500 text-slate-300 md:w-48"
          onChange={(e) => {
            const val = e.target.value;
            setSearch(val === 'All' ? '' : val);
          }}
        >
          <option value="All">All Statuses</option>
          <option value="Scheduled">Scheduled</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <MaintenanceTable search={search} onMaintenanceLoaded={handleMaintenanceLoaded} />

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Schedule Maintenance</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddMaintenance} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Equipment Name</label>
                <input required type="text" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500" value={formData.equipment} onChange={e => setFormData({...formData, equipment: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Scheduled Date</label>
                <input required type="date" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500" value={formData.scheduledDate} onChange={e => setFormData({...formData, scheduledDate: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Technician Name</label>
                <input required type="text" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500" value={formData.technician} onChange={e => setFormData({...formData, technician: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Type</label>
                <select className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                  <option value="Preventive">Preventive</option>
                  <option value="Corrective">Corrective</option>
                  <option value="Inspection">Inspection</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-400 hover:text-white transition">Cancel</button>
                <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-xl transition">Schedule</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageMaintenance;