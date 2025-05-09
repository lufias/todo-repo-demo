import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskPreviewModal from '../TaskPreviewModal';
import { TestWrapper } from '../../test/test-utils';

// Mock Font Awesome icons
vi.mock('react-icons/fa', () => ({
  FaTimes: () => <span data-testid="fa-times">Close Icon</span>
}));

const defaultProps = {
  isOpen: true,
  onClose: vi.fn(),
  title: 'Test Task',
  description: 'Test Description',
  tags: ['work', 'urgent'],
  done: false
};

const renderModal = (props = {}) => {
  return render(
    <TaskPreviewModal {...defaultProps} {...props} />,
    { wrapper: TestWrapper }
  );
};

describe('TaskPreviewModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not render when isOpen is false', () => {
    renderModal({ isOpen: false });
    expect(screen.queryByText('Task Details')).toBeNull();
  });

  it('should render modal with all elements when isOpen is true', async () => {
    renderModal();
    
    await waitFor(() => {
      expect(screen.getByText('Task Details')).toBeDefined();
      expect(screen.getByText('Test Task')).toBeDefined();
      expect(screen.getByText('Test Description')).toBeDefined();
      expect(screen.getByText('work')).toBeDefined();
      expect(screen.getByText('urgent')).toBeDefined();
      expect(screen.getByText('In Progress')).toBeDefined();
    });
  });

  it('should not render description section when description is not provided', () => {
    renderModal({ description: undefined });
    expect(screen.queryByText('Description')).toBeNull();
  });

  it('should not render tags section when tags are not provided', () => {
    renderModal({ tags: undefined });
    expect(screen.queryByText('Tags')).toBeNull();
  });

  it('should not render tags section when tags array is empty', () => {
    renderModal({ tags: [] });
    expect(screen.queryByText('Tags')).toBeNull();
  });

  it('should show completed status when task is done', async () => {
    renderModal({ done: true });
    
    await waitFor(() => {
      expect(screen.getByText('Completed')).toBeDefined();
      expect(screen.queryByText('In Progress')).toBeNull();
    });
  });

  it('should show completed style for title and description when task is done', async () => {
    renderModal({ done: true });
    
    await waitFor(() => {
      const title = screen.getByText('Test Task');
      const description = screen.getByText('Test Description');
      
      expect(title.className).toContain('line-through');
      expect(title.className).toContain('text-gray-400');
      expect(description.className).toContain('text-gray-300');
    });
  });

  it('should call onClose when clicking close button', async () => {
    const user = userEvent.setup();
    renderModal();

    const closeButton = screen.getByTestId('close-modal-button');
    await user.click(closeButton);

    await waitFor(() => {
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });
  });

  it('should call onClose when clicking close text button', async () => {
    const user = userEvent.setup();
    renderModal();

    const closeButton = screen.getByTestId('close-text-button');
    await user.click(closeButton);

    await waitFor(() => {
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });
  });

  it('should render tags with correct styling', async () => {
    renderModal();
    
    await waitFor(() => {
      const workTag = screen.getByTestId('tag-work');
      const urgentTag = screen.getByTestId('tag-urgent');
      
      [workTag, urgentTag].forEach(tag => {
        expect(tag.className).toContain('bg-blue-100');
        expect(tag.className).toContain('text-blue-800');
        expect(tag.className).toContain('rounded-full');
      });
    });
  });
}); 