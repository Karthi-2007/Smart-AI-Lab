import {
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

const BookingRow = ({
  booking,
  onView,
  onEdit,
  onDelete,
}) => {

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-500/20 text-green-400";

      case "Pending":
        return "bg-yellow-500/20 text-yellow-400";

      case "Completed":
        return "bg-blue-500/20 text-blue-400";

      case "Cancelled":
        return "bg-red-500/20 text-red-400";

      default:
        return "bg-slate-500/20 text-slate-300";
    }
  };

  return (
    <tr className="border-b border-slate-800 hover:bg-slate-800 transition">

      <td className="px-5 py-4">

        {booking.bookingId}

      </td>

      <td className="px-5 py-4">

        {booking.student}

      </td>

      <td className="px-5 py-4">

        {booking.equipment}

      </td>

      <td className="px-5 py-4">

        {booking.laboratory}

      </td>

      <td className="px-5 py-4">

        {booking.bookingDate}

      </td>

      <td className="px-5 py-4">

        {booking.slot}

      </td>

      <td className="px-5 py-4">

        <span
          className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
            booking.status
          )}`}
        >
          {booking.status}
        </span>

      </td>

      <td className="px-5 py-4">

        <div className="flex justify-center gap-3">

          <button
            onClick={() => onView(booking)}
            className="text-blue-400 hover:text-blue-300"
          >
            <Eye size={18} />
          </button>

          <button
            onClick={() => onEdit(booking)}
            className="text-yellow-400 hover:text-yellow-300"
          >
            <Pencil size={18} />
          </button>

          <button
            onClick={() => onDelete(booking)}
            className="text-red-400 hover:text-red-300"
          >
            <Trash2 size={18} />
          </button>

        </div>

      </td>

    </tr>
  );
};

export default BookingRow;