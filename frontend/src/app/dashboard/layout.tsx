'use client';

import { ReactNode, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import Script from 'next/script';

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Load Font Awesome */}
      <Script 
        src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js" 
        strategy="afterInteractive"
      />
      
      {/* Sidebar for desktop */}
      <Sidebar />
      
      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-gray-600 opacity-75" onClick={toggleSidebar}></div>
          <div className="fixed inset-y-0 left-0 flex flex-col z-50 w-64 bg-indigo-800">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar toggleSidebar={toggleSidebar} />
        
        {/* Main content area */}
        <main className="flex-1 overflow-y-auto bg-gray-100 p-4">
          <div className="container mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
