import { FaTimes } from 'react-icons/fa';

interface TaskPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  tags?: string[];
  done: boolean;
}

export default function TaskPreviewModal({ isOpen, onClose, title, description, tags, done }: TaskPreviewModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Task Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-1">Title</h3>
            <p className={`text-lg ${done ? 'text-gray-400 line-through' : 'text-gray-900'}`}>{title}</p>
          </div>

          {description && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1">Description</h3>
              <p className={`text-gray-600 whitespace-pre-wrap ${done ? 'text-gray-300' : ''}`}>{description}</p>
            </div>
          )}

          {tags && tags.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-1">Status</h3>
            <p className={`text-sm font-medium ${done ? 'text-green-600' : 'text-blue-600'}`}>
              {done ? 'Completed' : 'In Progress'}
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
} 