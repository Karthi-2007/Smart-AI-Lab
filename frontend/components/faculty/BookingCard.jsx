import React from "react";
import {
  User,
  Laptop,
  Building2,
  CalendarDays,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

const BookingCard = ({ booking, onApprove, onReject }) => {
  return (
    <div
      className="
      bg-white
      rounded-2xl
      shadow-md
      border
      p-6
      hover:shadow-lg
      transition
      "
    >
      {/* Header */}

      <div
        className="
      flex justify-between items-start mb-5
      "
      >
        <div>
          <h2
            className="
            text-lg
            font-bold
            text-gray-800
            "
          >
            {booking.equipment}
          </h2>

          <p
            className="
            text-sm
            text-gray-500
            "
          >
            Booking ID : {booking.bookingId}
          </p>
        </div>

        {/* Status */}

        <span
          className={`
          px-3 py-1
          rounded-full
          text-xs
          font-semibold

          ${
            booking.status === "Pending"
              ? "bg-yellow-100 text-yellow-700"
              : booking.status === "Approved"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
          }

          `}
        >
          {booking.status}
        </span>
      </div>

      {/* Details */}

      <div
        className="
      space-y-4
      "
      >
        {/* Student */}

        <div
          className="
        flex items-center gap-3
        "
        >
          <div
            className="
          bg-orange-100
          p-2
          rounded-lg
          "
          >
            <User size={18} className="text-orange-600" />
          </div>

          <div>
            <p className="text-xs text-gray-500">Student</p>

            <p className="font-medium">{booking.student}</p>
          </div>
        </div>

        {/* Equipment */}

        <div
          className="
        flex items-center gap-3
        "
        >
          <div
            className="
          bg-blue-100
          p-2
          rounded-lg
          "
          >
            <Laptop size={18} className="text-blue-600" />
          </div>

          <div>
            <p className="text-xs text-gray-500">Equipment</p>

            <p className="font-medium">{booking.equipment}</p>
          </div>
        </div>

        {/* Laboratory */}

        <div
          className="
        flex items-center gap-3
        "
        >
          <div
            className="
          bg-purple-100
          p-2
          rounded-lg
          "
          >
            <Building2 size={18} className="text-purple-600" />
          </div>

          <div>
            <p className="text-xs text-gray-500">Laboratory</p>

            <p className="font-medium">{booking.laboratory}</p>
          </div>
        </div>

        {/* Date & Time */}

        <div
          className="
        grid grid-cols-2 gap-4
        "
        >
          <div
            className="
          flex items-center gap-2
          bg-gray-50
          p-3
          rounded-lg
          "
          >
            <CalendarDays size={18} className="text-orange-600" />

            <span className="text-sm">{booking.date}</span>
          </div>

          <div
            className="
          flex items-center gap-2
          bg-gray-50
          p-3
          rounded-lg
          "
          >
            <Clock size={18} className="text-orange-600" />

            <span className="text-sm">{booking.slot}</span>
          </div>
        </div>
      </div>

      {/* Actions */}

      {booking.status === "Pending" && (
        <div
          className="
          flex gap-4 mt-6
          "
        >
          <button
            onClick={() => onApprove(booking.id)}
            className="
            flex-1
            flex items-center justify-center gap-2
            bg-green-600
            text-white
            py-3
            rounded-xl
            hover:bg-green-700
            transition
            "
          >
            <CheckCircle size={18} />
            Approve
          </button>

          <button
            onClick={() => onReject(booking.id)}
            className="
            flex-1
            flex items-center justify-center gap-2
            bg-red-500
            text-white
            py-3
            rounded-xl
            hover:bg-red-600
            transition
            "
          >
            <XCircle size={18} />
            Reject
          </button>
        </div>
      )}
    </div>
  );
};

export default BookingCard;
