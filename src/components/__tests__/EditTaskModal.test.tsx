import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EditTaskModal from '../EditTaskModal';
import { TestWrapper } from '../../test/test-utils';
import { Task } from '../../services/database';

// Add custom matchers
expect.extend({
  toBeInTheDocument(received) {
    return {
      pass: received !== null && received !== undefined,
      message: () => `expected ${received} to be in the document`,
    };
  },
});

// Mock the database service
vi.mock('../../services/database', () => ({
  updateTask: vi.fn().mockImplementation((taskId: string, updates: Partial<Task>) => {
    return Promise.resolve({
      id: taskId,
      listId: 'list-1',
      ...updates,
      done: false
    });
  })
}));

const mockTask: Task = {
  id: 'task-1',
  listId: 'list-1',
  title: 'Test Task',
  description: 'Test Description',
  done: false,
  tags: ['work', 'urgent'],
  priority: 'low',
};

// Mock the Redux state
const mockState = {
  tasks: {
    tasks: [mockTask],
    lists: [],
    loading: false,
    error: null
  }
};

// Mock the Redux dispatch
const mockDispatch = vi.fn().mockImplementation((action) => {
  if (typeof action === 'function') {
    // Handle thunk action
    return action(mockDispatch, () => mockState, undefined);
  }
  return Promise.resolve();
});

vi.mock('../../store/hooks', () => ({
  useAppDispatch: () => mockDispatch
}));

const renderModal = (props = {}) => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    task: mockTask
  };

  return render(
    <EditTaskModal {...defaultProps} {...props} />,
    { wrapper: TestWrapper }
  );
};

describe('EditTaskModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not render when isOpen is false', () => {
    renderModal({ isOpen: false });
    expect(screen.queryByTestId('modal-title')).toBeNull();
  });

  it('should render modal with all form elements when isOpen is true', () => {
    renderModal();
    
    expect(screen.getByTestId('modal-title')).toBeDefined();
    expect(screen.getByTestId('title-input')).toBeDefined();
    expect(screen.getByTestId('description-input')).toBeDefined();
    expect(screen.getByTestId('tags-input')).toBeDefined();
    expect(screen.getByTestId('submit-button')).toBeDefined();
    expect(screen.getByTestId('cancel-button')).toBeDefined();
  });

  it('should initialize form with task data', () => {
    renderModal();
    
    const titleInput = screen.getByTestId('title-input') as HTMLInputElement;
    const descriptionInput = screen.getByTestId('description-input') as HTMLTextAreaElement;
    
    expect(titleInput.value).toBe(mockTask.title);
    expect(descriptionInput.value).toBe(mockTask.description);
    mockTask.tags?.forEach(tag => {
      expect(screen.getByTestId(`tag-${tag}`)).toBeDefined();
    });
  });

  it('should show error when submitting empty title', async () => {
    const user = userEvent.setup();
    renderModal();
    
    const titleInput = screen.getByTestId('title-input');
    const submitButton = screen.getByTestId('submit-button');
    
    // Clear the title input and remove required attribute
    await act(async () => {
      titleInput.removeAttribute('required');
      await user.clear(titleInput);
    });

    // Submit the form to trigger validation
    await act(async () => {
      await user.click(submitButton);
    });

    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByTestId('title-error')).toBeDefined();
    });
  });

  it('should handle tag input correctly', async () => {
    const user = userEvent.setup();
    renderModal();
    
    const tagInput = screen.getByTestId('tags-input') as HTMLInputElement;
    
    // Add multiple tags in one input
    await act(async () => {
      await user.type(tagInput, 'tag1,tag2,');
    });
    
    // Verify both tags were added
    expect(screen.getByTestId('tag-tag1')).toBeDefined();
    expect(screen.getByTestId('tag-tag2')).toBeDefined();
    
    // Verify input is cleared after adding tags
    expect(tagInput.value).toBe('');
  });

  it('should prevent adding more than 5 tags', async () => {
    const user = userEvent.setup();
    renderModal();
    
    await act(async () => {
      const tagInput = screen.getByTestId('tags-input');
      
      // Add 3 more tags (we already have 2 from mockTask)
      for (let i = 1; i <= 3; i++) {
        await user.type(tagInput, `tag${i},`);
      }
      
      // Try to add a 6th tag
      await user.type(tagInput, 'tag6,');
    });
    
    expect(screen.getByTestId('tags-error')).toBeDefined();
    expect(screen.queryByTestId('tag-tag6')).toBeNull();
  });

  it('should prevent adding duplicate tags', async () => {
    const user = userEvent.setup();
    renderModal();
    
    const tagInput = screen.getByTestId('tags-input');
    
    // Try to add a duplicate tag
    await act(async () => {
      await user.type(tagInput, 'work,');  // work is already in mockTask.tags
    });
    
    // Verify the tag wasn't added again
    const workTags = screen.getAllByTestId('tag-work');
    expect(workTags).toHaveLength(1);  // Should only have one 'work' tag
  });

  it('should remove tag when clicking remove button', async () => {
    const user = userEvent.setup();
    renderModal();
    
    await act(async () => {
      const removeButton = screen.getByTestId('remove-tag-work');
      await user.click(removeButton);
    });
    
    expect(screen.queryByTestId('tag-work')).toBeNull();
  });

  it('should call onClose when clicking cancel button', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    renderModal({ onClose });
    
    await act(async () => {
      const cancelButton = screen.getByTestId('cancel-button');
      await user.click(cancelButton);
    });
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when clicking outside modal', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    renderModal({ onClose });
    
    await act(async () => {
      const overlay = screen.getByTestId('modal-overlay');
      await user.click(overlay);
    });
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should update task with new data', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    renderModal({ onClose });
    
    const titleInput = screen.getByTestId('title-input');
    const descriptionInput = screen.getByTestId('description-input');
    const tagInput = screen.getByTestId('tags-input');
    const submitButton = screen.getByTestId('submit-button');
    
    await act(async () => {
      await user.clear(titleInput);
      await user.type(titleInput, 'Updated Task');
      await user.clear(descriptionInput);
      await user.type(descriptionInput, 'Updated Description');
      await user.type(tagInput, 'new-tag,');
      await user.click(submitButton);
    });
    
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(expect.any(Function));
    });
    
    // Get the thunk action that was passed to dispatch
    const thunkAction = mockDispatch.mock.calls[0][0];
    
    // Execute the thunk action to verify its payload
    const result = await thunkAction(mockDispatch, () => mockState, undefined);
    
    await waitFor(() => {
      expect(result.payload).toEqual({
        id: mockTask.id,
        listId: mockTask.listId,
        title: 'Updated Task',
        description: 'Updated Description',
        done: false,
        tags: ['work', 'urgent', 'new-tag'],
        priority: 'low',
      });
      expect(onClose).toHaveBeenCalled();
    });
  });

  it('should reset form when modal is reopened', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    const { rerender } = renderModal({ onClose });
    
    // First, make some changes
    await act(async () => {
      const titleInput = screen.getByTestId('title-input');
      await user.clear(titleInput);
      await user.type(titleInput, 'Modified Title');
    });
    
    // Close the modal by setting isOpen to false
    await act(async () => {
      rerender(
        <EditTaskModal
          isOpen={false}
          onClose={onClose}
          task={mockTask}
        />
      );
    });
    
    // Reopen the modal
    await act(async () => {
      rerender(
        <EditTaskModal
          isOpen={true}
          onClose={onClose}
          task={mockTask}
        />
      );
    });
    
    // Wait for the next tick to ensure state updates are applied
    await new Promise(resolve => setTimeout(resolve, 0));
    
    // Verify form is reset to initial values
    const titleInput = screen.getByTestId('title-input') as HTMLInputElement;
    const descriptionInput = screen.getByTestId('description-input') as HTMLTextAreaElement;
    
    expect(titleInput.value).toBe(mockTask.title);
    expect(descriptionInput.value).toBe(mockTask.description);
    mockTask.tags?.forEach(tag => {
      expect(screen.getByTestId(`tag-${tag}`)).toBeDefined();
    });
  });

  it('should render priority radio buttons and select correct value', () => {
    renderModal({ task: { ...mockTask, priority: 'medium' } });
    const low = screen.getByTestId('priority-low') as HTMLInputElement;
    const medium = screen.getByTestId('priority-medium') as HTMLInputElement;
    const high = screen.getByTestId('priority-high') as HTMLInputElement;
    expect(low).toBeDefined();
    expect(medium).toBeDefined();
    expect(high).toBeDefined();
    expect(low.checked).toBe(false);
    expect(medium.checked).toBe(true);
    expect(high.checked).toBe(false);
  });

  it('should change priority selection when clicked', async () => {
    const user = userEvent.setup();
    renderModal({ task: { ...mockTask, priority: 'high' } });
    const low = screen.getByTestId('priority-low') as HTMLInputElement;
    const medium = screen.getByTestId('priority-medium') as HTMLInputElement;
    const high = screen.getByTestId('priority-high') as HTMLInputElement;
    expect(high.checked).toBe(true);
    await act(async () => { await user.click(medium); });
    expect(medium.checked).toBe(true);
    await act(async () => { await user.click(low); });
    expect(low.checked).toBe(true);
  });
}); 