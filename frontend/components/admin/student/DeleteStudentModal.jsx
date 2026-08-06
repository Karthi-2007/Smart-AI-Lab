import { Trash2 } from "lucide-react";

const DeleteStudentModal = ({
  isOpen,
  onClose,
  student,
  onDelete,
}) => {

  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-5">

      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md">

        <div className="p-6">

          <div className="flex justify-center">

            <div className="bg-red-500/20 p-5 rounded-full">

              <Trash2
                size={40}
                className="text-red-500"
              />

            </div>

          </div>

          <h2 className="text-2xl font-bold text-center mt-5">

            Delete Student

          </h2>

          <p className="text-slate-400 text-center mt-3">

            Are you sure you want to delete

            <span className="text-white font-semibold">

              {" "}
              {student.name}

            </span>

            ?

          </p>

          <div className="flex gap-4 mt-8">

            <button
              onClick={onClose}
              className="flex-1 bg-slate-800 hover:bg-slate-700 py-3 rounded-xl"
            >

              Cancel

            </button>

            <button
              onClick={() => onDelete(student.id)}
              className="flex-1 bg-red-500 hover:bg-red-600 py-3 rounded-xl"
            >

              Delete

            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default DeleteStudentModal;