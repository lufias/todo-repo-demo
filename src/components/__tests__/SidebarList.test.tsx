import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SidebarList from '../SidebarList';
import { TestWrapper } from '../../test/test-utils';

// Mock Font Awesome icons
vi.mock('react-icons/fa', () => ({
  FaListUl: () => <span data-testid="fa-list">List</span>,
  FaEllipsisH: () => <span data-testid="fa-ellipsis">Menu</span>,
  FaTrash: () => <span data-testid="fa-trash">Delete</span>,
  FaEdit: () => <span data-testid="fa-edit">Edit</span>
}));

const mockList = {
  id: 'list-1',
  folderId: 'folder-1',
  content: 'Test List'
};

const defaultProps = {
  list: mockList,
  activeDropdown: null,
  setActiveDropdown: vi.fn(),
  onDelete: vi.fn(),
  onRename: vi.fn(),
  isLastList: false,
  onSelect: vi.fn()
};

const renderSidebarList = (props = {}) => {
  return render(
    <SidebarList {...defaultProps} {...props} />,
    { wrapper: TestWrapper }
  );
};

describe('SidebarList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render list name and icons', () => {
    renderSidebarList();
    
    expect(screen.getByText('Test List')).toBeDefined();
    expect(screen.getByTestId('fa-list')).toBeDefined();
    expect(screen.getByTestId('fa-ellipsis')).toBeDefined();
  });

  it('should call onSelect when clicking the list', async () => {
    const user = userEvent.setup();
    renderSidebarList();

    const listElement = screen.getByText('Test List').closest('div');
    expect(listElement).toBeDefined();

    await act(async () => {
      await user.click(listElement!);
    });

    expect(defaultProps.onSelect).toHaveBeenCalledTimes(1);
  });

  it('should show dropdown menu when clicking ellipsis', async () => {
    const user = userEvent.setup();
    renderSidebarList();

    const ellipsisButton = screen.getByTestId('fa-ellipsis').closest('button');
    expect(ellipsisButton).toBeDefined();

    await act(async () => {
      await user.click(ellipsisButton!);
    });

    expect(defaultProps.setActiveDropdown).toHaveBeenCalledWith('list-1');
  });

  it('should show rename input when clicking rename option', async () => {
    const user = userEvent.setup();
    renderSidebarList({ activeDropdown: 'list-1' });

    await act(async () => {
      await user.click(screen.getByText('Rename List'));
    });

    expect(screen.getByRole('textbox')).toBeDefined();
    expect(screen.getByTitle('Confirm')).toBeDefined();
    expect(screen.getByTitle('Cancel')).toBeDefined();
  });

  it('should call onRename when confirming rename', async () => {
    const user = userEvent.setup();
    renderSidebarList({ activeDropdown: 'list-1' });

    // Click rename option
    await act(async () => {
      await user.click(screen.getByText('Rename List'));
    });

    // Type new name and confirm
    const input = screen.getByRole('textbox');
    await act(async () => {
      await user.clear(input);
      await user.type(input, 'New List Name');
      await user.click(screen.getByTitle('Confirm'));
    });

    expect(defaultProps.onRename).toHaveBeenCalledWith('New List Name');
  });

  it('should cancel rename when pressing escape', async () => {
    const user = userEvent.setup();
    renderSidebarList({ activeDropdown: 'list-1' });

    // Click rename option
    await act(async () => {
      await user.click(screen.getByText('Rename List'));
    });

    // Type new name and press escape
    const input = screen.getByRole('textbox');
    await act(async () => {
      await user.clear(input);
      await user.type(input, 'New List Name');
      await user.keyboard('{Escape}');
    });

    // Input should be gone and original name should be visible
    expect(screen.queryByRole('textbox')).toBeNull();
    expect(screen.getByText('Test List')).toBeDefined();
  });

  it('should call onDelete when clicking delete option', async () => {
    const user = userEvent.setup();
    renderSidebarList({ activeDropdown: 'list-1' });

    await act(async () => {
      await user.click(screen.getByText('Delete List'));
    });

    expect(defaultProps.onDelete).toHaveBeenCalledTimes(1);
  });

  it('should close dropdown when clicking outside', async () => {
    const user = userEvent.setup();
    renderSidebarList({ activeDropdown: 'list-1' });

    // Click outside the dropdown
    await act(async () => {
      await user.click(document.body);
    });

    expect(defaultProps.setActiveDropdown).toHaveBeenCalledWith(null);
  });

  it('should not show dropdown menu by default', () => {
    renderSidebarList();
    
    expect(screen.queryByText('Rename List')).toBeNull();
    expect(screen.queryByText('Delete List')).toBeNull();
  });

  it('should not allow empty list names when renaming', async () => {
    const user = userEvent.setup();
    renderSidebarList({ activeDropdown: 'list-1' });

    // Click rename option
    await act(async () => {
      await user.click(screen.getByText('Rename List'));
    });

    // Clear the input and confirm
    const input = screen.getByRole('textbox');
    await act(async () => {
      await user.clear(input);
      await user.click(screen.getByTitle('Confirm'));
    });

    // Should not call onRename with empty name
    expect(defaultProps.onRename).not.toHaveBeenCalled();
  });
}); 