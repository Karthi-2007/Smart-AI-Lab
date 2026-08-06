import React, { useState, useEffect, useRef } from 'react';
import { FlaskConical, Search, Plus, Download, Upload, X, Save, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminService } from '../../services/adminService';
import LaboratoryStats from './laboratory/LaboratoryStats';
import LaboratoryTable from './laboratory/LaboratoryTable';

/* ── Interactive Laboratory Form Modal ────────────────────────── */
const LaboratoryForm = ({ isOpen, onClose, mode, onSave, initialData }) => {
  const isEdit = mode === 'edit';
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState('30');
  const [status, setStatus] = useState('Active');
  const [deptId, setDeptId] = useState('');
  const [departments, setDepartments] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminService.getDepartments().then(res => {
      const list = res?.data || res || [];
      setDepartments(Array.isArray(list) ? list : []);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setLocation(initialData.location || '');
      setCapacity(String(initialData.capacity || '30'));
      setStatus(initialData.status || 'Active');
      setDeptId(initialData.department?.departmentId || initialData.departmentId || '');
    } else {
      setName('');
      setLocation('');
      setCapacity('30');
      setStatus('Active');
      setDeptId('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Laboratory Name is required');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name,
        location: location || 'Main Campus',
        capacity: parseInt(capacity) || 30,
        status,
        department: deptId ? { departmentId: parseInt(deptId) } : null
      };
      await onSave(payload);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center pb-4 border-b border-slate-800 mb-6">
          <h2 className="text-xl font-bold text-white">{isEdit ? 'Edit Laboratory' : 'Add New Laboratory'}</h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">Lab Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Advanced AI Research Lab"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Block C - Floor 2"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">Capacity</label>
              <input
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                placeholder="30"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">Department</label>
            <select
              value={deptId}
              onChange={(e) => setDeptId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500"
            >
              <option value="">Select Department (Optional)</option>
              {departments.map((d) => (
                <option key={d.departmentId || d.id} value={d.departmentId || d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500"
            >
              <option value="Active">Active</option>
              <option value="Maintenance">Under Maintenance</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 text-sm transition">Cancel</button>
            <button type="submit" disabled={saving} className="px-5 py-2.5 rounded-xl font-medium text-white bg-orange-500 hover:bg-orange-600 text-sm transition flex items-center gap-2 disabled:opacity-60">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isEdit ? 'Update Lab' : 'Save Lab'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ManageLaboratories = () => {
  const [labs, setLabs] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [search, setSearch] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('add');
  const [editingLab, setEditingLab] = useState(null);
  const [detailLab, setDetailLab] = useState(null);
  const [tableKey, setTableKey] = useState(1);
  const fileInputRef = useRef(null);

  const handleLabsLoaded = (loadedLabs) => {
    setLabs(loadedLabs || []);
    setLoadingStats(false);
  };

  const refreshData = () => {
    setTableKey(prev => prev + 1);
  };

  const handleSaveLab = async (labData) => {
    try {
      if (formMode === 'add') {
        await adminService.createLaboratory(labData);
        toast.success('Laboratory added successfully!');
      } else {
        const id = editingLab?.labId || editingLab?.id;
        await adminService.updateLaboratory(id, labData);
        toast.success('Laboratory updated successfully!');
      }
      refreshData();
      setIsFormOpen(false);
    } catch (error) {
      toast.error(formMode === 'add' ? 'Failed to add laboratory' : 'Failed to update laboratory');
    }
  };

  const handleEdit = (lab) => {
    setEditingLab(lab);
    setFormMode('edit');
    setIsFormOpen(true);
  };

  const handleDetail = (lab) => {
    setDetailLab(lab);
  };

  /* ── Export CSV ────────────────────────────────────────────── */
  const handleExportCSV = () => {
    if (!labs || labs.length === 0) {
      toast.error("No laboratory records to export");
      return;
    }
    const headers = ["ID", "Name", "Department", "Location", "Capacity", "Status"];
    const rows = labs.map((l) => [
      String(l.labId || l.id || ''),
      `"${String(l.name || '').replace(/"/g, '""')}"`,
      `"${String(typeof l.department === 'object' ? l.department?.name : (l.department || 'N/A')).replace(/"/g, '""')}"`,
      `"${String(l.location || '').replace(/"/g, '""')}"`,
      `"${String(l.capacity || 30).replace(/"/g, '""')}"`,
      `"${String(l.status || 'Active').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Laboratories_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Exported laboratories to CSV!");
  };

  /* ── Import CSV ────────────────────────────────────────────── */
  const handleImportClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result;
        if (typeof text !== 'string') return;
        const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
        if (lines.length <= 1) {
          toast.error("CSV file is empty or missing data rows");
          return;
        }

        let successCount = 0;
        toast.loading("Importing laboratories...", { id: "import-labs" });

        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(",").map(c => c.trim().replace(/^"|"$/g, ''));
          if (cols.length >= 1 && cols[0]) {
            const [name, location, capacity, status] = cols;
            try {
              await adminService.createLaboratory({
                name,
                location: location || "Main Building",
                capacity: capacity ? parseInt(capacity) : 30,
                status: status || "Active"
              });
              successCount++;
            } catch (err) {
              console.warn(`Failed row ${i}:`, err);
            }
          }
        }

        toast.success(`Successfully imported ${successCount} laboratories!`, { id: "import-labs" });
        refreshData();
      } catch (err) {
        toast.error("Failed to parse CSV file", { id: "import-labs" });
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    reader.readAsText(file);
  };

  const openAddForm = () => {
    setEditingLab(null);
    setFormMode('add');
    setIsFormOpen(true);
  };

  return (
    <div className="p-6">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".csv, .txt, .xlsx"
        className="hidden"
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Manage Laboratories</h1>
          <p className="text-slate-400 mt-1">Add, edit and manage college laboratories</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleImportClick} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition flex items-center gap-2 text-sm">
            <Upload className="w-4 h-4" /> Import CSV
          </button>
          <button onClick={handleExportCSV} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition flex items-center gap-2 text-sm">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button 
            onClick={openAddForm}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5 rounded-xl transition flex items-center gap-2 text-sm"
          >
            <FlaskConical className="w-5 h-5" />
            Add Laboratory
          </button>
        </div>
      </div>

      <LaboratoryStats labs={labs} loading={loadingStats} />

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search laboratories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-11 pr-4 py-3 text-white outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition text-sm"
            />
          </div>
        </div>

        <LaboratoryTable 
          key={tableKey} 
          search={search} 
          onLabsLoaded={handleLabsLoaded} 
          onDetail={handleDetail}
          onEdit={handleEdit}
        />
      </div>

      {isFormOpen && (
        <LaboratoryForm 
          isOpen={isFormOpen} 
          onClose={() => setIsFormOpen(false)} 
          mode={formMode}
          initialData={editingLab}
          onSave={handleSaveLab} 
        />
      )}

      {/* Laboratory Details Modal */}
      {detailLab && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800 mb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-orange-500" />
                Laboratory Details
              </h3>
              <button onClick={() => setDetailLab(null)} className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Lab ID:</span>
                <span className="font-mono text-white">#{detailLab.labId || detailLab.id}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Lab Name:</span>
                <span className="font-semibold text-white">{detailLab.name}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Department:</span>
                <span className="text-white">{typeof detailLab.department === 'object' ? detailLab.department?.name : (detailLab.department || 'N/A')}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Location:</span>
                <span className="text-white">{detailLab.location || 'Main Building'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Capacity:</span>
                <span className="text-white">{detailLab.capacity || 30} students</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Status:</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${detailLab.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'}`}>
                  {detailLab.status || 'Active'}
                </span>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button onClick={() => setDetailLab(null)} className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-medium transition">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageLaboratories;