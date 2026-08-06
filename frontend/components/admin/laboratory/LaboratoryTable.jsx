import React, { useState, useEffect } from 'react';
import { Eye, Pencil, Trash2, Loader2, FlaskConical } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminService } from '../../../services/adminService';

const LaboratoryTable = ({ search = '', onLabsLoaded, onDetail, onEdit }) => {
  const [laboratories, setLaboratories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLaboratories = async () => {
    try {
      setLoading(true);
      const res = await adminService.getLaboratories();
      const list = res?.data || res || [];
      const dataArray = Array.isArray(list) ? list : [];
      setLaboratories(dataArray);
      if (onLabsLoaded) {
        onLabsLoaded(dataArray);
      }
    } catch (error) {
      toast.error('Failed to fetch laboratories');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLaboratories();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this laboratory?')) {
      try {
        await adminService.deleteLaboratory(id);
        toast.success('Laboratory deleted successfully');
        fetchLaboratories();
      } catch (error) {
        toast.error('Failed to delete laboratory');
        console.error(error);
      }
    }
  };

  const filteredLabs = laboratories.filter(lab => {
    const searchLower = search.toLowerCase();
    return (
      (lab.name && lab.name.toLowerCase().includes(searchLower)) ||
      (lab.code && lab.code.toLowerCase().includes(searchLower)) ||
      (lab.department && lab.department.toLowerCase().includes(searchLower))
    );
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 bg-slate-900 border border-slate-800 rounded-2xl">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (filteredLabs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-slate-900 border border-slate-800 rounded-2xl text-slate-400">
        <FlaskConical className="w-12 h-12 mb-4 opacity-20" />
        <p>No laboratories found.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead className="bg-slate-800">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Lab ID</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Department</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Capacity</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Equipment Count</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filteredLabs.map((lab, idx) => {
              const lId = lab.labId || lab.id || lab._id || idx;
              const deptName = typeof lab.department === 'object' ? lab.department?.name : (lab.department || 'N/A');
              const labCode = lab.code || `LAB-${lId}`;

              return (
                <tr key={lId} className="hover:bg-slate-800/50 transition">
                  <td className="px-6 py-4 text-sm text-slate-300">{labCode}</td>
                  <td className="px-6 py-4 text-sm text-white font-medium">{lab.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-300">{deptName}</td>
                  <td className="px-6 py-4 text-sm text-slate-300">{lab.capacity || 30}</td>
                  <td className="px-6 py-4 text-sm text-slate-300">{lab.equipmentCount || 0}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      (lab.status === 'Active' || lab.status === 'ACTIVE')
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {lab.status || 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => onDetail && onDetail(lab)}
                        className="text-slate-400 hover:text-blue-400 p-1 rounded-lg hover:bg-slate-800 transition" 
                        title="View Details"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => onEdit && onEdit(lab)}
                        className="text-slate-400 hover:text-orange-400 p-1 rounded-lg hover:bg-slate-800 transition" 
                        title="Edit Laboratory"
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button 
                        className="text-slate-400 hover:text-red-400 p-1 rounded-lg hover:bg-slate-800 transition"
                        onClick={() => handleDelete(lId)}
                        title="Delete Laboratory"
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

export default LaboratoryTable;