import React, { useState, useEffect } from "react";
import { Mail, MessageSquare, Trash2, Search, Download, Clock, User, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../../services/api";

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadMessages = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/business/contact-messages").catch(() => ({ data: [] }));
      const list = Array.isArray(res?.data || res) ? (res?.data || res) : [];
      setMessages(list);
    } catch (e) {
      toast.error("Failed to load contact messages.");
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    try {
      await api.delete(`/api/business/contact-messages/${id}`);
      setMessages((prev) => prev.filter((m) => (m.messageId || m.id) !== id));
      toast.success("Contact message deleted.");
    } catch (err) {
      toast.error("Failed to delete message.");
    }
  };

  const handleExportCSV = () => {
    if (messages.length === 0) {
      toast.error("No contact messages to export.");
      return;
    }
    const headers = ["ID", "Name", "Email", "Subject", "Message", "SubmittedAt"];
    const rows = messages.map((m) => [
      String(m.messageId || m.id || ""),
      `"${String(m.name || "").replace(/"/g, '""')}"`,
      `"${String(m.email || "").replace(/"/g, '""')}"`,
      `"${String(m.subject || "").replace(/"/g, '""')}"`,
      `"${String(m.message || "").replace(/"/g, '""')}"`,
      `"${String(m.createdAt || "").replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Contact_Messages_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Exported contact messages to CSV!");
  };

  const filtered = messages.filter((m) => {
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      (m.name && m.name.toLowerCase().includes(term)) ||
      (m.email && m.email.toLowerCase().includes(term)) ||
      (m.subject && m.subject.toLowerCase().includes(term)) ||
      (m.message && m.message.toLowerCase().includes(term))
    );
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-2xl text-orange-400">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Received Public Messages</h2>
            <p className="text-xs text-slate-400">Live incoming messages submitted through the public Contact form</p>
          </div>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 text-xs font-semibold rounded-2xl border border-slate-700 transition flex items-center gap-2"
        >
          <Download className="w-4 h-4 text-orange-400" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search live contact messages..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-2xl pl-11 pr-4 py-3 text-white text-xs outline-none focus:border-orange-500 transition"
        />
      </div>

      {/* Message List */}
      {loading ? (
        <div className="p-8 text-center text-slate-400 animate-pulse text-xs">Loading live messages from server...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 bg-slate-800/40 rounded-2xl border border-slate-800 text-slate-400 text-xs space-y-1">
          <Mail className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-500" />
          <p className="font-semibold text-slate-300">No Contact Messages Found</p>
          <p className="text-[11px] text-slate-500">Public messages submitted via the home page will automatically appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((msg) => {
            const mId = msg.messageId || msg.id;
            return (
              <div
                key={mId}
                className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 hover:border-slate-600 transition flex flex-col sm:flex-row justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-bold text-white text-sm flex items-center gap-1.5">
                      <User className="w-4 h-4 text-orange-400" />
                      {msg.name || "Visitor"}
                    </span>
                    <a href={`mailto:${msg.email}`} className="text-xs text-orange-400 hover:underline">
                      {msg.email}
                    </a>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-200">{msg.subject || "General Inquiry"}</h4>
                  <p className="text-xs text-slate-300 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80 leading-relaxed whitespace-pre-wrap">
                    {msg.message}
                  </p>
                  <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {msg.createdAt ? new Date(msg.createdAt).toLocaleString() : "Recently"}
                  </div>
                </div>

                <div className="self-end sm:self-start">
                  <button
                    onClick={() => handleDelete(mId)}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-xl transition"
                    title="Delete message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ContactMessages;
