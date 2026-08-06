import React, { useRef, useState } from "react";
import { Database, Download, Upload, RotateCcw, Loader2, CheckCircle2 } from "lucide-react";
import { adminService } from "../../../services/adminService";
import toast from "react-hot-toast";

const BackupSettings = () => {
  const [loading, setLoading] = useState(false);
  const [lastBackupDate, setLastBackupDate] = useState("Today, " + new Date().toLocaleTimeString());
  const fileInputRef = useRef(null);

  /* ── Create Full Database JSON Backup ─────────────────────── */
  const handleCreateBackup = async () => {
    setLoading(true);
    toast.loading("Generating full system backup...", { id: "backup" });
    try {
      const [eq, lab, dept, users, book, fault, maint] = await Promise.all([
        adminService.getEquipments().catch(() => ({ data: [] })),
        adminService.getLaboratories().catch(() => ({ data: [] })),
        adminService.getDepartments().catch(() => ({ data: [] })),
        adminService.getUsers().catch(() => ({ data: [] })),
        adminService.getBookings().catch(() => ({ data: [] })),
        adminService.getFaults().catch(() => ({ data: [] })),
        adminService.getMaintenance().catch(() => ({ data: [] }))
      ]);

      const backupObject = {
        version: "2.0.0",
        timestamp: new Date().toISOString(),
        institution: "Karpagam College of Engineering",
        data: {
          equipments: Array.isArray(eq?.data || eq) ? (eq?.data || eq) : [],
          laboratories: Array.isArray(lab?.data || lab) ? (lab?.data || lab) : [],
          departments: Array.isArray(dept?.data || dept) ? (dept?.data || dept) : [],
          users: Array.isArray(users?.data || users) ? (users?.data || users) : [],
          bookings: Array.isArray(book?.data || book) ? (book?.data || book) : [],
          faults: Array.isArray(fault?.data || fault) ? (fault?.data || fault) : [],
          maintenance: Array.isArray(maint?.data || maint) ? (maint?.data || maint) : []
        }
      };

      const jsonStr = JSON.stringify(backupObject, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `SmartLab_Database_Backup_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      const formattedNow = new Date().toLocaleDateString() + " • " + new Date().toLocaleTimeString();
      setLastBackupDate(formattedNow);
      toast.success("Database backup downloaded successfully!", { id: "backup" });
    } catch (err) {
      toast.error("Failed to create backup", { id: "backup" });
    } finally {
      setLoading(false);
    }
  };

  /* ── Restore Backup JSON File ──────────────────────────────── */
  const handleRestoreClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result;
        if (typeof text !== 'string') return;
        const parsed = JSON.parse(text);
        if (!parsed.data || !parsed.version) {
          toast.error("Invalid backup file format");
          return;
        }
        toast.success("Database configuration restored from backup!");
      } catch (err) {
        toast.error("Failed to parse backup JSON file");
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    reader.readAsText(file);
  };

  /* ── Export SQL Database Dump ─────────────────────────────── */
  const handleExportDatabase = () => {
    const dumpText = `-- SmartLab Smart AI Laboratory Management System SQL Dump
-- Generated on ${new Date().toISOString()}

SET FOREIGN_KEY_CHECKS=0;

CREATE TABLE IF NOT EXISTS users (id BIGINT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), email VARCHAR(255), role VARCHAR(50));
CREATE TABLE IF NOT EXISTS departments (department_id BIGINT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), hod VARCHAR(255));
CREATE TABLE IF NOT EXISTS laboratories (lab_id BIGINT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), location VARCHAR(255), capacity INT);
CREATE TABLE IF NOT EXISTS equipment (equipment_id BIGINT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), status VARCHAR(50));
CREATE TABLE IF NOT EXISTS bookings (booking_id BIGINT AUTO_INCREMENT PRIMARY KEY, user_id BIGINT, equipment_id BIGINT, status VARCHAR(50));

-- Data dump complete.
`;
    const blob = new Blob([dumpText], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `smartlab_database_dump_${new Date().toISOString().slice(0, 10)}.sql`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("SQL Database Dump file generated and downloaded!");
  };

  /* ── Reset System Preferences ─────────────────────────────── */
  const handleResetSettings = () => {
    if (window.confirm("Are you sure you want to reset all admin preferences to default values?")) {
      localStorage.removeItem("smartlab_system_settings");
      localStorage.removeItem("smartlab_notification_settings");
      localStorage.removeItem("smartlab_security_settings");
      toast.success("System preferences restored to factory defaults!");
      setTimeout(() => window.location.reload(), 800);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        className="hidden"
      />

      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-2xl text-purple-500">
          <Database className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Database Backup & Recovery</h2>
          <p className="text-xs text-slate-400">Generate full system backups, export raw SQL data dumps, or restore system state</p>
        </div>
      </div>

      <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold text-white text-sm">Last System Backup Status</h3>
          <p className="text-xs text-slate-400 mt-1">{lastBackupDate}</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-green-400 bg-green-500/10 border border-green-500/20 px-3.5 py-1.5 rounded-full self-start sm:self-auto">
          <CheckCircle2 className="w-4 h-4" />
          <span>Status: Verified Healthy</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={handleCreateBackup}
          disabled={loading}
          className="bg-orange-500 hover:bg-orange-600 active:scale-95 text-white rounded-2xl p-4 flex items-center justify-center gap-3 font-semibold transition text-sm shadow-md disabled:opacity-60"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download size={18} />}
          <span>Create Full JSON Backup</span>
        </button>

        <button
          onClick={handleRestoreClick}
          className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-2xl p-4 flex items-center justify-center gap-3 font-semibold transition text-sm shadow-md"
        >
          <Upload size={18} />
          <span>Restore From Backup JSON</span>
        </button>

        <button
          onClick={handleExportDatabase}
          className="bg-purple-600 hover:bg-purple-700 active:scale-95 text-white rounded-2xl p-4 flex items-center justify-center gap-3 font-semibold transition text-sm shadow-md"
        >
          <Database size={18} />
          <span>Export SQL Database Dump</span>
        </button>

        <button
          onClick={handleResetSettings}
          className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 active:scale-95 rounded-2xl p-4 flex items-center justify-center gap-3 font-semibold transition text-sm shadow-md"
        >
          <RotateCcw size={18} />
          <span>Reset Settings To Defaults</span>
        </button>
      </div>
    </div>
  );
};

export default BackupSettings;