import { useState, useEffect } from "react";
import { X } from "lucide-react";

const MaintenanceForm = ({
  isOpen,
  onClose,
  mode = "add",
  maintenance,
  onSave,
}) => {

  const [formData, setFormData] = useState({
    id: "",
    maintenanceId: "",
    equipment: "",
    laboratory: "",
    technician: "",
    scheduledDate: "",
    cost: "",
    status: "Scheduled",
  });

  useEffect(() => {
    if (mode === "edit" && maintenance) {
      setFormData(maintenance);
    }
  }, [maintenance, mode]);

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
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-5">

      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl">

        <div className="flex justify-between items-center px-6 py-5 border-b border-slate-800">

          <h2 className="text-2xl font-bold">
            {mode === "add"
              ? "Schedule Maintenance"
              : "Edit Maintenance"}
          </h2>

          <button
            onClick={onClose}
            className="hover:bg-slate-800 p-2 rounded-lg"
          >
            <X />
          </button>

        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 grid md:grid-cols-2 gap-5"
        >

          <input
            name="maintenanceId"
            value={formData.maintenanceId}
            onChange={handleChange}
            placeholder="Maintenance ID"
            className="bg-slate-800 border border-slate-700 rounded-xl p-3"
          />

          <input
            name="equipment"
            value={formData.equipment}
            onChange={handleChange}
            placeholder="Equipment Name"
            className="bg-slate-800 border border-slate-700 rounded-xl p-3"
          />

          <input
            name="laboratory"
            value={formData.laboratory}
            onChange={handleChange}
            placeholder="Laboratory"
            className="bg-slate-800 border border-slate-700 rounded-xl p-3"
          />

          <input
            name="technician"
            value={formData.technician}
            onChange={handleChange}
            placeholder="Technician Name"
            className="bg-slate-800 border border-slate-700 rounded-xl p-3"
          />

          <input
            type="date"
            name="scheduledDate"
            value={formData.scheduledDate}
            onChange={handleChange}
            className="bg-slate-800 border border-slate-700 rounded-xl p-3"
          />

          <input
            name="cost"
            value={formData.cost}
            onChange={handleChange}
            placeholder="₹1000"
            className="bg-slate-800 border border-slate-700 rounded-xl p-3"
          />

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="bg-slate-800 border border-slate-700 rounded-xl p-3"
          >
            <option>Scheduled</option>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>

          <div className="md:col-span-2 flex justify-end gap-4 pt-4 border-t border-slate-800">

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
                ? "Schedule"
                : "Update"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default MaintenanceForm;