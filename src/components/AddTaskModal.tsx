import { useState, FC, FormEvent, ChangeEvent } from 'react';
import { useAppDispatch } from '../store/hooks';
import { addTask } from '../store/slices/taskListSlice';
import { FaTimes } from 'react-icons/fa';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  listId: string;
}

const AddTaskModal: FC<AddTaskModalProps> = ({ isOpen, onClose, listId }) => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [titleError, setTitleError] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>('');
  const [tagError, setTagError] = useState<string>('');
  const dispatch = useAppDispatch();

  if (!isOpen) return null;

  const validateTitle = (value: string): boolean => {
    if (!value.trim()) {
      setTitleError('Title is required');
      return false;
    }
    setTitleError('');
    return true;
  };

  const handleTagInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setTagInput(value);
    setTagError('');

    // Check if user entered a comma
    if (value.endsWith(',')) {
      const newTag = value.slice(0, -1).trim();
      if (newTag) {
        addTag(newTag);
        setTagInput(''); // Clear the input after adding a tag
      }
    }
  };

  const addTag = (tag: string): void => {
    const trimmedTag = tag.trim();
    if (!trimmedTag) return;

    if (tags.length >= 5) {
      setTagError('Maximum 5 tags allowed');
      return;
    }

    if (tags.includes(trimmedTag)) {
      setTagError('Tag already exists');
      return;
    }

    setTags([...tags, trimmedTag]);
  };

  const removeTag = (tagToRemove: string): void => {
    setTags(tags.filter(tag => tag !== tagToRemove));
    setTagError('');
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!validateTitle(title)) return;

    try {
      await dispatch(addTask({ 
        listId, 
        title: title.trim(),
        description: description.trim(),
        tags
      })).unwrap();
      setTitle('');
      setDescription('');
      setTitleError('');
      setTags([]);
      setTagInput('');
      setTagError('');
      onClose();
    } catch (error) {
      console.error('Failed to add task:', error);
    }
  };

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setTitle(value);
    if (titleError) {
      validateTitle(value);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
          onClick={onClose}
          data-testid="modal-overlay"
        />

        <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div className="px-6 pt-6 pb-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Add New Task</h2>
              <button
                onClick={onClose}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-4">
                <label htmlFor="taskTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Task Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="taskTitle"
                  value={title}
                  onChange={handleTitleChange}
                  onBlur={() => validateTitle(title)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    titleError ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Enter task title"
                  autoFocus
                  required
                />
                {titleError && (
                  <p className="mt-1 text-sm text-red-500">{titleError}</p>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="taskDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  id="taskDescription"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  rows={4}
                  placeholder="Enter task description"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="taskTags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  id="taskTags"
                  value={tagInput}
                  onChange={handleTagInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    tagError ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Enter tags (e.g., work, urgent)"
                />
                {tagError && (
                  <p className="mt-1 text-sm text-red-500">{tagError}</p>
                )}
                {tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                          aria-label={`Remove tag ${tag}`}
                        >
                          <FaTimes className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-4 px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-600">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTaskModal;