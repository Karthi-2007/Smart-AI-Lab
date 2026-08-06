const AuthLayout = ({ children, banner }) => {
  return (
    <section className="min-h-screen bg-slate-950 flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-7xl grid lg:grid-cols-2 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">

        {/* Left Side */}
        <div className="hidden lg:block">
          {banner}
        </div>

        {/* Right Side */}
        <div className="bg-slate-900 p-8 lg:p-14 flex items-center">
          <div className="w-full">
            {children}
          </div>
        </div>

      </div>
    </section>
  );
};

export default AuthLayout;