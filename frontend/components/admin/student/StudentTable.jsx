import { useEffect, useState } from "react";
import StudentRow from "./StudentRow";
import StudentModal from "./StudentModal";
import DeleteStudentModal from "./DeleteStudentModal";
import StudentForm from "./StudentForm";
import { adminService } from "../../../services/adminService";
import { Loader2, Users } from "lucide-react";
import toast from "react-hot-toast";

const StudentTable = ({ search, students = [], loading = false, onDeleteSuccess, onUpdateSuccess }) => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

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

  const filtered = students.filter((student) => {
    if (!search) return true;
    const kw = search.toLowerCase();
    return (
      student.name?.toLowerCase().includes(kw) ||
      student.regNo?.toLowerCase().includes(kw) ||
      student.registerNo?.toLowerCase().includes(kw) ||
      student.email?.toLowerCase().includes(kw)
    );
  });

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
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
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
              {filtered.map((student) => (
                <StudentRow
                  key={student.id}
                  student={student}
                  onView={handleView}
                  onDelete={handleDeleteClick}
                  onEdit={handleEdit}
                />
              ))}
            </tbody>
          </table>
        </div>
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