import React, { useState } from 'react';
import { User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const ProfileDropdown = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center space-x-3 p-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition"
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
          {user?.name ? user.name[0].toUpperCase() : 'U'}
        </div>
        <div className="text-left hidden sm:block pr-2">
          <p className="text-xs font-semibold text-white">{user?.name || 'User'}</p>
          <p className="text-[10px] text-slate-400 uppercase">{user?.role || 'Guest'}</p>
        </div>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-1 z-50">
          <div className="px-4 py-2 border-b border-slate-800">
            <p className="text-xs font-semibold text-white">{user?.name}</p>
            <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center px-4 py-2 text-xs text-rose-400 hover:bg-slate-800/80 transition"
          >
            <LogOut className="w-3.5 h-3.5 mr-2" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
