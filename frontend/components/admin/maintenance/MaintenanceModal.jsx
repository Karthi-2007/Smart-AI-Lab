import { X } from "lucide-react";

const MaintenanceModal = ({
  isOpen,
  onClose,
  maintenance,
}) => {

  if (!isOpen || !maintenance) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-500/20 text-green-400";

      case "Scheduled":
        return "bg-blue-500/20 text-blue-400";

      case "Pending":
        return "bg-yellow-500/20 text-yellow-400";

      case "In Progress":
        return "bg-orange-500/20 text-orange-400";

      default:
        return "bg-slate-500/20 text-slate-300";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">

      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl">

        <div className="flex justify-between items-center px-6 py-5 border-b border-slate-800">

          <h2 className="text-2xl font-bold">
            Maintenance Details
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
            <p className="text-slate-400">Maintenance ID</p>
            <p>{maintenance.maintenanceId}</p>
          </div>

          <div>
            <p className="text-slate-400">Equipment</p>
            <p>{maintenance.equipment}</p>
          </div>

          <div>
            <p className="text-slate-400">Laboratory</p>
            <p>{maintenance.laboratory}</p>
          </div>

          <div>
            <p className="text-slate-400">Technician</p>
            <p>{maintenance.technician}</p>
          </div>

          <div>
            <p className="text-slate-400">Scheduled Date</p>
            <p>{maintenance.scheduledDate}</p>
          </div>

          <div>
            <p className="text-slate-400">Cost</p>
            <p>{maintenance.cost}</p>
          </div>

          <div>
            <p className="text-slate-400">Status</p>

            <span
              className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                maintenance.status
              )}`}
            >
              {maintenance.status}
            </span>

          </div>

        </div>

      </div>

    </div>
  );
};

export default MaintenanceModal;