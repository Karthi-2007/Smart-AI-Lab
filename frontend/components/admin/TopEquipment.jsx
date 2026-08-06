import {
  Trophy,
  Cpu,
} from "lucide-react";

const equipments = [
  {
    name: "Digital Oscilloscope",
    bookings: 241,
  },
  {
    name: "Arduino Mega Kit",
    bookings: 216,
  },
  {
    name: "3D Printer",
    bookings: 192,
  },
  {
    name: "Raspberry Pi",
    bookings: 175,
  },
  {
    name: "CNC Machine",
    bookings: 162,
  },
];

const TopEquipment = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-full">

      <div className="flex items-center gap-3 mb-6">

        <Trophy className="text-orange-500" />

        <h2 className="text-xl font-bold">

          Top Utilized Equipment

        </h2>

      </div>

      <div className="space-y-5">

        {equipments.map((item, index) => (

          <div
            key={index}
            className="flex justify-between items-center p-3 rounded-xl hover:bg-slate-800 transition"
          >

            <div className="flex items-center gap-3">

              <div className="bg-orange-500 w-10 h-10 rounded-full flex items-center justify-center font-bold">

                {index + 1}

              </div>

              <div>

                <h3 className="font-semibold">

                  {item.name}

                </h3>

                <p className="text-sm text-slate-400">

                  {item.bookings} Bookings

                </p>

              </div>

            </div>

            <Cpu className="text-orange-500" />

          </div>

        ))}

      </div>

    </div>
  );
};

export default TopEquipment;