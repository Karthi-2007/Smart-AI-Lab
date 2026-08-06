import { X } from "lucide-react";
import { useEffect, useState } from "react";

const StudentForm = ({
  isOpen,
  onClose,
  mode = "add",
  student,
  onSave,
}) => {
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
  if (mode === "edit" && student) {
    setFormData({
      id: student.id,
      name: student.name,
      registerNo: student.registerNo,
      department: student.department,
      year: student.year,
      section: student.section,
      dob: student.dob,
      email: student.email,
      status: student.status,
    });
  } else {
    setFormData({
      name: "",
      registerNo: "",
      department: "",
      year: "",
      section: "",
      dob: "",
      email: "",
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
            department: formData.department || "Computer Science",
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
  value={formData.department}
  onChange={handleChange}
  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3"
>

                <option>CSE</option>
                <option>ECE</option>
                <option>EEE</option>
                <option>Mechanical</option>
                <option>Civil</option>

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

                <option>I</option>
                <option>II</option>
                <option>III</option>
                <option>IV</option>

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