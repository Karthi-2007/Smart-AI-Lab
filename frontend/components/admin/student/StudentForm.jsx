import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { adminService } from "../../../services/adminService";

const DEFAULT_DEPARTMENTS = [
  { id: '1', name: "Computer Science & Engineering", code: "CSE" },
  { id: '2', name: "Electrical & Electronics Engineering", code: "EEE" },
  { id: '3', name: "Electronics & Communication Engineering", code: "ECE" },
  { id: '4', name: "Mechanical Engineering", code: "MECH" },
  { id: '5', name: "Civil Engineering", code: "CIVIL" },
  { id: '6', name: "Artificial Intelligence & Data Science", code: "AI&DS" },
  { id: '7', name: "Information Technology", code: "IT" },
];

const StudentForm = ({
  isOpen,
  onClose,
  mode = "add",
  student,
  onSave,
}) => {
  const [departments, setDepartments] = useState(DEFAULT_DEPARTMENTS);
  const [formData, setFormData] = useState({
    name: "",
    registerNo: "",
    department: "",
    year: "",
    section: "",
    dob: "",
    email: "",
  });

  useEffect(() => {
    if (isOpen) {
      adminService.getDepartments().then(res => {
        const body = res?.data || res || [];
        const list = Array.isArray(body) ? body : (body.content || body.data || []);
        if (Array.isArray(list) && list.length > 0) {
          setDepartments(list);
        } else {
          setDepartments(DEFAULT_DEPARTMENTS);
        }
      }).catch(() => {
        setDepartments(DEFAULT_DEPARTMENTS);
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (mode === "edit" && student) {
      setFormData({
        id: student.id || student.studentId || student.userId,
        name: student.name || "",
        registerNo: student.registerNo || student.regNo || "",
        department: student.department || student.dept || "",
        year: student.year || "",
        section: student.section || "A",
        dob: student.dob || "",
        email: student.email || "",
        status: student.status || "Active",
      });
    } else {
      setFormData({
        name: "",
        registerNo: "",
        department: "",
        year: "1",
        section: "A",
        dob: "",
        email: "",
        status: "Active"
      });
    }
  }, [mode, student]);
const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });
};

const handleSubmit = (e) => {
    e.preventDefault();

    if (onSave) {
        const payload = {
            ...formData,
            regNo: formData.regNo || formData.registerNo || "REG-" + Date.now().toString().slice(-6),
            password: formData.password || "Password123!",
            department: formData.department || "Computer Science & Technology / ECE",
            role: "STUDENT"
        };
        onSave(payload);
    }

    onClose();
};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-5">

      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl">

        {/* Header */}

        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">

          <h2 className="text-2xl font-bold">

            {mode === "add" ? "Add Student" : "Edit Student"}

          </h2>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-800"
          >

            <X />

          </button>

        </div>

        {/* Body */}

        <form
  onSubmit={handleSubmit}
  className="p-6 space-y-6"
>

          <div className="grid md:grid-cols-2 gap-5">

            <div>

              <label className="block mb-2">

                Student Name

              </label>

              <input
             type="text"
             name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter student name"
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 focus:border-orange-500 outline-none"
            />

            </div>

            <div>

              <label className="block mb-2">

                Register Number

              </label>

              <input
  type="text"
  name="registerNo"
  value={formData.registerNo}
  onChange={handleChange}
  placeholder="22BCS001"
  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3"
/>

            </div>

            <div>

              <label className="block mb-2">

                Department

              </label>

              <select
                name="department"
                value={formData.department || ""}
                onChange={handleChange}
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 outline-none focus:border-orange-500 transition text-white"
              >
                <option value="">Select Department</option>
                {departments.map((dept, idx) => {
                  const dName = typeof dept === 'string' ? dept : (dept.name || dept.departmentName);
                  const dCode = typeof dept === 'string' ? '' : (dept.code || '');
                  return (
                    <option key={dept.departmentId || dept.id || idx} value={dName}>
                      {dName} {dCode ? `(${dCode})` : ""}
                    </option>
                  );
                })}
                {formData.department && !departments.some(d => (typeof d === 'string' ? d : d.name) === formData.department) && (
                  <option value={formData.department}>{formData.department}</option>
                )}
              </select>

            </div>

            <div>

              <label className="block mb-2">

                Year

              </label>

              <select
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3"
              >
                <option value="1">I</option>
                <option value="2">II</option>
                <option value="3">III</option>
                <option value="4">IV</option>
              </select>

            </div>

            <div>

              <label className="block mb-2">

                Section

              </label>

              <input
  type="text"
  name="section"
  value={formData.section}
  onChange={handleChange}
  placeholder="A"
  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3"
/>

            </div>

            <div>

              <label className="block mb-2">

                Date of Birth

              </label>

              <input
  type="date"
  name="dob"
  value={formData.dob}
  onChange={handleChange}
  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3"
/>

            </div>

            <div className="md:col-span-2">

            <div>
              <label className="block mb-2">
                College Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="student@kce.ac.in"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3"
              />
            </div>
            <div>
              <label className="block mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 outline-none focus:border-orange-500 transition"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          </div>

          {/* Footer */}

          <div className="flex justify-end gap-4 pt-4 border-t border-slate-800">

            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700"
            >

              Cancel

            </button>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 font-semibold"
            >

              {mode === "add" ? "Save Student" : "Update Student"}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default StudentForm;