import React, { useState, useEffect, useRef } from "react";
import { UserPlus, Upload, Download, FileText } from "lucide-react";
import StudentStats from "../../components/admin/student/StudentStats";
import StudentSearch from "../../components/admin/student/StudentSearch";
import StudentFilters from "../../components/admin/student/StudentFilters";
import StudentTable from "../../components/admin/student/StudentTable";
import StudentPagination from "../../components/admin/student/StudentPagination";
import StudentForm from "../../components/admin/student/StudentForm";
import { adminService } from "../../services/adminService";
import toast from "react-hot-toast";

const ManageStudents = () => {
  const [openForm, setOpenForm] = useState(false);
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDept, setSelectedDept] = useState("All Departments");
  const [selectedYear, setSelectedYear] = useState("All Years");
  const [selectedStatus, setSelectedStatus] = useState("Status");
  const fileInputRef = useRef(null);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      let res;
      if (search && search.trim()) {
        res = await adminService.searchStudents(search.trim());
      } else if (selectedStatus === "Activated") {
        res = await adminService.getStudentsActive();
      } else if (selectedStatus === "Pending") {
        res = await adminService.getStudentsPending();
      } else if (selectedDept && selectedDept !== "All Departments") {
        const codeMap = { "CSE": "cse", "ECE": "ece", "EEE": "eee", "Mechanical": "mechanical", "Civil": "civil" };
        res = await adminService.getStudentsByDepartment(codeMap[selectedDept] || selectedDept.toLowerCase());
      } else if (selectedYear && selectedYear !== "All Years") {
        const yrMap = { "I Year": 1, "II Year": 2, "III Year": 3, "IV Year": 4 };
        res = await adminService.getStudentsByYear(yrMap[selectedYear] || 1);
      } else {
        res = await adminService.getStudentsAll();
      }

      const body = res?.data || res;
      let rawList = [];
      if (body) {
        if (body.success && body.data) {
          rawList = body.data.content || body.data;
        } else {
          rawList = body.content || body;
        }
      }

      if (!Array.isArray(rawList) || rawList.length === 0) {
        // Fallback to combined user fetch if dedicated endpoint has no profile entries yet
        const usersRes = await adminService.getUsers();
        const allUsers = usersRes?.data || usersRes || [];
        rawList = (Array.isArray(allUsers) ? allUsers : []).filter(
          (u) => u.role === 'STUDENT' || u.role === 'student'
        );
      }
      setStudents(Array.isArray(rawList) ? rawList : []);
    } catch (err) {
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [selectedDept, selectedYear, selectedStatus, search]);

  const handleAddStudent = async (formData) => {
    try {
      await adminService.createStudent(formData);
      toast.success("Student added successfully!");
      setOpenForm(false);
      fetchStudents();
    } catch (err) {
      const msg = err?.response?.data || "Could not add student.";
      toast.error(typeof msg === "string" ? msg : "Failed to create student.");
    }
  };

  /* ── Export CSV/Excel ────────────────────────────────────────── */
  const handleExportCSV = () => {
    if (!students || students.length === 0) {
      toast.error("No student records to export");
      return;
    }
    const headers = ["ID", "Register No", "Name", "Email", "Department", "Year", "Status"];
    const rows = students.map((s) => [
      String(s.id || s.studentId || ''),
      `"${String(s.regNo || '').replace(/"/g, '""')}"`,
      `"${String(s.name || '').replace(/"/g, '""')}"`,
      `"${String(s.email || '').replace(/"/g, '""')}"`,
      `"${String(s.department || '').replace(/"/g, '""')}"`,
      `"${String(s.year || '').replace(/"/g, '""')}"`,
      `"${String(s.status || 'Active').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Students_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Exported students to CSV!");
  };

  /* ── Export PDF / Print ──────────────────────────────────────── */
  const handleExportPDF = () => {
    window.print();
  };

  /* ── Import CSV / Excel ──────────────────────────────────────── */
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
        toast.loading("Importing students...", { id: "import-toast" });

        // Skip header line
        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(",").map(c => c.trim().replace(/^"|"$/g, ''));
          if (cols.length >= 2) {
            const [name, email, regNo, department, year] = cols;
            if (name && email) {
              try {
                await adminService.createStudent({
                  name,
                  email,
                  regNo: regNo || `REG-${Date.now()}-${i}`,
                  department: department || "Computer Science & Engineering",
                  year: year ? parseInt(year) : 3
                });
                successCount++;
              } catch (err) {
                console.warn(`Failed row ${i}:`, err);
              }
            }
          }
        }

        toast.success(`Successfully imported ${successCount} students!`, { id: "import-toast" });
        fetchStudents();
      } catch (err) {
        toast.error("Failed to parse CSV file", { id: "import-toast" });
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Hidden File Input for Import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".csv, .txt, .xlsx"
        className="hidden"
      />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold text-white">Manage Students</h1>
          <p className="text-slate-400 mt-2">Add, edit, activate and manage student accounts.</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setOpenForm(true)}
            className="bg-orange-500 hover:bg-orange-600 px-5 py-3 rounded-xl font-semibold flex items-center gap-2 transition text-sm text-white"
          >
            <UserPlus size={18} />
            Add Student
          </button>

          <button
            onClick={handleImportClick}
            className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 px-4 py-3 rounded-xl flex items-center gap-2 transition text-sm"
          >
            <Upload size={18} />
            Import CSV
          </button>

          <button
            onClick={handleExportCSV}
            className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 px-4 py-3 rounded-xl flex items-center gap-2 transition text-sm"
          >
            <Download size={18} />
            Export CSV
          </button>

          <button
            onClick={handleExportPDF}
            className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 px-4 py-3 rounded-xl flex items-center gap-2 transition text-sm"
          >
            <FileText size={18} />
            Export PDF
          </button>
        </div>
      </div>

      {/* Statistics */}
      <StudentStats students={students} loading={loading} />

      {/* Search */}
      <StudentSearch search={search} setSearch={setSearch} />

      {/* Filters */}
      <StudentFilters
        selectedDept={selectedDept}
        setSelectedDept={setSelectedDept}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
      />

      <StudentTable
        search={search}
        students={students}
        loading={loading}
        selectedDept={selectedDept}
        selectedYear={selectedYear}
        selectedStatus={selectedStatus}
        onDeleteSuccess={fetchStudents}
        onUpdateSuccess={fetchStudents}
      />

      {/* Pagination */}
      <StudentPagination />

      {/* Add Student Form */}
      <StudentForm
        isOpen={openForm}
        onClose={() => setOpenForm(false)}
        mode="add"
        onSave={handleAddStudent}
      />
    </div>
  );
};

export default ManageStudents;