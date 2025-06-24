import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from '../lib/auth';

export default function Sidebar() {
  const pathname = usePathname();
  const [isStudentMenuOpen, setIsStudentMenuOpen] = useState(false);

  const handleLogout = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("You are not logged in!");
      return;
    }
    
    signOut();
    localStorage.removeItem('token');
    window.location.href = '/login';
  };
  

  const isActive = (path) => {
    return pathname === path ? 'bg-gray-700' : '';
  };

  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen p-4 flex flex-col">
      <div className="mb-8">
        <h2 className="text-xl font-bold">CITN Dashboard</h2>
        <p className="text-sm text-gray-400">Admin Panel</p>
      </div>

      <nav className="flex-1">
        <ul className="space-y-2">
          <li>
            <Link href="/" className={`flex items-center p-2 rounded hover:bg-gray-700 ${isActive('/')}`}>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Dashboard
            </Link>
          </li>
          <li>
            <button 
              onClick={() => setIsStudentMenuOpen(!isStudentMenuOpen)} 
              className="w-full flex items-center p-2 rounded hover:bg-gray-700 focus:outline-none"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Students
              <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isStudentMenuOpen && (
              <ul className="pl-6 space-y-2">
                <li>
                  <Link href="/students" className={`block p-2 rounded hover:bg-gray-700 ${isActive('/students')}`}>
                    View Students
                  </Link>
                </li>
                <li>
                  <Link href="/students/add" className="block p-2 rounded hover:bg-gray-700">
                    Add Student
                  </Link>
                </li>
              </ul>
            )}
          </li>
          <li>
            <Link href="/courses" className={`flex items-center p-2 rounded hover:bg-gray-700 ${isActive('/courses')}`}>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Courses
            </Link>
          </li>
          <li>
            <Link href="/pending-fees" className={`flex items-center p-2 rounded hover:bg-gray-700 ${isActive('/pending-fees')}`}>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Pending Fees
            </Link>
          </li>
        </ul>
      </nav>

      <div className="mt-auto">
        <button 
          onClick={handleLogout} 
          className="w-full flex items-center p-2 text-red-400 hover:bg-gray-700 rounded"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </div>
  );
}
