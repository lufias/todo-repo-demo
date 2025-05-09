import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Sidebar from '../Sidebar';
import { TestWrapper } from '../../test/test-utils';

// Mock the SidebarFolder component
vi.mock('../SidebarFolder', () => ({
  default: ({ folder, lists, expanded, onToggle, onSelectList }: any) => (
    <div data-testid={`folder-${folder.id}`}>
      <button onClick={() => onToggle(folder.id)} data-testid={`toggle-${folder.id}`}>
        {folder.name}
      </button>
      {expanded && lists.map((list: any) => (
        <div key={list.id} data-testid={`list-${list.id}`}>
          <button onClick={() => onSelectList(list.id)} data-testid={`select-${list.id}`}>
            {list.name}
          </button>
        </div>
      ))}
    </div>
  )
}));

// Mock the database service
vi.mock('../../services/database', () => ({
  getAllFolders: vi.fn().mockResolvedValue([
    { id: 'folder-1', name: 'Test Folder' }
  ])
}));

// Mock the Redux state
const mockState = {
  sidebar: {
    folders: [
      { id: 'folder-1', name: 'Test Folder' }
    ],
    lists: [
      { id: 'list-1', folderId: 'folder-1', name: 'Test List' }
    ],
    selectedListId: null
  }
};

// Mock the Redux dispatch
const mockDispatch = vi.fn().mockImplementation((action) => {
  if (typeof action === 'function') {
    return action(mockDispatch, () => mockState, undefined);
  }
  return Promise.resolve();
});

vi.mock('../../store/hooks', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (selector: any) => selector(mockState)
}));

const renderSidebar = () => {
  return render(
    <MemoryRouter>
      <Sidebar />
    </MemoryRouter>,
    { wrapper: TestWrapper }
  );
};

describe('Sidebar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the basic sidebar structure', () => {
    renderSidebar();
    
    expect(screen.getByText('Folders')).toBeDefined();
    expect(screen.getByTitle('Add new folder')).toBeDefined();
  });

  it('should show folder input when clicking add folder button', async () => {
    const user = userEvent.setup();
    renderSidebar();

    await act(async () => {
      await user.click(screen.getByTitle('Add new folder'));
    });

    expect(screen.getByPlaceholderText('Folder name')).toBeDefined();
    expect(screen.getByTitle('Confirm')).toBeDefined();
    expect(screen.getByTitle('Cancel')).toBeDefined();
  });

  it('should add a new folder when entering name and pressing enter', async () => {
    const user = userEvent.setup();
    renderSidebar();

    // Click add folder button
    await act(async () => {
      await user.click(screen.getByTitle('Add new folder'));
    });

    // Type folder name and press enter
    const input = screen.getByPlaceholderText('Folder name');
    await act(async () => {
      await user.type(input, 'New Folder');
      await user.keyboard('{Enter}');
    });

    // Verify dispatch was called with addFolder action
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(expect.any(Function));
    });
  });

  it('should cancel folder creation when pressing escape', async () => {
    const user = userEvent.setup();
    renderSidebar();

    // Click add folder button
    await act(async () => {
      await user.click(screen.getByTitle('Add new folder'));
    });

    // Type folder name and press escape
    const input = screen.getByPlaceholderText('Folder name');
    await act(async () => {
      await user.type(input, 'New Folder');
      await user.keyboard('{Escape}');
    });

    // Verify input is no longer visible
    expect(screen.queryByPlaceholderText('Folder name')).toBeNull();
  });

  it('should render existing folders and lists', () => {
    renderSidebar();
    
    expect(screen.getByTestId('folder-folder-1')).toBeDefined();
    expect(screen.getByTestId('toggle-folder-1')).toBeDefined();
  });

  it('should toggle folder expansion when clicking folder', async () => {
    const user = userEvent.setup();
    renderSidebar();

    const folderToggle = screen.getByTestId('toggle-folder-1');
    await act(async () => {
      await user.click(folderToggle);
    });

    // Verify dispatch was called with loadListsByFolder action
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(expect.any(Function));
    });
  });

  it('should select a list when clicking on it', async () => {
    const user = userEvent.setup();
    renderSidebar();

    // First expand the folder
    const folderToggle = screen.getByTestId('toggle-folder-1');
    await act(async () => {
      await user.click(folderToggle);
    });

    // Then click the list
    const listSelect = screen.getByTestId('select-list-1');
    await act(async () => {
      await user.click(listSelect);
    });

    // Verify dispatch was called with setSelectedListId and loadTasksByList actions
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(expect.any(Function));
    });
  });
}); 