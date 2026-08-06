import { useEffect, useState } from "react";
import { X } from "lucide-react";

const DepartmentForm = ({
  isOpen,
  onClose,
  mode = "add",
  department,
  onSave,
}) => {

  const [formData, setFormData] = useState({
    id: "",
    code: "",
    name: "",
    hod: "",
    faculty: "",
    students: "",
    laboratories: "",
    equipment: "",
    status: "Active",
  });

  useEffect(() => {
    if (mode === "edit" && department) {
      setFormData(department);
    }
  }, [mode, department]);

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

            {mode === "add" ? "Add Department" : "Edit Department"}

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
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="Department Code"
              className="bg-slate-800 border border-slate-700 rounded-xl p-3"
            />

            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Department Name"
              className="bg-slate-800 border border-slate-700 rounded-xl p-3"
            />

            <input
              name="hod"
              value={formData.hod}
              onChange={handleChange}
              placeholder="Head of Department"
              className="bg-slate-800 border border-slate-700 rounded-xl p-3"
            />

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="bg-slate-800 border border-slate-700 rounded-xl p-3"
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>

          </div>

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
              {mode === "add"
                ? "Save Department"
                : "Update Department"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default DepartmentForm;