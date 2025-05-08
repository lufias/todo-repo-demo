import { FaListUl } from 'react-icons/fa';
import TaskItem from './TaskItem';

export default function TaskList() {
  return (
    <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-0 overflow-hidden border-4 border-purple-600 mx-auto mt-10">
      {/* Header */}
      <div className="flex items-center gap-2 px-6 pt-6 pb-2">
        <FaListUl className="text-gray-700 text-xl" />
        <h2 className="text-xl font-semibold">Task Lists</h2>
      </div>
      {/* Task List */}
      <div className="max-h-96 overflow-y-auto divide-y">
        <TaskItem title="Call Sam For payments" author="Bob" status="rejected" color="yellow" />
        <TaskItem title="Make payment to Bluedart" author="Johnny" status="new" color="blue" />
        <TaskItem title="Office rent" author="Samino!" color="blue" />
        <TaskItem title="Office grocery shopping" author="Tida" color="blue" />
        <TaskItem title="Ask for Lunch to Clients" author="Office Admin" color="green" />
      </div>
      {/* Footer */}
      <div className="flex justify-end gap-4 px-6 py-4 bg-white border-t">
        <button className="text-blue-600 hover:underline font-medium">Cancel</button>
        <button className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 transition">Add Task</button>
      </div>
    </div>
  );
} 