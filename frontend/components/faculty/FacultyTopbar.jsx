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
          facultyService.getMyLabs().catch(() => ({ data: [] }))
        ]);

        const eqBody = eqRes?.data || eqRes;
        let eqItems = [];
        if (eqBody) {
          if (eqBody.success && eqBody.data) {
            eqItems = eqBody.data;
          } else {
            eqItems = eqBody;
          }
        }
        const eqList = Array.isArray(eqItems) ? eqItems : [];

        const labBody = labRes?.data || labRes;
        let labItems = [];
        if (labBody) {
          if (labBody.success && labBody.data) {
            labItems = labBody.data;
          } else {
            labItems = labBody;
          }
        }
        const labList = Array.isArray(labItems) ? labItems : [];
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

        {/* Search Bar Removed */}
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