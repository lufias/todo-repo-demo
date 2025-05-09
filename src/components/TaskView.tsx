import { FaListUl } from 'react-icons/fa';
import TaskItem from './TaskItem';
import { Virtuoso } from 'react-virtuoso';
import { useAppSelector } from '../store/hooks';
import { useState, useEffect, FC } from 'react';
import AddTaskModal from './AddTaskModal';
import { useAppDispatch } from '../store/hooks';
import { loadTasksByList } from '../store/slices/tasksSlice';
import { Task, List, Folder } from '../services/database';

interface TaskViewProps {}

const TaskView: FC<TaskViewProps> = () => {
  const dispatch = useAppDispatch();
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState<boolean>(false);
  const selectedListId = useAppSelector((state) => state.sidebar.selectedListId);
  const lists = useAppSelector((state) => state.sidebar.lists) as List[];
  const folders = useAppSelector((state) => state.sidebar.folders) as Folder[];
  const tasks = useAppSelector((state) => state.tasks.tasks) as Task[];
  const [loadedListId, setLoadedListId] = useState<string | null>(null);

  const selectedList = lists.find((list) => list.id === selectedListId);
  const selectedFolder = selectedList ? folders.find((folder) => folder.id === selectedList.folderId) : null;

  // Only load tasks when a list is explicitly selected
  useEffect(() => {
    if (selectedListId && selectedListId !== loadedListId) {
      dispatch(loadTasksByList(selectedListId));
      setLoadedListId(selectedListId);
    }
  }, [selectedListId, loadedListId, dispatch]);

  if (!selectedListId || !selectedList) {
    return (
      <div className="flex items-center justify-center h-96 text-gray-400 text-lg">
        No list selected. Pick a list from the sidebar or create a new one.
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-5xl p-0 overflow-hidden border border-gray-200 dark:border-gray-700 mx-auto lg:ml-4 lg:mx-0 virtuoso-container">
      {/* Header */}
      <div className="px-6 pt-6 pb-2">
        <div className="flex items-center gap-2 mb-1">
          <FaListUl className="text-gray-700 dark:text-gray-300 text-xl" />
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{selectedList ? selectedList.content : 'List'}</h2>
        </div>
        {selectedFolder && (
          <div className="text-sm text-gray-400 dark:text-gray-500 font-medium pl-7">
            in <span className="text-gray-600 dark:text-gray-300 font-semibold">{selectedFolder.name}</span>
          </div>
        )}
      </div>
      {/* Full-width border divider */}
      <div className="border-b border-gray-300 dark:border-gray-700 my-2 w-full" />
      {/* Task List with Virtuoso */}
      {tasks.length === 0 ? (
        <div className="flex items-center justify-center h-96 text-gray-400 dark:text-gray-500 text-lg">
          No tasks yet. Add your first task!
        </div>
      ) : (
        <Virtuoso
          style={{ height: 384 }}
          totalCount={tasks.length}
          itemContent={(index: number) => {
            const task = tasks[index];
            return (
              <TaskItem
                key={task.id || index}
                id={task.id}
                title={task.title}
                author=""
                status={undefined}
                color="blue"
                description={task.description}
                done={task.done}
                tags={task.tags}
              />
            );
          }}
        />
      )}
      {/* Footer */}
      <div className="flex justify-end gap-4 px-6 py-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <button 
          onClick={() => setIsAddTaskModalOpen(true)}
          className="bg-primary-600 text-white px-6 py-2 rounded font-semibold hover:bg-primary-700 transition"
        >
          Add Task
        </button>
      </div>

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        listId={selectedListId}
      />
    </div>
  );
};

export default TaskView; 