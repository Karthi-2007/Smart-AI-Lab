import React, { useState, useEffect } from 'react';
import { 
  Bell, CalendarCheck, Wrench, AlertTriangle, UserPlus, 
  Check, Trash2, Send, RefreshCw, Filter, CheckCheck, X 
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import toast from 'react-hot-toast';

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('ALL');
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [targetRole, setTargetRole] = useState('ALL');
  const [sending, setSending] = useState(false);

  const fetchLiveNotifications = async () => {
    setLoading(true);
    try {
      const [notifRes, bookRes, faultRes, maintRes] = await Promise.all([
        adminService.getNotifications().catch(() => ({ data: [] })),
        adminService.getBookings().catch(() => ({ data: [] })),
        adminService.getFaults().catch(() => ({ data: [] })),
        adminService.getMaintenance().catch(() => ({ data: [] }))
      ]);

      const notifList = Array.isArray(notifRes?.data || notifRes) ? (notifRes?.data || notifRes) : [];
      const bookList = Array.isArray(bookRes?.data || bookRes) ? (bookRes?.data || bookRes) : [];
      const faultList = Array.isArray(faultRes?.data || faultRes) ? (faultRes?.data || faultRes) : [];
      const maintList = Array.isArray(maintRes?.data || maintRes) ? (maintRes?.data || maintRes) : [];

      // Generate dynamic notifications from real system events if notification service is empty
      const generatedEvents = [];

      bookList.forEach(b => {
        const studentName = typeof b.student === 'object' ? b.student?.name : (b.student || 'Student');
        const eqName = typeof b.equipment === 'object' ? b.equipment?.name : (b.equipment || 'Equipment');
        generatedEvents.push({
          id: `book-${b.bookingId || b.id}`,
          type: 'BOOKING',
          title: `New Reservation Request: ${eqName}`,
          message: `${studentName} requested booking for ${eqName} on ${b.date || b.bookedAt || 'Upcoming Slot'}.`,
          createdAt: b.bookedAt || b.date || new Date().toISOString(),
          isRead: b.status === 'Approved' || b.status === 'Rejected',
          badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
          icon: CalendarCheck
        });
      });

      faultList.forEach(f => {
        const eqName = typeof f.equipment === 'object' ? f.equipment?.name : (f.equipment || 'Equipment');
        const reporter = typeof f.reportedBy === 'object' ? f.reportedBy?.name : (f.reportedBy || 'User');
        generatedEvents.push({
          id: `fault-${f.id || f.faultId}`,
          type: 'FAULT',
          title: `Fault Reported: ${eqName}`,
          message: `${reporter} reported fault (${f.description || 'Needs Inspection'}) for ${eqName}.`,
          createdAt: f.createdAt || new Date().toISOString(),
          isRead: f.status === 'Resolved',
          badgeColor: 'bg-red-500/10 text-red-400 border-red-500/20',
          icon: AlertTriangle
        });
      });

      maintList.forEach(m => {
        const eqName = typeof m.equipment === 'object' ? m.equipment?.name : (m.equipment || 'Equipment');
        generatedEvents.push({
          id: `maint-${m.id}`,
          type: 'MAINTENANCE',
          title: `Maintenance Scheduled: ${eqName}`,
          message: `Scheduled maintenance assigned to technician ${m.technician || 'Staff'}.`,
          createdAt: m.scheduledDate || new Date().toISOString(),
          isRead: m.status === 'Completed',
          badgeColor: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
          icon: Wrench
        });
      });

      // Merge backend notifications with generated events
      const merged = [...notifList.map(n => ({
        id: n.id,
        type: n.type || 'SYSTEM',
        title: n.title || 'System Notification',
        message: n.message || n.text || '',
        createdAt: n.createdAt || new Date().toISOString(),
        isRead: n.read || n.isRead || false,
        badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
        icon: Bell
      })), ...generatedEvents];

      setNotifications(merged);

    } catch (error) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await adminService.markNotificationAsRead(id).catch(() => {});
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      toast.success('Marked as read');
    } catch (err) {
      toast.error('Could not update notification');
    }
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    toast.success('All notifications marked as read');
  };

  const handleDeleteNotif = async (id) => {
    try {
      await adminService.deleteNotification(id).catch(() => {});
      setNotifications(prev => prev.filter(n => n.id !== id));
      toast.success('Notification removed');
    } catch (err) {
      toast.error('Failed to delete notification');
    }
  };

  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastMsg.trim()) {
      toast.error('Please enter notification title and message');
      return;
    }

    setSending(true);
    try {
      await adminService.createNotification({
        title: broadcastTitle,
        message: broadcastMsg,
        type: 'SYSTEM',
        role: targetRole === 'ALL' ? null : targetRole
      });

      // Add to local state
      const newNotif = {
        id: `sys-${Date.now()}`,
        type: 'SYSTEM',
        title: broadcastTitle,
        message: broadcastMsg,
        createdAt: new Date().toISOString(),
        isRead: false,
        badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
        icon: Bell
      };

      setNotifications(prev => [newNotif, ...prev]);
      toast.success(`Broadcast sent to ${targetRole === 'ALL' ? 'all users' : targetRole}!`);
      setIsBroadcastOpen(false);
      setBroadcastTitle('');
      setBroadcastMsg('');
    } catch (err) {
      toast.error('Failed to send broadcast notification');
    } finally {
      setSending(false);
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filterType === 'UNREAD') return !n.isRead;
    if (filterType === 'BOOKING') return n.type === 'BOOKING';
    if (filterType === 'FAULT') return n.type === 'FAULT';
    if (filterType === 'MAINTENANCE') return n.type === 'MAINTENANCE';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Admin System Notifications</h1>
            {unreadCount > 0 && (
              <span className="bg-orange-500 text-white font-bold text-xs px-3 py-1 rounded-full animate-bounce">
                {unreadCount} New
              </span>
            )}
          </div>
          <p className="text-slate-400 text-sm">
            Live notification logs derived from real-time student bookings, fault reports, and system alerts.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 rounded-2xl transition flex items-center gap-2 text-xs font-semibold border border-slate-700 disabled:opacity-50"
          >
            <CheckCheck className="w-4 h-4 text-green-400" />
            <span>Mark All Read</span>
          </button>

          <button
            onClick={() => setIsBroadcastOpen(true)}
            className="bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-semibold px-5 py-2.5 rounded-2xl transition flex items-center gap-2 text-xs shadow-lg"
          >
            <Send className="w-4 h-4" />
            <span>Broadcast Alert</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-4">
        {[
          { key: 'ALL', label: `All Alerts (${notifications.length})` },
          { key: 'UNREAD', label: `Unread (${unreadCount})` },
          { key: 'BOOKING', label: 'Bookings' },
          { key: 'FAULT', label: 'Faults' },
          { key: 'MAINTENANCE', label: 'Maintenance' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilterType(tab.key)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              filterType === tab.key
                ? 'bg-orange-500 text-white shadow-md'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-20 bg-slate-900 animate-pulse border border-slate-800 rounded-2xl"></div>
          ))}
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center flex flex-col items-center justify-center">
          <Bell className="w-16 h-16 text-slate-700 mb-4 opacity-30" />
          <h3 className="text-xl font-bold text-white mb-1">No Notifications Found</h3>
          <p className="text-slate-400 text-sm">No notification records match your selected filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotifications.map(item => {
            const Icon = item.icon || Bell;
            return (
              <div
                key={item.id}
                className={`p-5 rounded-3xl border transition flex items-start justify-between gap-4 ${
                  item.isRead
                    ? 'bg-slate-900/60 border-slate-800/80 opacity-80'
                    : 'bg-slate-900 border-slate-700/80 shadow-lg'
                }`}
              >
                <div className="flex gap-4 items-start">
                  <div className={`p-3 rounded-2xl border ${item.badgeColor} shrink-0 mt-0.5`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-white text-sm sm:text-base">{item.title}</h3>
                      {!item.isRead && (
                        <span className="w-2 h-2 rounded-full bg-orange-500 inline-block"></span>
                      )}
                    </div>
                    <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">{item.message}</p>
                    <span className="text-[11px] text-slate-500 font-mono mt-2 block">
                      {new Date(item.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {!item.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(item.id)}
                      className="p-2 text-slate-400 hover:text-green-400 hover:bg-slate-800 rounded-xl transition"
                      title="Mark as Read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteNotif(item.id)}
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
      )}

      {/* Broadcast Alert Modal */}
      {isBroadcastOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800 mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Send className="w-5 h-5 text-orange-500" />
                Broadcast System Notification
              </h2>
              <button onClick={() => setIsBroadcastOpen(false)} className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendBroadcast} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">Recipient Audience</label>
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 text-white text-sm focus:outline-none focus:border-orange-500"
                >
                  <option value="ALL">All Users (Students & Faculty)</option>
                  <option value="STUDENT">Students Only</option>
                  <option value="FACULTY">Faculty Only</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">Notification Title *</label>
                <input
                  type="text"
                  required
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  placeholder="e.g. System Maintenance Notice"
                  className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 text-white text-sm focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">Message Content *</label>
                <textarea
                  rows={4}
                  required
                  value={broadcastMsg}
                  onChange={(e) => setBroadcastMsg(e.target.value)}
                  placeholder="Type system alert message here..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 text-white text-sm focus:outline-none focus:border-orange-500 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button type="button" onClick={() => setIsBroadcastOpen(false)} className="px-5 py-2.5 rounded-2xl font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 text-sm transition">Cancel</button>
                <button type="submit" disabled={sending} className="px-5 py-2.5 rounded-2xl font-medium text-white bg-orange-500 hover:bg-orange-600 active:scale-95 text-sm transition flex items-center gap-2 disabled:opacity-60">
                  <Send className="w-4 h-4" />
                  <span>{sending ? 'Sending...' : 'Send Broadcast'}</span>
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