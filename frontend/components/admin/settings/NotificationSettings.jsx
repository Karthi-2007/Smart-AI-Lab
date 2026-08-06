import React, { useState, useEffect } from "react";
import { Bell, Save, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const NotificationSettings = () => {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(false);
  const [bookingReminders, setBookingReminders] = useState(true);
  const [maintenanceAlerts, setMaintenanceAlerts] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("smartlab_notification_settings");
      if (stored) {
        const n = JSON.parse(stored);
        setEmailNotifs(!!n.emailNotifs);
        setSmsNotifs(!!n.smsNotifs);
        setBookingReminders(!!n.bookingReminders);
        setMaintenanceAlerts(!!n.maintenanceAlerts);
      }
    } catch (e) {}
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      try {
        const notifSettings = { emailNotifs, smsNotifs, bookingReminders, maintenanceAlerts };
        localStorage.setItem("smartlab_notification_settings", JSON.stringify(notifSettings));
        toast.success("Notification Preferences saved successfully!");
      } catch (err) {
        toast.error("Failed to save notification settings.");
      } finally {
        setSaving(false);
      }
    }, 400);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl text-yellow-500">
          <Bell className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Notification & Alert Preferences</h2>
          <p className="text-xs text-slate-400">Control automated email dispatch, SMS gateways and system alerts</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="space-y-4">
          <label className="flex items-center justify-between bg-slate-800/80 border border-slate-700/60 rounded-2xl p-4 cursor-pointer hover:border-slate-600 transition">
            <div>
              <span className="font-semibold text-white text-sm block">Email Notifications</span>
              <span className="text-xs text-slate-400">Receive instant email receipts for bookings and approvals</span>
            </div>
            <input
              type="checkbox"
              checked={emailNotifs}
              onChange={(e) => setEmailNotifs(e.target.checked)}
              className="w-5 h-5 accent-orange-500 rounded cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between bg-slate-800/80 border border-slate-700/60 rounded-2xl p-4 cursor-pointer hover:border-slate-600 transition">
            <div>
              <span className="font-semibold text-white text-sm block">SMS Notifications</span>
              <span className="text-xs text-slate-400">Send urgent SMS alerts to faculty and students for time slots</span>
            </div>
            <input
              type="checkbox"
              checked={smsNotifs}
              onChange={(e) => setSmsNotifs(e.target.checked)}
              className="w-5 h-5 accent-orange-500 rounded cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between bg-slate-800/80 border border-slate-700/60 rounded-2xl p-4 cursor-pointer hover:border-slate-600 transition">
            <div>
              <span className="font-semibold text-white text-sm block">Booking Reminders</span>
              <span className="text-xs text-slate-400">Send automated reminders 30 minutes before lab sessions</span>
            </div>
            <input
              type="checkbox"
              checked={bookingReminders}
              onChange={(e) => setBookingReminders(e.target.checked)}
              className="w-5 h-5 accent-orange-500 rounded cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between bg-slate-800/80 border border-slate-700/60 rounded-2xl p-4 cursor-pointer hover:border-slate-600 transition">
            <div>
              <span className="font-semibold text-white text-sm block">Maintenance & Fault Alerts</span>
              <span className="text-xs text-slate-400">Alert admin and lab assistants when equipment faults are reported</span>
            </div>
            <input
              type="checkbox"
              checked={maintenanceAlerts}
              onChange={(e) => setMaintenanceAlerts(e.target.checked)}
              className="w-5 h-5 accent-orange-500 rounded cursor-pointer"
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-yellow-600 hover:bg-yellow-700 active:scale-95 text-white px-6 py-3 rounded-2xl font-semibold flex items-center gap-2 text-sm transition shadow-lg disabled:opacity-60"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save Notification Settings</span>
        </button>
      </form>
    </div>
  );
};

export default NotificationSettings;