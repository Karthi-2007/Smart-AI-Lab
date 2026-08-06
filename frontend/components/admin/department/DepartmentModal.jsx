import { X } from "lucide-react";

const DepartmentModal = ({
  isOpen,
  onClose,
  department,
}) => {

  if (!isOpen || !department) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-5">

      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl">

        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">

          <h2 className="text-2xl font-bold">

            Department Details

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
            <p className="text-slate-400">Department Code</p>
            <p className="font-semibold">{department.code}</p>
          </div>

          <div>
            <p className="text-slate-400">Department Name</p>
            <p className="font-semibold">{department.name}</p>
          </div>

          <div>
            <p className="text-slate-400">Head of Department</p>
            <p className="font-semibold">{department.hod}</p>
          </div>

          <div>
            <p className="text-slate-400">Faculty Members</p>
            <p className="font-semibold">{department.faculty}</p>
          </div>

          <div>
            <p className="text-slate-400">Students</p>
            <p className="font-semibold">{department.students}</p>
          </div>

          <div>
            <p className="text-slate-400">Laboratories</p>
            <p className="font-semibold">{department.laboratories}</p>
          </div>

          <div>
            <p className="text-slate-400">Equipment</p>
            <p className="font-semibold">{department.equipment}</p>
          </div>

          <div>
            <p className="text-slate-400">Status</p>

            <span
              className={`px-3 py-1 rounded-full text-sm ${
                department.status === "Active"
                  ? "bg-green-500/20 text-green-400"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {department.status}
            </span>

          </div>

        </div>

      </div>

    </div>
  );
};

export default DepartmentModal;