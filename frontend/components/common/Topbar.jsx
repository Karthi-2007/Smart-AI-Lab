import React from 'react';
import Notificationbell from './Notificationbell';
import ProfileDropdown from './ProfileDropdown';

const Topbar = ({ title }) => {
  return (
    <header className="h-16 px-6 flex items-center justify-between border-b-2" style={{ background: '#ffffff', borderColor: '#cc6926' }}>
      <h1 className="text-lg font-bold" style={{ color: '#0b2545' }}>{title || 'Dashboard'}</h1>
      <div className="flex items-center space-x-4">
        <Notificationbell count={2} />
        <ProfileDropdown />
      </div>
    </header>
  );
};

export default Topbar;
