import { useEffect, useState } from "react";
import { X } from "lucide-react";

const LaboratoryForm = ({
  isOpen,
  onClose,
  mode = "add",
  laboratory,
  onSave,
}) => {

  const [formData, setFormData] = useState({
    id: "",
    labId: "",
    name: "",
    department: "",
    roomNo: "",
    incharge: "",
    capacity: "",
    equipment: "",
    status: "Active",
  });

  useEffect(() => {

    if (mode === "edit" && laboratory) {

      setFormData(laboratory);

    }

  }, [mode, laboratory]);

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

        {/* Header */}

        <div className="flex justify-between items-center px-6 py-5 border-b border-slate-800">

          <h2 className="text-2xl font-bold">

            {mode === "add"
              ? "Add Laboratory"
              : "Edit Laboratory"}

          </h2>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-800"
          >

            <X />

          </button>

        </div>

        {/* Form */}

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-6"
        >

          <div className="grid md:grid-cols-2 gap-5">

            <input
              name="labId"
              value={formData.labId}
              onChange={handleChange}
              placeholder="Lab ID"
              className="bg-slate-800 border border-slate-700 rounded-xl p-3"
            />

            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Laboratory Name"
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

            <input
              name="roomNo"
              value={formData.roomNo}
              onChange={handleChange}
              placeholder="Room Number"
              className="bg-slate-800 border border-slate-700 rounded-xl p-3"
            />

            <input
              name="incharge"
              value={formData.incharge}
              onChange={handleChange}
              placeholder="Faculty In-charge"
              className="bg-slate-800 border border-slate-700 rounded-xl p-3"
            />

            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              placeholder="Capacity"
              className="bg-slate-800 border border-slate-700 rounded-xl p-3"
            />

            <input
              type="number"
              name="equipment"
              value={formData.equipment}
              onChange={handleChange}
              placeholder="Equipment Count"
              className="bg-slate-800 border border-slate-700 rounded-xl p-3"
            />

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="bg-slate-800 border border-slate-700 rounded-xl p-3"
            >

              <option>Active</option>
              <option>Maintenance</option>
              <option>Inactive</option>

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

              {mode === "add"
                ? "Save Laboratory"
                : "Update Laboratory"}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default LaboratoryForm;