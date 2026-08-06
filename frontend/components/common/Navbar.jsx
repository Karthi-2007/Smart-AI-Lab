import { useState } from "react";
import { HashLink } from "react-router-hash-link";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/90 border-b border-slate-800">
      <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" onClick={closeMenu} className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-orange-500/30">
            SL
          </div>

          <div>
            <h1 className="text-xl font-bold text-white">
              SmartLab
              <span className="text-orange-500"> AI</span>
            </h1>

            <p className="text-xs text-slate-400">
              Karpagam College of Engineering
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-300">
          <HashLink smooth to="/#home" className="hover:text-orange-400 transition duration-300">
            Home
          </HashLink>

          <HashLink smooth to="/#features" className="hover:text-orange-400 transition duration-300">
            Features
          </HashLink>

          <HashLink smooth to="/#about" className="hover:text-orange-400 transition duration-300">
            About
          </HashLink>

          <HashLink smooth to="/#contact" className="hover:text-orange-400 transition duration-300">
            Contact
          </HashLink>
        </div>

        {/* Desktop Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          <NavLink
            to="/activate-account"
            className="px-5 py-2.5 rounded-xl border border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white transition duration-300 text-sm font-semibold"
          >
            Activate Account
          </NavLink>

          <Link
            to="/login"
            className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 transition duration-300 text-white font-semibold text-sm shadow-lg shadow-orange-500/30"
          >
            Login
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden p-2.5 text-slate-300 hover:text-white rounded-xl bg-slate-800 hover:bg-slate-700 transition"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-6 py-6 space-y-5 animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-4 text-base font-semibold text-slate-200">
            <HashLink smooth to="/#home" onClick={closeMenu} className="hover:text-orange-400 transition py-1">
              Home
            </HashLink>

            <HashLink smooth to="/#features" onClick={closeMenu} className="hover:text-orange-400 transition py-1">
              Features
            </HashLink>

            <HashLink smooth to="/#about" onClick={closeMenu} className="hover:text-orange-400 transition py-1">
              About
            </HashLink>

            <HashLink smooth to="/#contact" onClick={closeMenu} className="hover:text-orange-400 transition py-1">
              Contact
            </HashLink>
          </div>

          <div className="pt-4 border-t border-slate-800 flex flex-col gap-3">
            <NavLink
              to="/activate-account"
              onClick={closeMenu}
              className="w-full text-center px-5 py-3 rounded-xl border border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white transition text-sm font-semibold"
            >
              Activate Account
            </NavLink>

            <Link
              to="/login"
              onClick={closeMenu}
              className="w-full text-center px-5 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white transition text-sm font-semibold shadow-lg shadow-orange-500/30"
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;