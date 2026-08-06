import { Trash2, X } from "lucide-react";

const DeleteDepartmentModal = ({
  isOpen,
  onClose,
  department,
  onDelete,
}) => {

  if (!isOpen || !department) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">

      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md">

        <div className="flex justify-between items-center px-6 py-5 border-b border-slate-800">

          <h2 className="text-2xl font-bold text-red-400">

            Delete Department

          </h2>

          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg"
          >
            <X />
          </button>

        </div>

        <div className="p-6 text-center">

          <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-5">

            <Trash2
              size={40}
              className="text-red-400"
            />

          </div>

          <p>

            Delete

          </p>

          <h3 className="text-xl font-bold mt-2">

            {department.name}

          </h3>

          <p className="text-slate-400 mt-2">

            This action cannot be undone.

          </p>

        </div>

        <div className="flex justify-end gap-3 p-5 border-t border-slate-800">

          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 px-5 py-3 rounded-xl"
          >
            Cancel
          </button>

          <button
            onClick={() => onDelete(department.id)}
            className="bg-red-500 hover:bg-red-600 px-5 py-3 rounded-xl font-semibold"
          >
            Delete
          </button>

        </div>

      </div>

    </div>
  );
};

export default DeleteDepartmentModal;