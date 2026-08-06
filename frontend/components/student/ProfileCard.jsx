import React from 'react';
import { User, Mail, GraduationCap, Building2 } from 'lucide-react';

const ProfileCard = ({ profile }) => {
  const item = profile || {
    name: 'Aarav Mehta',
    email: 'aarav.mehta@university.edu',
    regNo: 'RA2111003010492',
    department: 'Computer Science Engineering',
    year: '4th Year',
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 space-y-4">
      <div className="flex items-center space-x-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xl font-bold">
          {item.name ? item.name[0].toUpperCase() : 'S'}
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">{item.name}</h3>
          <p className="text-xs text-cyan-400 font-mono">{item.regNo}</p>
        </div>
      </div>
      <div className="space-y-2 pt-2 border-t border-slate-800 text-xs text-slate-300">
        <div className="flex items-center space-x-2">
          <Mail className="w-4 h-4 text-slate-400" />
          <span>{item.email}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Building2 className="w-4 h-4 text-slate-400" />
          <span>{item.department}</span>
        </div>
        <div className="flex items-center space-x-2">
          <GraduationCap className="w-4 h-4 text-slate-400" />
          <span>{item.year}</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
