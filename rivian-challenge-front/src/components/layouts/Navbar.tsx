'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, ChevronDown } from 'lucide-react';

export function Navbar() {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span onClick={() => router.replace('/')} className="text-xl font-bold text-gray-900 cursor-pointer">PrototypeChargeQueue™</span>
            </div>
          </div>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center h-full px-3 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 rounded-md transition-colors"
            >
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">
                    {user.fullName.charAt(0)}
                  </span>
                </div>
                <span className="ml-2 text-sm font-medium">
                  {user.fullName}
                </span>
                <ChevronDown className="ml-1 h-4 w-4 text-gray-500" />
              </div>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-1 w-48 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 divide-y divide-gray-100">
                <div className="py-1">
                  <div className="px-4 py-2 text-sm">
                    <div className="text-gray-900">{user.fullName}</div>
                    <div className="text-gray-500 text-xs">{user.email}</div>
                    <div className="text-gray-500 text-xs mt-1">
                      {user.userType}
                      {user.userType === 'Employee' && 
                        ` • ${user.travelDistanceKm}km travel distance`
                      }
                    </div>
                  </div>
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 flex items-center group"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}