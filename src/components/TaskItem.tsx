import { FaCheck, FaTrash, FaEye, FaEdit } from 'react-icons/fa';
import { useAppDispatch } from '../store/hooks';
import { updateTaskStatus, deleteTask } from '../store/slices/tasksSlice';
import { useState, useRef, FC, TouchEvent, MouseEvent } from 'react';
import TaskPreviewModal from './TaskPreviewModal';
import EditTaskModal from './EditTaskModal';
import { Task } from '../services/database';
import { useClickAway } from 'react-use';

type TaskStatus = 'rejected' | 'new' | undefined;
type TaskColor = 'yellow' | 'blue' | 'green';

interface TaskItemProps {
  id: string;
  title: string;
  author: string;
  status?: TaskStatus;
  color?: TaskColor;
  description?: string;
  done: boolean;
  tags?: string[];
}

const TaskItem: FC<TaskItemProps> = ({ 
  id, 
  title, 
  status, 
  description, 
  done, 
  tags 
}) => {
  const dispatch = useAppDispatch();
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const longPressTimeout = useRef<NodeJS.Timeout | null>(null);
  const touchMoved = useRef<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickAway(dropdownRef, () => {
    if (isDropdownOpen) setIsDropdownOpen(false);
  });

  const handleStatusChange = (newStatus: boolean): void => {
    dispatch(updateTaskStatus({ taskId: id, done: newStatus }));
  };

  const handleDelete = (): void => {
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

  // Long press handlers for mobile
  const handleTouchStart = (): void => {
    touchMoved.current = false;
    longPressTimeout.current = setTimeout(() => {
      setIsDropdownOpen(true);
    }, 500); // 500ms for long press
  };

  const handleTouchEnd = (): void => {
    if (longPressTimeout.current) clearTimeout(longPressTimeout.current);
  };

  const handleTouchMove = (): void => {
    touchMoved.current = true;
    if (longPressTimeout.current) clearTimeout(longPressTimeout.current);
  };

  const handleDropdownAction = (action: 'edit' | 'view' | 'delete'): void => {
    setIsDropdownOpen(false);
    switch (action) {
      case 'edit':
        setIsEditOpen(true);
        break;
      case 'view':
        setIsPreviewOpen(true);
        break;
      case 'delete':
        handleDelete();
        break;
    }
  };

  const handleEditClick = (): void => {
    setIsEditOpen(true);
  };

  const handlePreviewClick = (): void => {
    setIsPreviewOpen(true);
  };

  const handleClosePreview = (): void => {
    setIsPreviewOpen(false);
  };

  const handleCloseEdit = (): void => {
    setIsEditOpen(false);
  };

  return (
    <div
      className="group relative px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
    >
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
            onClick={handleEditClick}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors opacity-0 group-hover:opacity-100 hidden sm:inline-flex"
            aria-label="Edit task"
          >
            <FaEdit className="w-4 h-4" />
          </button>
          <button
            onClick={handlePreviewClick}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors opacity-0 group-hover:opacity-100 hidden sm:inline-flex"
            aria-label="View task details"
          >
            <FaEye className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors opacity-0 group-hover:opacity-100 hidden sm:inline-flex"
            aria-label="Delete task"
          >
            <FaTrash className="w-4 h-4" />
          </button>
        </div>
        {/* Dropdown for mobile actions */}
        {isDropdownOpen && (
          <div ref={dropdownRef} className="absolute right-4 top-12 z-20 bg-white dark:bg-gray-800 rounded shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col w-32 sm:hidden">
            <button
              onClick={() => handleDropdownAction('edit')}
              className="px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
            >
              <FaEdit className="inline mr-2" /> Edit
            </button>
            <button
              onClick={() => handleDropdownAction('view')}
              className="px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
            >
              <FaEye className="inline mr-2" /> View
            </button>
            <button
              onClick={() => handleDropdownAction('delete')}
              className="px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600 dark:text-red-400"
            >
              <FaTrash className="inline mr-2" /> Delete
            </button>
          </div>
        )}
      </div>

      <TaskPreviewModal
        isOpen={isPreviewOpen}
        onClose={handleClosePreview}
        title={title}
        description={description}
        tags={tags}
        done={done}
      />

      <EditTaskModal
        isOpen={isEditOpen}
        onClose={handleCloseEdit}
        task={task}
      />
    </div>
  );
};

export default TaskItem; 