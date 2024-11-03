import React from 'react';
import { BrainCog, Menu, Home, Compass, Mail, LogIn } from 'lucide-react';

interface NavbarProps {
  onMenuClick: () => void;
}

function NavLink({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <a
      href="#"
      className="text-gray-300 hover:text-white flex items-center space-x-1 transition-colors duration-200"
    >
      {icon}
      <span>{text}</span>
    </a>
  );
}

export function Navbar({ onMenuClick }: NavbarProps) {
  return (
    <nav className="fixed w-full bg-black/10 backdrop-blur-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 flex items-center space-x-2">
            <BrainCog className="h-8 w-8 text-purple-400" />
            <span className="text-white text-xl font-bold">MLflow</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <NavLink icon={<Home size={18} />} text="Home" />
            <NavLink icon={<Compass size={18} />} text="Explore" />
            <NavLink icon={<Mail size={18} />} text="Contact" />
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-300 transform hover:scale-105">
              <LogIn size={18} />
              <span>Login</span>
            </button>
          </div>

          <button
            onClick={onMenuClick}
            className="md:hidden text-gray-300 hover:text-white transition-colors"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
