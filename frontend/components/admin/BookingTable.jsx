import { CalendarCheck } from "lucide-react";

const bookings = [
  {
    id: "BK101",
    student: "Karthikeyan S S",
    equipment: "Oscilloscope",
    lab: "ECE Lab",
    time: "09:30 AM",
    status: "Approved",
  },
  {
    id: "BK102",
    student: "Rahul",
    equipment: "Arduino Kit",
    lab: "IoT Lab",
    time: "10:00 AM",
    status: "Pending",
  },
  {
    id: "BK103",
    student: "Priya",
    equipment: "3D Printer",
    lab: "Innovation Lab",
    time: "11:30 AM",
    status: "Approved",
  },
];

const BookingTable = () => {
  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">

      <div className="flex items-center gap-3 mb-6">
        <CalendarCheck className="text-orange-500" />
        <h2 className="text-xl font-bold">Recent Bookings</h2>
      </div>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>

            <tr className="text-left border-b border-slate-700">

              <th className="py-3">Student</th>

              <th>Equipment</th>

              <th>Lab</th>

              <th>Time</th>

              <th>Status</th>

            </tr>

          </thead>

          <tbody>

            {bookings.map((item) => (

              <tr
                key={item.id}
                className="border-b border-slate-800 hover:bg-slate-800 transition"
              >

                <td className="py-4">{item.student}</td>

                <td>{item.equipment}</td>

                <td>{item.lab}</td>

                <td>{item.time}</td>

                <td>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      item.status === "Approved"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {item.status}
                  </span>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default BookingTable;