import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Info, Package, AlertCircle, Clock, Wrench } from 'lucide-react';
import toast from 'react-hot-toast';
import { studentService } from '../../services/studentService';

const EquipmentDetails = () => {
  const [equipmentList, setEquipmentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const query = params.get('search');
    if (query) setSearchTerm(query);
    fetchEquipment();
  }, [window.location.search]);

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      const res = await studentService.getEquipmentList();
      const data = res?.data || res || [];
      setEquipmentList(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Failed to load equipment details');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case 'available':
        return { color: 'bg-green-500/10 text-green-500 border-green-500/20', icon: Package };
      case 'in use':
        return { color: 'bg-blue-500/10 text-blue-500 border-blue-500/20', icon: Clock };
      case 'faulty':
        return { color: 'bg-red-500/10 text-red-500 border-red-500/20', icon: AlertCircle };
      case 'under maintenance':
        return { color: 'bg-orange-500/10 text-orange-500 border-orange-500/20', icon: Wrench };
      default:
        return { color: 'bg-slate-500/10 text-slate-500 border-slate-500/20', icon: Info };
    }
  };

  const filteredEquipment = equipmentList.filter(eq => 
    eq.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    eq.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Equipment Catalog</h1>
          <p className="text-slate-400">View and book available laboratory equipment</p>
        </div>
        
        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-500" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-slate-700 rounded-lg bg-slate-900 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
            placeholder="Search equipment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-slate-800 rounded-xl p-5 border border-slate-700 animate-pulse">
              <div className="h-40 bg-slate-700 rounded-lg mb-4"></div>
              <div className="h-6 bg-slate-700 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-slate-700 rounded w-1/2 mb-4"></div>
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-700">
                <div className="h-6 bg-slate-700 rounded w-1/3"></div>
                <div className="h-8 bg-slate-700 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredEquipment.length === 0 ? (
        <div className="text-center py-12 bg-slate-900 rounded-xl border border-slate-800">
          <Package className="h-12 w-12 text-slate-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-300">No equipment found</h3>
          <p className="text-slate-500 mt-2">Try adjusting your search criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredEquipment.map((equipment, index) => {
            const StatusIcon = getStatusConfig(equipment.status).icon;
            const isAvailable = equipment.status?.toLowerCase() === 'available';
            const equipmentId = equipment.equipmentId || equipment.id || equipment._id || index;
            
            return (
              <div key={equipmentId} className="bg-slate-900 rounded-xl p-5 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col h-full">
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-white line-clamp-1" title={equipment.name}>
                      {equipment.name}
                    </h3>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusConfig(equipment.status).color}`}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {equipment.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-slate-400 line-clamp-2" title={equipment.description}>
                      {equipment.description || 'No description available'}
                    </p>
                    
                    {(equipment.equipmentId || equipmentId) && (
                      <div className="text-sm text-slate-300">
                        <span className="text-slate-500">ID: </span> {equipment.equipmentId || equipmentId}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-slate-800">
                  {isAvailable ? (
                    <Link
                      to={`/student/book-equipment?equipmentId=${equipmentId}`}
                      className="block w-full text-center px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors"
                    >
                      Book Now
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="block w-full text-center px-4 py-2 bg-slate-800 text-slate-500 font-medium rounded-lg cursor-not-allowed"
                    >
                      Unavailable
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EquipmentDetails;