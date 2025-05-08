import { FaEllipsisH, FaTrash } from 'react-icons/fa';

interface SidebarListProps {
  list: { id: string; folderId: string; content: string };
  activeDropdown: string | null;
  setActiveDropdown: (id: string | null) => void;
  onDelete: () => void;
}

export default function SidebarList({ list, activeDropdown, setActiveDropdown, onDelete }: SidebarListProps) {
  return (
    <div className="flex items-center justify-between group">
      <button
        className="flex-1 text-left px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded transition-colors font-normal"
      >
        {list.content}
      </button>
      <div className="relative">
        <button
          onClick={e => {
            e.stopPropagation();
            setActiveDropdown(activeDropdown === list.id ? null : list.id);
          }}
          className="p-1 hover:bg-gray-100 rounded transition-colors ml-2 opacity-0 group-hover:opacity-100"
          title="List options"
        >
          <FaEllipsisH className="text-gray-400 text-xs" />
        </button>
        {activeDropdown === list.id && (
          <div
            className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 z-10"
            onClick={e => e.stopPropagation()}
          >
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