import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SidebarFolder from '../SidebarFolder';
import { TestWrapper } from '../../test/test-utils';

// Mock Font Awesome icons
vi.mock('react-icons/fa', () => ({
  FaFolder: () => <span data-testid="fa-folder">Folder</span>,
  FaChevronDown: () => <span data-testid="fa-chevron-down">Down</span>,
  FaChevronRight: () => <span data-testid="fa-chevron-right">Right</span>,
  FaEllipsisH: () => <span data-testid="fa-ellipsis">Menu</span>,
  FaTrash: () => <span data-testid="fa-trash">Delete</span>,
  FaListUl: () => <span data-testid="fa-list">List</span>,
  FaEdit: () => <span data-testid="fa-edit">Edit</span>
}));

// Mock the SidebarList component
vi.mock('../SidebarList', () => ({
  default: ({ list, onSelect }: any) => (
    <div data-testid={`list-${list.id}`}>
      <button onClick={onSelect} data-testid={`select-${list.id}`}>
        {list.content}
      </button>
    </div>
  )
}));

// Mock the Redux state
const mockState = {
  sidebar: {
    lists: [
      { id: 'list-1', folderId: 'folder-1', content: 'Test List 1' },
      { id: 'list-2', folderId: 'folder-1', content: 'Test List 2' }
    ]
  }
};

// Mock the Redux hooks
vi.mock('../../store/hooks', () => ({
  useAppSelector: (selector: any) => selector(mockState)
}));

const mockFolder = {
  id: 'folder-1',
  name: 'Test Folder'
};

const mockLists = [
  { id: 'list-1', folderId: 'folder-1', content: 'Test List 1' },
  { id: 'list-2', folderId: 'folder-1', content: 'Test List 2' }
];

const defaultProps = {
  folder: mockFolder,
  lists: mockLists,
  expanded: false,
  onToggle: vi.fn(),
  onDropdown: vi.fn(),
  dropdownOpen: false,
  onAddListClick: vi.fn(),
  addingList: false,
  newListName: '',
  setNewListName: vi.fn(),
  onAddList: vi.fn(),
  onCancelAddList: vi.fn(),
  onDeleteFolder: vi.fn(),
  activeListDropdown: null,
  setActiveListDropdown: vi.fn(),
  onDeleteList: vi.fn(),
  onRenameFolder: vi.fn(),
  onRenameList: vi.fn(),
  onSelectList: vi.fn(),
  disableDelete: false
};

const renderSidebarFolder = (props = {}) => {
  return render(
    <SidebarFolder {...defaultProps} {...props} />,
    { wrapper: TestWrapper }
  );
};

describe('SidebarFolder', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render folder name and toggle button', () => {
    renderSidebarFolder();
    
    expect(screen.getByText('Test Folder')).toBeDefined();
    expect(screen.getByTestId('fa-folder')).toBeDefined();
  });

  it('should show chevron right when collapsed', () => {
    renderSidebarFolder();
    
    expect(screen.getByTestId('fa-chevron-right')).toBeDefined();
  });

  it('should show chevron down when expanded', () => {
    renderSidebarFolder({ expanded: true });
    
    expect(screen.getByTestId('fa-chevron-down')).toBeDefined();
  });

  it('should call onToggle when clicking folder', async () => {
    const user = userEvent.setup();
    renderSidebarFolder();

    const folderButton = screen.getByText('Test Folder').closest('button');
    expect(folderButton).toBeDefined();

    await act(async () => {
      await user.click(folderButton!);
    });

    expect(defaultProps.onToggle).toHaveBeenCalledWith('folder-1');
  });

  it('should show lists when expanded', () => {
    renderSidebarFolder({ expanded: true });
    
    expect(screen.getByTestId('list-list-1')).toBeDefined();
    expect(screen.getByTestId('list-list-2')).toBeDefined();
  });

  it('should not show lists when collapsed', () => {
    renderSidebarFolder();
    
    expect(screen.queryByTestId('list-list-1')).toBeNull();
    expect(screen.queryByTestId('list-list-2')).toBeNull();
  });

  it('should show rename input when clicking rename option', async () => {
    const user = userEvent.setup();
    renderSidebarFolder({ dropdownOpen: true });

    await act(async () => {
      await user.click(screen.getByText('Rename Folder'));
    });

    await waitFor(() => {
      expect(screen.getByRole('textbox')).toBeDefined();
      expect(screen.getByTitle('Confirm')).toBeDefined();
      expect(screen.getByTitle('Cancel')).toBeDefined();
    });
  });

  it('should call onRenameFolder when confirming rename', async () => {
    const user = userEvent.setup();
    renderSidebarFolder({ dropdownOpen: true });

    // Click rename option
    await act(async () => {
      await user.click(screen.getByText('Rename Folder'));
    });

    // Wait for the input to appear
    const input = await screen.findByRole('textbox');
    
    // Type new name and confirm
    await act(async () => {
      await user.clear(input);
      await user.type(input, 'New Folder Name');
      await user.click(screen.getByTitle('Confirm'));
    });

    await waitFor(() => {
      expect(defaultProps.onRenameFolder).toHaveBeenCalledWith('folder-1', 'New Folder Name');
    });
  });

  it('should show add list input when adding new list', () => {
    renderSidebarFolder({ expanded: true, addingList: true });
    
    expect(screen.getByPlaceholderText('List name')).toBeDefined();
    expect(screen.getByTitle('Confirm')).toBeDefined();
    expect(screen.getByTitle('Cancel')).toBeDefined();
  });

  it('should call onAddList when adding new list', async () => {
    const user = userEvent.setup();
    const onAddList = vi.fn();
    const setNewListName = vi.fn();
    
    renderSidebarFolder({ 
      expanded: true, 
      addingList: true,
      onAddList,
      setNewListName,
      newListName: 'New List'
    });

    // Click the confirm button
    const confirmButton = screen.getByTitle('Confirm');
    await user.click(confirmButton);

    // Verify the call
    expect(onAddList).toHaveBeenCalledWith('folder-1', 'New List');
  });

  it('should call onDeleteFolder when clicking delete option', async () => {
    const user = userEvent.setup();
    renderSidebarFolder({ dropdownOpen: true });

    await act(async () => {
      await user.click(screen.getByText('Delete Folder'));
    });

    expect(defaultProps.onDeleteFolder).toHaveBeenCalledWith('folder-1');
  });

  it('should call onSelectList when clicking a list', async () => {
    const user = userEvent.setup();
    renderSidebarFolder({ expanded: true });

    await act(async () => {
      await user.click(screen.getByTestId('select-list-1'));
    });

    expect(defaultProps.onSelectList).toHaveBeenCalledWith('list-1');
  });
}); 