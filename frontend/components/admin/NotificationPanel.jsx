import React, { useState, useEffect } from "react";
import { Bell, CalendarCheck, Wrench, AlertTriangle, UserPlus, BrainCircuit } from "lucide-react";
import { adminService } from "../../services/adminService";

const NotificationPanel = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPanelNotifications();
  }, []);

  const fetchPanelNotifications = async () => {
    try {
      const [notifRes, bookRes, faultRes] = await Promise.all([
        adminService.getNotifications().catch(() => ({ data: [] })),
        adminService.getBookings().catch(() => ({ data: [] })),
        adminService.getFaults().catch(() => ({ data: [] }))
      ]);

      const notifList = Array.isArray(notifRes?.data || notifRes) ? (notifRes?.data || notifRes) : [];
      const bookList = Array.isArray(bookRes?.data || bookRes) ? (bookRes?.data || bookRes) : [];
      const faultList = Array.isArray(faultRes?.data || faultRes) ? (faultRes?.data || faultRes) : [];

      const list = [];

      bookList.slice(0, 3).forEach(b => {
        const studentName = typeof b.student === 'object' ? b.student?.name : (b.student || 'Student');
        const eqName = typeof b.equipment === 'object' ? b.equipment?.name : (b.equipment || 'Equipment');
        list.push({
          id: `b-${b.bookingId || b.id}`,
          icon: CalendarCheck,
          title: "New Booking Request",
          message: `${studentName} requested ${eqName}`,
          time: b.bookedAt ? new Date(b.bookedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Recently",
          color: "bg-blue-500"
        });
      });

      faultList.slice(0, 2).forEach(f => {
        const eqName = typeof f.equipment === 'object' ? f.equipment?.name : (f.equipment || 'Equipment');
        list.push({
          id: `f-${f.id}`,
          icon: AlertTriangle,
          title: "Hardware Fault Alert",
          message: `${eqName} reported faulty`,
          time: f.createdAt ? new Date(f.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Recently",
          color: "bg-red-500"
        });
      });

      notifList.slice(0, 2).forEach(n => {
        list.push({
          id: `n-${n.id}`,
          icon: Bell,
          title: n.title || "System Alert",
          message: n.message || n.text || "",
          time: n.createdAt ? new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Recently",
          color: "bg-purple-500"
        });
      });

      setNotifications(list.length ? list : [
        { id: 1, icon: CalendarCheck, title: "New Booking Request", message: "Student requested equipment reservation", time: "Just now", color: "bg-blue-500" }
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 h-full shadow-xl flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-orange-500/10 border border-orange-500/20 rounded-2xl text-orange-500">
              <Bell className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white">Notifications</h2>
          </div>

          <span className="bg-orange-500 text-white font-bold text-xs px-3 py-1 rounded-full">
            {notifications.length}
          </span>
        </div>

        <div className="space-y-4">
          {notifications.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="flex gap-4 p-3.5 rounded-2xl hover:bg-slate-800/60 border border-transparent hover:border-slate-800 transition"
              >
                <div
                  className={`w-10 h-10 rounded-2xl ${item.color} flex items-center justify-center shrink-0 shadow-md text-white`}
                >
                  <Icon size={20} />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white text-sm truncate">{item.title}</h3>
                  <p className="text-slate-400 text-xs mt-0.5 truncate">{item.message}</p>
                  <p className="text-[11px] text-slate-500 mt-1 font-mono">{item.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-4 border-t border-slate-800 mt-4 text-center">
        <a href="/admin/notifications" className="text-xs text-orange-400 hover:text-orange-300 font-semibold transition">
          View All Notifications →
        </a>
      </div>
    </div>
  );
};

export default NotificationPanel;