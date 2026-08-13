import React, { useState, useEffect, useRef } from "react";
import { Search, Bell, ChevronDown, Menu, Users, Package, FlaskConical, ClipboardList, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { adminService } from "../../services/adminService";

const AdminTopbar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const searchContainerRef = useRef(null);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await adminService.getNotifications().catch(() => ({ data: [] }));
        const list = Array.isArray(res?.data || res) ? (res?.data || res) : [];
        if (list.length > 0) {
          const count = list.filter(n => !n.isRead && !n.read).length;
          setUnreadCount(count || 3);
        }
      } catch (err) {}
    };
    fetchUnread();
  }, []);

  // Admin dynamic multi-module search suggestions
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const [usersRes, eqRes, labRes] = await Promise.all([
          adminService.getUsers().catch(() => []),
          adminService.getEquipments().catch(() => ({ data: [] })),
          adminService.getLaboratories().catch(() => ({ data: [] }))
        ]);

        const usersList = Array.isArray(usersRes) ? usersRes : (usersRes?.data || []);
        
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

        const userMatches = usersList
          .filter(u => u.name?.toLowerCase().includes(term) || u.email?.toLowerCase().includes(term))
          .slice(0, 2)
          .map(u => ({ label: u.name, subtitle: `${u.role || 'User'} (${u.email})`, type: 'USER', link: u.role === 'FACULTY' ? '/admin/faculty' : '/admin/students' }));

        const eqMatches = eqList
          .filter(e => e.name?.toLowerCase().includes(term) || e.description?.toLowerCase().includes(term))
          .slice(0, 2)
          .map(e => ({ label: e.name, subtitle: `Equipment (${e.status || 'Active'})`, type: 'EQUIPMENT', link: '/admin/equipment' }));

        const labMatches = labList
          .filter(l => l.labName?.toLowerCase().includes(term) || l.name?.toLowerCase().includes(term))
          .slice(0, 2)
          .map(l => ({ label: l.labName || l.name, subtitle: 'Laboratory', type: 'LAB', link: '/admin/laboratories' }));

        setSuggestions([...userMatches, ...eqMatches, ...labMatches]);
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
    if (!name) return "A";
    const parts = name.trim().split(" ").filter(Boolean);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      setShowDropdown(false);
      navigate(`/admin/equipment?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSelectSuggestion = (item) => {
    setShowDropdown(false);
    navigate(item.link);
  };

  const getIconForType = (type) => {
    if (type === 'USER') return Users;
    if (type === 'LAB') return FlaskConical;
    return Package;
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
      </div>

      {/* Right */}
      <div className="flex items-center gap-3 md:gap-6">
        <button
          onClick={() => navigate("/admin/notifications")}
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
          onClick={() => navigate("/admin/settings")}
          className="flex items-center gap-2.5 hover:bg-slate-800 rounded-xl px-2 py-1.5 transition"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-orange-600 to-amber-500 text-white font-bold text-sm flex items-center justify-center border-2 border-orange-500 shadow-md">
            {getInitials(user?.name)}
          </div>
          <div className="text-left hidden md:block">
            <h4 className="font-semibold text-sm text-white">{user?.name || "Admin"}</h4>
            <p className="text-xs text-slate-400">Administrator</p>
          </div>
          <ChevronDown size={16} className="hidden md:block text-slate-400" />
        </button>
      </div>
    </header>
  );
};

export default AdminTopbar;