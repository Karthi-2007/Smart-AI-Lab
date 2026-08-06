import React from "react";
import { ExternalLink, Award, MapPin } from "lucide-react";

const campusImages = [
  {
    src: "/images/kce/banner-img2.webp",
    label: "Engineering Campus",
  },
  {
    src: "/images/kce/banner-img3.webp",
    label: "Research Facilities",
  },
  {
    src: "/images/kce/banner-img5.webp",
    label: "Innovation Centre",
  },
];

const KCECampusSection = () => {
  return (
    <section className="bg-slate-950 py-14 px-6 relative overflow-hidden">
      {/* Subtle bg glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-1">
              Our Institution
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Karpagam College of Engineering
            </h2>
            <p className="text-slate-400 text-sm mt-1 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-400 shrink-0" />
              Othakkalmandapam, Coimbatore - 641 032, Tamil Nadu
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1.5 bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" /> NAAC A+
            </span>
            <span className="px-3 py-1.5 bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold rounded-full">
              TNEA Code: 2710
            </span>
            <a
              href="https://kce.ac.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-full flex items-center gap-1.5 transition"
            >
              Visit Website <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Campus Photo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {campusImages.map((img, i) => (
            <div
              key={i}
              className="relative group overflow-hidden rounded-2xl border border-slate-800 hover:border-orange-500/50 transition-all duration-500"
            >
              <img
                src={img.src}
                alt={img.label}
                className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://www.kce.ac.in/images/kce/home/banner/" + img.src.split('/').pop();
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <span className="text-white font-semibold text-sm">{img.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KCECampusSection;
