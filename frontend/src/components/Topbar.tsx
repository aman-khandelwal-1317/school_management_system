'use client';

import { FC } from 'react';
import Image from 'next/image';

interface TopbarProps {
  toggleSidebar?: () => void;
}

const Topbar: FC<TopbarProps> = ({ toggleSidebar }) => {
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <header className="bg-white shadow-md">
      <div className="flex items-center justify-between px-6 py-3">
        <button 
          id="mobile-menu-button" 
          onClick={toggleSidebar} 
          className="md:hidden text-gray-500 focus:outline-none"
          aria-label="Toggle menu"
        >
          <i className="fas fa-bars"></i>
        </button>
        <div className="hidden md:flex items-center">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search subjects..." 
              className="w-64 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button className="absolute right-0 top-0 mt-2 mr-4 text-gray-500">
              <i className="fas fa-search"></i>
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleFullscreen}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Toggle fullscreen"
            title="Toggle fullscreen"
          >
            <i className="fas fa-expand text-xl"></i>
          </button>
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
              AU
            </div>
            <span className="text-sm text-gray-700">Admin User</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
