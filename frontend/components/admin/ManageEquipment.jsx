import React, { useState, useEffect, useRef } from 'react';
import { Package, Search, Upload, Download, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminService } from '../../services/adminService';
import EquipmentStats from './equipment/EquipmentStats';
import EquipmentTable from './equipment/EquipmentTable';
import EquipmentForm from './equipment/EquipmentForm';

const ManageEquipment = () => {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const fileInputRef = useRef(null);

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      const res = await adminService.getEquipments();
      const data = res?.data || res || [];
      setEquipment(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Failed to load equipment data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, []);

  const [formMode, setFormMode] = useState('add');
  const [editingEquipment, setEditingEquipment] = useState(null);
  const [detailEquipment, setDetailEquipment] = useState(null);

  const handleSaveEquipment = async (equipmentData) => {
    try {
      if (formMode === 'add') {
        await adminService.createEquipment(equipmentData);
        toast.success('Equipment added successfully!');
      } else {
        const id = editingEquipment?.equipmentId || editingEquipment?.id;
        await adminService.updateEquipment(id, equipmentData);
        toast.success('Equipment updated successfully!');
      }
      setIsFormOpen(false);
      fetchEquipment();
    } catch (error) {
      toast.error(formMode === 'add' ? 'Failed to add equipment' : 'Failed to update equipment');
      console.error(error);
    }
  };

  const handleEdit = (item) => {
    setEditingEquipment(item);
    setFormMode('edit');
    setIsFormOpen(true);
  };

  const handleDetail = (item) => {
    setDetailEquipment(item);
  };

  const openAddForm = () => {
    setEditingEquipment(null);
    setFormMode('add');
    setIsFormOpen(true);
  };

  /* ── Export CSV ────────────────────────────────────────────── */
  const handleExportCSV = () => {
    if (!equipment || equipment.length === 0) {
      toast.error("No equipment records to export");
      return;
    }
    const headers = ["ID", "Name", "Category", "Lab", "Serial No", "Quantity", "Status"];
    const rows = equipment.map((eq) => [
      String(eq.equipmentId || eq.id || ''),
      `"${String(eq.name || '').replace(/"/g, '""')}"`,
      `"${String(eq.category || 'General').replace(/"/g, '""')}"`,
      `"${String(typeof eq.laboratory === 'object' ? eq.laboratory?.name : (eq.laboratory || eq.lab || 'N/A')).replace(/"/g, '""')}"`,
      `"${String(eq.serialNo || '-').replace(/"/g, '""')}"`,
      `"${String(eq.quantity || 1).replace(/"/g, '""')}"`,
      `"${String(eq.status || 'Available').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Equipment_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Exported equipment list to CSV!");
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
        toast.loading("Importing equipment...", { id: "import-eq" });

        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(",").map(c => c.trim().replace(/^"|"$/g, ''));
          if (cols.length >= 1 && cols[0]) {
            const [name, category, status, serialNo] = cols;
            try {
              await adminService.createEquipment({
                name,
                category: category || "General",
                status: status || "Available",
                serialNo: serialNo || `SN-${Date.now()}-${i}`
              });
              successCount++;
            } catch (err) {
              console.warn(`Failed row ${i}:`, err);
            }
          }
        }

        toast.success(`Successfully imported ${successCount} equipment items!`, { id: "import-eq" });
        fetchEquipment();
      } catch (err) {
        toast.error("Failed to parse CSV file", { id: "import-eq" });
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    reader.readAsText(file);
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
          <h1 className="text-2xl font-bold text-white">Manage Equipment</h1>
          <p className="text-slate-400 mt-1">Add, edit and manage lab equipment</p>
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
            <Package className="w-5 h-5" />
            Add Equipment
          </button>
        </div>
      </div>

      <EquipmentStats equipment={equipment} loading={loading} />

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search equipment..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-11 pr-4 py-3 text-white outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition text-sm"
            />
          </div>
        </div>

        <EquipmentTable 
          search={search} 
          equipment={equipment} 
          loading={loading} 
          onDeleteSuccess={fetchEquipment}
          onDetail={handleDetail}
          onEdit={handleEdit}
        />
      </div>

      {isFormOpen && (
        <EquipmentForm 
          isOpen={isFormOpen} 
          onClose={() => setIsFormOpen(false)} 
          mode={formMode} 
          equipment={editingEquipment}
          onSave={handleSaveEquipment} 
        />
      )}

      {/* Equipment Details Modal */}
      {detailEquipment && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800 mb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-orange-500" />
                Equipment Details
              </h3>
              <button onClick={() => setDetailEquipment(null)} className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">ID / Code:</span>
                <span className="font-mono text-white">#{detailEquipment.equipmentId || detailEquipment.id}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Name:</span>
                <span className="font-semibold text-white">{detailEquipment.name}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Category:</span>
                <span className="text-white">{detailEquipment.category || 'General'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Laboratory:</span>
                <span className="text-white">{typeof detailEquipment.laboratory === 'object' ? detailEquipment.laboratory?.name : (detailEquipment.laboratory || detailEquipment.lab || 'N/A')}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Serial No:</span>
                <span className="font-mono text-white">{detailEquipment.serialNo || '-'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Quantity:</span>
                <span className="text-white">{detailEquipment.quantity || 1} units</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Status:</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${detailEquipment.status === 'Available' ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'}`}>
                  {detailEquipment.status || 'Available'}
                </span>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button onClick={() => setDetailEquipment(null)} className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-medium transition">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageEquipment;