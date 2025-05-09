import { FaCheck, FaTrash } from 'react-icons/fa';
import { useAppDispatch } from '../store/hooks';
import { updateTaskStatus } from '../store/slices/taskListSlice';

interface TaskItemProps {
  id: string;
  title: string;
  author: string;
  status?: 'rejected' | 'new' | undefined;
  color?: 'yellow' | 'blue' | 'green';
  description?: string;
  done: boolean;
  tags?: string[];
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

export default function TaskItem({ id, title, status, color = 'blue', description, done, tags }: TaskItemProps) {
  const dispatch = useAppDispatch();

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateTaskStatus({ taskId: id, done: e.target.checked }));
  };

  return (
    <div className="flex items-center px-4 py-3 border-b last:border-b-0 bg-white">
      <div className={`w-1 h-8 rounded-full mr-3 ${barColors[color]}`} />
      <input 
        type="checkbox" 
        className="mr-4 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        checked={done}
        onChange={handleCheckboxChange}
      />
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className={`font-medium ${done ? 'text-gray-400 line-through' : 'text-gray-900'}`}>{title}</span>
          {status === 'rejected' && (
            <span className="ml-2 px-2 py-0.5 rounded text-xs font-semibold bg-red-500 text-white">Rejected</span>
          )}
          {status === 'new' && (
            <span className="ml-2 px-2 py-0.5 rounded text-xs font-semibold bg-blue-200 text-blue-800">NEW</span>
          )}
        </div>
        {description && (
          <div className={`text-sm leading-tight mb-1 line-clamp-2 ${done ? 'text-gray-300' : 'text-gray-400'}`}>{description}</div>
        )}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      <button className="text-red-500 hover:text-red-700">
        <FaTrash size={18} />
      </button>
    </div>
  );
} 