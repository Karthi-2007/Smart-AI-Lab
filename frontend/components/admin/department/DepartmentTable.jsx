import React, { useState, useEffect, useMemo } from 'react';
import { Loader2, Building2, Edit, Trash2 } from 'lucide-react';
import { adminService } from '../../../services/adminService';
import toast from 'react-hot-toast';
import Pagination from '../../common/Pagination';

const DepartmentTable = ({
  search,
  selectedStatus = "Status",
  onDepartmentsLoaded,
  onEdit
}) => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    setCurrentPage(1);
    fetchDepartments();
  }, [selectedStatus]);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      let res;
      if (selectedStatus === 'ACTIVE') {
        res = await adminService.getDepartmentsActive();
      } else if (selectedStatus === 'INACTIVE') {
        res = await adminService.getDepartmentsInactive();
      } else {
        res = await adminService.getDepartmentsAll();
      }
      const body = res?.data || res;
      let list = [];
      if (body) {
        if (body.success && body.data) {
          list = body.data;
        } else {
          list = body;
        }
      }
      const dataArray = Array.isArray(list) ? list : [];
      setDepartments(dataArray);
      if (onDepartmentsLoaded) onDepartmentsLoaded(dataArray);
    } catch (error) {
      toast.error('Failed to load departments');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this department?')) return;
    try {
      await adminService.deleteDepartment(id);
      toast.success('Department deleted successfully');
      fetchDepartments();
    } catch (error) {
      toast.error('Failed to delete department');
    }
  };

  const getStatusBadge = (status) => {
    const s = status?.toUpperCase();
    if (s === 'ACTIVE') return <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">Active</span>;
    if (s === 'INACTIVE') return <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400">Inactive</span>;
    return <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-500/20 text-slate-400">{status}</span>;
  };

  const filteredDepartments = useMemo(() => {
    return departments.filter(d => {
      // 1. Search Query filter
      if (search) {
        const s = search.toLowerCase();
        const matchesSearch = (
          (d.name && d.name.toLowerCase().includes(s)) ||
          (d.code && d.code.toLowerCase().includes(s)) ||
          (d.hod && d.hod.toLowerCase().includes(s))
        );
        if (!matchesSearch) return false;
      }

      // 2. Status filter
      if (selectedStatus && selectedStatus !== "Status") {
        const status = d.status?.toLowerCase() || "";
        const target = selectedStatus.toLowerCase();
        if (status !== target) return false;
      }

      return true;
    });
  }, [departments, search, selectedStatus]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 bg-slate-900 border border-slate-800 rounded-2xl">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  if (departments.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center py-20 bg-slate-900 border border-slate-800 rounded-2xl">
        <Building2 className="w-12 h-12 text-slate-500 mb-4" />
        <h3 className="text-xl font-medium text-white mb-2">No Departments Found</h3>
        <p className="text-slate-400">Start by adding a new department.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-left text-sm text-slate-300">
          <thead className="bg-slate-800 text-slate-400 border-b border-slate-700">
            <tr>
              <th className="px-6 py-4 font-medium">Code</th>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">HOD</th>
              <th className="px-6 py-4 font-medium">Faculty Count</th>
              <th className="px-6 py-4 font-medium">Student Count</th>
              <th className="px-6 py-4 font-medium">Labs</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filteredDepartments.length > 0 ? (
              filteredDepartments
                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                .map((d, idx) => {
                  const deptId = d.departmentId || d.id || idx;
                  return (
                    <tr key={deptId} className="hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-white">{d.code || `DEPT-${deptId}`}</td>
                      <td className="px-6 py-4">{d.name}</td>
                      <td className="px-6 py-4">{d.hod || '-'}</td>
                      <td className="px-6 py-4">{d.facultyCount || 0}</td>
                      <td className="px-6 py-4">{d.studentCount || 0}</td>
                      <td className="px-6 py-4">{d.labCount || 0}</td>
                      <td className="px-6 py-4">{getStatusBadge(d.status || 'ACTIVE')}</td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-3">
                          <button onClick={() => onEdit && onEdit(d)} className="p-2 text-slate-400 hover:text-orange-500 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(deptId)} className="p-2 text-slate-400 hover:text-red-500 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
            ) : (
              <tr>
                <td colSpan="8" className="px-6 py-8 text-center text-slate-400">
                  No departments match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalItems={filteredDepartments.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default DepartmentTable;