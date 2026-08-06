import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import EquipmentCard from "../../components/student/EquipmentCard";
import { studentService } from "../../services/studentService";
import { toast } from 'react-hot-toast';
import { Search } from 'lucide-react';

const Equipment = () => {
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchFromUrl = searchParams.get('search') || '';
  const [filterText, setFilterText] = useState(searchFromUrl);

  useEffect(() => {
    setFilterText(searchFromUrl);
  }, [searchFromUrl]);

  useEffect(() => {
    const fetchEquipments = async () => {
      try {
        setLoading(true);
        const res = await studentService.getEquipmentList();
        const data = res?.data || res || [];
        setEquipments(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching equipments:', error);
        toast.error('Failed to load equipment list');
      } finally {
        setLoading(false);
      }
    };

    fetchEquipments();
  }, []);

  const filteredEquipments = equipments.filter((eq) => {
    if (!filterText) return true;
    const term = filterText.toLowerCase();
    const nameMatch = (eq.name || eq.equipmentName || '').toLowerCase().includes(term);
    const labMatch = (eq.labName || eq.laboratory?.name || '').toLowerCase().includes(term);
    const statusMatch = (eq.status || '').toLowerCase().includes(term);
    return nameMatch || labMatch || statusMatch;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold">
            Laboratory Equipment
          </h1>
          <p className="text-slate-400 mt-2">
            Browse and book available laboratory equipment.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Filter equipment..."
            value={filterText}
            onChange={(e) => {
              setFilterText(e.target.value);
              setSearchParams(e.target.value ? { search: e.target.value } : {});
            }}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:border-orange-500 text-sm"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredEquipments.map((equipment, index) => (
            <EquipmentCard
              key={equipment.equipmentId || equipment.id || equipment._id || index}
              equipment={equipment}
            />
          ))}
          {filteredEquipments.length === 0 && (
            <div className="col-span-full text-center text-slate-400 py-12 bg-slate-900/50 rounded-2xl border border-slate-800">
              No matching equipment found for "{filterText}".
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Equipment;