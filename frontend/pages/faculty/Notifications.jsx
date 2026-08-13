import React, { useState, useEffect, useMemo } from 'react';
import {
  CalendarCheck, Laptop, Wrench, AlertTriangle, Check,
  CheckCircle2, Bell, Loader2, CheckCheck, Trash2, X
} from 'lucide-react';
import toast from 'react-hot-toast';
import { facultyService } from '../../services/facultyService';
import { useAuth } from '../../context/AuthContext';
import Pagination from '../../components/common/Pagination';

const FacultyNotifications = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState('All');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  /* ── Fetch ───────────────────────────────────────────────── */
  const fetchNotifications = async () => {
    const userId = user?.id || user?.userId || 2;
    try {
      setLoading(true);
      const res = await facultyService.getNotifications(userId);
      const body = res?.data || res;
      let list = [];
      if (body?.success && body.data !== undefined) {
        list = Array.isArray(body.data) ? body.data : (body.data?.content ?? []);
      } else if (Array.isArray(body)) {
        list = body;
      }
      setNotifications(list);
    } catch (error) {
      console.error('Error fetching faculty notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotifications(); }, [user?.id, user?.userId]);
  useEffect(() => { setCurrentPage(1); }, [filter]);

  /* ── Actions ─────────────────────────────────────────────── */
  const markRead = async (id) => {
    try {
      await facultyService.markNotificationRead(id);
      setNotifications(prev =>
        prev.map(item => (item.id === id ? { ...item, isRead: true, read: true } : item))
      );
      toast.success('Marked as read');
    } catch {
      toast.error('Failed to update notification');
    }
  };

  const markAllRead = async () => {
    const unread = notifications.filter(n => !(n.isRead || n.read));
    if (unread.length === 0) { toast('All notifications already read'); return; }
    try {
      await facultyService.markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true, read: true })));
      toast.success('All notifications marked as read');
    } catch {
      toast.error('Failed to mark all as read');
    }
  };

  const deleteOne = async (id) => {
    try {
      await facultyService.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      toast.success('Notification removed');
    } catch {
      toast.error('Failed to remove notification');
    }
  };

  const clearAll = async () => {
    if (notifications.length === 0) { toast('No notifications to clear'); return; }
    if (!window.confirm('Clear all notifications? This cannot be undone.')) return;
    try {
      await facultyService.clearAllNotifications();
      setNotifications([]);
      toast.success('All notifications cleared');
    } catch {
      toast.error('Failed to clear notifications');
    }
  };

  /* ── Filter & Paginate ───────────────────────────────────── */
  const filtered = useMemo(() =>
    notifications.filter(item => {
      if (filter === 'All') return true;
      return item.type?.toLowerCase() === filter.toLowerCase();
    }),
  [notifications, filter]);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);

  const unreadCount = notifications.filter(n => !(n.isRead || n.read)).length;

  /* ── Icon helper ─────────────────────────────────────────── */
  const getIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'booking':     return <CalendarCheck size={20} className="text-blue-400" />;
      case 'equipment':   return <Laptop size={20} className="text-emerald-400" />;
      case 'maintenance': return <Wrench size={20} className="text-amber-400" />;
      default:            return <AlertTriangle size={20} className="text-rose-400" />;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <Bell className="h-7 w-7 text-orange-500" />
            Notifications
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">
                {unreadCount} Unread
              </span>
            )}
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Stay updated with real-time laboratory activities and approval requests
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 transition"
            >
              <CheckCheck className="w-4 h-4 text-emerald-400" />
              Mark All Read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={clearAll}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 text-xs font-semibold rounded-xl border border-slate-700 hover:border-rose-500/30 transition"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          )}
        </div>
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
        <span className="ml-auto self-center text-xs text-slate-500 pr-2">
          {filtered.length} of {notifications.length}
        </span>
      </div>

      {/* Notification List */}
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-2xl p-8">
          <Bell size={48} className="mx-auto mb-3 text-slate-700 opacity-50" />
          <h3 className="text-lg font-semibold text-slate-300">No Notifications</h3>
          <p className="text-slate-500 text-sm mt-1">
            {notifications.length === 0
              ? "You're all caught up! Notifications will appear here when events occur."
              : "No notifications match this filter."}
          </p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="divide-y divide-slate-800/60">
            {paginated.map((notification) => {
              const notifId = notification.id;
              const isUnread = !(notification.isRead || notification.read);
              return (
                <div
                  key={notifId}
                  className={`p-5 flex items-center justify-between gap-4 transition-all ${
                    isUnread
                      ? 'border-l-4 border-l-orange-500 bg-orange-500/5'
                      : 'hover:bg-slate-800/20'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-slate-800 border border-slate-700/60 shrink-0">
                      {getIcon(notification.type)}
                    </div>
                    <div>
                      <h2 className={`font-semibold text-base ${isUnread ? 'text-white' : 'text-slate-300'}`}>
                        {notification.title}
                      </h2>
                      <p className="text-sm text-slate-400 mt-0.5">{notification.message}</p>
                      <p className="text-xs text-slate-500 mt-1.5 font-mono">
                        {notification.createdAt
                          ? new Date(notification.createdAt).toLocaleString()
                          : 'Just now'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {isUnread ? (
                      <button
                        onClick={() => markRead(notifId)}
                        className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition shadow-md"
                        title="Mark as Read"
                      >
                        <Check size={13} /> Mark Read
                      </button>
                    ) : (
                      <CheckCircle2 size={18} className="text-emerald-500" />
                    )}
                    <button
                      onClick={() => deleteOne(notifId)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                      title="Remove"
                    >
                      <X size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <Pagination
            currentPage={currentPage}
            totalItems={filtered.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

export default FacultyNotifications;