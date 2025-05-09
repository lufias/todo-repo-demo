import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskItem from '../TaskItem';
import { TestWrapper } from '../../test/test-utils';

// Mock Font Awesome icons
vi.mock('react-icons/fa', () => ({
  FaCheck: () => <span data-testid="fa-check">Check</span>,
  FaTrash: () => <span data-testid="fa-trash">Delete</span>,
  FaEye: () => <span data-testid="fa-eye">View</span>,
  FaEdit: () => <span data-testid="fa-edit">Edit</span>,
  FaEllipsisV: () => <span data-testid="fa-ellipsis-v">More</span>
}));

// Mock the modals
vi.mock('../TaskPreviewModal', () => ({
  default: ({ isOpen, onClose, title }: any) => (
    isOpen ? (
      <div data-testid="preview-modal">
        <h2>{title}</h2>
        <button onClick={onClose}>Close Preview</button>
      </div>
    ) : null
  )
}));

vi.mock('../EditTaskModal', () => ({
  default: ({ isOpen, onClose }: any) => (
    isOpen ? (
      <div data-testid="edit-modal">
        <button onClick={onClose}>Close Edit</button>
      </div>
    ) : null
  )
}));

// Mock Redux dispatch
const mockDispatch = vi.fn();
vi.mock('../../store/hooks', () => ({
  useAppDispatch: () => mockDispatch
}));

// Mock useClickAway
vi.mock('react-use', () => ({
  useClickAway: vi.fn() // We don't need to test the hook itself
}));

// Mock window.matchMedia for mobile simulation
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: query === '(max-width: 640px)', // Simulate mobile view
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

const mockTask = {
  id: 'task-1',
  title: 'Test Task',
  author: 'Test Author',
  description: 'Test Description',
  done: false,
  tags: ['work', 'urgent']
};

const renderTaskItem = (props = {}) => {
  return render(
    <TaskItem {...mockTask} {...props} />,
    { wrapper: TestWrapper }
  );
};

describe('TaskItem', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render task title and description', () => {
    renderTaskItem();
    
    expect(screen.getByText('Test Task')).toBeDefined();
    expect(screen.getByText('Test Description')).toBeDefined();
  });

  it('should render tags if provided', () => {
    renderTaskItem();
    
    expect(screen.getByText('work')).toBeDefined();
    expect(screen.getByText('urgent')).toBeDefined();
  });

  it('should render status badge if provided', () => {
    renderTaskItem({ status: 'new' });
    
    expect(screen.getByText('new')).toBeDefined();
  });

  it('should toggle task status when clicking checkbox', async () => {
    const user = userEvent.setup();
    renderTaskItem();

    const checkbox = screen.getByRole('button', { name: /mark as complete/i });
    await act(async () => {
      await user.click(checkbox);
    });

    expect(mockDispatch).toHaveBeenCalled();
  });

  it('should show completed style when task is done', () => {
    renderTaskItem({ done: true });
    
    const title = screen.getByText('Test Task');
    expect(title.className).toContain('line-through');
    expect(screen.getByTestId('fa-check')).toBeDefined();
  });

  it('should handle task actions', async () => {
    const user = userEvent.setup();
    renderTaskItem();

    // Test edit action
    await act(async () => {
      await user.click(screen.getByRole('button', { name: /edit task/i }));
    });
    expect(screen.getByTestId('edit-modal')).toBeDefined();

    // Close edit modal
    await act(async () => {
      await user.click(screen.getByText('Close Edit'));
    });

    // Test view action
    await act(async () => {
      await user.click(screen.getByRole('button', { name: /view task details/i }));
    });
    expect(screen.getByTestId('preview-modal')).toBeDefined();

    // Close preview modal
    await act(async () => {
      await user.click(screen.getByText('Close Preview'));
    });

    // Test delete action
    await act(async () => {
      await user.click(screen.getByRole('button', { name: /delete task/i }));
    });
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('should show kebab menu and dropdown on mobile', async () => {
    const user = userEvent.setup();
    renderTaskItem();

    // Verify kebab menu is present
    const kebabButton = screen.getByRole('button', { name: /task options/i });
    expect(kebabButton).toBeDefined();

    // Click kebab menu to open dropdown
    await act(async () => {
      await user.click(kebabButton);
    });

    // Verify dropdown menu items are present
    expect(screen.getByTestId('dropdown-edit')).toBeDefined();
    expect(screen.getByTestId('dropdown-view')).toBeDefined();
    expect(screen.getByTestId('dropdown-delete')).toBeDefined();

    // Test dropdown actions
    await act(async () => {
      await user.click(screen.getByTestId('dropdown-edit'));
    });
    expect(screen.getByTestId('edit-modal')).toBeDefined();

    // Close edit modal
    await act(async () => {
      await user.click(screen.getByText('Close Edit'));
    });

    // Verify dropdown is closed after action
    expect(screen.queryByTestId('dropdown-edit')).toBeNull();
  });
}); 