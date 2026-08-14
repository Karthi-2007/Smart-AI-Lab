import {
  Eye,
  Pencil,
  Trash2,
  CheckCircle
} from "lucide-react";

const StudentRow = ({ student, onView, onDelete, onEdit, onActivate }) => {
  const isPending = student.status?.toLowerCase() === "pending" || student.status?.toLowerCase() === "unactivated";

  return (
    <tr className="border-b border-slate-800 hover:bg-slate-800 transition">
      <td className="px-5 py-4 font-mono text-slate-300 text-sm">
        {student.registerNo || student.regNo || '-'}
      </td>
      <td className="px-5 py-4 font-medium text-white">
        {student.name}
      </td>
      <td className="px-5 py-4 text-slate-300 text-sm">
        {student.department}
      </td>
      <td className="px-5 py-4 text-slate-300 text-sm">
        {student.year}
      </td>
      <td className="px-5 py-4 text-slate-300 text-sm">
        {student.email}
      </td>
      <td className="px-5 py-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            student.status?.toLowerCase() === "active" || student.status?.toLowerCase() === "activated"
              ? "bg-green-500/20 text-green-400"
              : "bg-orange-500/20 text-orange-400"
          }`}
        >
          {student.status || 'Active'}
        </span>
      </td>
      <td className="px-5 py-4">
        <div className="flex justify-center gap-3">
          {isPending && (
            <button
              onClick={() => onActivate && onActivate(student)}
              className="text-green-400 hover:text-green-300 transition"
              title="Approve / Activate Student"
            >
              <CheckCircle size={18} />
            </button>
          )}
          <button
            onClick={() => onView(student)}
            className="text-blue-400 hover:text-blue-300 transition"
            title="View Details"
          >
            <Eye size={18} />
          </button>
          <button
            onClick={() => onEdit(student)}
            className="text-yellow-400 hover:text-yellow-300 transition"
            title="Edit Student"
          >
            <Pencil size={18} />
          </button>
          <button
            onClick={() => onDelete(student)}
            className="text-red-400 hover:text-red-300 transition"
            title="Delete Student"
          >
            <Trash2 size={18}/>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default StudentRow;