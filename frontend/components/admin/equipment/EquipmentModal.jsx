import { X } from "lucide-react";

const EquipmentModal = ({
  isOpen,
  onClose,
  equipment,
}) => {

  if (!isOpen || !equipment) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-5">

      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl">

        {/* Header */}

        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">

          <h2 className="text-2xl font-bold">

            Equipment Details

          </h2>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-800"
          >

            <X />

          </button>

        </div>

        {/* Body */}

        <div className="p-6">

          <div className="grid md:grid-cols-2 gap-6">

            <div>

              <p className="text-slate-400">

                Equipment ID

              </p>

              <p className="font-semibold">

                {equipment.equipmentId}

              </p>

            </div>

            <div>

              <p className="text-slate-400">

                Equipment Name

              </p>

              <p className="font-semibold">

                {equipment.name}

              </p>

            </div>

            <div>

              <p className="text-slate-400">

                Category

              </p>

              <p>

                {equipment.category}

              </p>

            </div>

            <div>

              <p className="text-slate-400">

                Laboratory

              </p>

              <p>

                {equipment.laboratory}

              </p>

            </div>

            <div>

              <p className="text-slate-400">

                Brand

              </p>

              <p>

                {equipment.brand}

              </p>

            </div>

            <div>

              <p className="text-slate-400">

                Model

              </p>

              <p>

                {equipment.model}

              </p>

            </div>

            <div>

              <p className="text-slate-400">

                Serial Number

              </p>

              <p>

                {equipment.serialNo}

              </p>

            </div>

            <div>

              <p className="text-slate-400">

                Location

              </p>

              <p>

                {equipment.location}

              </p>

            </div>

            <div>

              <p className="text-slate-400">

                Purchase Date

              </p>

              <p>

                {equipment.purchaseDate}

              </p>

            </div>

            <div>

              <p className="text-slate-400">

                Warranty Expiry

              </p>

              <p>

                {equipment.warranty}

              </p>

            </div>

            <div>

              <p className="text-slate-400">

                Quantity

              </p>

              <p>

                {equipment.available} / {equipment.quantity}

              </p>

            </div>

            <div>

              <p className="text-slate-400">

                Status

              </p>

              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  equipment.status === "Available"
                    ? "bg-green-500/20 text-green-400"
                    : equipment.status === "Booked"
                    ? "bg-orange-500/20 text-orange-400"
                    : "bg-red-500/20 text-red-400"
                }`}
              >

                {equipment.status}

              </span>

            </div>

            <div>

              <p className="text-slate-400">

                Condition

              </p>

              <p>

                {equipment.condition}

              </p>

            </div>

          </div>

          {/* Footer */}

          <div className="flex justify-end mt-8 border-t border-slate-800 pt-5">

            <button
              onClick={onClose}
              className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-xl font-semibold"
            >

              Close

            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default EquipmentModal;