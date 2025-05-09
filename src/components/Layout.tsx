import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { FaBars } from 'react-icons/fa';
import Sidebar from './Sidebar';
import ThemeToggle from './ThemeToggle';

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Burger menu only visible on mobile */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors md:hidden"
              aria-label="Open sidebar"
            >
              <FaBars />
            </button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Todo App</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content with Sidebar */}
      <div className="flex-1 flex">
        {/* Sidebar overlay for mobile, static for md+ */}
        {/* Backdrop only on mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close sidebar backdrop"
          />
        )}
        <div
          className={`
            fixed z-40 top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            md:static md:translate-x-0 md:flex-shrink-0 md:h-auto md:z-auto
          `}
        >
          {/* Close button only on mobile */}
          <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700 md:hidden">
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors mr-2"
              aria-label="Close sidebar"
            >
              <FaBars />
            </button>
            <span className="font-semibold text-lg text-gray-800 dark:text-white">Folders</span>
          </div>
          {/* On desktop, just show the label */}
          <div className="hidden md:flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
            <span className="font-semibold text-lg text-gray-800 dark:text-white">Folders</span>
          </div>
          <Sidebar />
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-auto flex justify-center">
          <div className="container px-4 py-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-center  ">
        <div className="container px-4 py-4">
          <p className="text-center text-gray-600 dark:text-gray-400">© 2024 Todo App. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
} 