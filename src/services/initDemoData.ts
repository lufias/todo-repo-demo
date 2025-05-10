import { Task } from './database';

export const demoTasks: Omit<Task, 'id' | 'listId'>[] = [
  {
    title: 'Complete project documentation',
    description: 'Write comprehensive documentation for the new feature implementation, including API endpoints and database schema changes.',
    tags: ['documentation', 'priority'],
    priority: 'high',
    done: false
  },
  {
    title: 'Review pull requests',
    description: 'Review and provide feedback on team members\' pull requests, focusing on code quality and best practices.',
    tags: ['code-review', 'team'],
    priority: 'medium',
    done: false
  },
  {
    title: 'Update dependencies',
    description: 'Check for outdated npm packages and update them to their latest stable versions.',
    tags: ['maintenance', 'security'],
    priority: 'low',
    done: false
  },
  {
    title: 'Schedule team meeting',
    description: 'Organize a weekly sync-up meeting to discuss progress and blockers.',
    tags: ['meeting', 'planning'],
    priority: 'medium',
    done: false
  },
  {
    title: 'Fix reported bugs',
    description: 'Address the critical bugs reported in the latest release.',
    tags: ['bug-fix', 'urgent'],
    priority: 'high',
    done: false
  }
]; 