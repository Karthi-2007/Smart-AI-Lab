import {
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

const LaboratoryRow = ({
  laboratory,
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <tr className="border-b border-slate-800 hover:bg-slate-800 transition">

      <td className="px-5 py-4">

        {laboratory.labId}

      </td>

      <td className="px-5 py-4 font-medium">

        {laboratory.name}

      </td>

      <td className="px-5 py-4">

        {laboratory.department}

      </td>

      <td className="px-5 py-4">

        {laboratory.roomNo}

      </td>

      <td className="px-5 py-4">

        {laboratory.incharge}

      </td>

      <td className="px-5 py-4">

        {laboratory.equipment}

      </td>

      <td className="px-5 py-4">

        <span
          className={`px-3 py-1 rounded-full text-sm ${
            laboratory.status === "Active"
              ? "bg-green-500/20 text-green-400"
              : laboratory.status === "Maintenance"
              ? "bg-orange-500/20 text-orange-400"
              : "bg-red-500/20 text-red-400"
          }`}
        >

          {laboratory.status}

        </span>

      </td>

      <td className="px-5 py-4">

        <div className="flex justify-center gap-3">

          <button
            onClick={() => onView(laboratory)}
            className="text-blue-400 hover:text-blue-300"
          >
            <Eye size={18} />
          </button>

          <button
            onClick={() => onEdit(laboratory)}
            className="text-yellow-400 hover:text-yellow-300"
          >
            <Pencil size={18} />
          </button>

          <button
            onClick={() => onDelete(laboratory)}
            className="text-red-400 hover:text-red-300"
          >
            <Trash2 size={18} />
          </button>

        </div>

      </td>

    </tr>
  );
};

export default LaboratoryRow;