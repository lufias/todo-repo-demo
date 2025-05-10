import { FaCheck, FaTrash, FaEye, FaEdit, FaEllipsisV } from 'react-icons/fa';
import { useAppDispatch } from '../store/hooks';
import { updateTaskStatus, deleteTask } from '../store/slices/tasksSlice';
import { useState, useRef, FC } from 'react';
import TaskPreviewModal from './TaskPreviewModal';
import EditTaskModal from './EditTaskModal';
import { Task } from '../services/database';
import { useClickAway } from 'react-use';

type TaskStatus = 'rejected' | 'new' | undefined;
type TaskPriority = 'low' | 'medium' | 'high';

interface TaskItemProps {
  id: string;
  title: string;
  author: string;
  status?: TaskStatus;
  priority?: TaskPriority;
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
  tags, 
  priority = 'medium' // default priority
}) => {
  const dispatch = useAppDispatch();
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
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
    tags,
    priority: priority || 'medium',
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

  // Map priority prop to Tailwind border color class
  const borderColorClass =
    priority === 'low' ? 'border-l-sky-300' :
    priority === 'high' ? 'border-l-rose-400' :
    'border-l-amber-400';

  return (
    <div className={`group relative px-6 py-4 hover:bg-gray-50/50 transition-all duration-200 material-card border-l-4 ${borderColorClass}`} data-testid="task-item-container">
      <div className="flex items-start gap-4">
        <button
          onClick={() => handleStatusChange(!done)}
          className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full border-2 transition-all duration-200 ripple ${
            done
              ? 'bg-[var(--primary)] border-[var(--primary)]'
              : 'border-gray-300 hover:border-[var(--primary)]'
          }`}
          aria-label={done ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {done && <FaCheck className="w-full h-full text-white p-0.5" />}
        </button>
        
        <div className="flex-grow">
          <div className="flex items-center gap-2">
            <h3 className={`text-base font-medium truncate break-words whitespace-normal ${
              done ? 'text-[var(--text-secondary)] line-through' : 'text-[var(--text-primary)]'
            }`}>
              {title}
            </h3>
            {status && (
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                status === 'new'
                  ? 'bg-[var(--primary)]/10 text-[var(--primary)]'
                  : status === 'rejected'
                  ? 'bg-[var(--error)]/10 text-[var(--error)]'
                  : ''
              }`}>
                {status}
              </span>
            )}
          </div>
          {description && (
            <p className="mt-1 text-sm text-[var(--text-secondary)] line-clamp-2 break-words whitespace-normal">
              {description}
            </p>
          )}
          {tags && tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-[var(--text-secondary)] rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          {/* Desktop action buttons */}
          <button
            onClick={handleEditClick}
            className="p-2 text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors opacity-0 group-hover:opacity-100 hidden sm:inline-flex ripple"
            aria-label="Edit task"
          >
            <FaEdit className="w-4 h-4" />
          </button>
          <button
            onClick={handlePreviewClick}
            className="p-2 text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors opacity-0 group-hover:opacity-100 hidden sm:inline-flex ripple"
            aria-label="View task details"
          >
            <FaEye className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-gray-400 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors opacity-0 group-hover:opacity-100 hidden sm:inline-flex ripple"
            aria-label="Delete task"
          >
            <FaTrash className="w-4 h-4" />
          </button>

          {/* Mobile three dots menu */}
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg hover:bg-gray-100 transition-all duration-200 sm:hidden ripple"
            aria-label="Task options"
          >
            <FaEllipsisV className="w-4 h-4" />
          </button>
        </div>
        {/* Dropdown menu - only visible on mobile */}
        {isDropdownOpen && (
          <div ref={dropdownRef} className="absolute right-4 top-12 z-20 bg-[var(--surface)] rounded-lg material-elevation-3 border border-gray-200 flex flex-col w-32 sm:hidden">
            <button
              onClick={() => handleDropdownAction('edit')}
              className="px-4 py-2 text-left hover:bg-gray-100 text-[var(--text-primary)] transition-all duration-200 ripple"
              data-testid="dropdown-edit"
            >
              <FaEdit className="inline mr-2" /> Edit
            </button>
            <button
              onClick={() => handleDropdownAction('view')}
              className="px-4 py-2 text-left hover:bg-gray-100 text-[var(--text-primary)] transition-all duration-200 ripple"
              data-testid="dropdown-view"
            >
              <FaEye className="inline mr-2" /> View
            </button>
            <button
              onClick={() => handleDropdownAction('delete')}
              className="px-4 py-2 text-left hover:bg-gray-100 text-[var(--error)] transition-all duration-200 ripple"
              data-testid="dropdown-delete"
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