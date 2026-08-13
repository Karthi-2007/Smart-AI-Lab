import React, { useState, useEffect, useMemo } from 'react';
import {
  Laptop, Plus, Search, Edit2, Trash2, Loader2,
  Building2, X, Save, AlertTriangle, CheckCircle, Clock, AlertOctagon
} from 'lucide-react';
import toast from 'react-hot-toast';
import { facultyService } from '../../services/facultyService';
import Pagination from '../../components/common/Pagination';

/* ─── Add/Edit Modal ─────────────────────────────────────────── */
function EquipmentModal({ mode, equipment, labs, onClose, onSave }) {
  const isEdit = mode === 'edit';
  const [form, setForm] = useState({
    name: isEdit ? (equipment?.name || '') : '',
    status: isEdit ? (equipment?.status || 'Available') : 'Available',
    labId: isEdit ? (equipment?.laboratory?.labId || '') : (labs[0]?.labId || ''),
    imageUrl: isEdit ? (equipment?.imageUrl || '') : ''
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Equipment name is required'); return; }
    if (!form.labId) { toast.error('Please select a laboratory'); return; }
    setSaving(true);
    try {
      await onSave({
        name: form.name.trim(),
        status: form.status,
        laboratory: { labId: Number(form.labId) },
        imageUrl: form.imageUrl.trim()
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
              <Laptop className="w-5 h-5 text-orange-400" />
            </div>
            <h2 className="text-lg font-semibold text-white">
              {isEdit ? 'Edit Equipment' : 'Add New Equipment'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Equipment Name *</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Oscilloscope Tektronix TBS1052B"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Laboratory *</label>
            <select
              name="labId"
              value={form.labId}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors text-sm"
            >
              <option value="" disabled>Select Laboratory</option>
              {labs.map((lab, idx) => (
                <option key={lab.labId || lab.id || `lab-${idx}`} value={lab.labId || lab.id}>
                  {lab.name} ({lab.location || 'No Loc'})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Status *</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors text-sm"
            >
              <option value="Available">Available</option>
              <option value="Under Maintenance">Under Maintenance</option>
              <option value="Faulty">Faulty</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Image URL</label>
            <input
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              placeholder="e.g. https://images.unsplash.com/..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors text-sm"
            />
          </div>

          {/* Live Preview inside Faculty Modal */}
          <div className="flex items-center gap-3 bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
            <img
              src={form.imageUrl || "https://images.unsplash.com/photo-1532187643603-ba119ca4109e?w=600&auto=format&fit=crop"}
              onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1532187643603-ba119ca4109e?w=600&auto=format&fit=crop"; }}
              className="w-12 h-10 object-cover rounded-lg border border-slate-800"
              alt="preview"
            />
            <span className="text-[11px] text-slate-500 truncate flex-1">
              {form.imageUrl ? "Image URL Active" : "Default Fallback Image"}
            </span>
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
              {isEdit ? 'Save Changes' : 'Add Equipment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Delete Confirm ─────────────────────────────────────────── */
function DeleteConfirm({ item, onClose, onConfirm }) {
  const [deleting, setDeleting] = useState(false);

  const handleConfirm = async () => {
    setDeleting(true);
    try { await onConfirm(); }
    finally { setDeleting(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-6 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-7 h-7 text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Delete Equipment</h3>
            <p className="text-slate-400 text-sm mt-1">
              Are you sure you want to delete <span className="text-white font-medium">"{item?.name}"</span>?
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium transition-colors">
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={deleting}
              className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main ManageEquipment Component ───────────────────────────── */
export default function ManageEquipment() {
  const [equipments, setEquipments] = useState([]);
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [modal, setModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    setCurrentPage(1);
    fetchData();
  }, [statusFilter]);

  const fetchData = async () => {
    setLoading(true);
    try {
      let eqReq;
      switch (statusFilter) {
        case 'Available':
          eqReq = facultyService.getEquipmentsAvailable();
          break;
        case 'Under Maintenance':
          eqReq = facultyService.getEquipmentsUnderMaintenance();
          break;
        case 'Faulty':
          eqReq = facultyService.getEquipmentsFaulty();
          break;
        case 'All':
        default:
          eqReq = facultyService.getEquipmentsAll();
          break;
      }

      const [eqRes, labRes] = await Promise.all([
        eqReq,
        facultyService.getMyLabs()
      ]);
      const eqBody = eqRes?.data || eqRes;
      let eqList = [];
      if (eqBody) {
        if (eqBody.success && eqBody.data) {
          eqList = eqBody.data;
        } else {
          eqList = eqBody;
        }
      }
      setEquipments(Array.isArray(eqList) ? eqList : []);

      const labBody = labRes?.data || labRes;
      let labList = [];
      if (labBody) {
        if (labBody.success && labBody.data) {
          labList = labBody.data;
        } else {
          labList = labBody;
        }
      }
      setLabs(Array.isArray(labList) ? labList : []);
    } catch (err) {
      toast.error('Failed to load equipment data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    return {
      total: equipments.length,
      available: equipments.filter(e => e.status === 'Available').length,
      maintenance: equipments.filter(e => e.status === 'Under Maintenance').length,
      faulty: equipments.filter(e => e.status === 'Faulty').length,
    };
  }, [equipments]);

  const filteredEquipments = useMemo(() => {
    return equipments.filter(e => {
      const matchesSearch =
        (e.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (e.laboratory?.name || '').toLowerCase().includes(search.toLowerCase()) ||
        String(e.equipmentId || '').includes(search);
      const matchesStatus = statusFilter === 'All' || e.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [equipments, search, statusFilter]);

  const paginatedEquipments = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredEquipments.slice(start, start + itemsPerPage);
  }, [filteredEquipments, currentPage]);

  const handleAdd = async (payload) => {
    try {
      await facultyService.createEquipment(payload);
      toast.success('Equipment added successfully!');
      setModal(null);
      fetchData();
    } catch (err) {
      toast.error('Failed to add equipment');
    }
  };

  const handleEdit = async (payload) => {
    try {
      await facultyService.updateEquipment(modal.equipment.equipmentId, payload);
      toast.success('Equipment updated successfully!');
      setModal(null);
      fetchData();
    } catch (err) {
      toast.error('Failed to update equipment');
    }
  };

  const handleDelete = async () => {
    try {
      await facultyService.deleteEquipment(deleteTarget.equipmentId);
      toast.success(`"${deleteTarget.name}" deleted`);
      setDeleteTarget(null);
      fetchData();
    } catch (err) {
      toast.error('Failed to delete equipment');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Available':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20';
      case 'Under Maintenance':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/20';
      case 'Faulty':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/20';
      default:
        return 'bg-slate-700 text-slate-300 border-slate-600';
    }
  };

  return (
    <div className="space-y-7 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Manage Equipment</h1>
          <p className="text-slate-400 text-sm mt-1">Track, modify, and manage all laboratory devices and apparatus</p>
        </div>
        <button
          onClick={() => setModal({ mode: 'add' })}
          className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-all shadow-lg shadow-orange-500/20 text-sm"
        >
          <Plus className="w-4 h-4" /> Add Equipment
        </button>
      </div>

      {/* Stats Bar */}
      {!loading && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Equipment', value: stats.total, icon: Laptop, color: 'text-orange-400' },
            { label: 'Available', value: stats.available, icon: CheckCircle, color: 'text-emerald-400' },
            { label: 'Under Maintenance', value: stats.maintenance, icon: Clock, color: 'text-amber-400' },
            { label: 'Faulty', value: stats.faulty, icon: AlertOctagon, color: 'text-rose-400' },
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
            placeholder="Search by equipment name or lab..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-11 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex gap-2 bg-slate-900 border border-slate-800 p-1 rounded-xl overflow-x-auto">
          {['All', 'Available', 'Under Maintenance', 'Faulty'].map(tab => (
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
            <p className="text-slate-400 text-sm">Loading equipment list...</p>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-800/50 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4 font-medium">ID</th>
                  <th className="px-6 py-4 font-medium">Equipment Name</th>
                  <th className="px-6 py-4 font-medium">Laboratory</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredEquipments.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center gap-2">
                        <Laptop className="w-8 h-8 text-slate-700" />
                        <p className="font-medium text-slate-400">No equipment found</p>
                        <p className="text-xs text-slate-600">Try adjusting your filters or add a new equipment</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedEquipments.map((item, idx) => (
                    <tr key={item.equipmentId || item.id || `eq-${idx}`} className="hover:bg-slate-800/30 transition-colors text-slate-300">
                      <td className="px-6 py-4 font-mono text-xs text-slate-400">#{item.equipmentId}</td>
                      <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                        <img
                          src={item.imageUrl || "https://images.unsplash.com/photo-1532187643603-ba119ca4109e?w=600&auto=format&fit=crop"}
                          onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1532187643603-ba119ca4109e?w=600&auto=format&fit=crop"; }}
                          className="w-12 h-10 object-cover rounded-lg border border-slate-700 bg-slate-950/60"
                          alt={item.name}
                        />
                        <span>{item.name}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-orange-400/80" />
                          <span>{item.laboratory?.name || 'Unassigned'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setModal({ mode: 'edit', equipment: item })}
                            className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"
                            title="Edit Equipment"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(item)}
                            className="p-1.5 hover:bg-red-500/10 text-red-400 hover:text-red-300 rounded-lg transition-colors"
                            title="Delete Equipment"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <Pagination
            currentPage={currentPage}
            totalItems={filteredEquipments.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Modals */}
      {modal?.mode === 'add' && (
        <EquipmentModal mode="add" labs={labs} onClose={() => setModal(null)} onSave={handleAdd} />
      )}
      {modal?.mode === 'edit' && (
        <EquipmentModal mode="edit" equipment={modal.equipment} labs={labs} onClose={() => setModal(null)} onSave={handleEdit} />
      )}
      {deleteTarget && (
        <DeleteConfirm item={deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} />
      )}
    </div>
  );
}