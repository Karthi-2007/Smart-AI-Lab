import React from "react";
import { Globe, MapPin, Phone, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer style={{ background: "#0b2545", color: "#e2e8f0" }}>
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Brand */}
        <div className="md:col-span-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-white px-2.5 py-1.5 rounded-xl inline-block shadow-md">
              <img
                src="/images/kce/KCE-logo-color.png"
                alt="KCE Logo"
                className="h-7 w-auto object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://kce.ac.in/images/kce/logo/KCE-logo-color.png";
                }}
              />
            </div>
            <div className="border-l-2 pl-3" style={{ borderColor: "#cc6926" }}>
              <h2 className="text-xl font-extrabold text-white">
                SmartLab <span style={{ color: "#cc6926" }}>AI</span>
              </h2>
              <p className="text-xs text-slate-400 uppercase tracking-wider">Lab Management System</p>
            </div>
          </div>
          <p className="text-slate-400 text-sm max-w-md leading-relaxed">
            AI-Powered Laboratory Equipment Booking & Predictive Maintenance Platform for Karpagam College of Engineering.
          </p>
          <a
            href="https://kce.ac.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-semibold hover:underline"
            style={{ color: "#cc6926" }}
          >
            <Globe className="w-4 h-4" /> https://kce.ac.in/
          </a>
        </div>

        {/* Contact */}
        <div className="md:col-span-6 space-y-3 text-xs">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2" style={{ color: "#cc6926" }}>
            Karpagam College of Engineering
          </h3>
          <p className="text-slate-400 flex items-start gap-2">
            <MapPin className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#cc6926" }} />
            Myleripalayam Road, Othakkalmandapam Post, Coimbatore - 641 032, Tamil Nadu, India.
          </p>
          <p className="text-slate-400 flex items-center gap-2">
            <Phone className="w-4 h-4 shrink-0" style={{ color: "#cc6926" }} />
            +91 - 422 2619005 &nbsp;|&nbsp; TNEA Code: 2710
          </p>
          <p className="text-slate-400 flex items-center gap-2">
            <Mail className="w-4 h-4 shrink-0" style={{ color: "#cc6926" }} />
            <a href="mailto:smartlab.college.auth@gmail.com" style={{ color: "#cc6926" }} className="hover:underline">
              smartlab.college.auth@gmail.com
            </a>
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t py-4 text-center text-xs text-slate-400" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        © 2026 SmartLab AI &nbsp;|&nbsp; Karpagam College of Engineering (NAAC 'A+' Autonomous Institution) &nbsp;|&nbsp; TNEA Code: 2710
      </div>
    </footer>
  );
};

export default Footer;