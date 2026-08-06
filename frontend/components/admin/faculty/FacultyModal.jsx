import { X } from "lucide-react";

const FacultyModal = ({
  isOpen,
  onClose,
  faculty,
}) => {

  if (!isOpen || !faculty) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-5">

      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl">

        <div className="flex justify-between items-center px-6 py-5 border-b border-slate-800">

          <h2 className="text-2xl font-bold">

            Faculty Details

          </h2>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-800"
          >

            <X />

          </button>

        </div>

        <div className="grid grid-cols-2 gap-6 p-6">

          <div>
            <p className="text-slate-400">Faculty ID</p>
            <p className="font-semibold mt-1">{faculty.facultyId}</p>
          </div>

          <div>
            <p className="text-slate-400">Name</p>
            <p className="font-semibold mt-1">{faculty.name}</p>
          </div>

          <div>
            <p className="text-slate-400">Department</p>
            <p className="font-semibold mt-1">{faculty.department}</p>
          </div>

          <div>
            <p className="text-slate-400">Designation</p>
            <p className="font-semibold mt-1">{faculty.designation}</p>
          </div>

          <div>
            <p className="text-slate-400">Email</p>
            <p className="font-semibold mt-1">{faculty.email}</p>
          </div>

          <div>
            <p className="text-slate-400">Phone</p>
            <p className="font-semibold mt-1">{faculty.phone}</p>
          </div>

          <div>
            <p className="text-slate-400">Specialization</p>
            <p className="font-semibold mt-1">{faculty.specialization}</p>
          </div>

          <div>
            <p className="text-slate-400">Laboratory</p>
            <p className="font-semibold mt-1">{faculty.lab}</p>
          </div>

          <div>
            <p className="text-slate-400">Status</p>

            <span
              className={`inline-block mt-1 px-3 py-1 rounded-full text-sm ${
                faculty.status === "Active"
                  ? "bg-green-500/20 text-green-400"
                  : faculty.status === "On Leave"
                  ? "bg-yellow-500/20 text-yellow-400"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {faculty.status}
            </span>

          </div>

        </div>

      </div>

    </div>
  );
};

export default FacultyModal;