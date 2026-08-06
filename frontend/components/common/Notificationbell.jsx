import React, { useState, useEffect } from 'react';
import { Bell, Check, Info } from 'lucide-react';
import api from '../../services/api';

const Notificationbell = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/api/business/notifications').catch(() => ({ data: [] }));
      const list = Array.isArray(res?.data || res) ? (res?.data || res) : [];
      setNotifications(list.slice(0, 5));
    } catch (e) {
      setNotifications([]);
    }
  };

  const unreadCount = notifications.filter((n) => !(n.isRead || n.read)).length;

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true, read: true })));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white shadow-md shadow-orange-500/50">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="p-3.5 border-b border-slate-800 flex justify-between items-center bg-slate-900/80">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Notifications</h4>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[11px] text-orange-400 hover:underline flex items-center"
              >
                <Check className="w-3 h-3 mr-1" /> Mark all read
              </button>
            )}
          </div>
          <div className="max-h-64 overflow-y-auto divide-y divide-slate-800/60">
            {notifications.length === 0 ? (
              <p className="p-6 text-xs text-slate-500 text-center">No new notifications</p>
            ) : (
              notifications.map((n, i) => {
                const isRead = n.isRead || n.read;
                return (
                  <div
                    key={n.id || n._id || i}
                    className={`p-3 text-xs transition ${
                      isRead ? 'bg-slate-900/40 text-slate-400' : 'bg-orange-500/5 text-slate-200 font-medium'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-white">{n.title || 'System Alert'}</span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {n.createdAt ? new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{n.message}</p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notificationbell;
