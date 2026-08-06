import { useEffect, useState } from "react";
import { X } from "lucide-react";

const FacultyForm = ({
  isOpen,
  onClose,
  mode = "add",
  faculty,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    id: "",
    facultyId: "",
    name: "",
    department: "",
    designation: "",
    email: "",
    phone: "",
    specialization: "",
    lab: "",
    status: "Active",
  });

  useEffect(() => {
    if (mode === "edit" && faculty) {
      setFormData(faculty);
    }
  }, [mode, faculty]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (onSave) {
      onSave(formData);
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-5">

      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl">

        <div className="flex justify-between items-center px-6 py-5 border-b border-slate-800">

          <h2 className="text-2xl font-bold">

            {mode === "add" ? "Add Faculty" : "Edit Faculty"}

          </h2>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-800"
          >

            <X />

          </button>

        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-6"
        >

          <div className="grid md:grid-cols-2 gap-5">

            <input
              name="facultyId"
              value={formData.facultyId}
              onChange={handleChange}
              placeholder="Faculty ID"
              className="bg-slate-800 border border-slate-700 rounded-xl p-3"
            />

            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Faculty Name"
              className="bg-slate-800 border border-slate-700 rounded-xl p-3"
            />

            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="bg-slate-800 border border-slate-700 rounded-xl p-3"
            >
              <option>CSE</option>
              <option>ECE</option>
              <option>EEE</option>
              <option>Mechanical</option>
              <option>Civil</option>
            </select>

            <select
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              className="bg-slate-800 border border-slate-700 rounded-xl p-3"
            >
              <option>Professor</option>
              <option>Associate Professor</option>
              <option>Assistant Professor</option>
            </select>

            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="College Email"
              className="bg-slate-800 border border-slate-700 rounded-xl p-3"
            />

            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              className="bg-slate-800 border border-slate-700 rounded-xl p-3"
            />

            <input
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              placeholder="Specialization"
              className="bg-slate-800 border border-slate-700 rounded-xl p-3"
            />

            <input
              name="lab"
              value={formData.lab}
              onChange={handleChange}
              placeholder="Assigned Laboratory"
              className="bg-slate-800 border border-slate-700 rounded-xl p-3"
            />

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="bg-slate-800 border border-slate-700 rounded-xl p-3 md:col-span-2"
            >
              <option>Active</option>
              <option>Inactive</option>
              <option>On Leave</option>
            </select>

          </div>

          <div className="flex justify-end gap-4 pt-5 border-t border-slate-800">

            <button
              type="button"
              onClick={onClose}
              className="bg-slate-800 hover:bg-slate-700 px-6 py-3 rounded-xl"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-xl font-semibold"
            >
              {mode === "add" ? "Save Faculty" : "Update Faculty"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default FacultyForm;