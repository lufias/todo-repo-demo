import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskView from '../TaskView';
import { TestWrapper } from '../../test/test-utils';
import { Task, List, Folder } from '../../services/database';
import { useAppSelector } from '../../store/hooks';
import { RootState } from '../../store';

// Mock Font Awesome icons
vi.mock('react-icons/fa', () => ({
  FaListUl: () => <span data-testid="fa-list">List Icon</span>
}));

// Mock the TaskItem component
vi.mock('../TaskItem', () => ({
  default: ({ title, description, tags }: any) => (
    <div data-testid="task-item">
      <h3>{title}</h3>
      <p>{description}</p>
      {tags?.map((tag: string) => (
        <span key={tag} data-testid={`tag-${tag}`}>{tag}</span>
      ))}
    </div>
  )
}));

// Mock the AddTaskModal component
vi.mock('../AddTaskModal', () => ({
  default: ({ isOpen, onClose }: any) => (
    isOpen ? (
      <div data-testid="add-task-modal">
        <button onClick={onClose}>Close Modal</button>
      </div>
    ) : null
  )
}));

// Mock the Virtuoso component
vi.mock('react-virtuoso', () => ({
  Virtuoso: ({ itemContent }: any) => (
    <div data-testid="virtuoso-list">
      {itemContent(0)}
    </div>
  )
}));

// Mock tasks
const mockTasks: Task[] = [
  {
    id: 'task-1',
    listId: 'list-1',
    title: 'Test Task 1',
    description: 'Test Description 1',
    done: false,
    tags: ['work', 'urgent']
  },
  {
    id: 'task-2',
    listId: 'list-1',
    title: 'Test Task 2',
    description: 'Test Description 2',
    done: true,
    tags: ['personal']
  }
];

// Mock lists and folders
const mockLists: List[] = [
  {
    id: 'list-1',
    folderId: 'folder-1',
    content: 'Test List'
  }
];

const mockFolders: Folder[] = [
  {
    id: 'folder-1',
    name: 'Test Folder'
  }
];

// Mock Redux state
const mockState: RootState = {
  user: {
    id: null,
    name: null,
    email: null,
    isAuthenticated: false,
    loading: false,
    error: null
  },
  sidebar: {
    selectedListId: 'list-1',
    selectedFolderId: 'folder-1',
    lists: mockLists,
    folders: mockFolders,
    loading: false,
    error: null
  },
  tasks: {
    tasks: mockTasks,
    loading: false,
    error: null
  }
};

// Mock Redux dispatch
const mockDispatch = vi.fn();

// Mock the Redux hooks
vi.mock('../../store/hooks', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: vi.fn()
}));

const renderTaskView = (state: RootState = mockState) => {
  // Set up the mock selector for this render
  vi.mocked(useAppSelector).mockImplementation((selector) => selector(state));
  
  return render(
    <TaskView />,
    { wrapper: TestWrapper }
  );
};

describe('TaskView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset the mock selector to use the default state
    vi.mocked(useAppSelector).mockImplementation((selector) => selector(mockState));
  });

  it('should show message when no list is selected', () => {
    const noListState: RootState = {
      ...mockState,
      sidebar: {
        ...mockState.sidebar,
        selectedListId: null
      }
    };
    
    renderTaskView(noListState);
    
    expect(screen.getByText('No list selected. Pick a list from the sidebar or create a new one.')).toBeDefined();
  });

  it('should show message when selected list is deleted', () => {
    const deletedListState: RootState = {
      ...mockState,
      sidebar: {
        ...mockState.sidebar,
        selectedListId: 'list-1',
        lists: [] // Empty lists array simulates the list being deleted
      }
    };
    
    renderTaskView(deletedListState);
    
    expect(screen.getByText('No list selected. Pick a list from the sidebar or create a new one.')).toBeDefined();
  });

  it('should render list and folder information', () => {
    renderTaskView();
    
    expect(screen.getByText('Test List')).toBeDefined();
    expect(screen.getByText('in')).toBeDefined();
    expect(screen.getByText('Test Folder')).toBeDefined();
  });

  it('should load tasks when a list is selected', async () => {
    renderTaskView();
    
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(expect.any(Function));
    });
  });

  it('should render tasks using Virtuoso', () => {
    renderTaskView();
    
    expect(screen.getByTestId('virtuoso-list')).toBeDefined();
    expect(screen.getByText('Test Task 1')).toBeDefined();
    expect(screen.getByText('Test Description 1')).toBeDefined();
    expect(screen.getByTestId('tag-work')).toBeDefined();
    expect(screen.getByTestId('tag-urgent')).toBeDefined();
  });

  it('should show empty state when no tasks exist', () => {
    const emptyTasksState: RootState = {
      ...mockState,
      tasks: {
        ...mockState.tasks,
        tasks: []
      }
    };
    
    renderTaskView(emptyTasksState);
    
    expect(screen.getByText('No tasks yet. Add your first task!')).toBeDefined();
  });

  it('should open add task modal when clicking add button', async () => {
    const user = userEvent.setup();
    renderTaskView();

    const addButton = screen.getByText('Add Task');
    await act(async () => {
      await user.click(addButton);
    });

    expect(screen.getByTestId('add-task-modal')).toBeDefined();
  });

  it('should close add task modal', async () => {
    const user = userEvent.setup();
    renderTaskView();

    // Open modal
    const addButton = screen.getByText('Add Task');
    await act(async () => {
      await user.click(addButton);
    });

    // Close modal
    const closeButton = screen.getByText('Close Modal');
    await act(async () => {
      await user.click(closeButton);
    });

    expect(screen.queryByTestId('add-task-modal')).toBeNull();
  });
}); 