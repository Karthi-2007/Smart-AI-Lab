import {
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

const EquipmentRow = ({
  equipment,
  onView,
  onEdit,
  onDelete,
}) => {

  const getStatusColor = (status) => {

    switch (status) {

      case "Available":
        return "bg-green-500/20 text-green-400";

      case "Booked":
        return "bg-orange-500/20 text-orange-400";

      case "Maintenance":
        return "bg-red-500/20 text-red-400";

      default:
        return "bg-slate-700 text-slate-300";

    }

  };

  return (

    <tr className="border-b border-slate-800 hover:bg-slate-800 transition">

      <td className="px-5 py-4 font-medium">

        {equipment.equipmentId}

      </td>

      <td className="px-5 py-4">

        <div>

          <p className="font-semibold">

            {equipment.name}

          </p>

          <p className="text-sm text-slate-400">

            {equipment.brand} • {equipment.model}

          </p>

        </div>

      </td>

      <td className="px-5 py-4">

        {equipment.laboratory}

      </td>

      <td className="px-5 py-4">

        {equipment.category}

      </td>

      <td className="px-5 py-4">

        {equipment.available} / {equipment.quantity}

      </td>

      <td className="px-5 py-4">

        <span
          className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
            equipment.status
          )}`}
        >

          {equipment.status}

        </span>

      </td>

      <td className="px-5 py-4">

        <div className="flex justify-center gap-3">

          <button
            onClick={() => onView(equipment)}
            className="text-blue-400 hover:text-blue-300"
          >

            <Eye size={18} />

          </button>

          <button
            onClick={() => onEdit(equipment)}
            className="text-yellow-400 hover:text-yellow-300"
          >

            <Pencil size={18} />

          </button>

          <button
            onClick={() => onDelete(equipment)}
            className="text-red-400 hover:text-red-300"
          >

            <Trash2 size={18} />

          </button>

        </div>

      </td>

    </tr>

  );

};

export default EquipmentRow;