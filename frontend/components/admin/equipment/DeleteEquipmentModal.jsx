import { Trash2, X } from "lucide-react";

const DeleteEquipmentModal = ({
  isOpen,
  onClose,
  equipment,
  onDelete,
}) => {

  if (!isOpen || !equipment) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-5">

      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5">

          <h2 className="text-2xl font-bold text-red-400">

            Delete Equipment

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

          <div className="flex justify-center mb-6">

            <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center">

              <Trash2
                size={40}
                className="text-red-400"
              />

            </div>

          </div>

          <h3 className="text-xl font-semibold text-center">

            Are you sure?

          </h3>

          <p className="text-slate-400 text-center mt-3">

            You are about to delete

          </p>

          <p className="text-center mt-2 font-semibold text-orange-400">

            {equipment.name}

          </p>

          <p className="text-center text-slate-500">

            ({equipment.equipmentId})

          </p>

          <p className="text-center text-slate-500 mt-5">

            This action cannot be undone.

          </p>

        </div>

        {/* Footer */}

        <div className="flex justify-end gap-3 border-t border-slate-800 px-6 py-5">

          <button
            onClick={onClose}
            className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700"
          >

            Cancel

          </button>

          <button
            onClick={() => onDelete(equipment.id)}
            className="px-5 py-3 rounded-xl bg-red-500 hover:bg-red-600 font-semibold"
          >

            Delete

          </button>

        </div>

      </div>

    </div>
  );
};

export default DeleteEquipmentModal;