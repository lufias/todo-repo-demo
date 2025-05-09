import { FaListUl, FaEllipsisH, FaTrash, FaEdit } from 'react-icons/fa';
import { useState, useRef, FC, ChangeEvent, KeyboardEvent, MouseEvent } from 'react';
import { useClickAway } from 'react-use';

interface List {
  id: string;
  folderId: string;
  content: string;
}

interface SidebarListProps {
  list: List;
  activeDropdown: string | null;
  setActiveDropdown: (id: string | null) => void;
  onDelete: () => void;
  onRename: (newName: string) => void;
  isLastList: boolean;
  onSelect: () => void;
}

const SidebarList: FC<SidebarListProps> = ({
  list,
  activeDropdown,
  setActiveDropdown,
  onDelete,
  onRename,
  onSelect,
}) => {
  const [isRenaming, setIsRenaming] = useState<boolean>(false);
  const [newListName, setNewListName] = useState<string>(list.content);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickAway(dropdownRef, () => {
    if (activeDropdown === list.id) {
      setActiveDropdown(null);
    }
  });

  const handleRename = (): void => {
    if (newListName.trim() && newListName !== list.content) {
      onRename(newListName.trim());
    }
    setIsRenaming(false);
  };

  const handleNewListNameChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setNewListName(e.target.value);
  };

  const handleNewListNameKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      handleRename();
    } else if (e.key === 'Escape') {
      setIsRenaming(false);
      setNewListName(list.content);
    }
  };

  const handleDropdownClick = (e: MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === list.id ? null : list.id);
  };

  const handleDropdownMenuClick = (e: MouseEvent<HTMLDivElement>): void => {
    e.stopPropagation();
  };

  const handleRenameClick = (): void => {
    setIsRenaming(true);
    setActiveDropdown(null);
  };

  const handleDeleteClick = (): void => {
    onDelete();
    setActiveDropdown(null);
  };

  const handleCancelRename = (): void => {
    setIsRenaming(false);
    setNewListName(list.content);
  };

  return (
    <div className="flex items-center justify-between group">
      {isRenaming ? (
        <div className="flex-1 flex items-center space-x-2">
          <FaListUl className="text-gray-400 text-sm" />
          <input
            autoFocus
            type="text"
            className="border rounded px-2 py-1 text-sm w-28 focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={newListName}
            onChange={handleNewListNameChange}
            onKeyDown={handleNewListNameKeyDown}
          />
          <button
            className="text-green-500 hover:text-green-700"
            title="Confirm"
            onClick={handleRename}
          >
            ✓
          </button>
          <button
            className="text-red-400 hover:text-red-600"
            title="Cancel"
            onClick={handleCancelRename}
          >
            ✕
          </button>
        </div>
      ) : (
        <div
          className="flex-1 flex items-center space-x-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded px-1"
          onClick={onSelect}
        >
          <FaListUl className="text-gray-400 dark:text-gray-300 text-sm" />
          <span className="text-gray-900 dark:text-gray-100 text-sm">{list.content}</span>
        </div>
      )}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={handleDropdownClick}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
          title="List options"
        >
          <FaEllipsisH className="text-gray-400 text-xs" />
        </button>
        {activeDropdown === list.id && (
          <div
            className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10"
            onClick={handleDropdownMenuClick}
          >
            <button
              onClick={handleRenameClick}
              className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <FaEdit className="mr-2 text-blue-400 text-sm" />
              Rename List
            </button>
            <button
              onClick={handleDeleteClick}
              className="w-full flex items-center px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
            >
              <FaTrash className="mr-2 text-sm" />
              Delete List
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarList; 