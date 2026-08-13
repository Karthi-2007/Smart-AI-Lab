import React, { useState, useEffect, useRef } from "react";
import { Search, Bell, ChevronDown, Menu, Package, CalendarCheck, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { studentService } from "../../services/studentService";

const StudentTopbar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchContainerRef = useRef(null);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await studentService.getNotificationsAll().catch(() => ({ data: [] }));
        const list = Array.isArray(res?.data || res) ? (res?.data || res) : (res?.data?.data || []);
        const count = Array.isArray(list) ? list.filter(n => !(n.isRead || n.read)).length : 0;
        setUnreadCount(count);
      } catch (err) {
        setUnreadCount(0);
      }
    };
    fetchUnread();
  }, []);

  // Dynamic search suggestion lookup
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await studentService.getEquipmentList().catch(() => ({ data: [] }));
        const body = res?.data || res;
        let list = [];
        if (body) {
          if (body.success && body.data) {
            list = body.data;
          } else {
            list = body;
          }
        }
        const listData = Array.isArray(list) ? list : [];
        const term = searchQuery.toLowerCase().trim();
        const matches = listData.filter(
          e => e.name?.toLowerCase().includes(term) || e.description?.toLowerCase().includes(term)
        ).slice(0, 5);

        setSuggestions(matches);
        setShowDropdown(true);
      } catch (e) {
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getInitials = (name) => {
    if (!name) return "S";
    const parts = name.trim().split(" ").filter(Boolean);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      setShowDropdown(false);
      navigate(`/student/equipment?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSelectSuggestion = (eq) => {
    setShowDropdown(false);
    setSearchQuery(eq.name);
    navigate(`/student/equipment?search=${encodeURIComponent(eq.name)}`);
  };

  return (
    <header className="h-16 md:h-20 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 md:px-8 shrink-0">
      {/* Left: Hamburger + Search */}
      <div className="flex items-center gap-3 flex-1">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition text-slate-300"
        >
          <Menu size={20} />
        </button>

        {/* Search Bar Removed */}
      </div>

      {/* Right */}
      <div className="flex items-center gap-3 md:gap-6">
        <button
          onClick={() => navigate("/student/notifications")}
          title="Notifications"
          className="relative p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 transition text-slate-300"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center border-2 border-slate-900 shadow">
              {unreadCount}
            </span>
          )}
        </button>

        <button
          onClick={() => navigate("/student/profile")}
          className="flex items-center gap-2.5 hover:bg-slate-800 rounded-xl px-2 py-1.5 transition"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-orange-600 to-amber-500 text-white font-bold text-sm flex items-center justify-center border-2 border-orange-500 shadow-md">
            {getInitials(user?.name)}
          </div>
          <div className="text-left hidden md:block">
            <h4 className="font-semibold text-sm text-white">{user?.name || "Student"}</h4>
            <p className="text-xs text-slate-400">{user?.regNo || "Student"}</p>
          </div>
          <ChevronDown size={16} className="hidden md:block text-slate-400" />
        </button>
      </div>
    </header>
  );
};

export default StudentTopbar;