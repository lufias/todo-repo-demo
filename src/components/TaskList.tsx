import { FaListUl } from 'react-icons/fa';
import TaskItem from './TaskItem';
import { Virtuoso } from 'react-virtuoso';
import { useAppSelector } from '../store/hooks';
import { useState, useEffect } from 'react';
import AddTaskModal from './AddTaskModal';
import { useAppDispatch } from '../store/hooks';
import { loadTasksByList } from '../store/slices/taskListSlice';

// const tasks = [
//   {
//     title: 'Call Sam For payments',
//     author: 'Bob',
//     status: 'rejected',
//     color: 'yellow',
//     description: 'Follow up with Sam regarding the overdue payment for last month. The invoice #INV-2024-001 is pending since January 15th. Need to discuss the payment terms and any potential issues that might be causing the delay. Also, check if they need any additional documentation.'
//   },
//   {
//     title: 'Make payment to Bluedart',
//     author: 'Johnny',
//     status: 'new',
//     color: 'blue',
//     description: 'Ensure the invoice is correct before making the payment. The monthly courier charges for February need to be verified against the service usage report. Check for any discrepancies in the weight calculations and verify the fuel surcharge percentages. Also, confirm if there are any pending claims that need to be adjusted.'
//   },
//   {
//     title: 'Office rent',
//     author: 'Samino!',
//     color: 'blue',
//     description: 'Process the quarterly rent payment for the office space. The lease agreement specifies a 5% annual increase, so make sure to calculate the new amount correctly. Also, check if there are any maintenance charges or utility bills that need to be included in this payment cycle.'
//   },
//   {
//     title: 'Office grocery shopping',
//     author: 'Tida',
//     color: 'blue',
//     description: 'Buy snacks, coffee, and cleaning supplies for the office kitchen. Make sure to get organic coffee beans from the preferred supplier, and stock up on healthy snack options. Don\'t forget to check the inventory of cleaning supplies and restock any items that are running low. Also, verify the expiry dates of existing items.'
//   },
//   {
//     title: 'Ask for Lunch to Clients',
//     author: 'Office Admin',
//     color: 'green',
//     description: 'Coordinate with the visiting clients for their lunch preferences. We have a team of 5 people coming in for the quarterly review meeting. Need to check dietary restrictions, preferred cuisine, and any specific restaurant preferences. Also, make sure to book a table in advance and inform the restaurant about the exact number of people.'
//   },
//   // Add more tasks here to test virtual scrolling
// ];

type Task = {
  title: string;
  author: string;
  status?: string;
  color: string;
  description: string;
  done: boolean;
  tags: string[];
};

const tasks: Task[] = [];

export default function TaskList() {
  const dispatch = useAppDispatch();
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const selectedListId = useAppSelector(state => state.sidebar.selectedListId);
  const lists = useAppSelector(state => state.sidebar.lists);
  const folders = useAppSelector(state => state.sidebar.folders);
  const tasks = useAppSelector(state => state.taskList.tasks);
  const [loadedListId, setLoadedListId] = useState<string | null>(null);

  const selectedList = lists.find(list => list.id === selectedListId);
  const selectedFolder = selectedList ? folders.find(folder => folder.id === selectedList.folderId) : null;

  // Only load tasks when a list is explicitly selected
  useEffect(() => {
    if (selectedListId && selectedListId !== loadedListId) {
      dispatch(loadTasksByList(selectedListId));
      setLoadedListId(selectedListId);
    }
  }, [selectedListId, loadedListId, dispatch]);

  if (!selectedListId) {
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
          <div className="text-sm text-gray-400 dark:text-gray-500 font-medium pl-7">in <span className="text-gray-600 dark:text-gray-300 font-semibold">{selectedFolder.name}</span></div>
        )}
      </div>
      {/* Task List with Virtuoso */}
      {tasks.length === 0 ? (
        <div className="flex items-center justify-center h-96 text-gray-400 dark:text-gray-500 text-lg">
          No tasks yet. Add your first task!
        </div>
      ) : (
        <Virtuoso
          style={{ height: 384 }}
          totalCount={tasks.length}
          itemContent={index => {
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
} 