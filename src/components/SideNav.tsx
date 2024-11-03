import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  LayoutDashboard,
  Brain,
  Cog,
  Camera,
  Plus,
  User,
  Users,
  FolderOpen,
} from 'lucide-react';
import { useSideNav } from '../Context/SideNavContext';

interface NavItemProps {
  icon: React.ReactNode;
  text: string;
  active?: boolean;
  onClick?: () => void;
}

function NavItem({ icon, text, active = false, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center px-4 py-3 text-sm ${
        active
          ? 'text-white bg-purple-600/20 border-r-2 border-purple-600'
          : 'text-gray-400 hover:text-white hover:bg-white/5'
      } transition-colors`}
    >
      <div className="flex items-center space-x-2">
        {icon}
        <span>{text}</span>
      </div>
    </button>
  );
}

interface SideNavProps {
  isOpen: boolean;
  onClose: () => void;
  onSectionChange: (section: string | null) => void;
}

export function SideNav({ isOpen, onClose, onSectionChange }: SideNavProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const { isCollapsed, setIsCollapsed } = useSideNav();
  const sideNavRef = useRef<HTMLDivElement>(null);

  const handleSectionClick = (section: string) => {
    setActiveSection(section);
    onSectionChange(section);
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        sideNavRef.current &&
        !sideNavRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const sideNavClasses = `fixed top-16 left-0 h-[calc(100vh-64px)] transform transition-all duration-300 ease-in-out z-40 
    ${isCollapsed ? 'w-16' : 'w-64'} bg-slate-900
    ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`;

  return (
    <>
      <div ref={sideNavRef} className={sideNavClasses}>
        <div className="h-full flex flex-col">
          <div className="p-4 flex items-center justify-between border-b border-gray-700">
            {!isCollapsed && (
              <h2 className="text-white font-semibold">Tools</h2>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-gray-400 hover:text-white md:block hidden"
            >
              <ChevronLeft
                size={20}
                className={`transform transition-transform ${
                  isCollapsed ? 'rotate-180' : ''
                }`}
              />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className={`${isCollapsed ? 'px-2' : 'p-4'} space-y-4`}>
              {!isCollapsed && (
                <>
                  <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors">
                    <Plus size={18} />
                    <span>New Project</span>
                  </button>

                  <button className="w-full bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors">
                    <FolderOpen size={18} />
                    <span>View All Projects</span>
                  </button>
                </>
              )}
            </div>

            <div
              className={`${isCollapsed ? 'items-center' : ''} flex flex-col`}
            >
              <button
                onClick={() => handleSectionClick('dashboard')}
                className={`${
                  isCollapsed ? 'justify-center' : ''
                } p-3 hover:bg-white/5 transition-colors flex items-center space-x-2 ${
                  activeSection === 'dashboard'
                    ? 'text-purple-400 bg-purple-600/20'
                    : 'text-gray-400'
                }`}
              >
                <LayoutDashboard size={20} />
                {!isCollapsed && <span>Dashboard</span>}
              </button>

              <button
                onClick={() => handleSectionClick('data-science')}
                className={`${
                  isCollapsed ? 'justify-center' : ''
                } p-3 hover:bg-white/5 transition-colors flex items-center space-x-2 ${
                  activeSection === 'data-science'
                    ? 'text-purple-400 bg-purple-600/20'
                    : 'text-gray-400'
                }`}
              >
                <Brain size={20} />
                {!isCollapsed && <span>Data Science</span>}
              </button>

              <button
                onClick={() => handleSectionClick('deep-learning')}
                className={`${
                  isCollapsed ? 'justify-center' : ''
                } p-3 hover:bg-white/5 transition-colors flex items-center space-x-2 ${
                  activeSection === 'deep-learning'
                    ? 'text-purple-400 bg-purple-600/20'
                    : 'text-gray-400'
                }`}
              >
                <Cog size={20} />
                {!isCollapsed && <span>Deep Learning</span>}
              </button>

              <button
                onClick={() => handleSectionClick('computer-vision')}
                className={`${
                  isCollapsed ? 'justify-center' : ''
                } p-3 hover:bg-white/5 transition-colors flex items-center space-x-2 ${
                  activeSection === 'computer-vision'
                    ? 'text-purple-400 bg-purple-600/20'
                    : 'text-gray-400'
                }`}
              >
                <Camera size={20} />
                {!isCollapsed && <span>Computer Vision</span>}
              </button>
            </div>
          </div>

          {!isCollapsed && (
            <div className="p-4 border-t border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="bg-gray-700 p-2 rounded-full">
                  <User size={20} className="text-gray-300" />
                </div>
                <div>
                  <p className="text-sm text-white font-medium">Guest User</p>
                  <p className="text-xs text-gray-400">
                    Sign in to save progress
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}
    </>
  );
}

export default SideNav;
