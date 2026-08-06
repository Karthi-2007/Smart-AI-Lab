import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from "lucide-react";

const equipments = [
  {
    id: 1,
    name: "Digital Oscilloscope",
    health: 92,
  },
  {
    id: 2,
    name: "Arduino Mega Kit",
    health: 78,
  },
  {
    id: 3,
    name: "3D Printer",
    health: 56,
  },
  {
    id: 4,
    name: "CNC Machine",
    health: 34,
  },
];

const EquipmentHealth = () => {
  const getStatus = (health) => {
    if (health >= 85)
      return {
        text: "Excellent",
        color: "text-green-400",
        bg: "bg-green-500",
        icon: CheckCircle2,
      };

    if (health >= 60)
      return {
        text: "Good",
        color: "text-blue-400",
        bg: "bg-blue-500",
        icon: Activity,
      };

    if (health >= 40)
      return {
        text: "Needs Service",
        color: "text-yellow-400",
        bg: "bg-yellow-500",
        icon: AlertTriangle,
      };

    return {
      text: "Critical",
      color: "text-red-400",
      bg: "bg-red-500",
      icon: XCircle,
    };
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-full">

      <h2 className="text-xl font-bold mb-6">

        Equipment Health

      </h2>

      <div className="space-y-6">

        {equipments.map((item) => {

          const status = getStatus(item.health);

          const Icon = status.icon;

          return (

            <div key={item.id}>

              <div className="flex justify-between items-center">

                <div>

                  <h3 className="font-semibold">

                    {item.name}

                  </h3>

                  <div
                    className={`flex items-center gap-2 mt-1 ${status.color}`}
                  >

                    <Icon size={16} />

                    <span className="text-sm">

                      {status.text}

                    </span>

                  </div>

                </div>

                <span className="font-bold text-lg">

                  {item.health}%

                </span>

              </div>

              <div className="w-full h-3 rounded-full bg-slate-800 mt-3">

                <div
                  className={`${status.bg} h-3 rounded-full transition-all duration-700`}
                  style={{
                    width: `${item.health}%`,
                  }}
                ></div>

              </div>

            </div>

          );

        })}

      </div>

    </div>
  );
};

export default EquipmentHealth;