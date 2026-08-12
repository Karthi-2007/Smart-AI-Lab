import React, { useState, useEffect } from 'react';
import { Eye, Pencil, Trash2, Loader2, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminService } from '../../../services/adminService';

const fallbackUrl = "https://images.unsplash.com/photo-1532187643603-ba119ca4109e?w=600&auto=format&fit=crop";

const EquipmentTable = ({ search = '', equipment = [], loading = false, onDeleteSuccess, onDetail, onEdit }) => {

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this equipment?')) {
      try {
        await adminService.deleteEquipment(id);
        toast.success('Equipment deleted successfully');
        if (onDeleteSuccess) onDeleteSuccess();
      } catch (error) {
        toast.error('Failed to delete equipment');
        console.error(error);
      }
    }
  };

  const filteredEquipment = equipment.filter(item => {
    const searchLower = search.toLowerCase();
    return (
      (item.name && item.name.toLowerCase().includes(searchLower)) ||
      (item.category && item.category.toLowerCase().includes(searchLower)) ||
      (item.serialNo && item.serialNo.toLowerCase().includes(searchLower))
    );
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 bg-slate-900 border border-slate-800 rounded-2xl">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (filteredEquipment.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-slate-900 border border-slate-800 rounded-2xl text-slate-400">
        <Package className="w-12 h-12 mb-4 opacity-20" />
        <p>No equipment found.</p>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const statusText = status || 'Available';
    let colors = 'bg-green-500/20 text-green-400';
    if (statusText === 'In Use' || statusText === 'Booked') colors = 'bg-blue-500/20 text-blue-400';
    else if (statusText === 'Faulty') colors = 'bg-red-500/20 text-red-400';
    else if (statusText === 'Under Maintenance' || statusText === 'Maintenance') colors = 'bg-orange-500/20 text-orange-400';

    return <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors}`}>{statusText}</span>;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead className="bg-slate-800">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">ID</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Category</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Lab</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Serial No</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Quantity</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filteredEquipment.map((item, idx) => {
              const eqId = item.equipmentId || item.id || item._id || idx;
              const labName = typeof item.laboratory === 'object'
                ? item.laboratory?.name
                : typeof item.lab === 'object'
                ? item.lab?.name
                : (item.laboratory || item.lab || 'N/A');

              return (
                <tr key={eqId} className="hover:bg-slate-800/50 transition">
                  <td className="px-6 py-4 text-sm text-slate-300">{item.code || `EQ-${eqId}`}</td>
                  <td className="px-6 py-4 text-sm text-white font-medium flex items-center gap-3">
                    <img
                      src={item.imageUrl || fallbackUrl}
                      onError={(e) => { e.target.src = fallbackUrl; }}
                      className="w-12 h-10 object-cover rounded-lg border border-slate-700 bg-slate-950/60"
                      alt={item.name}
                    />
                    <span>{item.name}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-300">{item.category || 'General'}</td>
                  <td className="px-6 py-4 text-sm text-slate-300">{labName}</td>
                  <td className="px-6 py-4 text-sm text-slate-300">{item.serialNo || '-'}</td>
                  <td className="px-6 py-4 text-sm text-slate-300">{item.quantity || 1}</td>
                  <td className="px-6 py-4">
                    {getStatusBadge(item.status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => onDetail && onDetail(item)}
                        className="text-slate-400 hover:text-blue-400 p-1 rounded-lg hover:bg-slate-800 transition"
                        title="View Details"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => onEdit && onEdit(item)}
                        className="text-slate-400 hover:text-orange-400 p-1 rounded-lg hover:bg-slate-800 transition"
                        title="Edit Equipment"
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button 
                        className="text-slate-400 hover:text-red-400 p-1 rounded-lg hover:bg-slate-800 transition"
                        onClick={() => handleDelete(eqId)}
                        title="Delete Equipment"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EquipmentTable;