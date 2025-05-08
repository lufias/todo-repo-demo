import TaskList from '../components/TaskList';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-center">
        <TaskList />
      </div>
    </div>
  );
} 