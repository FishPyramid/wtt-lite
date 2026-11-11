'use client';

import { useState } from 'react';
import Link from 'next/link';
import { HiHome, HiLogin, HiUserAdd, HiLogout } from 'react-icons/hi'; // Import React Icons

// Navigation links with React Icon components stored in the array
const navLinks = [
  { label: 'Home', href: '/', icon: HiHome },
  { label: 'Log in', href: '/login', icon: HiLogin, guestOnly: true },
  { label: 'Sign Up', href: '/signup', icon: HiUserAdd, guestOnly: true },
];

export default function Sidebar({ 
  children, 
  isLoggedIn,
  logoutFunction,
  username,
  usertype
}: { 
  children: React.ReactNode; 
  isLoggedIn: boolean; 
  logoutFunction: () => Promise<void>;
  username?: string;
  usertype?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  // Filter links dynamically based on session status
  const filteredLinks = navLinks.filter((link) => {
    if (link.guestOnly && isLoggedIn) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 relative">
      {/* 1. Fixed Open/Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-40 bg-emerald-900 text-white p-3 rounded-lg shadow-lg hover:bg-emerald-950 transition-colors flex items-center justify-center"
        aria-label="Toggle Menu"
      >
        <span className="text-xl">☰</span>
      </button>

      {/* 2. Slide-out Drawer Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-emerald-900 text-white z-50 shadow-2xl transition-transform duration-300 flex flex-col p-4 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Close Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setIsOpen(false)}
            className="bg-emerald-800 px-3 py-1.5 rounded text-sm hover:bg-emerald-700 transition-colors"
          >
            ✕ Close
          </button>
        </div>

        {/* Navigation Links Mapped from Filtered Array */}
        <nav className="flex flex-col gap-2">
          {filteredLinks.map((link) => {
            // Assign the icon component to a variable with an uppercase name for JSX
            const IconComponent = link.icon;

            return (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-emerald-800 transition-colors"
              >
                {/* Render the React Icon */}
                <IconComponent className="text-xl shrink-0" />
                <span className="whitespace-nowrap">{link.label}</span>
              </Link>
            );
          })}
        </nav>
        {isLoggedIn && (
          <form action={async () => {
              setIsOpen(false);
              await logoutFunction();
            }}
            className="mt-2">
            <button
              type="submit"
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-emerald-800 text-white transition-colors"
            >
              <HiLogout className="text-xl shrink-0" />
              <span className="whitespace-nowrap">Log Out</span>
            </button>
          </form>
        )}
        {isLoggedIn && (
          <p className='mt-2'>
            Logged in as {username}, {usertype}.
          </p>
        )}
      </aside>

      {/* 3. Main Content Area */}
      <main className="ml-0 w-full min-h-screen bg-gray-50 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}