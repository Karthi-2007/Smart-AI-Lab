import { useEffect, useState, useMemo } from "react";
import StudentRow from "./StudentRow";
import StudentModal from "./StudentModal";
import DeleteStudentModal from "./DeleteStudentModal";
import StudentForm from "./StudentForm";
import { adminService } from "../../../services/adminService";
import { Loader2, Users } from "lucide-react";
import toast from "react-hot-toast";
import Pagination from "../../common/Pagination";

const StudentTable = ({
  search,
  students = [],
  loading = false,
  selectedDept = "All Departments",
  selectedYear = "All Years",
  selectedStatus = "Status",
  onDeleteSuccess,
  onUpdateSuccess
}) => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedDept, selectedYear, selectedStatus]);

  const handleView = (student) => { setSelectedStudent(student); setOpenModal(true); };
  const handleDeleteClick = (student) => { setSelectedStudent(student); setDeleteModal(true); };
  const handleEdit = (student) => { setSelectedStudent(student); setEditModal(true); };

  const handleDelete = async (id) => {
    try {
      await adminService.deleteStudent(id);
      toast.success("Student deleted.");
      if (onDeleteSuccess) onDeleteSuccess();
    } catch {
      toast.error("Could not delete student.");
    } finally {
      setDeleteModal(false);
    }
  };

  const handleActivate = async (student) => {
    try {
      const studentId = student.id || student.studentId || student.userId;
      await adminService.activateStudent(studentId);
      toast.success("Student account activated successfully.");
      if (onUpdateSuccess) onUpdateSuccess();
      if (onDeleteSuccess) onDeleteSuccess();
    } catch (err) {
      toast.error("Failed to activate student account.");
    }
  };

  const handleUpdate = async (updatedStudent) => {
    try {
      const studentId = selectedStudent.id || selectedStudent.studentId || selectedStudent.userId;
      await adminService.updateStudent(studentId, updatedStudent);
      toast.success("Student updated successfully.");
      setEditModal(false);
      if (onUpdateSuccess) onUpdateSuccess();
    } catch (err) {
      toast.error("Failed to update student.");
    }
  };

  const filtered = useMemo(() => {
    return students.filter((student) => {
      // 1. Search Query filter
      if (search) {
        const kw = search.toLowerCase();
        const matchesSearch = (
          student.name?.toLowerCase().includes(kw) ||
          student.regNo?.toLowerCase().includes(kw) ||
          student.registerNo?.toLowerCase().includes(kw) ||
          student.email?.toLowerCase().includes(kw)
        );
        if (!matchesSearch) return false;
      }

      // 2. Department filter
      if (selectedDept && selectedDept !== "All Departments") {
        const dept = student.department?.toLowerCase() || "";
        const target = selectedDept.toLowerCase();
        if (target === "cse" && !dept.includes("computer")) return false;
        if (target === "ece" && !dept.includes("electronics & communication") && !dept.includes("ece")) return false;
        if (target === "eee" && !dept.includes("electrical") && !dept.includes("eee")) return false;
        if (target === "mechanical" && !dept.includes("mechanical")) return false;
        if (target === "civil" && !dept.includes("civil")) return false;
      }

      // 3. Year filter
      if (selectedYear && selectedYear !== "All Years") {
        const yr = parseInt(student.year);
        if (selectedYear === "I Year" && yr !== 1) return false;
        if (selectedYear === "II Year" && yr !== 2) return false;
        if (selectedYear === "III Year" && yr !== 3) return false;
        if (selectedYear === "IV Year" && yr !== 4) return false;
      }

      // 4. Status filter
      if (selectedStatus && selectedStatus !== "Status") {
        const status = student.status?.toLowerCase() || "";
        if (selectedStatus === "Activated" && status !== "active" && status !== "activated") return false;
        if (selectedStatus === "Pending" && status !== "pending") return false;
      }

      return true;
    });
  }, [students, search, selectedDept, selectedYear, selectedStatus]);

  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 size={36} className="animate-spin text-orange-500" />
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-2xl">
        <Users size={40} className="mx-auto mb-3 text-slate-600" />
        <p className="text-slate-400">{search ? "No students match your search." : "No students found."}</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto table-wrapper">
          <table className="w-full min-w-[700px]">
            <thead className="bg-slate-800">
              <tr>
                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-300">Reg No</th>
                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-300">Name</th>
                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-300">Department</th>
                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-300">Year</th>
                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-300">Email</th>
                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-300">Status</th>
                <th className="px-5 py-4 text-center text-sm font-semibold text-slate-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedStudents.map((student) => (
                <StudentRow
                  key={student.id}
                  student={student}
                  onView={handleView}
                  onDelete={handleDeleteClick}
                  onEdit={handleEdit}
                  onActivate={handleActivate}
                />
              ))}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={currentPage}
          totalItems={filtered.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>

      <StudentModal isOpen={openModal} onClose={() => setOpenModal(false)} student={selectedStudent} />
      <DeleteStudentModal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        student={selectedStudent}
        onDelete={handleDelete}
      />
      <StudentForm
        isOpen={editModal}
        onClose={() => setEditModal(false)}
        mode="edit"
        student={selectedStudent}
        onSave={handleUpdate}
      />
    </>
  );
};

export default StudentTable;