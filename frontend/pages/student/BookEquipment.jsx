import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Calendar, Clock, FileText, Package, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { studentService } from '../../services/studentService';
import { useAuth } from '../../hooks/useAuth';

const getDynamicTimeSlots = () => {
  let opening = "08:30";
  let closing = "17:30";
  let durationType = "2 Hours";

  try {
    const stored = localStorage.getItem("smartlab_system_settings");
    if (stored) {
      const s = JSON.parse(stored);
      if (s.openingTime) opening = s.openingTime;
      if (s.closingTime) closing = s.closingTime;
      if (s.bookingDuration) durationType = s.bookingDuration;
    }
  } catch (e) {}

  const timeToMinutes = (tStr) => {
    if (!tStr) return 510;
    const parts = tStr.split(":");
    const h = parseInt(parts[0], 10) || 0;
    const m = parseInt(parts[1], 10) || 0;
    return h * 60 + m;
  };

  const minutesToTime = (totalMin) => {
    const h = Math.floor(totalMin / 60) % 24;
    const m = totalMin % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  let stepMinutes = 120;
  if (durationType === "1 Hour" || durationType.includes("1")) stepMinutes = 60;
  else if (durationType === "2 Hours" || durationType.includes("2")) stepMinutes = 120;
  else if (durationType === "3 Hours" || durationType.includes("3")) stepMinutes = 180;
  else if (durationType === "Half Day" || durationType.includes("4")) stepMinutes = 240;

  const startMin = timeToMinutes(opening);
  const endMin = timeToMinutes(closing);

  const slots = [];
  let curr = startMin;
  while (curr + stepMinutes <= endMin) {
    const slotStart = minutesToTime(curr);
    const slotEnd = minutesToTime(curr + stepMinutes);
    slots.push(`${slotStart} - ${slotEnd}`);
    curr += stepMinutes;
  }

  return slots.length > 0 ? slots : ['08:30 - 10:30', '10:30 - 12:30', '12:30 - 14:30', '14:30 - 16:30'];
};

const BookEquipment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialEquipmentId = queryParams.get('equipmentId') || '';

  const [timeSlots, setTimeSlots] = useState(getDynamicTimeSlots());
  const [equipmentList, setEquipmentList] = useState([]);
  const [loadingEq, setLoadingEq] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [bookedCounts, setBookedCounts] = useState({});
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  
  const [formData, setFormData] = useState({
    equipmentId: initialEquipmentId,
    date: '',
    timeSlot: '',
    purpose: '',
    isUrgent: false
  });

  useEffect(() => {
    const updateSlots = () => setTimeSlots(getDynamicTimeSlots());
    
    // 1. Same-window event listener
    window.addEventListener('smartlab_settings_updated', updateSlots);
    
    // 2. Cross-tab localStorage event listener
    window.addEventListener('storage', updateSlots);
    
    // 3. Tab focus listener
    window.addEventListener('focus', updateSlots);

    // 4. BroadcastChannel for instant zero-reload cross-tab messaging
    let channel;
    try {
      channel = new BroadcastChannel('smartlab_settings_channel');
      channel.onmessage = () => {
        updateSlots();
      };
    } catch (e) {}

    // 5. Short polling interval (every 2 seconds) to guarantee live sync with zero delay
    const intervalId = setInterval(updateSlots, 2000);

    return () => {
      window.removeEventListener('smartlab_settings_updated', updateSlots);
      window.removeEventListener('storage', updateSlots);
      window.removeEventListener('focus', updateSlots);
      if (channel) channel.close();
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        setLoadingEq(true);
        const res = await studentService.getEquipmentList();
        const body = res?.data || res;
        let list = [];
        if (body) {
          if (body.success && body.data) {
            list = body.data;
          } else {
            list = body;
          }
        }
        const dataList = Array.isArray(list) ? list : [];
        // Allow selection of available equipment
        const availableList = dataList.filter(eq => eq.status?.toLowerCase() === 'available');
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

  useEffect(() => {
    const fetchAvailability = async () => {
      if (!formData.equipmentId || !formData.date) {
        setBookedCounts({});
        return;
      }
      try {
        setLoadingAvailability(true);
        const res = await studentService.getSlotAvailability(formData.equipmentId, formData.date);
        setBookedCounts(res?.data || {});
      } catch (err) {
        console.warn("Could not load slot availability:", err);
      } finally {
        setLoadingAvailability(false);
      }
    };
    fetchAvailability();
  }, [formData.equipmentId, formData.date]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      // Clear timeslot if equipment or date changes to force choosing from the new slot options
      if (name === 'equipmentId' || name === 'date') {
        updated.timeSlot = '';
      }
      return updated;
    });
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
        purpose: formData.purpose,
        isUrgent: formData.isUrgent
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
                    <p><span className="font-semibold text-slate-500 text-[11px]">Total Quantity:</span> <span className="text-white font-semibold">{selectedEq.quantity || 5}</span></p>
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
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                  <Clock className="h-4 w-4 text-orange-500" />
                  Time Slot
                </label>
                <span className="text-[11px] font-semibold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                  Live System Format
                </span>
              </div>
              <select
                name="timeSlot"
                value={formData.timeSlot}
                onChange={handleChange}
                disabled={loadingAvailability}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors disabled:opacity-50"
                required
              >
                <option value="">
                  {loadingAvailability 
                    ? '-- Checking Slot Availability... --' 
                    : '-- Choose Time Slot --'}
                </option>
                {timeSlots.map(slot => {
                  const selectedEq = equipmentList.find(eq => String(eq.equipmentId || eq.id) === String(formData.equipmentId));
                  const maxQty = selectedEq?.quantity || 5;
                  const booked = bookedCounts[slot] || 0;
                  const left = maxQty - booked;
                  const isFull = left <= 0;
                  const showAvailability = formData.equipmentId && formData.date;
                  return (
                    <option key={slot} value={slot} disabled={showAvailability && isFull}>
                      {slot} {showAvailability ? (isFull ? '(Fully Booked)' : `(${left} of ${maxQty} available)`) : ''}
                    </option>
                  );
                })}
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

          <div className="flex items-center gap-3 py-2">
            <input
              type="checkbox"
              id="isUrgent"
              name="isUrgent"
              checked={formData.isUrgent}
              onChange={(e) => setFormData(prev => ({ ...prev, isUrgent: e.target.checked }))}
              className="w-4 h-4 text-orange-500 bg-slate-800 border-slate-700 rounded focus:ring-orange-500 cursor-pointer accent-orange-500"
            />
            <label htmlFor="isUrgent" className="text-sm font-medium text-slate-300 cursor-pointer select-none">
              Mark as Urgent / Priority Booking (Urgent requests are flagged for quick Faculty review)
            </label>
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