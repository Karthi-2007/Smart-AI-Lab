import { X } from "lucide-react";

const EquipmentModal = ({
  isOpen,
  onClose,
  equipment,
}) => {

  if (!isOpen || !equipment) return null;

  const fallbackUrl = "https://images.unsplash.com/photo-1532187643603-ba119ca4109e?w=600&auto=format&fit=crop";

  const labName = typeof equipment.laboratory === 'object'
    ? equipment.laboratory?.name
    : (equipment.laboratory || 'N/A');

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-5 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
          <h2 className="text-2xl font-bold">
            Equipment Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-800"
          >
            <X />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 grid md:grid-cols-3 gap-6">
          {/* Left Column: Details */}
          <div className="md:col-span-2 grid grid-cols-2 gap-6">
            <div>
              <p className="text-slate-400 text-xs">Equipment ID</p>
              <p className="font-semibold text-white mt-1">#{equipment.equipmentId}</p>
            </div>

            <div>
              <p className="text-slate-400 text-xs">Equipment Name</p>
              <p className="font-semibold text-white mt-1">{equipment.name}</p>
            </div>

            <div>
              <p className="text-slate-400 text-xs">Category</p>
              <p className="text-slate-300 mt-1">{equipment.category || 'General'}</p>
            </div>

            <div>
              <p className="text-slate-400 text-xs">Laboratory</p>
              <p className="text-slate-300 mt-1">{labName}</p>
            </div>

            <div>
              <p className="text-slate-400 text-xs">Brand</p>
              <p className="text-slate-300 mt-1">{equipment.brand || '-'}</p>
            </div>

            <div>
              <p className="text-slate-400 text-xs">Model</p>
              <p className="text-slate-300 mt-1">{equipment.model || '-'}</p>
            </div>

            <div>
              <p className="text-slate-400 text-xs">Serial Number</p>
              <p className="text-slate-300 mt-1">{equipment.serialNo || equipment.assetId || '-'}</p>
            </div>

            <div>
              <p className="text-slate-400 text-xs">Purchase Date</p>
              <p className="text-slate-300 mt-1">{equipment.purchaseDate || '-'}</p>
            </div>

            <div className="col-span-2">
              <p className="text-slate-400 text-xs">Description</p>
              <p className="text-slate-300 mt-1">{equipment.description || 'No description available'}</p>
            </div>
          </div>

          {/* Right Column: Image */}
          <div className="flex flex-col items-center justify-center p-4 bg-slate-950 border border-slate-800 rounded-xl max-h-72">
            <p className="text-slate-400 text-xs mb-3 font-semibold uppercase tracking-wider">Equipment Image</p>
            <div className="w-full h-48 rounded-lg overflow-hidden border border-slate-800 bg-slate-900/60">
              <img
                src={equipment.imageUrl || fallbackUrl}
                onError={(e) => { e.target.src = fallbackUrl; }}
                className="w-full h-full object-cover"
                alt={equipment.name}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentModal;