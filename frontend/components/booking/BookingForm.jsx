import React, { useState } from 'react';
import PrimaryButton from '../ui/PrimaryButton';

const BookingForm = ({ equipmentList = [], onSubmit }) => {
  const [equipmentId, setEquipmentId] = useState('');
  const [date, setDate] = useState('');
  const [slot, setSlot] = useState('10:00 AM - 01:00 PM');
  const [purpose, setPurpose] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({ equipmentId, date, slot, purpose });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 space-y-4">
      <h3 className="text-lg font-bold text-white mb-2">Request Equipment Slot</h3>
      
      <div>
        <label className="block text-xs text-slate-400 mb-1">Equipment</label>
        <select
          value={equipmentId}
          onChange={(e) => setEquipmentId(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/50"
          required
        >
          <option value="">Select Equipment</option>
          {equipmentList.map((eq) => (
            <option key={eq.id || eq.equipmentId} value={eq.id || eq.equipmentId}>
              {eq.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-slate-400 mb-1">Booking Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/50"
            required
          />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Time Slot</label>
          <select
            value={slot}
            onChange={(e) => setSlot(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/50"
          >
            <option value="09:00 AM - 12:00 PM">09:00 AM - 12:00 PM</option>
            <option value="10:00 AM - 01:00 PM">10:00 AM - 01:00 PM</option>
            <option value="02:00 PM - 05:00 PM">02:00 PM - 05:00 PM</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs text-slate-400 mb-1">Project / Research Purpose</label>
        <textarea
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          rows={3}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/50"
          placeholder="Briefly describe the experiment or training task..."
          required
        />
      </div>

      <PrimaryButton type="submit">Submit Booking Request</PrimaryButton>
    </form>
  );
};

export default BookingForm;
