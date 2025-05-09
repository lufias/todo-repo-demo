import { useState, useEffect, FC, ChangeEvent, KeyboardEvent, MouseEvent } from 'react';
import { FaFolder } from 'react-icons/fa';
import { FiFolderPlus } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  loadFolders,
  addFolder as addFolderThunk,
  deleteFolder as deleteFolderThunk,
  addList as addListThunk,
  loadListsByFolder,
  deleteList as deleteListThunk,
  renameFolder as renameFolderThunk,
  renameList as renameListThunk,
  setSelectedListId,
} from '../store/slices/sidebarSlice';
import { loadTasksByList } from '../store/slices/taskListSlice';
import SidebarFolder from './SidebarFolder';
import { Folder, getAllFolders } from '../services/database';

interface SidebarProps {
  // Add any props if needed in the future
}

const Sidebar: FC<SidebarProps> = () => {
  const dispatch = useAppDispatch();
  const folders = useAppSelector(state => state.sidebar.folders);
  const lists = useAppSelector(state => state.sidebar.lists);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [addingFolder, setAddingFolder] = useState<boolean>(false);
  const [newFolderName, setNewFolderName] = useState<string>('');
  const [addingListFolderId, setAddingListFolderId] = useState<string | null>(null);
  const [newListName, setNewListName] = useState<string>('');
  const [activeListDropdown, setActiveListDropdown] = useState<string | null>(null);

  const disableDelete: boolean = folders.length === 1 && lists.length === 1;

  // Robust initialization: check storage directly
  useEffect(() => {
    (async () => {
      const storedFolders = await getAllFolders();
      if (!storedFolders || storedFolders.length === 0) {
        // No folders in storage, create default
        const folderAction = await dispatch(addFolderThunk('My Folder'));
        const folder = folderAction.payload as Folder;
        if (folder) {
          await dispatch(addListThunk({ folderId: folder.id, content: 'My List' }));
          setExpandedFolders(new Set([folder.id]));
        }
        // Always reload folders after creation to sync state
        dispatch(loadFolders());
      } else {
        // Just load folders as usual
        dispatch(loadFolders());
      }
    })();
  }, [dispatch]);

  const toggleFolder = (folderId: string): void => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
      // Load lists for the expanded folder
      dispatch(loadListsByFolder(folderId));
    }
    setExpandedFolders(newExpanded);
  };

  const toggleDropdown = (folderId: string): void => {
    setActiveDropdown(activeDropdown === folderId ? null : folderId);
  };

  // Close dropdown when clicking outside
  const handleClickOutside = (): void => {
    setActiveDropdown(null);
    setAddingListFolderId(null);
    setNewListName('');
  };

  const handleAddFolder = (name: string): void => {
    dispatch(addFolderThunk(name));
  };

  const handleDeleteFolder = (folderId: string): void => {
    dispatch(deleteFolderThunk(folderId));
  };

  const handleAddList = (folderId: string, content: string): void => {
    dispatch(addListThunk({ folderId, content })).then(() => {
      // Always reload lists for the currently expanded folder
      if (expandedFolders.size === 1) {
        const expandedId = Array.from(expandedFolders)[0];
        dispatch(loadListsByFolder(expandedId));
      }
      setNewListName('');
      setAddingListFolderId(null);
    });
  };

  const handleDeleteList = (listId: string, folderId: string): void => {
    dispatch(deleteListThunk(listId)).then(() => {
      dispatch(loadListsByFolder(folderId));
    });
  };

  const handleRenameFolder = (folderId: string, newName: string): void => {
    dispatch(renameFolderThunk({ folderId, newName }));
  };

  const handleRenameList = (listId: string, folderId: string, newName: string): void => {
    dispatch(renameListThunk({ listId, newName })).then(() => {
      dispatch(loadListsByFolder(folderId));
    });
  };

  const handleSelectList = (listId: string): void => {
    dispatch(setSelectedListId(listId));
    dispatch(loadTasksByList(listId));
  };

  const handleNewFolderNameChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setNewFolderName(e.target.value);
  };

  const handleNewFolderKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && newFolderName.trim()) {
      handleAddFolder(newFolderName.trim());
      setNewFolderName('');
      setAddingFolder(false);
    } else if (e.key === 'Escape') {
      setAddingFolder(false);
      setNewFolderName('');
    }
  };

  const handleAddFolderClick = (e: MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();
    setAddingFolder(true);
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
              onChange={handleNewFolderNameChange}
              onKeyDown={handleNewFolderKeyDown}
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
            onClick={handleAddFolderClick}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Add new folder"
          >
            <FiFolderPlus className="text-blue-400 text-base" />
          </button>
        )}
      </div>
      {folders.map((folder) => (
        <SidebarFolder
          key={folder.id}
          folder={folder}
          lists={lists}
          expanded={expandedFolders.has(folder.id)}
          onToggle={toggleFolder}
          onDropdown={toggleDropdown}
          dropdownOpen={activeDropdown === folder.id}
          onAddListClick={folderId => {
            setAddingListFolderId(folderId);
            setActiveDropdown(null);
            setExpandedFolders(new Set([folderId]));
          }}
          addingList={addingListFolderId === folder.id}
          newListName={newListName}
          setNewListName={setNewListName}
          onAddList={handleAddList}
          onCancelAddList={() => {
            setAddingListFolderId(null);
            setNewListName('');
          }}
          onDeleteFolder={handleDeleteFolder}
          activeListDropdown={activeListDropdown}
          setActiveListDropdown={setActiveListDropdown}
          onDeleteList={handleDeleteList}
          onRenameFolder={handleRenameFolder}
          onRenameList={handleRenameList}
          disableDelete={disableDelete}
          onSelectList={handleSelectList}
        />
      ))}
    </div>
  );
};

export default Sidebar; 