import { X, Mail, GraduationCap, Calendar, CircleUser } from "lucide-react";

const StudentModal = ({ isOpen, onClose, student }) => {
  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-5">

      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl">

        {/* Header */}

        <div className="flex items-center justify-between p-6 border-b border-slate-800">

          <h2 className="text-2xl font-bold">

            Student Details

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

          <div className="flex flex-col md:flex-row gap-6 items-center">

            <div className="w-28 h-28 rounded-full bg-orange-500 flex items-center justify-center">

              <CircleUser size={70} />

            </div>

            <div>

              <h3 className="text-2xl font-bold">

                {student.name}

              </h3>

              <p className="text-slate-400 mt-2">

                {student.registerNo}

              </p>

              <span
                className={`inline-block mt-3 px-3 py-1 rounded-full ${
                  student.status === "Activated"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-orange-500/20 text-orange-400"
                }`}
              >
                {student.status}
              </span>

            </div>

          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-10">

            <div className="flex gap-3">

              <GraduationCap className="text-orange-500" />

              <div>

                <p className="text-slate-400">

                  Department

                </p>

                <h4>{student.department}</h4>

              </div>

            </div>

            <div className="flex gap-3">

              <Calendar className="text-orange-500" />

              <div>

                <p className="text-slate-400">

                  Year

                </p>

                <h4>{student.year}</h4>

              </div>

            </div>

            <div className="flex gap-3">

              <CircleUser className="text-orange-500" />

              <div>

                <p className="text-slate-400">

                  Section

                </p>

                <h4>{student.section}</h4>

              </div>

            </div>

            <div className="flex gap-3">

              <Mail className="text-orange-500" />

              <div>

                <p className="text-slate-400">

                  Email

                </p>

                <h4>{student.email}</h4>

              </div>

            </div>

          </div>

          <div className="mt-10 flex justify-end">

            <button
              onClick={onClose}
              className="px-6 py-3 bg-orange-500 rounded-xl hover:bg-orange-600"
            >
              Close
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default StudentModal;