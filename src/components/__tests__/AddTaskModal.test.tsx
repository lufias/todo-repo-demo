import { describe, it, expect, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddTaskModal from '../AddTaskModal';
import { TestWrapper } from '../../test/test-utils';

const renderModal = (props = {}) => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    listId: 'list-1'
  };

  return render(
    <AddTaskModal {...defaultProps} {...props} />,
    { wrapper: TestWrapper }
  );
};

describe('AddTaskModal', () => {
  it('should not render when isOpen is false', () => {
    renderModal({ isOpen: false });
    expect(screen.queryByText('Add New Task')).toBeNull();
  });

  it('should render modal with all form elements when isOpen is true', () => {
    renderModal();
    
    expect(screen.getByText('Add New Task')).toBeDefined();
    expect(screen.getByLabelText(/Task Title/i)).toBeDefined();
    expect(screen.getByLabelText(/Description/i)).toBeDefined();
    expect(screen.getByLabelText(/Tags/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /Add Task/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeDefined();
  });

  it('should show error when submitting empty title', async () => {
    const user = userEvent.setup();
    renderModal();
    
    await act(async () => {
      const submitButton = screen.getByRole('button', { name: /Add Task/i });
      await user.click(submitButton);
    });

    expect(await screen.findByText('Title is required')).toBeDefined();
  });

  it('should handle tag input correctly', async () => {
    const user = userEvent.setup();
    renderModal();
    
    await act(async () => {
      const tagInput = screen.getByLabelText(/Tags/i);
      await user.type(tagInput, 'work,');
    });
    
    expect(screen.getByText('work')).toBeDefined();
  });

  it('should prevent adding more than 5 tags', async () => {
    const user = userEvent.setup();
    renderModal();
    
    await act(async () => {
      const tagInput = screen.getByLabelText(/Tags/i);
      
      // Add 5 tags
      for (let i = 1; i <= 5; i++) {
        await user.type(tagInput, `tag${i},`);
      }
      
      // Try to add a 6th tag
      await user.type(tagInput, 'tag6,');
    });
    
    expect(screen.getByText('Maximum 5 tags allowed')).toBeDefined();
    expect(screen.queryByText('tag6')).toBeNull();
  });

  it('should prevent adding duplicate tags', async () => {
    const user = userEvent.setup();
    renderModal();
    
    await act(async () => {
      const tagInput = screen.getByLabelText(/Tags/i);
      await user.type(tagInput, 'work,');
      await user.type(tagInput, 'work,');
    });
    
    expect(screen.getByText('Tag already exists')).toBeDefined();
  });

  it('should remove tag when clicking remove button', async () => {
    const user = userEvent.setup();
    renderModal();
    
    await act(async () => {
      const tagInput = screen.getByLabelText(/Tags/i);
      await user.type(tagInput, 'work,');
    });
    
    await act(async () => {
      const removeButton = screen.getByRole('button', { name: /Remove tag work/i });
      await user.click(removeButton);
    });
    
    expect(screen.queryByText('work')).toBeNull();
  });

  it('should call onClose when clicking cancel button', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    renderModal({ onClose });
    
    await act(async () => {
      const cancelButton = screen.getByRole('button', { name: /Cancel/i });
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

  it('should submit form with valid data', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    renderModal({ onClose });
    
    await act(async () => {
      // Fill in the form
      await user.type(screen.getByLabelText(/Task Title/i), 'Test Task');
      await user.type(screen.getByLabelText(/Description/i), 'Test Description');
      await user.type(screen.getByLabelText(/Tags/i), 'work,urgent,');
      
      // Submit the form
      const submitButton = screen.getByRole('button', { name: /Add Task/i });
      await user.click(submitButton);
    });
    
    // Verify form is reset and modal is closed
    expect(onClose).toHaveBeenCalled();
  });
}); 