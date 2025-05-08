import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Todo App</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <p className="text-center text-gray-600">© 2024 Todo App. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
} 