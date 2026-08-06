import {
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

const DepartmentRow = ({
  department,
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <tr className="border-b border-slate-800 hover:bg-slate-800 transition">

      <td className="px-5 py-4">

        {department.code}

      </td>

      <td className="px-5 py-4 font-medium">

        {department.name}

      </td>

      <td className="px-5 py-4">

        {department.hod}

      </td>

      <td className="px-5 py-4 text-center">

        {department.faculty}

      </td>

      <td className="px-5 py-4 text-center">

        {department.students}

      </td>

      <td className="px-5 py-4 text-center">

        {department.laboratories}

      </td>

      <td className="px-5 py-4">

        <span
          className={`px-3 py-1 rounded-full text-sm ${
            department.status === "Active"
              ? "bg-green-500/20 text-green-400"
              : "bg-red-500/20 text-red-400"
          }`}
        >
          {department.status}
        </span>

      </td>

      <td className="px-5 py-4">

        <div className="flex justify-center gap-3">

          <button
            onClick={() => onView(department)}
            className="text-blue-400 hover:text-blue-300"
          >
            <Eye size={18} />
          </button>

          <button
            onClick={() => onEdit(department)}
            className="text-yellow-400 hover:text-yellow-300"
          >
            <Pencil size={18} />
          </button>

          <button
            onClick={() => onDelete(department)}
            className="text-red-400 hover:text-red-300"
          >
            <Trash2 size={18} />
          </button>

        </div>

      </td>

    </tr>
  );
};

export default DepartmentRow;