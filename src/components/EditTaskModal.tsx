import { useState, useEffect, FC, FormEvent, ChangeEvent } from 'react';
import { useAppDispatch } from '../store/hooks';
import { updateTask } from '../store/slices/tasksSlice';
import { FaTimes } from 'react-icons/fa';
import { Task } from '../services/database';

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
}

const EditTaskModal: FC<EditTaskModalProps> = ({ isOpen, onClose, task }) => {
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState<string>(task.title);
  const [description, setDescription] = useState<string>(task.description || '');
  const [tags, setTags] = useState<string[]>(task.tags || []);
  const [tagInput, setTagInput] = useState<string>('');
  const [titleError, setTitleError] = useState<string>('');
  const [tagError, setTagError] = useState<string>('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(task.priority || 'low');

  useEffect(() => {
    if (isOpen) {
      setTitle(task.title);
      setDescription(task.description || '');
      setTags(task.tags || []);
      setTagInput('');
      setTitleError('');
      setTagError('');
      setPriority(task.priority || 'low');
    }
  }, [isOpen, task]);

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
    setTagError('');
    // Split by comma
    const parts = value.split(',');
    // All but the last are complete tags
    const newTags = parts.slice(0, -1).map(tag => tag.trim()).filter(tag => tag);
    let updatedTags = [...tags];
    for (const tag of newTags) {
      if (updatedTags.length >= 5) {
        setTagError('Maximum 5 tags allowed');
        break;
      }
      if (!updatedTags.includes(tag)) {
        updatedTags.push(tag);
      }
    }
    setTags(updatedTags);
    setTagInput(parts[parts.length - 1]);
  };

  const removeTag = (tagToRemove: string): void => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!validateTitle(title)) return;

    try {
      await dispatch(updateTask({
        taskId: task.id,
        updates: {
          title: title.trim(),
          description: description.trim(),
          tags,
          priority,
        }
      })).unwrap();
      onClose();
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
          onClick={onClose}
          data-testid="modal-overlay"
        />

        <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all w-full max-w-lg mx-auto">
          <div className="px-6 pt-6 pb-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white" data-testid="modal-title">Edit Task</h2>
              <button
                onClick={onClose}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                data-testid="close-button"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleSubmit} data-testid="edit-task-form">
              <div className="mb-4">
                <label htmlFor="taskTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="taskTitle"
                  value={title}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setTitle(e.target.value);
                    if (titleError) validateTitle(e.target.value);
                  }}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    titleError ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Enter task title"
                  required
                  data-testid="title-input"
                />
                {titleError && (
                  <p className="mt-1 text-sm text-red-500" data-testid="title-error">{titleError}</p>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="taskDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  id="taskDescription"
                  value={description}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  rows={4}
                  placeholder="Enter task description"
                  data-testid="description-input"
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
                  data-testid="tags-input"
                />
                {tagError && (
                  <p className="mt-1 text-sm text-red-500" data-testid="tags-error">{tagError}</p>
                )}
                {tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2" data-testid="tags-container">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                        data-testid={`tag-${tag}`}
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                          aria-label={`Remove tag ${tag}`}
                          data-testid={`remove-tag-${tag}`}
                        >
                          <FaTimes className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Priority
                </label>
                <div className="flex gap-4" role="radiogroup" aria-labelledby="priority-label">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="priority"
                      value="low"
                      checked={priority === 'low'}
                      onChange={() => setPriority('low')}
                      className="form-radio text-green-500 focus:ring-green-500"
                      data-testid="priority-low"
                    />
                    <span className="ml-2">Low</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="priority"
                      value="medium"
                      checked={priority === 'medium'}
                      onChange={() => setPriority('medium')}
                      className="form-radio text-yellow-500 focus:ring-yellow-500"
                      data-testid="priority-medium"
                    />
                    <span className="ml-2">Medium</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="priority"
                      value="high"
                      checked={priority === 'high'}
                      onChange={() => setPriority('high')}
                      className="form-radio text-red-500 focus:ring-red-500"
                      data-testid="priority-high"
                    />
                    <span className="ml-2">High</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium"
                  data-testid="cancel-button"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
                  data-testid="submit-button"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTaskModal; 