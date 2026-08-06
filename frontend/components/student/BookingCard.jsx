import {
  CalendarDays,
  Clock,
  FlaskConical,
  XCircle,
} from "lucide-react";

const BookingCard = ({ booking }) => {
  const statusColor = {
    Approved: "bg-green-500/20 text-green-400",
    Pending: "bg-yellow-500/20 text-yellow-400",
    Completed: "bg-blue-500/20 text-blue-400",
    Cancelled: "bg-red-500/20 text-red-400",
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-orange-500 transition">

      <div className="flex justify-between items-start">

        <div>
          <h2 className="text-xl font-bold">
            {booking.equipment}
          </h2>

          <p className="text-slate-400 text-sm mt-1">
            Booking ID : {booking.bookingId}
          </p>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-sm ${
            statusColor[booking.status]
          }`}
        >
          {booking.status}
        </span>

      </div>

      <div className="mt-6 space-y-4">

        <div className="flex items-center gap-3">
          <FlaskConical size={18} className="text-orange-400" />
          <span>{booking.laboratory}</span>
        </div>

        <div className="flex items-center gap-3">
          <CalendarDays size={18} className="text-orange-400" />
          <span>{booking.bookingDate}</span>
        </div>

        <div className="flex items-center gap-3">
          <Clock size={18} className="text-orange-400" />
          <span>{booking.slot}</span>
        </div>

      </div>

      {booking.status === "Pending" && (
        <button
          className="mt-6 w-full bg-red-500 hover:bg-red-600 rounded-xl py-3 flex items-center justify-center gap-2"
        >
          <XCircle size={18} />

          Cancel Booking
        </button>
      )}

    </div>
  );
};

export default BookingCard;