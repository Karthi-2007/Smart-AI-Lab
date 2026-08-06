import { X } from "lucide-react";

const BookingModal = ({
  isOpen,
  onClose,
  booking,
}) => {

  if (!isOpen || !booking) return null;

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
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">

      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl">

        <div className="flex justify-between items-center px-6 py-5 border-b border-slate-800">

          <h2 className="text-2xl font-bold">
            Booking Details
          </h2>

          <button
            onClick={onClose}
            className="hover:bg-slate-800 p-2 rounded-lg"
          >
            <X />
          </button>

        </div>

        <div className="grid grid-cols-2 gap-6 p-6">

          <div>
            <p className="text-slate-400">Booking ID</p>
            <p className="font-semibold">{booking.bookingId}</p>
          </div>

          <div>
            <p className="text-slate-400">Student</p>
            <p className="font-semibold">{booking.student}</p>
          </div>

          <div>
            <p className="text-slate-400">Register No</p>
            <p>{booking.registerNo}</p>
          </div>

          <div>
            <p className="text-slate-400">Equipment</p>
            <p>{booking.equipment}</p>
          </div>

          <div>
            <p className="text-slate-400">Laboratory</p>
            <p>{booking.laboratory}</p>
          </div>

          <div>
            <p className="text-slate-400">Booking Date</p>
            <p>{booking.bookingDate}</p>
          </div>

          <div>
            <p className="text-slate-400">Time Slot</p>
            <p>{booking.slot}</p>
          </div>

          <div>
            <p className="text-slate-400">Status</p>

            <span
              className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                booking.status
              )}`}
            >
              {booking.status}
            </span>

          </div>

        </div>

      </div>

    </div>
  );
};

export default BookingModal;