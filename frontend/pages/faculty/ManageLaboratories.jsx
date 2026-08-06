import React, { useState, useEffect, useMemo } from 'react';
import {
  Building2, Plus, Search, Edit2, Trash2, Loader2,
  MapPin, FlaskConical, X, Save, ChevronDown, AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { facultyService } from '../../services/facultyService';

/* ─── Modal ─────────────────────────────────────────────────── */
function LabModal({ mode, lab, onClose, onSave }) {
  const isEdit = mode === 'edit';
  const [form, setForm] = useState({
    name: isEdit ? (lab?.name || '') : '',
    location: isEdit ? (lab?.location || '') : '',
    departmentId: isEdit ? (lab?.department?.departmentId || '') : '',
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Lab name is required'); return; }
    if (!form.location.trim()) { toast.error('Location is required'); return; }
    setSaving(true);
    try {
      await onSave(form);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-500/15 flex items-center justify-center">
              <FlaskConical className="w-5 h-5 text-orange-400" />
            </div>
            <h2 className="text-lg font-semibold text-white">
              {isEdit ? 'Edit Laboratory' : 'Add New Laboratory'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Lab Name *</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. AI & Machine Learning Lab"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Location / Block *</label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="e.g. Block A, Ground Floor"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors text-sm"
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
              {isEdit ? 'Save Changes' : 'Add Laboratory'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Delete Confirm ─────────────────────────────────────────── */
function DeleteConfirm({ lab, onClose, onConfirm }) {
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
            <h3 className="text-lg font-semibold text-white">Delete Laboratory</h3>
            <p className="text-slate-400 text-sm mt-1">
              Are you sure you want to delete <span className="text-white font-medium">"{lab?.name}"</span>? This action cannot be undone.
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

/* ─── Lab Card ───────────────────────────────────────────────── */
function LabCard({ lab, onEdit, onDelete, index }) {
  const colors = [
    'from-orange-500/20 to-amber-500/10 border-orange-500/20',
    'from-violet-500/20 to-purple-500/10 border-violet-500/20',
    'from-cyan-500/20 to-sky-500/10 border-cyan-500/20',
    'from-emerald-500/20 to-green-500/10 border-emerald-500/20',
    'from-rose-500/20 to-pink-500/10 border-rose-500/20',
    'from-yellow-500/20 to-orange-500/10 border-yellow-500/20',
  ];
  const iconColors = [
    'text-orange-400 bg-orange-500/15',
    'text-violet-400 bg-violet-500/15',
    'text-cyan-400 bg-cyan-500/15',
    'text-emerald-400 bg-emerald-500/15',
    'text-rose-400 bg-rose-500/15',
    'text-yellow-400 bg-yellow-500/15',
  ];
  const ci = index % colors.length;

  return (
    <div className={`relative bg-gradient-to-br ${colors[ci]} border rounded-2xl p-6 hover:scale-[1.02] hover:shadow-xl hover:shadow-black/30 transition-all duration-300 group overflow-hidden`}>
      {/* Decorative blob */}
      <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-white/5 blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconColors[ci]} shrink-0`}>
            <FlaskConical className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-white font-bold text-base leading-tight">{lab.name}</h3>
            <div className="flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-slate-400" />
              <span className="text-slate-400 text-xs">{lab.location || 'No location'}</span>
            </div>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-500/15 text-green-400 border border-green-500/20 shrink-0">
          Active
        </span>
      </div>

      {/* Department */}
      <div className="mb-5 p-3 bg-black/20 rounded-xl border border-white/5">
        <p className="text-xs text-slate-500 mb-0.5">Department</p>
        <p className="text-slate-200 text-sm font-medium">
          {lab.department?.name || <span className="text-slate-500 italic">Not assigned</span>}
        </p>
      </div>

      {/* Lab ID badge */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Lab ID</span>
          <span className="px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 text-xs font-mono">#{lab.labId}</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(lab)}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-sm font-medium transition-all border border-slate-700/50"
        >
          <Edit2 className="w-4 h-4" /> Edit
        </button>
        <button
          onClick={() => onDelete(lab)}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-xl text-sm font-medium transition-all border border-red-500/20"
        >
          <Trash2 className="w-4 h-4" /> Delete
        </button>
      </div>
    </div>
  );
}

/* ─── Stats Bar ──────────────────────────────────────────────── */
function StatsBar({ labs }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {[
        { label: 'Total Labs', value: labs.length, icon: FlaskConical, color: 'text-orange-400' },
        { label: 'Departments', value: [...new Set(labs.map(l => l.department?.name).filter(Boolean))].length, icon: Building2, color: 'text-violet-400' },
        { label: 'Locations', value: [...new Set(labs.map(l => l.location).filter(Boolean))].length, icon: MapPin, color: 'text-cyan-400' },
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
  );
}

/* ─── Main Page ──────────────────────────────────────────────── */
export default function ManageLaboratories() {
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null); // null | { mode:'add' } | { mode:'edit', lab }
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchLabs = async () => {
    setLoading(true);
    try {
      const res = await facultyService.getLabs();
      setLabs(res?.data || []);
    } catch (err) {
      toast.error('Failed to load laboratories');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLabs(); }, []);

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return labs.filter(l =>
      (l.name || '').toLowerCase().includes(term) ||
      (l.location || '').toLowerCase().includes(term) ||
      (l.department?.name || '').toLowerCase().includes(term)
    );
  }, [labs, search]);

  const handleAdd = async (form) => {
    try {
      const payload = {
        name: form.name,
        location: form.location,
        ...(form.departmentId ? { department: { departmentId: Number(form.departmentId) } } : {})
      };
      await facultyService.createLab(payload);
      toast.success('Laboratory added successfully!');
      setModal(null);
      fetchLabs();
    } catch (err) {
      const msg = err?.response?.data || 'Failed to add laboratory';
      toast.error(typeof msg === 'string' ? msg : 'Failed to add laboratory');
    }
  };

  const handleEdit = async (form) => {
    try {
      const payload = {
        name: form.name,
        location: form.location,
        ...(form.departmentId ? { department: { departmentId: Number(form.departmentId) } } : {})
      };
      await facultyService.updateLab(modal.lab.labId, payload);
      toast.success('Laboratory updated successfully!');
      setModal(null);
      fetchLabs();
    } catch (err) {
      toast.error('Failed to update laboratory');
    }
  };

  const handleDelete = async () => {
    try {
      await facultyService.deleteLab(deleteTarget.labId);
      toast.success(`"${deleteTarget.name}" deleted`);
      setDeleteTarget(null);
      fetchLabs();
    } catch (err) {
      toast.error('Failed to delete laboratory');
    }
  };

  return (
    <div className="space-y-7 max-w-7xl mx-auto">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Manage Laboratories</h1>
          <p className="text-slate-400 text-sm mt-1">View, create and manage all laboratory facilities</p>
        </div>
        <button
          onClick={() => setModal({ mode: 'add' })}
          className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-all shadow-lg shadow-orange-500/20 text-sm"
        >
          <Plus className="w-4 h-4" /> Add Laboratory
        </button>
      </div>

      {/* ── Stats ── */}
      {!loading && <StatsBar labs={labs} />}

      {/* ── Search ── */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, location or department…"
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ── Content ── */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
            <p className="text-slate-400 text-sm">Loading laboratories…</p>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-slate-900 border border-slate-800 rounded-2xl gap-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center">
            <FlaskConical className="w-8 h-8 text-slate-600" />
          </div>
          <div className="text-center">
            <p className="text-slate-300 font-medium">
              {search ? 'No labs match your search' : 'No laboratories found'}
            </p>
            <p className="text-slate-500 text-sm mt-1">
              {search ? 'Try different keywords' : 'Click "Add Laboratory" to get started'}
            </p>
          </div>
          {!search && (
            <button
              onClick={() => setModal({ mode: 'add' })}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" /> Add First Lab
            </button>
          )}
        </div>
      ) : (
        <>
          <p className="text-slate-500 text-sm">
            Showing <span className="text-slate-300 font-medium">{filtered.length}</span> of {labs.length} laboratories
            {search && <span> for "<span className="text-orange-400">{search}</span>"</span>}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((lab, idx) => (
              <LabCard
                key={lab.labId}
                lab={lab}
                index={idx}
                onEdit={(l) => setModal({ mode: 'edit', lab: l })}
                onDelete={(l) => setDeleteTarget(l)}
              />
            ))}
          </div>
        </>
      )}

      {/* ── Modals ── */}
      {modal?.mode === 'add' && (
        <LabModal mode="add" onClose={() => setModal(null)} onSave={handleAdd} />
      )}
      {modal?.mode === 'edit' && (
        <LabModal mode="edit" lab={modal.lab} onClose={() => setModal(null)} onSave={handleEdit} />
      )}
      {deleteTarget && (
        <DeleteConfirm lab={deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} />
      )}

    </div>
  );
}