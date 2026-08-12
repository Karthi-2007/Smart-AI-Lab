import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Calendar, Clock, FileText, Package, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { studentService } from '../../services/studentService';
import { useAuth } from '../../hooks/useAuth';

const TIME_SLOTS = [
  '09:00 - 11:00',
  '11:00 - 13:00',
  '13:00 - 15:00',
  '15:00 - 17:00'
];

const BookEquipment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialEquipmentId = queryParams.get('equipmentId') || '';

  const [equipmentList, setEquipmentList] = useState([]);
  const [loadingEq, setLoadingEq] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    equipmentId: initialEquipmentId,
    date: '',
    timeSlot: '',
    purpose: ''
  });

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        setLoadingEq(true);
        const res = await studentService.getEquipmentList();
        const data = res?.data || res || [];
        const list = Array.isArray(data) ? data : [];
        // Allow selection of available equipment
        const availableList = list.filter(eq => eq.status?.toLowerCase() === 'available');
        setEquipmentList(availableList);
        
        // Warn if pre-selected equipment is not available
        if (initialEquipmentId && !availableList.some(eq => String(eq.equipmentId || eq.id || eq._id) === String(initialEquipmentId))) {
           toast.error('The selected equipment might not be available');
        }
      } catch (error) {
        toast.error('Failed to load equipment list');
        console.error(error);
      } finally {
        setLoadingEq(false);
      }
    };
    fetchEquipment();
  }, [initialEquipmentId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.equipmentId || !formData.date || !formData.timeSlot || !formData.purpose) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setSubmitting(true);
      const currentStudentId = Number(user?.id || user?.userId || user?.studentId || 1);
      const studentName = user?.name || "Student";
      const studentEmail = user?.email || "student@kce.ac.in";
      const studentDept = user?.department || "Computer Science & Engineering";
      const studentRegNo = user?.regNo || "";

      await studentService.createBooking({
        studentId: currentStudentId,
        equipmentId: Number(formData.equipmentId),
        student: { 
          studentId: currentStudentId,
          name: studentName,
          email: studentEmail,
          department: studentDept,
          regNo: studentRegNo
        },
        studentName: studentName,
        equipment: { equipmentId: Number(formData.equipmentId) },
        date: formData.date,
        timeSlot: formData.timeSlot,
        purpose: formData.purpose
      });
      
      toast.success('Equipment booked successfully');
      navigate('/student/bookings');
    } catch (error) {
      toast.error('Failed to book equipment');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">Book Equipment</h1>
          <p className="text-slate-400">Schedule lab equipment for your project</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <Package className="h-4 w-4 text-orange-500" />
              Select Equipment
            </label>
            <select
              name="equipmentId"
              value={formData.equipmentId}
              onChange={handleChange}
              disabled={loadingEq}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors disabled:opacity-50"
              required
            >
              <option value="">-- Choose Equipment --</option>
              {equipmentList.map((eq, idx) => {
                const eqId = eq.equipmentId || eq.id || eq._id || idx;
                return (
                  <option key={eqId} value={eqId}>
                    {eq.name} {eq.equipmentId ? `(#${eq.equipmentId})` : ''}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Equipment Live Preview */}
          {(() => {
            const selectedEq = equipmentList.find(eq => String(eq.equipmentId || eq.id) === String(formData.equipmentId));
            if (!selectedEq) return null;
            return (
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-4 mt-2">
                <div className="w-full md:w-1/3 aspect-video md:aspect-auto md:h-28 rounded-lg overflow-hidden bg-slate-900 border border-slate-800 flex-shrink-0">
                  <img
                    src={selectedEq.imageUrl || 'https://images.unsplash.com/photo-1532187643603-ba119ca4109e?w=600&auto=format&fit=crop'}
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1532187643603-ba119ca4109e?w=600&auto=format&fit=crop'; }}
                    className="w-full h-full object-cover"
                    alt={selectedEq.name}
                  />
                </div>
                <div className="flex-1 space-y-1.5 text-xs text-slate-400">
                  <h4 className="text-sm font-bold text-white">{selectedEq.name}</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <p><span className="font-semibold text-slate-500 text-[11px]">Asset ID:</span> {selectedEq.assetId || `EQ-${selectedEq.equipmentId}`}</p>
                    <p><span className="font-semibold text-slate-500 text-[11px]">Category:</span> {selectedEq.category || 'General'}</p>
                    <p><span className="font-semibold text-slate-500 text-[11px]">Lab:</span> {selectedEq.laboratory?.name || 'Main Lab'}</p>
                    <p><span className="font-semibold text-slate-500 text-[11px]">Status:</span> <span className="text-emerald-400 font-semibold">{selectedEq.status}</span></p>
                  </div>
                </div>
              </div>
            );
          })()}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <Calendar className="h-4 w-4 text-orange-500" />
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                min={today}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <Clock className="h-4 w-4 text-orange-500" />
                Time Slot
              </label>
              <select
                name="timeSlot"
                value={formData.timeSlot}
                onChange={handleChange}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                required
              >
                <option value="">-- Choose Time Slot --</option>
                {TIME_SLOTS.map(slot => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <FileText className="h-4 w-4 text-orange-500" />
              Purpose
            </label>
            <textarea
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              rows={4}
              placeholder="Briefly describe what you'll use this equipment for..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors resize-none"
              required
            ></textarea>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2.5 rounded-lg font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || loadingEq}
              className="px-6 py-2.5 rounded-lg font-medium text-white bg-orange-500 hover:bg-orange-600 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {submitting ? 'Submitting...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookEquipment;