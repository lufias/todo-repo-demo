import { useState, useEffect } from 'react';
import { FaFolder, FaChevronDown, FaChevronRight, FaEllipsisH, FaTrash, FaListUl } from 'react-icons/fa';
import { FiFolderPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  loadFolders,
  addFolder as addFolderThunk,
  deleteFolder as deleteFolderThunk,
  addList as addListThunk,
  loadListsByFolder,
  deleteList as deleteListThunk,
} from '../store/slices/sidebarSlice';

interface Folder {
  id: string;
  name: string;
}

export default function Sidebar() {
  const dispatch = useAppDispatch();
  const folders = useAppSelector(state => state.sidebar.folders);
  const lists = useAppSelector(state => state.sidebar.lists);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [addingFolder, setAddingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [addingListFolderId, setAddingListFolderId] = useState<string | null>(null);
  const [newListName, setNewListName] = useState('');
  const [activeListDropdown, setActiveListDropdown] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(loadFolders());
  }, [dispatch]);

  // Load lists when a folder is expanded
  useEffect(() => {
    if (expandedFolders.size === 1) {
      const folderId = Array.from(expandedFolders)[0];
      dispatch(loadListsByFolder(folderId));
    }
  }, [expandedFolders, dispatch]);

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.clear(); // Only one expanded at a time for simplicity
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
    setAddingListFolderId(null);
    setNewListName('');
  };

  const handleAddFolder = (name: string) => {
    dispatch(addFolderThunk(name));
  };

  const handleDeleteFolder = (folderId: string) => {
    dispatch(deleteFolderThunk(folderId));
  };

  const handleAddList = (folderId: string, content: string) => {
    dispatch(addListThunk({ folderId, content })).then(() => {
      dispatch(loadListsByFolder(folderId));
    });
  };

  const handleDeleteList = (listId: string, folderId: string) => {
    dispatch(deleteListThunk(listId)).then(() => {
      dispatch(loadListsByFolder(folderId));
    });
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
        <div key={folder.id} className="rounded-lg group">
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
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors ml-2 opacity-0 group-hover:opacity-100"
                title="Folder options"
              >
                <FaEllipsisH className="text-gray-400 text-xs" />
              </button>
              {activeDropdown === folder.id && (
                <div 
                  className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => {
                      setAddingListFolderId(folder.id);
                      setActiveDropdown(null);
                    }}
                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <FaListUl className="mr-2 text-blue-400 text-sm" />
                    Add List
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
          {expandedFolders.has(folder.id) && (
            <div className="ml-6 mt-1 space-y-1">
              {/* Add List input */}
              {addingListFolderId === folder.id && (
                <div className="flex items-center space-x-2 mb-2">
                  <input
                    autoFocus
                    type="text"
                    className="border rounded px-2 py-1 text-sm w-28 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="List name"
                    value={newListName}
                    onChange={e => setNewListName(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && newListName.trim()) {
                        handleAddList(folder.id, newListName.trim());
                        setNewListName('');
                        setAddingListFolderId(null);
                      } else if (e.key === 'Escape') {
                        setAddingListFolderId(null);
                        setNewListName('');
                      }
                    }}
                  />
                  <button
                    className="text-green-500 hover:text-green-700"
                    title="Confirm"
                    onClick={() => {
                      if (newListName.trim()) {
                        handleAddList(folder.id, newListName.trim());
                        setNewListName('');
                        setAddingListFolderId(null);
                      }
                    }}
                  >
                    ✓
                  </button>
                  <button
                    className="text-red-400 hover:text-red-600"
                    title="Cancel"
                    onClick={() => {
                      setAddingListFolderId(null);
                      setNewListName('');
                    }}
                  >
                    ✕
                  </button>
                </div>
              )}
              {/* Show lists for this folder */}
              {lists
                .filter(list => list.folderId === folder.id)
                .map(list => (
                  <div key={list.id} className="flex items-center justify-between group">
                    <button
                      className="flex-1 text-left px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded transition-colors font-normal"
                    >
                      {list.content}
                    </button>
                    <div className="relative">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setActiveListDropdown(activeListDropdown === list.id ? null : list.id);
                        }}
                        className="p-1 hover:bg-gray-100 rounded transition-colors ml-2 opacity-0 group-hover:opacity-100"
                        title="List options"
                      >
                        <FaEllipsisH className="text-gray-400 text-xs" />
                      </button>
                      {activeListDropdown === list.id && (
                        <div
                          className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 z-10"
                          onClick={e => e.stopPropagation()}
                        >
                          <button
                            onClick={() => {
                              handleDeleteList(list.id, folder.id);
                              setActiveListDropdown(null);
                            }}
                            className="w-full flex items-center px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                          >
                            <FaTrash className="mr-2 text-sm" />
                            Delete List
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
} 