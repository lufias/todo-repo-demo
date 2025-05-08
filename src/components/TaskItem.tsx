import { FaCheck, FaTrash } from 'react-icons/fa';

interface TaskItemProps {
  title: string;
  author: string;
  status?: 'rejected' | 'new' | undefined;
  color?: 'yellow' | 'blue' | 'green';
  excerpt?: string;
}

const statusStyles = {
  rejected: 'bg-red-600 text-white',
  new: 'bg-blue-200 text-blue-800',
};

const barColors = {
  yellow: 'bg-yellow-300',
  blue: 'bg-blue-300',
  green: 'bg-green-300',
};

export default function TaskItem({ title, author, status, color = 'blue', excerpt }: TaskItemProps) {
  return (
    <div className="flex items-center px-4 py-3 border-b last:border-b-0 bg-white">
      <div className={`w-1 h-8 rounded-full mr-3 ${barColors[color]}`} />
      <input type="checkbox" className="mr-4" />
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900">{title}</span>
          {status === 'rejected' && (
            <span className="ml-2 px-2 py-0.5 rounded text-xs font-semibold bg-red-500 text-white">Rejected</span>
          )}
          {status === 'new' && (
            <span className="ml-2 px-2 py-0.5 rounded text-xs font-semibold bg-blue-200 text-blue-800">NEW</span>
          )}
        </div>
        {excerpt && (
          <div className="text-gray-400 text-sm leading-tight mb-1">{excerpt}</div>
        )}
        <div className="text-gray-500 text-sm italic font-normal">By {author}</div>
      </div>
      <button className="mx-2 text-green-600 hover:text-green-800">
        <FaCheck size={18} />
      </button>
      <button className="text-red-500 hover:text-red-700">
        <FaTrash size={18} />
      </button>
    </div>
  );
} 