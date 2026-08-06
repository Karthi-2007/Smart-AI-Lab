import React, { useState, useEffect } from 'react';
import { Loader2, Users, Edit, Trash2 } from 'lucide-react';
import { adminService } from '../../../services/adminService';
import toast from 'react-hot-toast';

const FacultyTable = ({ search, faculty = [], loading = false, onEdit, onDeleteSuccess }) => {

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this faculty member?')) return;
    try {
      await adminService.deleteFaculty(id);
      toast.success('Faculty deleted successfully');
      if (onDeleteSuccess) onDeleteSuccess();
    } catch (error) {
      toast.error('Failed to delete faculty');
    }
  };

  const getStatusBadge = (status) => {
    const s = status?.toUpperCase();
    if (s === 'ACTIVE') return <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">Active</span>;
    if (s === 'INACTIVE') return <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400">Inactive</span>;
    return <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-500/20 text-slate-400">{status}</span>;
  };

  const filteredFaculty = faculty.filter(f => {
    const s = search.toLowerCase();
    return (
      (f.name && f.name.toLowerCase().includes(s)) ||
      (f.facultyId && f.facultyId.toLowerCase().includes(s)) ||
      (f.email && f.email.toLowerCase().includes(s)) ||
      (f.department && f.department.toLowerCase().includes(s))
    );
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 bg-slate-900 border border-slate-800 rounded-2xl">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  if (faculty.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center py-20 bg-slate-900 border border-slate-800 rounded-2xl">
        <Users className="w-12 h-12 text-slate-500 mb-4" />
        <h3 className="text-xl font-medium text-white mb-2">No Faculty Found</h3>
        <p className="text-slate-400">Start by adding a new faculty member.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] text-left text-sm text-slate-300">
          <thead className="bg-slate-800 text-slate-400 border-b border-slate-700">
            <tr>
              <th className="px-6 py-4 font-medium">Faculty ID</th>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Department</th>
              <th className="px-6 py-4 font-medium">Designation</th>
              <th className="px-6 py-4 font-medium">Lab</th>
              <th className="px-6 py-4 font-medium">Email</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filteredFaculty.length > 0 ? (
              filteredFaculty.map((f) => (
                <tr key={f.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">{f.facultyId}</td>
                  <td className="px-6 py-4 font-medium text-white">{f.name}</td>
                  <td className="px-6 py-4">{f.department}</td>
                  <td className="px-6 py-4">{f.designation}</td>
                  <td className="px-6 py-4">{f.lab || '-'}</td>
                  <td className="px-6 py-4">{f.email}</td>
                  <td className="px-6 py-4">{getStatusBadge(f.status || 'ACTIVE')}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-3">
                      <button onClick={() => onEdit && onEdit(f)} className="p-2 text-slate-400 hover:text-orange-500 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(f.id)} className="p-2 text-slate-400 hover:text-red-500 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="px-6 py-8 text-center text-slate-400">
                  No faculty match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FacultyTable;