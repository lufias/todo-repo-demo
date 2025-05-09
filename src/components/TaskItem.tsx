import { FaCheck, FaTrash, FaEye, FaEdit } from 'react-icons/fa';
import { useAppDispatch } from '../store/hooks';
import { updateTaskStatus, deleteTask } from '../store/slices/taskListSlice';
import { useState } from 'react';
import TaskPreviewModal from './TaskPreviewModal';
import EditTaskModal from './EditTaskModal';
import { Task } from '../services/database';

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

export default function TaskItem({ id, title, author, status, color, description, done, tags }: TaskItemProps) {
  const dispatch = useAppDispatch();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleStatusChange = (newStatus: boolean) => {
    dispatch(updateTaskStatus({ taskId: id, done: newStatus }));
  };

  const handleDelete = () => {
    dispatch(deleteTask(id));
  };

  const task: Task = {
    id,
    listId: '', // This will be filled by the database
    title,
    description,
    done,
    tags
  };

  return (
    <div className="group relative px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
      <div className="flex items-start gap-4">
        <button
          onClick={() => handleStatusChange(!done)}
          className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full border-2 transition-colors ${
            done
              ? 'bg-primary-500 border-primary-500'
              : 'border-gray-300 dark:border-gray-600 hover:border-primary-500 dark:hover:border-primary-500'
          }`}
          aria-label={done ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {done && <FaCheck className="w-full h-full text-white p-0.5" />}
        </button>
        
        <div className="flex-grow">
          <div className="flex items-center gap-2">
            <h3 className={`text-base font-medium truncate break-words whitespace-normal ${done ? 'text-gray-500 dark:text-gray-400 line-through' : 'text-gray-900 dark:text-white'}`}>
              {title}
            </h3>
            {status && (
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                status === 'new'
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  : status === 'rejected'
                  ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  : ''
              }`}>
                {status}
              </span>
            )}
          </div>
          {description && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2 break-words whitespace-normal">
              {description}
            </p>
          )}
          {tags && tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsEditOpen(true)}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Edit task"
          >
            <FaEdit className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsPreviewOpen(true)}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="View task details"
          >
            <FaEye className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Delete task"
          >
            <FaTrash className="w-4 h-4" />
          </button>
        </div>
      </div>

      <TaskPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title={title}
        description={description}
        tags={tags}
        done={done}
      />

      <EditTaskModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        task={task}
      />
    </div>
  );
} 