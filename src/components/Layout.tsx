import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { FaBars } from 'react-icons/fa';
import Sidebar from './Sidebar';

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
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
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle sidebar"
          >
            <FaBars />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Todo App</h1>
        </div>
      </header>

      {/* Main Content with Sidebar */}
      <div className="flex-1 flex">
        {/* Sidebar */}
        <div 
          className={`${
            isSidebarOpen ? 'w-64' : 'w-0'
          } transition-all duration-300 ease-in-out overflow-hidden`}
        >
          <Sidebar
            folders={folders}
            onAddFolder={handleAddFolder}
            onSelectFolder={handleSelectFolder}
          />
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 py-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <p className="text-center text-gray-600">© 2024 Todo App. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
} 