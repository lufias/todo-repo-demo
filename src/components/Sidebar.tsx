import { useState } from 'react';
import { FaFolder, FaPlus, FaChevronDown, FaChevronRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

interface Folder {
  id: string;
  name: string;
  todos: string[];
}

interface SidebarProps {
  folders: Folder[];
  onAddFolder: () => void;
  onSelectFolder: (folderId: string) => void;
}

export default function Sidebar({ folders, onAddFolder, onSelectFolder }: SidebarProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  return (
    <div className="h-full bg-white border-r border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Folders</h2>
          <button
            onClick={onAddFolder}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Add new folder"
          >
            <FaPlus />
          </button>
        </div>
      </div>
      
      <div className="p-2 space-y-1 overflow-y-auto h-[calc(100%-4rem)]">
        {folders.map((folder) => (
          <div key={folder.id} className="rounded-lg">
            <button
              onClick={() => toggleFolder(folder.id)}
              className="w-full flex items-center justify-between p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-2">
                <FaFolder className="text-blue-500" />
                <span className="text-gray-700">{folder.name}</span>
              </div>
              {expandedFolders.has(folder.id) ? (
                <FaChevronDown className="text-gray-500" />
              ) : (
                <FaChevronRight className="text-gray-500" />
              )}
            </button>
            
            {expandedFolders.has(folder.id) && (
              <div className="ml-6 mt-1 space-y-1">
                {folder.todos.map((todoId) => (
                  <button
                    key={todoId}
                    onClick={() => onSelectFolder(folder.id)}
                    className="w-full text-left px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded transition-colors"
                  >
                    Todo {todoId}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 