import React, { useState, useEffect, useRef } from "react";
import { Search, Bell, ChevronDown, Menu, Package, FlaskConical, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { facultyService } from "../../services/facultyService";

const FacultyTopbar = ({ onMenuClick }) => {
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
      const id = user?.id || user?.userId;
      if (!id) return;
      try {
        const res = await facultyService.getNotifications(id);
        const data = res?.data || res || [];
        if (Array.isArray(data)) {
          const count = data.filter(n => !n.isRead && !n.read).length;
          setUnreadCount(count);
        }
      } catch (err) {
        console.warn("Could not fetch faculty notifications count:", err);
      }
    };
    fetchUnread();
  }, [user]);

  // Dynamic search suggestion lookup for Faculty (equipment + labs)
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const [eqRes, labRes] = await Promise.all([
          facultyService.getEquipments().catch(() => ({ data: [] })),
          facultyService.getLabs().catch(() => ({ data: [] }))
        ]);

        const eqList = Array.isArray(eqRes?.data || eqRes) ? (eqRes?.data || eqRes) : [];
        const labList = Array.isArray(labRes?.data || labRes) ? (labRes?.data || labRes) : [];
        const term = searchQuery.toLowerCase().trim();

        const eqMatches = eqList
          .filter(e => e.name?.toLowerCase().includes(term) || e.description?.toLowerCase().includes(term))
          .slice(0, 3)
          .map(e => ({ ...e, itemType: "EQUIPMENT" }));

        const labMatches = labList
          .filter(l => l.labName?.toLowerCase().includes(term) || l.name?.toLowerCase().includes(term))
          .slice(0, 2)
          .map(l => ({ ...l, itemType: "LAB" }));

        setSuggestions([...eqMatches, ...labMatches]);
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
    if (!name) return "F";
    const parts = name.trim().split(" ").filter(Boolean);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      setShowDropdown(false);
      navigate(`/faculty/equipment?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSelectSuggestion = (item) => {
    setShowDropdown(false);
    if (item.itemType === "LAB") {
      navigate(`/faculty/labs`);
    } else {
      setSearchQuery(item.name);
      navigate(`/faculty/equipment?search=${encodeURIComponent(item.name)}`);
    }
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

        {/* Functional Search Bar */}
        <div ref={searchContainerRef} className="relative hidden sm:block w-full max-w-xs md:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search labs, equipment, approvals... (Press Enter)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchSubmit}
            onFocus={() => searchQuery.trim() && setShowDropdown(true)}
            className="w-full bg-slate-800 border border-slate-700 rounded-2xl pl-11 pr-9 py-2.5 focus:outline-none focus:border-orange-500 text-sm text-white placeholder-slate-400 transition"
          />
          {searchQuery && (
            <button
              onClick={() => { setSearchQuery(""); setShowDropdown(false); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X size={16} />
            </button>
          )}

          {/* Auto-suggest Search Dropdown */}
          {showDropdown && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="p-2 border-b border-slate-800 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Faculty Results ({suggestions.length})
              </div>
              {isSearching ? (
                <div className="p-4 text-xs text-slate-400 text-center animate-pulse">Searching...</div>
              ) : suggestions.length === 0 ? (
                <div className="p-4 text-xs text-slate-400 text-center">
                  No matching labs or equipment for "{searchQuery}"
                </div>
              ) : (
                <div className="divide-y divide-slate-800/60 max-h-60 overflow-y-auto">
                  {suggestions.map((item, idx) => (
                    <div
                      key={item.id || item.labId || idx}
                      onClick={() => handleSelectSuggestion(item)}
                      className="p-3 hover:bg-slate-800 cursor-pointer flex items-center justify-between transition group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-500">
                          {item.itemType === 'LAB' ? <FlaskConical size={16} /> : <Package size={16} />}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white group-hover:text-orange-400 transition">
                            {item.labName || item.name}
                          </p>
                          <p className="text-xs text-slate-400 truncate max-w-xs">{item.itemType === 'LAB' ? 'Engineering Laboratory' : (item.description || 'Equipment')}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        {item.itemType}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3 md:gap-6">
        <button
          onClick={() => navigate("/faculty/notifications")}
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
          onClick={() => navigate("/faculty/profile")}
          className="flex items-center gap-2.5 hover:bg-slate-800 rounded-xl px-2 py-1.5 transition"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-orange-600 to-amber-500 text-white font-bold text-sm flex items-center justify-center border-2 border-orange-500 shadow-md">
            {getInitials(user?.name)}
          </div>
          <div className="text-left hidden md:block">
            <h4 className="font-semibold text-sm text-white">{user?.name || "Faculty"}</h4>
            <p className="text-xs text-slate-400">Faculty</p>
          </div>
          <ChevronDown size={16} className="hidden md:block text-slate-400" />
        </button>
      </div>
    </header>
  );
};

export default FacultyTopbar;