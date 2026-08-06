const StudentPagination = () => {
  return (
    <div className="flex justify-between items-center">

      <p className="text-slate-400">

        Showing 1-10 of 1250 Students

      </p>

      <div className="flex gap-2">

        <button className="px-4 py-2 bg-slate-800 rounded-lg">

          Previous

        </button>

        <button className="px-4 py-2 bg-orange-500 rounded-lg">

          1

        </button>

        <button className="px-4 py-2 bg-slate-800 rounded-lg">

          2

        </button>

        <button className="px-4 py-2 bg-slate-800 rounded-lg">

          3

        </button>

        <button className="px-4 py-2 bg-slate-800 rounded-lg">

          Next

        </button>

      </div>

    </div>
  );
};

export default StudentPagination;