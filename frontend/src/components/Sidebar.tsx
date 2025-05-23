'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FC } from 'react';
import Cookies from 'js-cookie';

const Sidebar: FC = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    // Remove auth token from cookies
    Cookies.remove('authToken');
    // Remove user data from localStorage
    localStorage.removeItem('user');
    // Redirect to login page
    router.push('/admin/login');
  };

  return (
    <aside id="sidebar" className="bg-indigo-800 text-white w-64 min-h-screen flex-shrink-0">
      <div className="p-4">
        <h1 className="text-2xl font-bold">SMS Dashboard</h1>
        <p className="text-indigo-200 text-sm">Student Management System</p>
      </div>
      <nav className="mt-6">
        <ul>
          <li className="relative">
            <Link href="/dashboard" className={`flex items-center text-white ${pathname === '/dashboard' ? 'active-nav-link' : 'opacity-75 hover:opacity-100'} py-4 pl-6 nav-item`}>
              <i className="fas fa-tachometer-alt mr-3"></i>
              Dashboard
            </Link>
          </li>
          <li className="relative">
            <Link href="/dashboard/students" className={`flex items-center text-white ${pathname === '/dashboard/students' ? 'active-nav-link' : 'opacity-75 hover:opacity-100'} py-4 pl-6 nav-item`}>
              <i className="fas fa-user-graduate mr-3"></i>
              Students
            </Link>
          </li>
          <li className="relative">
            <Link href="/dashboard/classes" className={`flex items-center text-white ${pathname === '/dashboard/classes' ? 'active-nav-link' : 'opacity-75 hover:opacity-100'} py-4 pl-6 nav-item`}>
              <i className="fas fa-chalkboard mr-3"></i>
              Classes
            </Link>
          </li>
          <li className="relative">
            <Link href="/dashboard/teachers" className={`flex items-center text-white ${pathname === '/dashboard/teachers' ? 'active-nav-link' : 'opacity-75 hover:opacity-100'} py-4 pl-6 nav-item`}>
              <i className="fas fa-chalkboard-teacher mr-3"></i>
              Teachers
            </Link>
          </li>
          <li className="relative">
            <Link href="/dashboard/subjects" className={`flex items-center text-white ${pathname === '/dashboard/subjects' ? 'active-nav-link' : 'opacity-75 hover:opacity-100'} py-4 pl-6 nav-item`}>
              <i className="fas fa-book mr-3"></i>
              Subjects
            </Link>
          </li>
          <li className="relative">
            <Link href="/dashboard/attendance" className={`flex items-center text-white ${pathname === '/dashboard/attendance' ? 'active-nav-link' : 'opacity-75 hover:opacity-100'} py-4 pl-6 nav-item`}>
              <i className="fas fa-calendar-check mr-3"></i>
              Attendance
            </Link>
          </li>
          <li className="relative">
            <Link href="/dashboard/reports" className={`flex items-center text-white ${pathname === '/dashboard/reports' ? 'active-nav-link' : 'opacity-75 hover:opacity-100'} py-4 pl-6 nav-item`}>
              <i className="fas fa-chart-bar mr-3"></i>
              Reports
            </Link>
          </li>
        </ul>
      </nav>
      <div className="absolute bottom-0 w-full">
        <button 
          onClick={handleLogout}
          className="w-full text-left flex items-center text-white opacity-75 hover:opacity-100 py-4 pl-6 nav-item hover:bg-indigo-700 transition-colors"
        >
          <i className="fas fa-sign-out-alt mr-3"></i>
          Log Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
