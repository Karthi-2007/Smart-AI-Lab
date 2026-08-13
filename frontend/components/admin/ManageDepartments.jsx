import React, { useState, useRef } from 'react';
import { Plus, Download, Upload, Search, Filter, X, Save, Loader2 } from 'lucide-react';
import DepartmentTable from '../../components/admin/department/DepartmentTable';
import DepartmentStats from '../../components/admin/department/DepartmentStats';
import { adminService } from '../../services/adminService';
import toast from 'react-hot-toast';

/* ── Interactive Department Form Modal ───────────────────────── */
const DepartmentForm = ({ isOpen, onClose, mode, onSave, initialData }) => {
  const isEdit = mode === 'edit';
  const [name, setName] = useState('');
  const [hod, setHod] = useState('');
  const [status, setStatus] = useState('ACTIVE');
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setHod(initialData.hod || '');
      setStatus(initialData.status || 'ACTIVE');
    } else {
      setName('');
      setHod('');
      setStatus('ACTIVE');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Department Name is required');
      return;
    }
    setSaving(true);
    try {
      await onSave({ name, hod, status });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center pb-4 border-b border-slate-800 mb-6">
          <h2 className="text-xl font-bold text-white">{isEdit ? 'Edit Department' : 'Add New Department'}</h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">Department Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Computer Science & Engineering"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500"
              required
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">Head of Department (HOD)</label>
            <input
              type="text"
              value={hod}
              onChange={(e) => setHod(e.target.value)}
              placeholder="e.g. Dr. A. Ramanathan"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500"
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 text-sm transition">Cancel</button>
            <button type="submit" disabled={saving} className="px-5 py-2.5 rounded-xl font-medium text-white bg-orange-500 hover:bg-orange-600 text-sm transition flex items-center gap-2 disabled:opacity-60">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isEdit ? 'Update Department' : 'Save Department'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ManageDepartments = () => {
  const [search, setSearch] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [formMode, setFormMode] = useState('add');
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [tableKey, setTableKey] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("Status");
  const fileInputRef = useRef(null);

  const onDepartmentsLoaded = (data) => {
    setDepartments(data || []);
    setLoadingStats(false);
  };

  const refreshData = () => {
    setTableKey(prev => prev + 1);
  };

  const handleAddDepartment = async (formData) => {
    try {
      if (formMode === 'add') {
        await adminService.createDepartment(formData);
        toast.success('Department added successfully!');
      } else {
        const id = editingDepartment?.departmentId || editingDepartment?.id;
        await adminService.updateDepartment(id, formData);
        toast.success('Department updated successfully!');
      }
      refreshData();
      setOpenForm(false);
    } catch (error) {
      toast.error(formMode === 'add' ? 'Failed to add department' : 'Failed to update department');
    }
  };

  /* ── Export CSV ────────────────────────────────────────────── */
  const handleExportCSV = () => {
    if (!departments || departments.length === 0) {
      toast.error("No department records to export");
      return;
    }
    const headers = ["ID", "Code", "Name", "HOD", "Status"];
    const rows = departments.map((d) => [
      String(d.departmentId || d.id || ''),
      `"${String(d.code || d.departmentId || '').replace(/"/g, '""')}"`,
      `"${String(d.name || '').replace(/"/g, '""')}"`,
      `"${String(d.hod || '-').replace(/"/g, '""')}"`,
      `"${String(d.status || 'ACTIVE').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Departments_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Exported departments to CSV!");
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
        toast.loading("Importing departments...", { id: "import-dept" });

        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(",").map(c => c.trim().replace(/^"|"$/g, ''));
          if (cols.length >= 1 && cols[0]) {
            const [name, hod, status] = cols;
            try {
              await adminService.createDepartment({
                name,
                hod: hod || "",
                status: status || "ACTIVE"
              });
              successCount++;
            } catch (err) {
              console.warn(`Failed row ${i}:`, err);
            }
          }
        }

        toast.success(`Successfully imported ${successCount} departments!`, { id: "import-dept" });
        refreshData();
      } catch (err) {
        toast.error("Failed to parse CSV file", { id: "import-dept" });
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    reader.readAsText(file);
  };

  const handleEdit = (department) => {
    setEditingDepartment(department);
    setFormMode('edit');
    setOpenForm(true);
  };

  const openAddForm = () => {
    setEditingDepartment(null);
    setFormMode('add');
    setOpenForm(true);
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
          <h1 className="text-2xl font-bold text-white mb-1">Manage Departments</h1>
          <p className="text-slate-400">Add, edit and manage college departments</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleImportClick} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition flex items-center gap-2 text-sm">
            <Upload className="w-4 h-4" /> Import CSV
          </button>
          <button onClick={handleExportCSV} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition flex items-center gap-2 text-sm">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button onClick={openAddForm} className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2 rounded-xl transition flex items-center gap-2 text-sm">
            <Plus className="w-5 h-5" /> Add Department
          </button>
        </div>
      </div>

      <DepartmentStats departments={departments} loading={loadingStats} />

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search departments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-white placeholder:text-slate-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-3 border rounded-xl text-slate-300 transition flex items-center gap-2 whitespace-nowrap ${showFilters ? 'bg-orange-500/10 border-orange-500 text-orange-500' : 'bg-slate-900 border-slate-800 hover:bg-slate-800'}`}
        >
          <Filter className="w-5 h-5" /> Filters
        </button>
      </div>

      {showFilters && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-6 animate-in slide-in-from-top-2 duration-200">
          <div className="grid md:grid-cols-1 gap-5">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-orange-500"
            >
              <option>Status</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </div>
        </div>
      )}

      <DepartmentTable 
        key={tableKey}
        search={search} 
        selectedStatus={selectedStatus}
        onDepartmentsLoaded={onDepartmentsLoaded} 
        onEdit={handleEdit}
      />

      <DepartmentForm 
        isOpen={openForm} 
        onClose={() => setOpenForm(false)} 
        mode={formMode} 
        initialData={editingDepartment}
        onSave={handleAddDepartment} 
      />
    </div>
  );
};

export default ManageDepartments;