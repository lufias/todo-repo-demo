import { FaListUl, FaEllipsisH, FaTrash, FaEdit } from 'react-icons/fa';
import { useState, useRef } from 'react';
import { useClickAway } from 'react-use';

interface SidebarListProps {
  list: { id: string; folderId: string; content: string };
  activeDropdown: string | null;
  setActiveDropdown: (id: string | null) => void;
  onDelete: () => void;
  onRename: (newName: string) => void;
  isLastList: boolean;
}

export default function SidebarList({
  list,
  activeDropdown,
  setActiveDropdown,
  onDelete,
  onRename,
  isLastList,
}: SidebarListProps) {
  const [isRenaming, setIsRenaming] = useState(false);
  const [newListName, setNewListName] = useState(list.content);
  const dropdownRef = useRef(null);

  useClickAway(dropdownRef, () => {
    if (activeDropdown === list.id) {
      setActiveDropdown(null);
    }
  });

  const handleRename = () => {
    if (newListName.trim() && newListName !== list.content) {
      onRename(newListName.trim());
    }
    setIsRenaming(false);
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
            onChange={e => setNewListName(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                handleRename();
              } else if (e.key === 'Escape') {
                setIsRenaming(false);
                setNewListName(list.content);
              }
            }}
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
            onClick={() => {
              setIsRenaming(false);
              setNewListName(list.content);
            }}
          >
            ✕
          </button>
        </div>
      ) : (
        <div className="flex-1 flex items-center space-x-2">
          <FaListUl className="text-gray-400 text-sm" />
          <span className="text-gray-700 text-sm">{list.content}</span>
        </div>
      )}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={e => {
            e.stopPropagation();
            setActiveDropdown(activeDropdown === list.id ? null : list.id);
          }}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
          title="List options"
        >
          <FaEllipsisH className="text-gray-400 text-xs" />
        </button>
        {activeDropdown === list.id && (
          <div
            className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => {
                setIsRenaming(true);
                setActiveDropdown(null);
              }}
              className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <FaEdit className="mr-2 text-blue-400 text-sm" />
              Rename List
            </button>
            <button
              onClick={() => {
                onDelete();
                setActiveDropdown(null);
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
  );
} 