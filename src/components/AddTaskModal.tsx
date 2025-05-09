import { useState } from 'react';
import { useAppDispatch } from '../store/hooks';
import { addTask } from '../store/slices/taskListSlice';
import { FaTimes } from 'react-icons/fa';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  listId: string;
}

export default function AddTaskModal({ isOpen, onClose, listId }: AddTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [titleError, setTitleError] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [tagError, setTagError] = useState('');
  const dispatch = useAppDispatch();

  if (!isOpen) return null;

  const validateTitle = (value: string) => {
    if (!value.trim()) {
      setTitleError('Title is required');
      return false;
    }
    setTitleError('');
    return true;
  };

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTagInput(value);
    setTagError('');

    // Check if user entered a comma
    if (value.endsWith(',')) {
      const newTag = value.slice(0, -1).trim();
      if (newTag) {
        addTag(newTag);
      }
    }
  };

  const addTag = (tag: string) => {
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

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
    setTagError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTitle(value);
    if (titleError) {
      validateTitle(value);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Add New Task</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label htmlFor="taskTitle" className="block text-sm font-medium text-gray-700 mb-2">
              Task Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="taskTitle"
              value={title}
              onChange={handleTitleChange}
              onBlur={() => validateTitle(title)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                titleError ? 'border-red-500' : 'border-gray-300'
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
            <label htmlFor="taskTags" className="block text-sm font-medium text-gray-700 mb-2">
              Tags <span className="text-gray-500 text-xs">(max 5, comma separated)</span>
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <FaTimes className="text-xs" />
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              id="taskTags"
              value={tagInput}
              onChange={handleTagInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                tagError ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Add tags (press comma to add)"
            />
            {tagError && (
              <p className="mt-1 text-sm text-red-500">{tagError}</p>
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="taskDescription" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="taskDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px] resize-y"
              placeholder="Enter task description (optional)"
            />
          </div>
          
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}