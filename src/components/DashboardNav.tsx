import React from 'react';
import { Menu, BrainCog, Bell, Users } from 'lucide-react';

interface DashboardNavProps {
  onMenuClick: () => void;
}

export function DashboardNav({ onMenuClick }: DashboardNavProps) {
  return (
    <nav className="fixed w-full bg-slate-900/90 backdrop-blur-md z-50 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={onMenuClick}
              className="text-gray-300 hover:text-white transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="ml-4 flex items-center space-x-2">
              <BrainCog className="h-8 w-8 text-purple-400" />
              <span className="text-white text-xl font-bold">MLflow</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="text-gray-300 hover:text-white p-2 rounded-lg hover:bg-white/5">
              <Bell className="h-5 w-5" />
            </button>
            <button className="hidden md:flex items-center space-x-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 px-4 py-2 rounded-lg transition-colors">
              <Users size={18} />
              <span>Invite Friends</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default DashboardNav;