import {
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

const MaintenanceRow = ({
  maintenance,
  onView,
  onEdit,
  onDelete,
}) => {

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-500/20 text-green-400";

      case "Scheduled":
        return "bg-blue-500/20 text-blue-400";

      case "Pending":
        return "bg-yellow-500/20 text-yellow-400";

      case "In Progress":
        return "bg-orange-500/20 text-orange-400";

      default:
        return "bg-slate-500/20 text-slate-300";
    }
  };

  return (
    <tr className="border-b border-slate-800 hover:bg-slate-800 transition">

      <td className="px-5 py-4">
        {maintenance.maintenanceId}
      </td>

      <td className="px-5 py-4">
        {maintenance.equipment}
      </td>

      <td className="px-5 py-4">
        {maintenance.laboratory}
      </td>

      <td className="px-5 py-4">
        {maintenance.technician}
      </td>

      <td className="px-5 py-4">
        {maintenance.scheduledDate}
      </td>

      <td className="px-5 py-4">
        {maintenance.cost}
      </td>

      <td className="px-5 py-4">
        <span
          className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
            maintenance.status
          )}`}
        >
          {maintenance.status}
        </span>
      </td>

      <td className="px-5 py-4">

        <div className="flex justify-center gap-3">

          <button
            onClick={() => onView(maintenance)}
            className="text-blue-400 hover:text-blue-300"
          >
            <Eye size={18} />
          </button>

          <button
            onClick={() => onEdit(maintenance)}
            className="text-yellow-400 hover:text-yellow-300"
          >
            <Pencil size={18} />
          </button>

          <button
            onClick={() => onDelete(maintenance)}
            className="text-red-400 hover:text-red-300"
          >
            <Trash2 size={18} />
          </button>

        </div>

      </td>

    </tr>
  );
};

export default MaintenanceRow;