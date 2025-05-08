import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { FaBars } from 'react-icons/fa';
import Sidebar from './Sidebar';

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [folders, setFolders] = useState([
    { id: '1', name: 'Personal', todos: ['1', '2'] },
    { id: '2', name: 'Work', todos: ['3', '4'] },
  ]);

  const handleAddFolder = () => {
    const newFolder = {
      id: Date.now().toString(),
      name: 'New Folder',
      todos: [],
    };
    setFolders([...folders, newFolder]);
  };

  const handleSelectFolder = (folderId: string) => {
    // Handle folder selection - you can implement navigation or state updates here
    console.log('Selected folder:', folderId);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container px-4 py-4 flex items-center space-x-4">
          {/* Burger menu only visible on mobile */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors md:hidden"
            aria-label="Open sidebar"
          >
            <FaBars />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Todo App</h1>
        </div>
      </header>

      {/* Main Content with Sidebar */}
      <div className="flex-1 flex relative">
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
            fixed z-40 top-0 left-0 h-full w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            md:static md:translate-x-0 md:flex-shrink-0 md:h-auto md:z-auto
          `}
        >
          {/* Close button only on mobile */}
          <div className="flex items-center p-4 border-b border-gray-200 md:hidden">
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors mr-2"
              aria-label="Close sidebar"
            >
              <FaBars />
            </button>
            <span className="font-semibold text-lg text-gray-800">Folders</span>
          </div>
          {/* On desktop, just show the label */}
          <div className="hidden md:flex items-center p-4 border-b border-gray-200">
            <span className="font-semibold text-lg text-gray-800">Folders</span>
          </div>
          <Sidebar
            folders={folders}
            onAddFolder={handleAddFolder}
            onSelectFolder={handleSelectFolder}
          />
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-auto flex items-center justify-center">
          <div className="container px-4 py-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white shadow-sm">
        <div className="container px-4 py-4">
          <p className="text-center text-gray-600">© 2024 Todo App. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
} 