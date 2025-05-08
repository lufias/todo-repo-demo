import { FaFolder, FaChevronDown, FaChevronRight, FaEllipsisH, FaTrash, FaListUl } from 'react-icons/fa';
import SidebarList from './SidebarList.tsx';

interface SidebarFolderProps {
  folder: { id: string; name: string };
  lists: { id: string; folderId: string; content: string }[];
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
}

export default function SidebarFolder({
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
}: SidebarFolderProps) {
  return (
    <div className="rounded-lg">
      <div className="flex items-center justify-between group">
        <button
          onClick={() => onToggle(folder.id)}
          className="flex-1 flex items-center justify-between p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <div className="flex items-center space-x-2">
            <FaFolder className="text-blue-400 text-base" />
            <span className="text-gray-700 font-normal">{folder.name}</span>
          </div>
          {expanded ? (
            <FaChevronDown className="text-gray-400 text-sm" />
          ) : (
            <FaChevronRight className="text-gray-400 text-sm" />
          )}
        </button>
        <div className="relative">
          <button
            onClick={e => {
              e.stopPropagation();
              onDropdown(folder.id);
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors ml-2 opacity-0 group-hover:opacity-100"
            title="Folder options"
          >
            <FaEllipsisH className="text-gray-400 text-xs" />
          </button>
          {dropdownOpen && (
            <div
              className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => {
                  onAddListClick(folder.id);
                }}
                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <FaListUl className="mr-2 text-blue-400 text-sm" />
                Add List
              </button>
              <button
                onClick={() => {
                  onDeleteFolder(folder.id);
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
                onChange={e => setNewListName(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && newListName.trim()) {
                    onAddList(folder.id, newListName.trim());
                  } else if (e.key === 'Escape') {
                    onCancelAddList();
                  }
                }}
              />
              <button
                className="text-green-500 hover:text-green-700"
                title="Confirm"
                onClick={() => {
                  if (newListName.trim()) {
                    onAddList(folder.id, newListName.trim());
                  }
                }}
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
          {lists
            .filter(list => list.folderId === folder.id)
            .map(list => (
              <SidebarList
                key={list.id}
                list={list}
                activeDropdown={activeListDropdown}
                setActiveDropdown={setActiveListDropdown}
                onDelete={() => onDeleteList(list.id, folder.id)}
              />
            ))}
        </div>
      )}
    </div>
  );
} 