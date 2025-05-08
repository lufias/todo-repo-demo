import { useState, useEffect } from 'react';
import { FaFolder, FaChevronDown, FaChevronRight, FaEllipsisV, FaTrash, FaStickyNote } from 'react-icons/fa';
import { FiFolderPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loadFolders, addFolder as addFolderThunk, deleteFolder as deleteFolderThunk } from '../store/slices/sidebarSlice';

interface Folder {
  id: string;
  name: string;
  todos: string[];
}

export default function Sidebar() {
  const dispatch = useAppDispatch();
  const folders = useAppSelector(state => state.sidebar.folders);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [addingFolder, setAddingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(loadFolders());
  }, [dispatch]);

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

  const handleAddFolder = (name: string) => {
    dispatch(addFolderThunk(name));
  };

  const handleSelectFolder = (folderId: string) => {
    // Handle folder selection - you can implement navigation or state updates here
    console.log('Selected folder:', folderId);
  };

  const handleAddNote = (folderId: string) => {
    // Stub: implement note adding logic
    console.log('Add note to folder:', folderId);
  };

  const handleDeleteFolder = (folderId: string) => {
    dispatch(deleteFolderThunk(folderId));
  };

  const handleDeleteNote = (folderId: string, noteId: string) => {
    // Stub: implement note deletion logic
    console.log('Delete note', noteId, 'from folder', folderId);
  };

  return (
    <div className="p-2 space-y-1 overflow-y-auto h-[calc(100%-4rem)]" onClick={handleClickOutside}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-base font-medium text-gray-600">Folders</span>
        {addingFolder ? (
          <div className="flex items-center space-x-2">
            <FaFolder className="text-blue-400 text-base" />
            <input
              autoFocus
              type="text"
              className="border rounded px-2 py-1 text-sm w-28 focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Folder name"
              value={newFolderName}
              onChange={e => setNewFolderName(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && newFolderName.trim()) {
                  handleAddFolder(newFolderName.trim());
                  setNewFolderName('');
                  setAddingFolder(false);
                } else if (e.key === 'Escape') {
                  setAddingFolder(false);
                  setNewFolderName('');
                }
              }}
            />
            <button
              className="text-green-500 hover:text-green-700"
              title="Confirm"
              onClick={() => {
                if (newFolderName.trim()) {
                  handleAddFolder(newFolderName.trim());
                  setNewFolderName('');
                  setAddingFolder(false);
                }
              }}
            >
              ✓
            </button>
            <button
              className="text-red-400 hover:text-red-600"
              title="Cancel"
              onClick={() => {
                setAddingFolder(false);
                setNewFolderName('');
              }}
            >
              ✕
            </button>
          </div>
        ) : (
          <button
            onClick={e => {
              e.stopPropagation();
              setAddingFolder(true);
              setTimeout(() => {
                // Focus will be handled by autoFocus on input
              }, 0);
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Add new folder"
          >
            <FiFolderPlus className="text-blue-400 text-base" />
          </button>
        )}
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
                      handleAddNote(folder.id);
                      setActiveDropdown(null);
                    }}
                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <FaStickyNote className="mr-2 text-green-400 text-sm" />
                    Add Note
                  </button>
                  <button
                    onClick={() => {
                      handleDeleteFolder(folder.id);
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
          {/* Removed notes/lists display for now */}
        </div>
      ))}
    </div>
  );
} 