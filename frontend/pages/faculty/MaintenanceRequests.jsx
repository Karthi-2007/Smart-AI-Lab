import React, { useState, useEffect, useMemo } from 'react';
import {
  Wrench, Plus, Search, Edit2, Loader2, Laptop,
  X, Save, CheckCircle, Clock, Calendar, AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { facultyService } from '../../services/facultyService';

/* ─── Add/Edit Modal ─────────────────────────────────────────── */
function MaintenanceModal({ mode, maintenance, equipments, onClose, onSave }) {
  const isEdit = mode === 'edit';
  const [form, setForm] = useState({
    equipmentId: isEdit ? (maintenance?.equipment?.equipmentId || '') : (equipments[0]?.equipmentId || ''),
    scheduledAt: isEdit && maintenance?.scheduledAt ? new Date(maintenance.scheduledAt).toISOString().slice(0, 16) : '',
    status: isEdit ? (maintenance?.status || 'Scheduled') : 'Scheduled',
    notes: isEdit ? (maintenance?.notes || '') : ''
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.equipmentId) { toast.error('Please select an equipment'); return; }
    setSaving(true);
    try {
      await onSave({
        equipment: { equipmentId: Number(form.equipmentId) },
        scheduledAt: form.scheduledAt ? new Date(form.scheduledAt).toISOString() : new Date().toISOString(),
        status: form.status,
        notes: form.notes.trim()
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-500/15 flex items-center justify-center">
              <Wrench className="w-5 h-5 text-orange-400" />
            </div>
            <h2 className="text-lg font-semibold text-white">
              {isEdit ? 'Edit Maintenance Task' : 'Schedule Maintenance'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Select Equipment *</label>
            <select
              name="equipmentId"
              value={form.equipmentId}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors text-sm"
            >
              <option value="" disabled>Select Equipment</option>
              {equipments.map(eq => (
                <option key={eq.equipmentId} value={eq.equipmentId}>
                  {eq.name} ({eq.laboratory?.name || 'No Lab'})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Scheduled Date & Time</label>
            <input
              type="datetime-local"
              name="scheduledAt"
              value={form.scheduledAt}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Status *</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors text-sm"
            >
              <option value="Scheduled">Scheduled</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Maintenance Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={3}
              placeholder="Describe the issue or routine maintenance required..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors text-sm resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-60"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isEdit ? 'Save Changes' : 'Schedule Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Main Maintenance Component ────────────────────────────── */
export default function MaintenanceRequests() {
  const [maintenanceList, setMaintenanceList] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [modal, setModal] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [mRes, eqRes] = await Promise.all([
        facultyService.getAllMaintenance(),
        facultyService.getAllEquipments()
      ]);
      setMaintenanceList(mRes?.data || []);
      setEquipments(eqRes?.data || []);
    } catch (err) {
      toast.error('Failed to load maintenance records');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const stats = useMemo(() => {
    return {
      total: maintenanceList.length,
      scheduled: maintenanceList.filter(m => m.status === 'Scheduled').length,
      inProgress: maintenanceList.filter(m => m.status === 'In Progress').length,
      completed: maintenanceList.filter(m => m.status === 'Completed').length,
    };
  }, [maintenanceList]);

  const filteredTasks = useMemo(() => {
    return maintenanceList.filter(m => {
      const matchesSearch =
        (m.equipment?.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (m.notes || '').toLowerCase().includes(search.toLowerCase()) ||
        String(m.maintenanceId || '').includes(search);
      const matchesStatus = statusFilter === 'All' || m.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [maintenanceList, search, statusFilter]);

  const handleCreate = async (payload) => {
    try {
      await facultyService.createMaintenance(payload);
      toast.success('Maintenance scheduled!');
      setModal(null);
      fetchData();
    } catch (err) {
      toast.error('Failed to schedule maintenance');
    }
  };

  const handleEdit = async (payload) => {
    try {
      await facultyService.updateMaintenance(modal.maintenance.maintenanceId, payload);
      toast.success('Maintenance task updated!');
      setModal(null);
      fetchData();
    } catch (err) {
      toast.error('Failed to update maintenance task');
    }
  };

  const handleComplete = async (id) => {
    try {
      await facultyService.completeMaintenance(id);
      toast.success('Maintenance marked as Completed');
      fetchData();
    } catch (err) {
      toast.error('Failed to mark task as complete');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20';
      case 'In Progress':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/20';
      case 'Scheduled':
        return 'bg-sky-500/15 text-sky-400 border-sky-500/20';
      default:
        return 'bg-slate-700 text-slate-300 border-slate-600';
    }
  };

  return (
    <div className="space-y-7 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Maintenance Schedule</h1>
          <p className="text-slate-400 text-sm mt-1">Manage and track equipment maintenance tasks and service logs</p>
        </div>
        <button
          onClick={() => setModal({ mode: 'add' })}
          className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-all shadow-lg shadow-orange-500/20 text-sm"
        >
          <Plus className="w-4 h-4" /> Schedule Maintenance
        </button>
      </div>

      {/* Stats Bar */}
      {!loading && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Tasks', value: stats.total, icon: Wrench, color: 'text-orange-400' },
            { label: 'Scheduled', value: stats.scheduled, icon: Calendar, color: 'text-sky-400' },
            { label: 'In Progress', value: stats.inProgress, icon: Clock, color: 'text-amber-400' },
            { label: 'Completed', value: stats.completed, icon: CheckCircle, color: 'text-emerald-400' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-slate-900 border border-slate-800 rounded-xl px-5 py-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-xs text-slate-500">{label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by equipment name or notes..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-11 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex gap-2 bg-slate-900 border border-slate-800 p-1 rounded-xl overflow-x-auto">
          {['All', 'Scheduled', 'In Progress', 'Completed'].map(tab => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                statusFilter === tab
                  ? 'bg-orange-500 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Data Table */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
            <p className="text-slate-400 text-sm">Loading maintenance tasks...</p>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-800/50 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4 font-medium">Task ID</th>
                  <th className="px-6 py-4 font-medium">Equipment</th>
                  <th className="px-6 py-4 font-medium">Scheduled Date</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Notes</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center gap-2">
                        <Wrench className="w-8 h-8 text-slate-700" />
                        <p className="font-medium text-slate-400">No maintenance tasks found</p>
                        <p className="text-xs text-slate-600">Try adjusting your filters or schedule a new task</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((item) => (
                    <tr key={item.maintenanceId} className="hover:bg-slate-800/30 transition-colors text-slate-300">
                      <td className="px-6 py-4 font-mono text-xs text-slate-400">#{item.maintenanceId}</td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-white">{item.equipment?.name || 'Unassigned Equipment'}</div>
                          <div className="text-xs text-slate-500">{item.equipment?.laboratory?.name || 'No Lab'}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-300">
                        {item.scheduledAt ? new Date(item.scheduledAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-xs max-w-xs truncate">
                        {item.notes || <span className="italic text-slate-600">No notes</span>}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {item.status !== 'Completed' && (
                            <button
                              onClick={() => handleComplete(item.maintenanceId)}
                              className="p-1.5 hover:bg-emerald-500/10 text-emerald-400 hover:text-emerald-300 rounded-lg transition-colors"
                              title="Mark as Completed"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => setModal({ mode: 'edit', maintenance: item })}
                            className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"
                            title="Edit Task"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      {modal?.mode === 'add' && (
        <MaintenanceModal mode="add" equipments={equipments} onClose={() => setModal(null)} onSave={handleCreate} />
      )}
      {modal?.mode === 'edit' && (
        <MaintenanceModal mode="edit" maintenance={modal.maintenance} equipments={equipments} onClose={() => setModal(null)} onSave={handleEdit} />
      )}
    </div>
  );
}