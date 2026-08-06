import React from "react";
import { Globe, MapPin, Phone, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 mt-20 text-slate-400">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-6 space-y-4">
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <span className="w-2.5 h-6 bg-orange-500 rounded-full"></span>
            SmartLab AI
          </h2>
          <p className="text-slate-400 text-sm max-w-md leading-relaxed">
            AI-Powered Laboratory Equipment Booking & Predictive Maintenance Management Platform.
          </p>
          <div className="flex items-center gap-2 text-xs text-orange-400 font-semibold pt-1">
            <Globe className="w-4 h-4" />
            <a href="https://kce.ac.in/" target="_blank" rel="noopener noreferrer" className="hover:underline">
              Official Website: https://kce.ac.in/
            </a>
          </div>
        </div>

        <div className="md:col-span-6 space-y-3 text-xs">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Karpagam College of Engineering</h3>
          <p className="text-slate-400 flex items-start gap-2">
            <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
            <span>Myleripalayam Road, Othakkalmandapam Post, Coimbatore - 641 032, Tamil Nadu, India.</span>
          </p>
          <p className="text-slate-400 flex items-center gap-2">
            <Phone className="w-4 h-4 text-orange-400 shrink-0" />
            <span>+91 - 422 2619005 (TNEA Code: 2710)</span>
          </p>
          <p className="text-slate-400 flex items-center gap-2">
            <Mail className="w-4 h-4 text-orange-400 shrink-0" />
            <a href="mailto:smartlab.college.auth@gmail.com" className="text-orange-400 hover:underline">
              smartlab.college.auth@gmail.com
            </a>
          </p>
        </div>
      </div>

      <div className="border-t border-slate-900 bg-slate-950/80 py-4 text-center text-xs text-slate-500">
        © 2026 SmartLab AI | Designed & Developed for Karpagam College of Engineering (NAAC 'A+' Autonomous Institution)
      </div>
    </footer>
  );
};

export default Footer;