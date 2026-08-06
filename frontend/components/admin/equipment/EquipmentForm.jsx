import { X } from "lucide-react";
import { useEffect, useState } from "react";

const EquipmentForm = ({
  isOpen,
  onClose,
  mode = "add",
  equipment,
  onSave,
}) => {

  const [formData, setFormData] = useState({
    id: "",
    equipmentId: "",
    name: "",
    category: "",
    laboratory: "",
    brand: "",
    model: "",
    serialNo: "",
    quantity: "",
    available: "",
    location: "",
    purchaseDate: "",
    warranty: "",
    status: "Available",
    condition: "Excellent",
  });

  useEffect(() => {

    if (mode === "edit" && equipment) {
      setFormData(equipment);
    }

    if (mode === "add") {
      setFormData({
        id: "",
        equipmentId: "",
        name: "",
        category: "",
        laboratory: "",
        brand: "",
        model: "",
        serialNo: "",
        quantity: "",
        available: "",
        location: "",
        purchaseDate: "",
        warranty: "",
        status: "Available",
        condition: "Excellent",
      });
    }

  }, [equipment, mode]);

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
        name: formData.name,
        desc: formData.brand ? `${formData.brand} ${formData.model}` : "Standard Equipment",
        category: formData.category || "General",
        labName: formData.laboratory || "Main Lab",
        status: formData.status || "Available",
        equipmentId: formData.equipmentId || formData.serialNo || "EQ-" + Math.floor(Math.random() * 1000)
      };
      // Keep ID if in edit mode
      if (mode === 'edit' && formData.id) {
        payload.id = formData.id;
      }
      onSave(payload);
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-5 overflow-y-auto">

      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl">

        {/* Header */}

        <div className="flex justify-between items-center px-6 py-5 border-b border-slate-800">

          <h2 className="text-2xl font-bold">

            {mode === "add"
              ? "Add Equipment"
              : "Edit Equipment"}

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
          className="p-6 space-y-5"
        >

          <div className="grid md:grid-cols-2 gap-5">

            <Input
              label="Equipment ID"
              name="equipmentId"
              value={formData.equipmentId}
              onChange={handleChange}
            />

            <Input
              label="Equipment Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />

            <Input
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            />

            <Input
              label="Laboratory"
              name="laboratory"
              value={formData.laboratory}
              onChange={handleChange}
            />

            <Input
              label="Brand"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
            />

            <Input
              label="Model"
              name="model"
              value={formData.model}
              onChange={handleChange}
            />

            <Input
              label="Serial Number"
              name="serialNo"
              value={formData.serialNo}
              onChange={handleChange}
            />

            <Input
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
            />

            <Input
              label="Quantity"
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
            />

            <Input
              label="Available Quantity"
              type="number"
              name="available"
              value={formData.available}
              onChange={handleChange}
            />

            <Input
              label="Purchase Date"
              type="date"
              name="purchaseDate"
              value={formData.purchaseDate}
              onChange={handleChange}
            />

            <Input
              label="Warranty Expiry"
              type="date"
              name="warranty"
              value={formData.warranty}
              onChange={handleChange}
            />

            <Select
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={[
                "Available",
                "Booked",
                "Maintenance",
              ]}
            />

            <Select
              label="Condition"
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              options={[
                "Excellent",
                "Good",
                "Fair",
                "Repair",
              ]}
            />

          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-slate-800">

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
                ? "Save Equipment"
                : "Update Equipment"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

const Input = ({
  label,
  type = "text",
  name,
  value,
  onChange,
}) => (
  <div>
    <label className="block mb-2">{label}</label>

    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 focus:border-orange-500 outline-none"
    />
  </div>
);

const Select = ({
  label,
  name,
  value,
  onChange,
  options,
}) => (
  <div>
    <label className="block mb-2">{label}</label>

    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3"
    >
      {options.map((item) => (
        <option
          key={item}
          value={item}
        >
          {item}
        </option>
      ))}
    </select>
  </div>
);

export default EquipmentForm;