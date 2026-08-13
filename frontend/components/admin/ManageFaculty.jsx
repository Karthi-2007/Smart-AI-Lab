import React, { useState, useEffect, useRef } from 'react';
import { Plus, Download, Upload, Search, Filter, X, Save, Loader2 } from 'lucide-react';
import FacultyTable from '../../components/admin/faculty/FacultyTable';
import FacultyStats from '../../components/admin/faculty/FacultyStats';
import { adminService } from '../../services/adminService';
import toast from 'react-hot-toast';

/* ─── Real Faculty Form Modal ─────────────────────────────────── */
const FacultyForm = ({ isOpen, onClose, mode, onSave, initialData }) => {
  const isEdit = mode === 'edit';
  const [form, setForm] = useState({
    name: '',
    email: '',
    facultyId: '',
    department: 'Computer Science & Engineering',
    designation: 'Assistant Professor',
    status: 'ACTIVE',
    lab: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        email: initialData.email || '',
        facultyId: initialData.facultyId || '',
        department: initialData.department || 'Computer Science & Engineering',
        designation: initialData.designation || 'Assistant Professor',
        status: initialData.status || 'ACTIVE',
        lab: initialData.lab || ''
      });
    } else {
      setForm({
        name: '',
        email: '',
        facultyId: `FAC-${Math.floor(100 + Math.random() * 900)}`,
        department: 'Computer Science & Engineering',
        designation: 'Assistant Professor',
        status: 'ACTIVE',
        lab: ''
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      toast.error('Name and email are required');
      return;
    }
    setSaving(true);
    try {
      await onSave(form);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center pb-4 border-b border-slate-800 mb-6">
          <h2 className="text-xl font-bold text-white">{isEdit ? 'Edit Faculty' : 'Add New Faculty'}</h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">Full Name *</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Dr. Rajesh Kumar"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500"
              required
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">Email Address *</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="e.g. rajesh@university.edu"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500"
              required
              disabled={isEdit}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">Faculty ID</label>
              <input
                name="facultyId"
                value={form.facultyId}
                onChange={handleChange}
                placeholder="FAC-101"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">Designation</label>
              <select
                name="designation"
                value={form.designation}
                onChange={handleChange}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500"
              >
                <option value="Assistant Professor">Assistant Professor</option>
                <option value="Associate Professor">Associate Professor</option>
                <option value="Professor">Professor</option>
                <option value="Professor & HOD">Professor & HOD</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">Department</label>
            <select
              name="department"
              value={form.department}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500"
            >
              <option value="Computer Science & Engineering">Computer Science & Engineering</option>
              <option value="Electrical & Electronics Engineering">Electrical & Electronics Engineering</option>
              <option value="Mechanical Engineering">Mechanical Engineering</option>
              <option value="Civil & Structural Engineering">Civil & Structural Engineering</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">Lab Name</label>
              <input
                name="lab"
                value={form.lab}
                onChange={handleChange}
                placeholder="e.g. VLSI & DSP Labs"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 text-sm transition">Cancel</button>
            <button type="submit" disabled={saving} className="px-5 py-2.5 rounded-xl font-medium text-white bg-orange-500 hover:bg-orange-600 text-sm transition flex items-center gap-2 disabled:opacity-60">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isEdit ? 'Update Faculty' : 'Save Faculty'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ManageFaculty = () => {
  const [search, setSearch] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formMode, setFormMode] = useState('add');
  const [editingFaculty, setEditingFaculty] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDept, setSelectedDept] = useState("All Departments");
  const [selectedStatus, setSelectedStatus] = useState("Status");
  const fileInputRef = useRef(null);

  const fetchFaculty = async () => {
    try {
      setLoading(true);
      const res = await adminService.getUsers();
      const allUsers = res?.data || res || [];
      const facultyOnly = (Array.isArray(allUsers) ? allUsers : []).filter(
        (u) => u.role === 'FACULTY' || u.role === 'faculty'
      );
      setFaculty(facultyOnly);
    } catch (err) {
      toast.error('Failed to load faculty');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculty();
  }, []);

  const handleAddFaculty = async (formData) => {
    try {
      if (formMode === 'add') {
        await adminService.createFaculty(formData);
        toast.success('Faculty added successfully!');
      } else {
        await adminService.updateFaculty(editingFaculty.id, formData);
        toast.success('Faculty updated successfully!');
      }
      fetchFaculty(); 
      setOpenForm(false);
    } catch (error) {
      toast.error(formMode === 'add' ? 'Failed to add faculty' : 'Failed to update faculty');
    }
  };

  /* ── Export CSV ────────────────────────────────────────────── */
  const handleExportCSV = () => {
    if (!faculty || faculty.length === 0) {
      toast.error("No faculty records to export");
      return;
    }
    const headers = ["ID", "Faculty ID", "Name", "Email", "Department", "Designation", "Status"];
    const rows = faculty.map((f) => [
      String(f.id || f.facultyId || ''),
      `"${String(f.facultyId || '').replace(/"/g, '""')}"`,
      `"${String(f.name || '').replace(/"/g, '""')}"`,
      `"${String(f.email || '').replace(/"/g, '""')}"`,
      `"${String(f.department || '').replace(/"/g, '""')}"`,
      `"${String(f.designation || '').replace(/"/g, '""')}"`,
      `"${String(f.status || 'Active').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Faculty_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Exported faculty list to CSV!");
  };

  /* ── Import CSV ────────────────────────────────────────────── */
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
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
        toast.loading("Importing faculty records...", { id: "import-faculty" });

        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(",").map(c => c.trim().replace(/^"|"$/g, ''));
          if (cols.length >= 2) {
            const [name, email, facultyId, department, designation] = cols;
            if (name && email) {
              try {
                await adminService.createFaculty({
                  name,
                  email,
                  facultyId: facultyId || `FAC-${100 + i}`,
                  department: department || "Computer Science & Engineering",
                  designation: designation || "Assistant Professor"
                });
                successCount++;
              } catch (err) {
                console.warn(`Failed row ${i}:`, err);
              }
            }
          }
        }

        toast.success(`Successfully imported ${successCount} faculty members!`, { id: "import-faculty" });
        fetchFaculty();
      } catch (err) {
        toast.error("Failed to parse CSV file", { id: "import-faculty" });
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    reader.readAsText(file);
  };

  const handleEdit = (facultyMember) => {
    setEditingFaculty(facultyMember);
    setFormMode('edit');
    setOpenForm(true);
  };

  const openAddForm = () => {
    setEditingFaculty(null);
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
          <h1 className="text-2xl font-bold text-white mb-1">Manage Faculty</h1>
          <p className="text-slate-400">Add, edit and manage faculty members</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleImportClick} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition flex items-center gap-2 text-sm">
            <Upload className="w-4 h-4" /> Import CSV
          </button>
          <button onClick={handleExportCSV} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition flex items-center gap-2 text-sm">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button onClick={openAddForm} className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2 rounded-xl transition flex items-center gap-2 text-sm">
            <Plus className="w-5 h-5" /> Add Faculty
          </button>
        </div>
      </div>

      <FacultyStats faculty={faculty} loading={loading} />

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search faculty..."
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
          <div className="grid md:grid-cols-2 gap-5">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-orange-500"
            >
              <option>All Departments</option>
              <option>CSE</option>
              <option>ECE</option>
              <option>EEE</option>
              <option>Mechanical</option>
              <option>Civil</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-orange-500"
            >
              <option>Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>
      )}

      <FacultyTable 
        search={search} 
        faculty={faculty}
        loading={loading}
        selectedDept={selectedDept}
        selectedStatus={selectedStatus}
        onEdit={handleEdit}
        onDeleteSuccess={fetchFaculty}
      />

      <FacultyForm 
        isOpen={openForm} 
        onClose={() => setOpenForm(false)} 
        mode={formMode} 
        initialData={editingFaculty}
        onSave={handleAddFaculty} 
      />
    </div>
  );
};

export default ManageFaculty;