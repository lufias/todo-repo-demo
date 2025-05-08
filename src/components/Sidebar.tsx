import { useState } from 'react';
import { FaFolder, FaChevronDown, FaChevronRight, FaEllipsisV, FaTrash, FaStickyNote } from 'react-icons/fa';
import { FiFolderPlus } from 'react-icons/fi';
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
  onAddNote: (folderId: string) => void;
  onDeleteFolder: (folderId: string) => void;
  onDeleteNote: (folderId: string, noteId: string) => void;
}

export default function Sidebar({ 
  folders, 
  onAddFolder, 
  onSelectFolder, 
  onAddNote, 
  onDeleteFolder,
  onDeleteNote 
}: SidebarProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
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

  const toggleDropdown = (folderId: string) => {
    setActiveDropdown(activeDropdown === folderId ? null : folderId);
  };

  // Close dropdown when clicking outside
  const handleClickOutside = () => {
    setActiveDropdown(null);
  };

  return (
    <div className="p-2 space-y-1 overflow-y-auto h-[calc(100%-4rem)]" onClick={handleClickOutside}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-base font-medium text-gray-600">Folders</span>
        <button
          onClick={onAddFolder}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Add new folder"
        >
          <FiFolderPlus className="text-blue-400 text-base" />
        </button>
      </div>
      {folders.map((folder) => (
        <div key={folder.id} className="rounded-lg">
          <div className="flex items-center justify-between">
            <button
              onClick={() => toggleFolder(folder.id)}
              className="flex-1 flex items-center justify-between p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-2">
                <FaFolder className="text-blue-400 text-base" />
                <span className="text-gray-700 font-normal">{folder.name}</span>
              </div>
              {expandedFolders.has(folder.id) ? (
                <FaChevronDown className="text-gray-400 text-sm" />
              ) : (
                <FaChevronRight className="text-gray-400 text-sm" />
              )}
            </button>
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown(folder.id);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors ml-2"
                title="Folder options"
              >
                <FaEllipsisV className="text-gray-400 text-base" />
              </button>
              {activeDropdown === folder.id && (
                <div 
                  className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => {
                      onAddNote(folder.id);
                      setActiveDropdown(null);
                    }}
                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <FaStickyNote className="mr-2 text-green-400 text-sm" />
                    Add Note
                  </button>
                  <button
                    onClick={() => {
                      onDeleteFolder(folder.id);
                      setActiveDropdown(null);
                    }}
                    className="w-full flex items-center px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                  >
                    <FaTrash className="mr-2 text-sm" />
                    Delete Folder
                  </button>
                </div>
              )}
            </div>
          </div>
          {expandedFolders.has(folder.id) && (
            <div className="ml-6 mt-1 space-y-1">
              {folder.todos.map((todoId) => (
                <div key={todoId} className="flex items-center justify-between group">
                  <button
                    onClick={() => onSelectFolder(folder.id)}
                    className="flex-1 text-left px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded transition-colors font-normal"
                  >
                    Todo {todoId}
                  </button>
                  <button
                    onClick={() => onDeleteNote(folder.id, todoId)}
                    className="p-1 opacity-0 group-hover:opacity-100 hover:bg-gray-100 rounded transition-all"
                    title="Delete note"
                  >
                    <FaTrash className="text-red-400 text-xs" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
} 