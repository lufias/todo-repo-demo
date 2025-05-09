import { FaFolder, FaChevronDown, FaChevronRight, FaEllipsisH, FaTrash, FaListUl, FaEdit } from 'react-icons/fa';
import SidebarList from './SidebarList';
import { useState, useRef, FC, ChangeEvent, KeyboardEvent, MouseEvent } from 'react';
import { useClickAway } from 'react-use';
import { useAppSelector } from '../store/hooks';

interface Folder {
  id: string;
  name: string;
}

interface List {
  id: string;
  folderId: string;
  content: string;
}

interface SidebarFolderProps {
  folder: Folder;
  lists: List[];
  expanded: boolean;
  onToggle: (folderId: string) => void;
  onDropdown: (folderId: string) => void;
  dropdownOpen: boolean;
  onAddListClick: (folderId: string) => void;
  addingList: boolean;
  newListName: string;
  setNewListName: (name: string) => void;
  onAddList: (folderId: string, content: string) => void;
  onCancelAddList: () => void;
  onDeleteFolder: (folderId: string) => void;
  activeListDropdown: string | null;
  setActiveListDropdown: (id: string | null) => void;
  onDeleteList: (listId: string, folderId: string) => void;
  onRenameFolder: (folderId: string, newName: string) => void;
  onRenameList: (listId: string, folderId: string, newName: string) => void;
  disableDelete: boolean;
  onSelectList: (listId: string) => void;
}

const SidebarFolder: FC<SidebarFolderProps> = ({
  folder,
  lists,
  expanded,
  onToggle,
  onDropdown,
  dropdownOpen,
  onAddListClick,
  addingList,
  newListName,
  setNewListName,
  onAddList,
  onCancelAddList,
  onDeleteFolder,
  activeListDropdown,
  setActiveListDropdown,
  onDeleteList,
  onRenameFolder,
  onRenameList,  
  onSelectList,
}) => {
  const [isRenaming, setIsRenaming] = useState<boolean>(false);
  const [newFolderName, setNewFolderName] = useState<string>(folder.name);
  const dropdownRef = useRef<HTMLDivElement>(null);  
  const allLists = useAppSelector(state => state.sidebar.lists);
  const folderLists = lists.filter(list => list.folderId === folder.id);

  useClickAway(dropdownRef, () => {
    if (dropdownOpen) {
      onDropdown('');
    }
  });

  const handleRename = (): void => {
    if (newFolderName.trim() && newFolderName !== folder.name) {
      onRenameFolder(folder.id, newFolderName.trim());
    }
    setIsRenaming(false);
  };

  const handleNewFolderNameChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setNewFolderName(e.target.value);
  };

  const handleNewFolderNameKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      handleRename();
    } else if (e.key === 'Escape') {
      setIsRenaming(false);
      setNewFolderName(folder.name);
    }
  };

  const handleNewListNameChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setNewListName(e.target.value);
  };

  const handleNewListNameKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && newListName.trim()) {
      onAddList(folder.id, newListName.trim());
    } else if (e.key === 'Escape') {
      onCancelAddList();
    }
  };

  const handleDropdownClick = (e: MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();
    onDropdown(folder.id);
  };

  const handleDropdownMenuClick = (e: MouseEvent<HTMLDivElement>): void => {
    e.stopPropagation();
  };

  const handleRenameClick = (): void => {
    setIsRenaming(true);
    onDropdown(folder.id);
  };

  const handleAddListClick = (): void => {
    onAddListClick(folder.id);
  };

  const handleDeleteFolderClick = (): void => {
    onDeleteFolder(folder.id);
  };

  const handleConfirmRenameClick = (): void => {
    handleRename();
  };

  const handleCancelRenameClick = (): void => {
    setIsRenaming(false);
    setNewFolderName(folder.name);
  };

  const handleConfirmAddListClick = (): void => {
    if (newListName.trim()) {
      onAddList(folder.id, newListName.trim());
    }
  };

  const totalListsCount: number = allLists.length;

  return (
    <div className="rounded-lg">
      <div className="flex items-center justify-between group">
        {isRenaming ? (
          <div className="flex-1 flex items-center space-x-2 p-2">
            <FaFolder className="text-blue-400 text-base" />
            <input
              autoFocus
              type="text"
              className="border rounded px-2 py-1 text-sm w-28 focus:outline-none focus:ring-2 focus:ring-blue-200"
              value={newFolderName}
              onChange={handleNewFolderNameChange}
              onKeyDown={handleNewFolderNameKeyDown}
            />
            <button
              className="text-green-500 hover:text-green-700"
              title="Confirm"
              onClick={handleConfirmRenameClick}
            >
              ✓
            </button>
            <button
              className="text-red-400 hover:text-red-600"
              title="Cancel"
              onClick={handleCancelRenameClick}
            >
              ✕
            </button>
          </div>
        ) : (
          <button
            onClick={() => onToggle(folder.id)}
            className="flex-1 flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <div className="flex items-center space-x-2">
              <FaFolder className="text-blue-400 text-base dark:text-blue-300" />
              <span className="text-gray-900 dark:text-gray-100 font-normal">{folder.name}</span>
            </div>
            {expanded ? (
              <FaChevronDown className="text-gray-400 text-sm" />
            ) : (
              <FaChevronRight className="text-gray-400 text-sm" />
            )}
          </button>
        )}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={handleDropdownClick}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors ml-2 opacity-0 group-hover:opacity-100"
            title="Folder options"
          >
            <FaEllipsisH className="text-gray-400 text-xs" />
          </button>
          {dropdownOpen && (
            <div
              className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10"
              onClick={handleDropdownMenuClick}
            >
              <button
                onClick={handleRenameClick}
                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <FaEdit className="mr-2 text-blue-400 text-sm" />
                Rename Folder
              </button>
              <button
                onClick={handleAddListClick}
                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <FaListUl className="mr-2 text-blue-400 text-sm" />
                Add List
              </button>
              <button
                onClick={handleDeleteFolderClick}
                className="w-full flex items-center px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
              >
                <FaTrash className="mr-2 text-sm" />
                Delete Folder
              </button>
            </div>
          )}
        </div>
      </div>
      {expanded && (
        <div className="ml-6 mt-1 space-y-1">
          {addingList && (
            <div className="flex items-center space-x-2 mb-2">
              <input
                autoFocus
                type="text"
                className="border rounded px-2 py-1 text-sm w-28 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="List name"
                value={newListName}
                onChange={handleNewListNameChange}
                onKeyDown={handleNewListNameKeyDown}
              />
              <button
                className="text-green-500 hover:text-green-700"
                title="Confirm"
                onClick={handleConfirmAddListClick}
              >
                ✓
              </button>
              <button
                className="text-red-400 hover:text-red-600"
                title="Cancel"
                onClick={onCancelAddList}
              >
                ✕
              </button>
            </div>
          )}
          {folderLists.map(list => {
            const isOnlyListInSystem: boolean = totalListsCount === 1;
            const isOnlyListInFolder: boolean = folderLists.length === 1;
            const disableListDelete: boolean = isOnlyListInSystem || isOnlyListInFolder;
            return (
              <SidebarList
                key={list.id}
                list={list}
                activeDropdown={activeListDropdown}
                setActiveDropdown={setActiveListDropdown}
                onDelete={() => onDeleteList(list.id, folder.id)}
                onRename={(newName) => onRenameList(list.id, folder.id, newName)}
                isLastList={disableListDelete}
                onSelect={() => onSelectList(list.id)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SidebarFolder; 