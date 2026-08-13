import React, { useState, useEffect } from 'react';
import { 
  Bell, CalendarCheck, Wrench, AlertTriangle, UserPlus, 
  Check, Trash2, Send, RefreshCw, Filter, CheckCheck, X, Loader2 
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import toast from 'react-hot-toast';
import Pagination from '../../components/common/Pagination';

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('ALL');
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [targetRole, setTargetRole] = useState('ALL');
  const [sending, setSending] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchLiveNotifications = async () => {
    setLoading(true);
    try {
      let notifRes;
      switch (filterType) {
        case 'UNREAD':
          notifRes = await adminService.getNotificationsAdminUnread();
          break;
        case 'BOOKING':
          notifRes = await adminService.getNotificationsAdminBooking();
          break;
        case 'SYSTEM':
          notifRes = await adminService.getNotificationsAdminSystem();
          break;
        case 'FAULT':
          notifRes = await adminService.getNotificationsAdminFault();
          break;
        case 'MAINTENANCE':
          notifRes = await adminService.getNotificationsAdminMaintenance();
          break;
        case 'ALL':
        default:
          notifRes = await adminService.getNotificationsAdminAll();
          break;
      }

      const body = notifRes?.data || notifRes;
      let rawList = [];
      if (body) {
        if (body.success && body.data) {
          rawList = body.data;
        } else {
          rawList = body;
        }
      }
      const notifList = Array.isArray(rawList) ? rawList : [];

      const list = notifList.map((n) => ({
        id: n.id || n._id,
        type: (n.type || 'SYSTEM').toUpperCase(),
        title: n.title || 'System Notification',
        message: n.message || n.text || '',
        createdAt: n.createdAt || new Date().toISOString(),
        isRead: n.read || n.isRead || false,
        badgeColor: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
        icon: Bell
      }));

      setNotifications(list);
    } catch (error) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchLiveNotifications();
  }, [filterType]);

  const handleMarkAsRead = async (id) => {
    try {
      await adminService.markNotificationRead(id);
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, isRead: true } : n)
      );
      toast.success('Notification marked as read');
    } catch (error) {
      toast.error('Failed to update notification');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await adminService.markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  const handleClearAll = async () => {
    if (notifications.length === 0) { toast('No notifications to clear'); return; }
    if (!window.confirm('Clear all notifications? This cannot be undone.')) return;
    try {
      await adminService.clearAllNotifications();
      setNotifications([]);
      toast.success('All notifications cleared');
    } catch (error) {
      toast.error('Failed to clear notifications');
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      await adminService.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      toast.success('Notification deleted');
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  };

  const handleBroadcast = async (e) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastMsg.trim()) {
      toast.error('Please enter title and message');
      return;
    }

    setSending(true);
    try {
      await adminService.createNotification({
        title: broadcastTitle.trim(),
        message: broadcastMsg.trim(),
        type: 'SYSTEM',
        targetRole: targetRole,
        isRead: false,
        createdAt: new Date().toISOString()
      });

      toast.success(`Broadcast sent successfully to ${targetRole}!`);
      setBroadcastTitle('');
      setBroadcastMsg('');
      setIsBroadcastOpen(false);
      fetchLiveNotifications();
    } catch (error) {
      toast.error('Failed to send broadcast');
    } finally {
      setSending(false);
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filterType === 'ALL') return true;
    if (filterType === 'UNREAD') return !n.isRead;
    return n.type === filterType;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const paginatedNotifications = filteredNotifications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white">System Notifications</h1>
              {unreadCount > 0 && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  {unreadCount} Unread
                </span>
              )}
            </div>
            <p className="text-slate-400 text-xs mt-1">
              Live authentic notifications from system activities, student bookings, faculty requests, and website inquiries.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchLiveNotifications}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition border border-slate-700"
            title="Refresh Notifications"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition border border-slate-700 flex items-center gap-2"
            >
              <CheckCheck className="w-4 h-4 text-green-400" />
              <span>Mark All Read</span>
            </button>
          )}

          {notifications.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-4 py-2.5 bg-slate-800 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 font-semibold text-xs rounded-xl transition border border-slate-700 hover:border-rose-500/30 flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear All</span>
            </button>
          )}

          <button
            onClick={() => setIsBroadcastOpen(true)}
            className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-semibold text-xs rounded-xl transition shadow-lg flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Send Broadcast</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-wrap gap-2 items-center justify-between">
        <div className="flex items-center gap-2 overflow-x-auto">
          <Filter className="w-4 h-4 text-slate-500 ml-2 mr-1" />
          {['ALL', 'UNREAD', 'BOOKING', 'SYSTEM', 'FAULT', 'MAINTENANCE'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                filterType === type
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {type === 'ALL' ? 'All Notifications' : type.charAt(0) + type.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-500 font-mono pr-2">
          Showing {filteredNotifications.length} of {notifications.length}
        </span>
      </div>

      {/* Notification List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
            <span className="text-xs">Fetching live system notifications...</span>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <Bell className="w-10 h-10 mx-auto opacity-30 text-slate-600" />
            <p className="text-sm font-semibold text-slate-400">No Notifications Match Filter</p>
            <p className="text-xs text-slate-500">Live notifications will appear here when events occur.</p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-slate-800">
              {paginatedNotifications.map((n) => {
                const IconComp = n.icon || Bell;
                return (
                  <div
                    key={n.id}
                    className={`p-5 transition flex items-start justify-between gap-4 ${
                      !n.isRead ? 'bg-slate-800/40 hover:bg-slate-800/60 border-l-4 border-l-orange-500' : 'hover:bg-slate-800/20'
                    }`}
                  >
                    <div className="flex gap-4 items-start">
                      <div className="p-3 rounded-2xl bg-slate-800 border border-slate-700/60 shrink-0 text-orange-400 mt-0.5">
                        <IconComp className="w-5 h-5" />
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h3 className={`text-sm ${!n.isRead ? 'font-bold text-white' : 'font-semibold text-slate-300'}`}>
                            {n.title}
                          </h3>
                          <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider ${n.badgeColor}`}>
                            {n.type}
                          </span>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed">
                          {n.message}
                        </p>

                        <span className="text-[10px] text-slate-500 font-mono block pt-1">
                          {n.createdAt ? new Date(n.createdAt).toLocaleString() : 'Recently'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {!n.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(n.id)}
                          className="p-2 text-slate-400 hover:text-green-400 hover:bg-slate-800 rounded-xl transition"
                          title="Mark as Read"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        onClick={() => handleDeleteNotification(n.id)}
                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-xl transition"
                        title="Delete Notification"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <Pagination
              currentPage={currentPage}
              totalItems={filteredNotifications.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>

      {/* Broadcast Modal */}
      {isBroadcastOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsBroadcastOpen(false)} />
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-orange-500/10 border border-orange-500/20 text-orange-500 rounded-2xl">
                  <Send className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Broadcast Notification</h3>
              </div>
              <button onClick={() => setIsBroadcastOpen(false)} className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBroadcast} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">Target Audience</label>
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white outline-none focus:border-orange-500 transition"
                >
                  <option value="ALL">All Users (Students & Faculty)</option>
                  <option value="STUDENT">Students Only</option>
                  <option value="FACULTY">Faculty Only</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">Notification Title *</label>
                <input
                  type="text"
                  required
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  placeholder="e.g. Scheduled Maintenance Notice"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white outline-none focus:border-orange-500 transition"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">Message Content *</label>
                <textarea
                  required
                  rows={3}
                  value={broadcastMsg}
                  onChange={(e) => setBroadcastMsg(e.target.value)}
                  placeholder="Type broadcast alert message..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white outline-none focus:border-orange-500 transition resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsBroadcastOpen(false)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sending}
                  className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-semibold text-xs rounded-xl transition shadow-lg flex items-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{sending ? 'Sending...' : 'Dispatch Broadcast'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNotifications;