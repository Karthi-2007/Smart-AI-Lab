import React, { useState, useEffect } from 'react';
import Badge from '../ui/Badge';
import { Cpu, HardDrive, Zap, Info, Package } from 'lucide-react';

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1532187643603-ba119ca4109e?w=600&auto=format&fit=crop";

const EquipmentDetailsCard = ({ equipment }) => {
  const item = equipment || {
    name: 'GPU Server Alpha (NVIDIA A100)',
    status: 'Available',
    lab: 'Deep Learning & Neural Networks Lab',
    specs: '8x NVIDIA A100 80GB PCIe, 512GB RAM, 10TB NVMe RAID',
    imageUrl: ''
  };

  const [imgSrc, setImgSrc] = useState(item.imageUrl || FALLBACK_IMAGE);
  const [imgLoading, setImgLoading] = useState(true);

  useEffect(() => {
    setImgSrc(item.imageUrl || FALLBACK_IMAGE);
    setImgLoading(true);
  }, [item.imageUrl]);

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 space-y-4 h-full flex flex-col justify-between">
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
            alt={item.name}
          />
        </div>

        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold text-white line-clamp-1" title={item.name}>{item.name}</h2>
          <Badge variant={item.status === 'Available' ? 'success' : 'warning'}>{item.status}</Badge>
        </div>
        <p className="text-sm text-slate-400">{item.lab || (item.laboratory?.name)}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs pt-4 border-t border-slate-800">
        <div className="flex items-center space-x-2 text-slate-300">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span className="line-clamp-1">{item.category || 'HPC / Compute'}</span>
        </div>
        <div className="flex items-center space-x-2 text-slate-300">
          <HardDrive className="w-4 h-4 text-cyan-400" />
          <span>{item.assetId || 'N/A'}</span>
        </div>
      </div>
    </div>
  );
};

export default EquipmentDetailsCard;
