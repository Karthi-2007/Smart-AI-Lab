import { useState } from "react";
import { HashLink } from "react-router-hash-link";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);
  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm" style={{ borderColor: "#cc6926" }}>
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo — KCE Official Logo + SmartLab AI text */}
        <Link to="/" onClick={closeMenu} className="flex items-center gap-2">
          <img
            src="/images/kce/KCE-logo-color.png"
            alt="Karpagam College of Engineering"
            className="h-8 w-auto object-contain"
            onError={(e) => { e.target.style.display = "none"; }}
          />
          <div className="border-l pl-2" style={{ borderColor: "#cc6926" }}>
            <h1 className="text-base font-extrabold leading-none" style={{ color: "#0b2545" }}>
              SmartLab <span style={{ color: "#cc6926" }}>AI</span>
            </h1>
            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
              Lab Management System
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8 text-sm font-semibold" style={{ color: "#0b2545" }}>
          <HashLink smooth to="/#home" className="hover:text-[#cc6926] transition-colors duration-200">Home</HashLink>
          <HashLink smooth to="/#features" className="hover:text-[#cc6926] transition-colors duration-200">Features</HashLink>
          <HashLink smooth to="/#about" className="hover:text-[#cc6926] transition-colors duration-200">About</HashLink>
          <HashLink smooth to="/#departments" className="hover:text-[#cc6926] transition-colors duration-200">Labs</HashLink>
          <HashLink smooth to="/#contact" className="hover:text-[#cc6926] transition-colors duration-200">Contact</HashLink>
        </div>

        {/* Desktop Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          <NavLink
            to="/activate-account"
            className="px-5 py-2.5 rounded-lg border-2 font-bold text-sm transition-all duration-200 hover:text-white"
            style={{ borderColor: "#cc6926", color: "#cc6926" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#cc6926"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#cc6926"; }}
          >
            Activate Account
          </NavLink>
          <Link
            to="/login"
            className="px-5 py-2.5 rounded-lg text-white font-bold text-sm shadow-lg transition-all duration-200 hover:opacity-90"
            style={{ background: "#cc6926" }}
          >
            Login
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden p-2.5 rounded-lg border-2 transition"
          style={{ borderColor: "#cc6926", color: "#cc6926" }}
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b-2 px-6 py-6 space-y-5" style={{ borderColor: "#cc6926" }}>
          <div className="flex flex-col space-y-4 text-base font-semibold" style={{ color: "#0b2545" }}>
            <HashLink smooth to="/#home" onClick={closeMenu} className="hover:text-[#cc6926] transition py-1">Home</HashLink>
            <HashLink smooth to="/#features" onClick={closeMenu} className="hover:text-[#cc6926] transition py-1">Features</HashLink>
            <HashLink smooth to="/#about" onClick={closeMenu} className="hover:text-[#cc6926] transition py-1">About</HashLink>
            <HashLink smooth to="/#departments" onClick={closeMenu} className="hover:text-[#cc6926] transition py-1">Labs</HashLink>
            <HashLink smooth to="/#contact" onClick={closeMenu} className="hover:text-[#cc6926] transition py-1">Contact</HashLink>
          </div>
          <div className="pt-4 border-t flex flex-col gap-3" style={{ borderColor: "#e2e8f0" }}>
            <NavLink to="/activate-account" onClick={closeMenu}
              className="w-full text-center px-5 py-3 rounded-lg border-2 font-bold text-sm transition"
              style={{ borderColor: "#cc6926", color: "#cc6926" }}>
              Activate Account
            </NavLink>
            <Link to="/login" onClick={closeMenu}
              className="w-full text-center px-5 py-3 rounded-lg text-white font-bold text-sm"
              style={{ background: "#cc6926" }}>
              Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;