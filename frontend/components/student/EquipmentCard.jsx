import React, { useState, useEffect } from "react";
import { Package, Eye, CalendarPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1532187643603-ba119ca4109e?w=600&auto=format&fit=crop";

const EquipmentCard = ({ equipment }) => {
  const navigate = useNavigate();
  const eqId = equipment.equipmentId || equipment.id || equipment._id;
  const isAvailable = (equipment.status || '').toLowerCase() === 'available';

  const [imgSrc, setImgSrc] = useState(equipment.imageUrl || FALLBACK_IMAGE);
  const [imgLoading, setImgLoading] = useState(true);

  useEffect(() => {
    setImgSrc(equipment.imageUrl || FALLBACK_IMAGE);
    setImgLoading(true);
  }, [equipment.imageUrl]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all flex flex-col justify-between h-full">
      <div>
        {/* Equipment Image */}
        <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-950 mb-4 border border-slate-800/80">
          {imgLoading && (
            <div className="absolute inset-0 bg-slate-800/60 animate-pulse flex items-center justify-center">
              <Package size={24} className="text-slate-600 animate-bounce" />
            </div>
          )}
          <img
            src={imgSrc}
            onLoad={() => setImgLoading(false)}
            onError={() => {
              setImgSrc(FALLBACK_IMAGE);
              setImgLoading(false);
            }}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            alt={equipment.name}
          />
        </div>

        <div className="flex justify-between items-start gap-3">
          <div>
            <h2 className="text-lg font-bold text-white line-clamp-1" title={equipment.name}>
              {equipment.name}
            </h2>
            <p className="text-slate-400 text-xs mt-1">
              {equipment.laboratory?.name || equipment.labName || equipment.lab || 'General Lab'}
            </p>
          </div>
          <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500 shrink-0">
            <Package size={18} />
          </div>
        </div>

        <div className="mt-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold border inline-block ${
              isAvailable
                ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20"
                : "bg-rose-500/15 text-rose-400 border-rose-500/20"
            }`}
          >
            {equipment.status || 'Available'}
          </span>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={() => navigate(`/student/equipment?id=${eqId}`)}
          className="flex-1 bg-slate-800 hover:bg-slate-700 py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm text-slate-300 transition-colors"
        >
          <Eye size={16} />
          Details
        </button>

        <button
          onClick={() => navigate(`/student/book-equipment?equipmentId=${eqId}`)}
          disabled={!isAvailable}
          className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-all ${
            isAvailable
              ? "bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20"
              : "bg-slate-800 text-slate-500 cursor-not-allowed"
          }`}
        >
          <CalendarPlus size={16} />
          {isAvailable ? 'Book' : 'Unavailable'}
        </button>
      </div>
    </div>
  );
};

export default EquipmentCard;