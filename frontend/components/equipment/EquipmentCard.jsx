import React, { useState, useEffect } from 'react';
import Badge from '../ui/Badge';
import PrimaryButton from '../ui/PrimaryButton';
import { Server, Package } from 'lucide-react';

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1532187643603-ba119ca4109e?w=600&auto=format&fit=crop";

const EquipmentCard = ({ equipment, onBook }) => {
  const item = equipment || {
    id: 1,
    name: 'GPU Server Alpha (NVIDIA A100)',
    category: 'High Performance Computing',
    status: 'Available',
    location: 'Deep Learning Lab',
    imageUrl: ''
  };

  const [imgSrc, setImgSrc] = useState(item.imageUrl || FALLBACK_IMAGE);
  const [imgLoading, setImgLoading] = useState(true);

  useEffect(() => {
    setImgSrc(item.imageUrl || FALLBACK_IMAGE);
    setImgLoading(true);
  }, [item.imageUrl]);

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition flex flex-col justify-between h-full">
      <div>
        {/* Equipment Image */}
        <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-950 mb-4 border border-slate-800/80">
          {imgLoading && (
            <div className="absolute inset-0 bg-slate-800/60 animate-pulse flex items-center justify-center">
              <Package size={20} className="text-slate-600 animate-bounce" />
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
            alt={item.name}
          />
        </div>

        <div className="flex justify-between items-start mb-3">
          <div className="p-2 bg-slate-800/60 rounded-xl text-cyan-400">
            <Server className="w-4 h-4" />
          </div>
          <Badge variant={item.status === 'Available' ? 'success' : 'warning'}>{item.status}</Badge>
        </div>
        <h3 className="text-md font-semibold text-white mb-1 line-clamp-1" title={item.name}>{item.name}</h3>
        <p className="text-xs text-slate-400 mb-2">{item.location}</p>
        <span className="inline-block text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300 mb-4">
          {item.category}
        </span>
      </div>
      <PrimaryButton onClick={() => onBook && onBook(item)}>
        Book Equipment
      </PrimaryButton>
    </div>
  );
};

export default EquipmentCard;
