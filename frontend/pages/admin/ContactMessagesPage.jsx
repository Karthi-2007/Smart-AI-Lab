import React, { useState, useEffect } from "react";
import {
  Mail,
  Search,
  Download,
  Trash2,
  CheckCircle2,
  Star,
  Clock,
  Send,
  MessageSquare,
  Inbox,
  Filter,
  User,
  Phone,
  Calendar,
  X,
  AlertCircle,
  Tag
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";

const ContactMessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/business/contact-messages").catch(() => ({ data: [] }));
      const list = Array.isArray(res?.data || res) ? (res?.data || res) : [];
      setMessages(list);
    } catch (err) {
      toast.error("Failed to load contact messages");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await api.put(`/api/business/contact-messages/${id}/status`, { status: newStatus });
      setMessages((prev) =>
        prev.map((m) => ((m.messageId || m.id) === id ? { ...m, status: newStatus } : m))
      );
      if (selectedMsg && (selectedMsg.messageId || selectedMsg.id) === id) {
        setSelectedMsg((prev) => ({ ...prev, status: newStatus }));
      }
      toast.success(`Message marked as ${newStatus.toLowerCase()}`);
    } catch (err) {
      toast.error("Failed to update message status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this inquiry message?")) return;
    try {
      await api.delete(`/api/business/contact-messages/${id}`);
      setMessages((prev) => prev.filter((m) => (m.messageId || m.id) !== id));
      if (selectedMsg && (selectedMsg.messageId || selectedMsg.id) === id) {
        setSelectedMsg(null);
      }
      toast.success("Message deleted");
    } catch (err) {
      toast.error("Failed to delete message");
    }
  };

  const handleSendReply = async () => {
    if (!replyText.trim()) {
      toast.error("Please enter a reply message.");
      return;
    }
    setSendingReply(true);
    try {
      const msgId = selectedMsg.messageId || selectedMsg.id;
      
      // 1. Call Spring Boot backend to register reply in database and dispatch portal notifications
      await api.post(`/api/business/contact-messages/${msgId}/reply`, {
        replyMessage: replyText.trim()
      }).catch((err) => console.warn("Backend reply save note:", err));

      // 2. Open direct Gmail / Mail client compose window to visitor's email address
      const mailtoUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
        selectedMsg.email
      )}&su=${encodeURIComponent("Re: " + (selectedMsg.subject || "SmartLab AI Inquiry"))}&body=${encodeURIComponent(
        `Dear ${selectedMsg.name || "Visitor"},\n\n` +
          replyText.trim() +
          `\n\nBest regards,\nSmartLab AI Administration Team\nKathir College of Engineering`
      )}`;

      window.open(mailtoUrl, "_blank");

      setMessages((prev) =>
        prev.map((m) => ((m.messageId || m.id) === msgId ? { ...m, status: "REPLIED" } : m))
      );
      setSelectedMsg((prev) => (prev ? { ...prev, status: "REPLIED" } : null));

      toast.success(`Reply ready & sent to ${selectedMsg.email}!`);
      setReplyText("");
    } catch (err) {
      toast.error("Failed to send reply.");
    } finally {
      setSendingReply(false);
    }
  };

  const filteredMessages = messages.filter((m) => {
    const term = searchQuery.toLowerCase();
    const matchesSearch =
      (m.name || "").toLowerCase().includes(term) ||
      (m.email || "").toLowerCase().includes(term) ||
      (m.subject || "").toLowerCase().includes(term) ||
      (m.message || "").toLowerCase().includes(term);

    const matchesStatus =
      statusFilter === "All"
        ? true
        : (m.status || "UNREAD").toUpperCase() === statusFilter.toUpperCase();

    const matchesCategory =
      categoryFilter === "All"
        ? true
        : (m.category || "").toLowerCase() === categoryFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const totalCount = messages.length;
  const unreadCount = messages.filter((m) => (m.status || "UNREAD").toUpperCase() === "UNREAD").length;
  const repliedCount = messages.filter((m) => (m.status || "").toUpperCase() === "REPLIED").length;
  const starredCount = messages.filter((m) => (m.status || "").toUpperCase() === "STARRED").length;

  const handleExportCSV = () => {
    if (filteredMessages.length === 0) {
      toast.error("No messages to export");
      return;
    }
    const headers = ["ID,Sender Name,Email,Phone,Subject,Category,Status,Received Date\n"];
    const rows = filteredMessages.map((m) => {
      const mId = m.messageId || m.id;
      const date = m.createdAt ? new Date(m.createdAt).toLocaleString() : "N/A";
      return `"${mId}","${m.name || "N/A"}","${m.email || "N/A"}","${m.phone || "N/A"}","${m.subject || "N/A"}","${m.category || "General"}","${m.status || "UNREAD"}","${date}"\n`;
    });

    const blob = new Blob([headers.concat(rows).join("")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `SmartLab_Contact_Messages_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Contact inquiries exported as CSV!");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Mail className="w-7 h-7 text-orange-500" />
            <span>Public Contact Inquiries</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage, inspect, and respond to incoming user messages, equipment requests, and lab support inquiries.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-2xl transition border border-slate-700 flex items-center gap-2 shadow-lg"
        >
          <Download className="w-4 h-4 text-orange-400" />
          <span>Export Messages (CSV)</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">Total Inquiries</span>
            <Inbox className="w-5 h-5 text-orange-400" />
          </div>
          <p className="text-2xl font-extrabold text-white mt-2">{totalCount}</p>
          <span className="text-[10px] text-slate-500">All submitted messages</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">Unread Messages</span>
            <AlertCircle className="w-5 h-5 text-amber-400 animate-pulse" />
          </div>
          <p className="text-2xl font-extrabold text-amber-400 mt-2">{unreadCount}</p>
          <span className="text-[10px] text-slate-500">Awaiting review</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">Replied Inquiries</span>
            <CheckCircle2 className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-2xl font-extrabold text-green-400 mt-2">{repliedCount}</p>
          <span className="text-[10px] text-slate-500">Resolved & answered</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">Starred / Priority</span>
            <Star className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="text-2xl font-extrabold text-yellow-400 mt-2">{starredCount}</p>
          <span className="text-[10px] text-slate-500">High priority requests</span>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {["All", "UNREAD", "STARRED", "REPLIED"].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
                statusFilter === tab
                  ? "bg-orange-500 text-white shadow-md"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
              }`}
            >
              {tab === "UNREAD" ? "Unread" : tab === "STARRED" ? "Starred" : tab === "REPLIED" ? "Replied" : "All Messages"}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sender, email, or subject..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 outline-none focus:border-orange-500 transition"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-xs text-slate-300 rounded-xl px-3 py-2 outline-none focus:border-orange-500 transition"
          >
            <option value="All">All Categories</option>
            <option value="General Inquiry">General Inquiry</option>
            <option value="Equipment Booking">Equipment Booking</option>
            <option value="Technical Support">Technical Support</option>
            <option value="Lab Collaboration">Lab Collaboration</option>
          </select>
        </div>
      </div>

      {/* Main Inbox & Reader Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Messages List */}
        <div className={`${selectedMsg ? "lg:col-span-5" : "lg:col-span-12"} space-y-3 transition-all`}>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="divide-y divide-slate-800">
              {loading ? (
                Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="p-4 animate-pulse space-y-2">
                      <div className="h-4 bg-slate-800 rounded w-1/3"></div>
                      <div className="h-3 bg-slate-800 rounded w-2/3"></div>
                    </div>
                  ))
              ) : filteredMessages.length === 0 ? (
                <div className="p-12 text-center text-slate-500">
                  <Inbox className="w-10 h-10 mx-auto mb-3 text-slate-700" />
                  <p className="text-base font-semibold text-slate-400">No Messages Found</p>
                  <p className="text-xs text-slate-500 mt-1">No contact inquiries match your active search filters.</p>
                </div>
              ) : (
                filteredMessages.map((msg) => {
                  const mId = msg.messageId || msg.id;
                  const isSelected = selectedMsg && (selectedMsg.messageId || selectedMsg.id) === mId;
                  const isUnread = (msg.status || "UNREAD").toUpperCase() === "UNREAD";
                  const isStarred = (msg.status || "").toUpperCase() === "STARRED";
                  const isReplied = (msg.status || "").toUpperCase() === "REPLIED";

                  return (
                    <div
                      key={mId}
                      onClick={() => {
                        setSelectedMsg(msg);
                        if (isUnread) handleUpdateStatus(mId, "READ");
                      }}
                      className={`p-4 cursor-pointer transition flex items-start justify-between gap-3 ${
                        isSelected
                          ? "bg-orange-500/10 border-l-4 border-l-orange-500"
                          : isUnread
                          ? "bg-slate-800/40 hover:bg-slate-800"
                          : "hover:bg-slate-800/30"
                      }`}
                    >
                      <div className="flex gap-3 overflow-hidden">
                        <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-orange-400 text-xs shrink-0 mt-0.5">
                          {(msg.name || "U").charAt(0).toUpperCase()}
                        </div>

                        <div className="overflow-hidden">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-semibold truncate ${isUnread ? "text-white font-bold" : "text-slate-200"}`}>
                              {msg.name || "Visitor"}
                            </span>
                            <span className="text-[10px] text-slate-500 truncate">({msg.email})</span>
                          </div>

                          <h4 className={`text-xs truncate mt-0.5 ${isUnread ? "text-orange-400 font-bold" : "text-slate-300"}`}>
                            {msg.subject || "No Subject"}
                          </h4>

                          <p className="text-[11px] text-slate-400 truncate mt-1">
                            {msg.message}
                          </p>

                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-[9px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700">
                              {msg.category || "General"}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : "Today"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateStatus(mId, isStarred ? "READ" : "STARRED");
                          }}
                          className={`p-1 rounded-lg transition ${
                            isStarred ? "text-yellow-400" : "text-slate-600 hover:text-slate-300"
                          }`}
                        >
                          <Star className="w-4 h-4 fill-current" />
                        </button>

                        {isUnread && (
                          <span className="w-2 h-2 rounded-full bg-orange-500 shadow-lg shadow-orange-500/50"></span>
                        )}
                        {isReplied && (
                          <span className="text-[10px] text-green-400 font-semibold px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20">
                            Replied
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Message Detail Reader Drawer */}
        {selectedMsg && (
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 font-bold text-sm">
                  {(selectedMsg.name || "U").charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{selectedMsg.name}</h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <span>{selectedMsg.email}</span>
                    {selectedMsg.phone && <span>• {selectedMsg.phone}</span>}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDelete(selectedMsg.messageId || selectedMsg.id)}
                  className="p-2 text-slate-400 hover:text-red-400 rounded-xl hover:bg-slate-800 transition"
                  title="Delete message"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedMsg(null)}
                  className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Message Metadata */}
            <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-4 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-orange-400" /> Subject:
                </span>
                <span className="font-semibold text-white">{selectedMsg.subject}</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-orange-400" /> Received:
                </span>
                <span className="font-mono text-slate-300">
                  {selectedMsg.createdAt ? new Date(selectedMsg.createdAt).toLocaleString() : "N/A"}
                </span>
              </div>
            </div>

            {/* Body Message */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 text-sm text-slate-200 leading-relaxed space-y-2 min-h-[140px]">
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">Message Body</p>
              <p className="whitespace-pre-wrap">{selectedMsg.message}</p>
            </div>

            {/* Quick Admin Reply Form */}
            <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-orange-400" /> Reply to Inquiry
                </label>
                <span className="text-[10px] text-slate-400 font-mono bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-700">
                  From: <strong className="text-orange-400">smartlab.ai.kce@gmail.com</strong>
                </span>
              </div>

              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={`Type your reply to ${selectedMsg.email}...`}
                rows={3}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 outline-none focus:border-orange-500 transition resize-none"
              />

              <div className="flex items-center justify-between pt-1">
                <a
                  href={`mailto:${selectedMsg.email}?subject=Re: ${encodeURIComponent(selectedMsg.subject || "SmartLab AI Inquiry")}`}
                  className="text-xs text-orange-400 hover:underline flex items-center gap-1"
                >
                  <Mail className="w-3.5 h-3.5" /> Open Default Mail Client
                </a>

                <button
                  onClick={handleSendReply}
                  disabled={sendingReply}
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-semibold text-xs rounded-xl transition shadow-lg flex items-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{sendingReply ? "Sending Reply..." : "Send Reply"}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactMessagesPage;
