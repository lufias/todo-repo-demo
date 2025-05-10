import { Outlet } from 'react-router-dom';
import { useState, FC } from 'react';
import { FaBars } from 'react-icons/fa';
import Sidebar from './Sidebar';
import ThemeToggle from './ThemeToggle';
import AppLogo from '../assets/menu-food-left.svg?react';

interface LayoutProps {
  // Add any props if needed in the future
}

const Layout: FC<LayoutProps> = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const handleSidebarToggle = (): void => {
    setIsSidebarOpen(prev => !prev);
  };

  const handleSidebarClose = (): void => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--text-primary)] transition-colors">
      {/* Header */}
      <header className="bg-[var(--surface)] material-elevation-2">
        <div className="container max-w-full px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Burger menu only visible on mobile */}
            <button
              onClick={handleSidebarToggle}
              className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-gray-100 rounded-lg transition-all duration-200 md:hidden ripple"
              aria-label="Open sidebar"
              data-testid="sidebar-toggle"
            >
              <FaBars />
            </button>
            <AppLogo className="w-8 h-8 text-[var(--primary)]" />
            <h1 className="text-2xl font-bold text-[var(--text-primary)]" data-testid="app-title">Todo App</h1>
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
            onClick={handleSidebarClose}
            aria-label="Close sidebar backdrop"
            data-testid="sidebar-backdrop"
          />
        )}
        <div
          className={`
            fixed z-40 top-0 left-0 h-full w-64 bg-[var(--surface)] border-r border-gray-200 transition-all duration-300 ease-in-out material-elevation-2
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            md:static md:translate-x-0 md:flex-shrink-0 md:h-auto md:z-auto
          `}
          data-testid="sidebar"
        >
          {/* Close button only on mobile */}
          <div className="flex items-center p-4 border-b border-gray-200 md:hidden">
            <button
              onClick={handleSidebarClose}
              className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-gray-100 rounded-lg transition-all duration-200 mr-2 ripple"
              aria-label="Close sidebar"
              data-testid="sidebar-close"
            >
              <FaBars />
            </button>
          </div>
          {/* On desktop, just show the label */}
          <div className="hidden md:flex items-center p-4 border-b border-gray-200">
          </div>
          <Sidebar />
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-auto flex justify-center" data-testid="main-content">
          <div className="container px-4 py-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-[var(--surface)] border-t border-gray-200 flex justify-center material-elevation-1" data-testid="footer">
        <div className="container px-4 py-4">
          <p className="text-center text-[var(--text-secondary)]">© 2025 Todo App. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 