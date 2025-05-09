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

  it('should show error when submitting empty title', async () => {
    const user = userEvent.setup();
    renderModal();
    
    await act(async () => {
      const submitButton = screen.getByTestId('submit-button');
      await user.click(submitButton);
    });

    expect(await screen.findByTestId('title-error')).toBeDefined();
  });

  it('should handle tag input correctly', async () => {
    const user = userEvent.setup();
    renderModal();
    
    await act(async () => {
      const tagInput = screen.getByTestId('tags-input');
      await user.type(tagInput, 'work,');
    });
    
    expect(screen.getByTestId('tag-work')).toBeDefined();
  });

  it('should prevent adding more than 5 tags', async () => {
    const user = userEvent.setup();
    renderModal();
    
    await act(async () => {
      const tagInput = screen.getByTestId('tags-input');
      
      // Add 5 tags
      for (let i = 1; i <= 5; i++) {
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
    
    await act(async () => {
      const tagInput = screen.getByTestId('tags-input');
      await user.type(tagInput, 'work,');
      await user.type(tagInput, 'work,');
    });
    
    expect(screen.getByTestId('tags-error')).toBeDefined();
  });

  it('should remove tag when clicking remove button', async () => {
    const user = userEvent.setup();
    renderModal();
    
    await act(async () => {
      const tagInput = screen.getByTestId('tags-input');
      await user.type(tagInput, 'work,');
    });
    
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

  it('should submit form with valid data', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    renderModal({ onClose });
    
    await act(async () => {
      // Fill in the form
      await user.type(screen.getByTestId('title-input'), 'Test Task');
      await user.type(screen.getByTestId('description-input'), 'Test Description');
      await user.type(screen.getByTestId('tags-input'), 'work,urgent,');
      
      // Submit the form
      const submitButton = screen.getByTestId('submit-button');
      await user.click(submitButton);
    });
    
    // Verify form is reset and modal is closed
    expect(onClose).toHaveBeenCalled();
  });
}); 