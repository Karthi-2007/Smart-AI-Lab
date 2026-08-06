import React, { useState, useEffect } from 'react';
import { CalendarCheck, Laptop, Wrench, AlertTriangle, Check, CheckCircle2, Bell, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { studentService } from '../../services/studentService';
import { useAuth } from '../../context/AuthContext';

const StudentNotifications = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState('All');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    const userId = user?.id || user?.userId;
    if (!userId) { setLoading(false); return; }
    try {
      setLoading(true);
      const res = await studentService.getMyNotifications(userId);
      const data = res?.data || res || [];
      setNotifications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching student notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user?.id, user?.userId]);

  const markRead = async (id) => {
    try {
      await studentService.markNotificationRead(id);
      setNotifications(prev =>
        prev.map((item) =>
          (item.id === id || item._id === id) ? { ...item, isRead: true, read: true } : item
        )
      );
      toast.success('Marked as read');
    } catch (err) {
      toast.error('Failed to update notification');
    }
  };

  const filteredNotifications = notifications.filter((item) => {
    if (filter === 'All') return true;
    return item.type?.toLowerCase() === filter.toLowerCase();
  });

  const getIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'booking':
        return <CalendarCheck size={20} className="text-blue-400" />;
      case 'equipment':
        return <Laptop size={20} className="text-emerald-400" />;
      case 'maintenance':
        return <Wrench size={20} className="text-amber-400" />;
      default:
        return <AlertTriangle size={20} className="text-rose-400" />;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          <Bell className="h-7 w-7 text-orange-500" />
          Notifications
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Stay updated with your laboratory activities and booking updates
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex flex-wrap gap-2">
        {['All', 'Booking', 'Equipment', 'Maintenance'].map((item) => (
          <button
            key={item}
            onClick={() => setFilter(item)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === item
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20 font-semibold'
                : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Notification List */}
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-2xl p-8">
          <Bell size={48} className="mx-auto mb-3 text-slate-700 opacity-50" />
          <h3 className="text-lg font-semibold text-slate-300">No Notifications</h3>
          <p className="text-slate-500 text-sm mt-1">You're all caught up! No notifications match this filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotifications.map((notification, index) => {
            const notifId = notification.id || notification._id || index;
            const isUnread = !(notification.isRead || notification.read);

            return (
              <div
                key={notifId}
                className={`bg-slate-900 border rounded-2xl p-5 flex items-center justify-between gap-4 transition-all ${
                  isUnread
                    ? 'border-orange-500/50 bg-orange-500/5 shadow-md shadow-orange-500/5'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-slate-800 border border-slate-700/60 shrink-0">
                    {getIcon(notification.type)}
                  </div>

                  <div>
                    <h2 className="font-semibold text-white text-base">
                      {notification.title}
                    </h2>
                    <p className="text-sm text-slate-300 mt-0.5">
                      {notification.message}
                    </p>
                    <p className="text-xs text-slate-500 mt-2 font-mono">
                      {notification.createdAt ? new Date(notification.createdAt).toLocaleString() : 'Just now'}
                    </p>
                  </div>
                </div>

                {isUnread ? (
                  <button
                    onClick={() => markRead(notifId)}
                    className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition shadow-md shrink-0"
                  >
                    <Check size={14} />
                    Mark Read
                  </button>
                ) : (
                  <CheckCircle2 size={20} className="text-emerald-500 shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentNotifications;