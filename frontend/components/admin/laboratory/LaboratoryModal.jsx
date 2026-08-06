import { X } from "lucide-react";

const LaboratoryModal = ({
  isOpen,
  onClose,
  laboratory,
}) => {

  if (!isOpen || !laboratory) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-5">

      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl">

        {/* Header */}

        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">

          <h2 className="text-2xl font-bold">

            Laboratory Details

          </h2>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-800"
          >

            <X />

          </button>

        </div>

        {/* Body */}

        <div className="grid grid-cols-2 gap-6 p-6">

          <div>

            <p className="text-slate-400">Lab ID</p>

            <p className="font-semibold mt-1">

              {laboratory.labId}

            </p>

          </div>

          <div>

            <p className="text-slate-400">Laboratory Name</p>

            <p className="font-semibold mt-1">

              {laboratory.name}

            </p>

          </div>

          <div>

            <p className="text-slate-400">Department</p>

            <p className="font-semibold mt-1">

              {laboratory.department}

            </p>

          </div>

          <div>

            <p className="text-slate-400">Room Number</p>

            <p className="font-semibold mt-1">

              {laboratory.roomNo}

            </p>

          </div>

          <div>

            <p className="text-slate-400">Faculty In-charge</p>

            <p className="font-semibold mt-1">

              {laboratory.incharge}

            </p>

          </div>

          <div>

            <p className="text-slate-400">Capacity</p>

            <p className="font-semibold mt-1">

              {laboratory.capacity}

            </p>

          </div>

          <div>

            <p className="text-slate-400">Equipment Count</p>

            <p className="font-semibold mt-1">

              {laboratory.equipment}

            </p>

          </div>

          <div>

            <p className="text-slate-400">Status</p>

            <span
              className={`inline-block mt-1 px-3 py-1 rounded-full text-sm ${
                laboratory.status === "Active"
                  ? "bg-green-500/20 text-green-400"
                  : laboratory.status === "Maintenance"
                  ? "bg-orange-500/20 text-orange-400"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {laboratory.status}
            </span>

          </div>

        </div>

      </div>

    </div>
  );
};

export default LaboratoryModal;