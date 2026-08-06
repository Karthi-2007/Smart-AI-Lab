import React from 'react';
import Notificationbell from './Notificationbell';
import ProfileDropdown from './ProfileDropdown';

const Topbar = ({ title }) => {
  return (
    <header className="h-16 bg-slate-900/60 backdrop-blur-xl border-b border-slate-800 px-6 flex items-center justify-between">
      <h1 className="text-lg font-semibold text-white">{title || 'Dashboard'}</h1>
      <div className="flex items-center space-x-4">
        <Notificationbell count={2} />
        <ProfileDropdown />
      </div>
    </header>
  );
};

export default Topbar;
