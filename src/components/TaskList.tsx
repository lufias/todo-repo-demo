import { FaListUl } from 'react-icons/fa';
import TaskItem from './TaskItem';
import { Virtuoso } from 'react-virtuoso';

const tasks = [
  {
    title: 'Call Sam For payments',
    author: 'Bob',
    status: 'rejected',
    color: 'yellow',
    description: 'Follow up with Sam regarding the overdue payment for last month. The invoice #INV-2024-001 is pending since January 15th. Need to discuss the payment terms and any potential issues that might be causing the delay. Also, check if they need any additional documentation.'
  },
  {
    title: 'Make payment to Bluedart',
    author: 'Johnny',
    status: 'new',
    color: 'blue',
    description: 'Ensure the invoice is correct before making the payment. The monthly courier charges for February need to be verified against the service usage report. Check for any discrepancies in the weight calculations and verify the fuel surcharge percentages. Also, confirm if there are any pending claims that need to be adjusted.'
  },
  {
    title: 'Office rent',
    author: 'Samino!',
    color: 'blue',
    description: 'Process the quarterly rent payment for the office space. The lease agreement specifies a 5% annual increase, so make sure to calculate the new amount correctly. Also, check if there are any maintenance charges or utility bills that need to be included in this payment cycle.'
  },
  {
    title: 'Office grocery shopping',
    author: 'Tida',
    color: 'blue',
    description: 'Buy snacks, coffee, and cleaning supplies for the office kitchen. Make sure to get organic coffee beans from the preferred supplier, and stock up on healthy snack options. Don\'t forget to check the inventory of cleaning supplies and restock any items that are running low. Also, verify the expiry dates of existing items.'
  },
  {
    title: 'Ask for Lunch to Clients',
    author: 'Office Admin',
    color: 'green',
    description: 'Coordinate with the visiting clients for their lunch preferences. We have a team of 5 people coming in for the quarterly review meeting. Need to check dietary restrictions, preferred cuisine, and any specific restaurant preferences. Also, make sure to book a table in advance and inform the restaurant about the exact number of people.'
  },
  // Add more tasks here to test virtual scrolling
];

export default function TaskList() {
  return (
    <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl p-0 overflow-hidden border border-gray-200 mt-10 mx-auto lg:ml-4 lg:mx-0 virtuoso-container">
      {/* Header */}
      <div className="flex items-center gap-2 px-6 pt-6 pb-2">
        <FaListUl className="text-gray-700 text-xl" />
        <h2 className="text-lg font-semibold text-gray-800">Task Lists</h2>
      </div>
      {/* Task List with Virtuoso */}
      <Virtuoso
        style={{ height: 384 }} // 24rem, similar to max-h-96
        totalCount={tasks.length}
        itemContent={index => {
          const task = tasks[index];
          return (
            <TaskItem
              key={index}
              title={task.title}              
              status={task.status as any}
              color={task.color as any}
              description={task.description}
              author={task.author}
            />
          );
        }}
      />
      {/* Footer */}
      <div className="flex justify-end gap-4 px-6 py-4 bg-white border-t">
        <button className="text-blue-600 hover:underline font-medium">Cancel</button>
        <button className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 transition">Add Task</button>
      </div>
    </div>
  );
} 