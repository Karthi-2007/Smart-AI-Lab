import React, { useState, useEffect } from "react";
import { Settings, Save, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const SystemSettings = () => {
  const [institution, setInstitution] = useState("Karpagam College of Engineering");
  const [timeZone, setTimeZone] = useState("Asia/Kolkata");
  const [openingTime, setOpeningTime] = useState("08:30");
  const [closingTime, setClosingTime] = useState("17:30");
  const [bookingDuration, setBookingDuration] = useState("2 Hours");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("smartlab_system_settings");
      if (stored) {
        const s = JSON.parse(stored);
        if (s.institution) setInstitution(s.institution);
        if (s.timeZone) setTimeZone(s.timeZone);
        if (s.openingTime) setOpeningTime(s.openingTime);
        if (s.closingTime) setClosingTime(s.closingTime);
        if (s.bookingDuration) setBookingDuration(s.bookingDuration);
      }
    } catch (e) {}
  }, []);

  const persistAndBroadcastSettings = (newInst, newTz, newOpen, newClose, newDur) => {
    try {
      const settings = { 
        institution: newInst !== undefined ? newInst : institution, 
        timeZone: newTz !== undefined ? newTz : timeZone, 
        openingTime: newOpen !== undefined ? newOpen : openingTime, 
        closingTime: newClose !== undefined ? newClose : closingTime, 
        bookingDuration: newDur !== undefined ? newDur : bookingDuration 
      };
      localStorage.setItem("smartlab_system_settings", JSON.stringify(settings));
      window.dispatchEvent(new Event('smartlab_settings_updated'));
      try {
        const channel = new BroadcastChannel('smartlab_settings_channel');
        channel.postMessage(settings);
        channel.close();
      } catch (err) {}
    } catch (e) {}
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      try {
        persistAndBroadcastSettings(institution, timeZone, openingTime, closingTime, bookingDuration);
        toast.success("System Settings saved successfully!");
      } catch (err) {
        toast.error("Failed to save system settings.");
      } finally {
        setSaving(false);
      }
    }, 300);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-blue-500">
          <Settings className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">System Preferences</h2>
          <p className="text-xs text-slate-400">Configure global lab operating hours, time zone and booking rules</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Institution Name *</label>
            <input
              type="text"
              required
              value={institution}
              onChange={(e) => {
                const val = e.target.value;
                setInstitution(val);
                persistAndBroadcastSettings(val, timeZone, openingTime, closingTime, bookingDuration);
              }}
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-3.5 text-white text-sm focus:border-blue-500 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Time Zone</label>
            <select
              value={timeZone}
              onChange={(e) => {
                const val = e.target.value;
                setTimeZone(val);
                persistAndBroadcastSettings(institution, val, openingTime, closingTime, bookingDuration);
              }}
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-3.5 text-white text-sm focus:border-blue-500 outline-none transition"
            >
              <option value="Asia/Kolkata">Asia/Kolkata (IST +5:30)</option>
              <option value="UTC">UTC (Coordinated Universal Time)</option>
              <option value="America/New_York">America/New_York (EST)</option>
              <option value="Europe/London">Europe/London (GMT)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Lab Opening Time</label>
            <input
              type="time"
              value={openingTime}
              onChange={(e) => {
                const val = e.target.value;
                setOpeningTime(val);
                persistAndBroadcastSettings(institution, timeZone, val, closingTime, bookingDuration);
              }}
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-3.5 text-white text-sm focus:border-blue-500 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Lab Closing Time</label>
            <input
              type="time"
              value={closingTime}
              onChange={(e) => {
                const val = e.target.value;
                setClosingTime(val);
                persistAndBroadcastSettings(institution, timeZone, openingTime, val, bookingDuration);
              }}
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-3.5 text-white text-sm focus:border-blue-500 outline-none transition"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Default Booking Slot Duration</label>
            <select
              value={bookingDuration}
              onChange={(e) => {
                const val = e.target.value;
                setBookingDuration(val);
                persistAndBroadcastSettings(institution, timeZone, openingTime, closingTime, val);
              }}
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-3.5 text-white text-sm focus:border-blue-500 outline-none transition"
            >
              <option value="1 Hour">1 Hour Per Session</option>
              <option value="2 Hours">2 Hours Per Session</option>
              <option value="3 Hours">3 Hours Per Session</option>
              <option value="Half Day">Half Day (4 Hours)</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white px-6 py-3 rounded-2xl font-semibold flex items-center gap-2 text-sm transition shadow-lg disabled:opacity-60"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save System Settings</span>
        </button>
      </form>
    </div>
  );
};

export default SystemSettings;