'use client';

import { FC } from 'react';
import Image from 'next/image';

interface TopbarProps {
  toggleSidebar?: () => void;
}

const Topbar: FC<TopbarProps> = ({ toggleSidebar }) => {
  return (
    <header className="bg-white shadow-md">
      <div className="flex items-center justify-between px-6 py-3">
        <button 
          id="mobile-menu-button" 
          onClick={toggleSidebar} 
          className="md:hidden text-gray-500 focus:outline-none"
        >
          <i className="fas fa-bars"></i>
        </button>
        <div className="flex items-center">
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
        <div className="flex items-center">
          <div className="relative">
            <button className="flex items-center text-gray-500 focus:outline-none mr-4">
              <i className="fas fa-bell text-xl"></i>
              <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">3</span>
            </button>
          </div>
          <div className="relative">
            <button className="flex items-center text-sm focus:outline-none">
              <Image 
                className="h-8 w-8 rounded-full object-cover" 
                src="https://ui-avatars.com/api/?name=Admin+User" 
                alt="Profile"
                width={32}
                height={32}
              />
              <span className="ml-2 mr-1 text-gray-700">Admin User</span>
              <i className="fas fa-chevron-down text-xs text-gray-500"></i>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
