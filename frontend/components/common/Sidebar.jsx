import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Server, BookOpen, AlertCircle, Wrench, BarChart3, Settings } from 'lucide-react';

const Sidebar = ({ links = [] }) => {
  return (
    <aside className="w-64 bg-slate-900/90 border-r border-slate-800 flex flex-col h-full">
      <div className="p-6 border-b border-slate-800">
        <h2 className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          SmartLab AI
        </h2>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                isActive ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`
            }
          >
            {link.icon && <link.icon className="w-4 h-4 mr-3" />}
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
