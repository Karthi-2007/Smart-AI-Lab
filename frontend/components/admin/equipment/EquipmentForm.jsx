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
    imageUrl: ""
  });

  useEffect(() => {
    if (mode === "edit" && equipment) {
      // Map laboratory object to string for the form if it exists
      const labName = typeof equipment.laboratory === 'object' 
        ? equipment.laboratory?.name 
        : (equipment.laboratory || "");
      
      setFormData({
        ...equipment,
        laboratory: labName,
        imageUrl: equipment.imageUrl || ""
      });
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
        imageUrl: ""
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
        equipmentId: formData.equipmentId || formData.serialNo || "EQ-" + Math.floor(Math.random() * 1000),
        imageUrl: formData.imageUrl || ""
      };
      
      // Keep ID if in edit mode
      const targetId = formData.id || formData.equipmentId;
      if (mode === 'edit' && targetId) {
        payload.id = targetId;
      }
      onSave(payload);
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-5 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl my-8">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-slate-800">
          <h2 className="text-2xl font-bold">
            {mode === "add" ? "Add Equipment" : "Edit Equipment"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-800"
          >
            <X />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
            <Input
              label="Equipment ID / Serial Number"
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
              label="Purchase Date"
              type="date"
              name="purchaseDate"
              value={formData.purchaseDate}
              onChange={handleChange}
            />

            <Select
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={["Available", "Booked", "Under Maintenance", "Faulty"]}
            />

            {/* Image URL Input */}
            <Input
              label="Image URL"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="e.g. https://images.unsplash.com/..."
            />

            {/* Image Live Preview */}
            <div>
              <label className="block mb-2">Image Preview</label>
              <div className="h-12 bg-slate-950 border border-slate-800 rounded-xl flex items-center px-4 overflow-hidden gap-3">
                <img
                  src={formData.imageUrl || "https://images.unsplash.com/photo-1532187643603-ba119ca4109e?w=600&auto=format&fit=crop"}
                  onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1532187643603-ba119ca4109e?w=600&auto=format&fit=crop"; }}
                  className="w-10 h-8 object-cover rounded-lg border border-slate-800"
                  alt="preview"
                />
                <span className="text-xs text-slate-500 truncate flex-1">
                  {formData.imageUrl ? formData.imageUrl : "Default Fallback Image"}
                </span>
              </div>
            </div>
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
              className="px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 font-semibold text-white"
            >
              {mode === "add" ? "Save Equipment" : "Update Equipment"}
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
  placeholder = ""
}) => (
  <div>
    <label className="block mb-2">{label}</label>
    <input
      type={type}
      name={name}
      value={value || ""}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 focus:border-orange-500 outline-none text-white text-sm"
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
      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white text-sm outline-none"
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