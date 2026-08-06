import {
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

const StudentRow = ({ student,onView,onDelete,onEdit}) => {
  return (
    <tr className="border-b border-slate-800 hover:bg-slate-800 transition">

      <td className="px-5 py-4">

        {student.registerNo}

      </td>

      <td className="px-5 py-4 font-medium">

        {student.name}

      </td>

      <td className="px-5 py-4">

        {student.department}

      </td>

      <td className="px-5 py-4">

        {student.year}

      </td>

      <td className="px-5 py-4">

        {student.email}

      </td>

      <td className="px-5 py-4">

        <span
          className={`px-3 py-1 rounded-full text-sm ${
            student.status === "Activated"
              ? "bg-green-500/20 text-green-400"
              : "bg-orange-500/20 text-orange-400"
          }`}
        >
          {student.status}
        </span>

      </td>

      <td className="px-5 py-4">

        <div className="flex justify-center gap-3">

          <button
          onClick={() => onView(student)}
          className="text-blue-400 hover:text-blue-300"
          >
          <Eye size={18} />
          </button>

          <button
          onClick={() => onEdit(student)}
          className="text-yellow-400 hover:text-yellow-300"
           >
          <Pencil size={18} />
        </button>

          <button
           onClick={() => onDelete(student)}
           className="text-red-400 hover:text-red-300"
            >
            <Trash2 size={18}/>
          </button>

        </div>

      </td>

    </tr>
  );
};

export default StudentRow;