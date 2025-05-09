import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Folder, List, getAllFolders, getListsByFolder, addFolder as dbAddFolder, deleteFolder as dbDeleteFolder, addList as dbAddList, deleteList as dbDeleteList, renameFolder as dbRenameFolder, renameList as dbRenameList } from '../../services/database';

interface SidebarState {
  folders: Folder[];
  lists: List[];
  selectedFolderId: string | null;
  selectedListId: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: SidebarState = {
  folders: [],
  lists: [],
  selectedFolderId: null,
  selectedListId: null,
  loading: false,
  error: null,
};

export const loadFolders = createAsyncThunk('sidebar/loadFolders', async () => {
  return await getAllFolders();
});

export const addFolder = createAsyncThunk('sidebar/addFolder', async (name: string, { rejectWithValue }) => {
  try {
    return await dbAddFolder(name);
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to add folder');
  }
});

export const deleteFolder = createAsyncThunk('sidebar/deleteFolder', async (id: string, { rejectWithValue }) => {
  try {
    await dbDeleteFolder(id);
    return id;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete folder');
  }
});

export const addList = createAsyncThunk('sidebar/addList', async ({ folderId, content }: { folderId: string; content: string }, { rejectWithValue }) => {
  try {
    return await dbAddList(folderId, content);
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to add list');
  }
});

export const deleteList = createAsyncThunk('sidebar/deleteList', async (id: string, { rejectWithValue }) => {
  try {
    await dbDeleteList(id);
    return id;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete list');
  }
});

export const loadListsByFolder = createAsyncThunk(
  'sidebar/loadListsByFolder',
  async (folderId: string) => {
    return await getListsByFolder(folderId);
  }
);

export const renameFolder = createAsyncThunk(
  'sidebar/renameFolder',
  async ({ folderId, newName }: { folderId: string; newName: string }) => {
    const folder = await dbRenameFolder(folderId, newName);
    if (!folder) throw new Error('Folder not found');
    return folder;
  }
);

export const renameList = createAsyncThunk(
  'sidebar/renameList',
  async ({ listId, newName }: { listId: string; newName: string }) => {
    const list = await dbRenameList(listId, newName);
    if (!list) throw new Error('List not found');
    return list;
  }
);

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    setSelectedFolderId(state, action: PayloadAction<string | null>) {
      state.selectedFolderId = action.payload;
    },
    setSelectedListId(state, action: PayloadAction<string | null>) {
      state.selectedListId = action.payload;
    },
    clearSidebarState(state) {
      state.folders = [];
      state.lists = [];
      state.selectedFolderId = null;
      state.selectedListId = null;
      state.loading = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadFolders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadFolders.fulfilled, (state, action) => {
        state.folders = action.payload;
        state.loading = false;
      })
      .addCase(loadFolders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load folders';
      })
      .addCase(addFolder.fulfilled, (state, action) => {
        state.folders.push(action.payload);
      })
      .addCase(addFolder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to add folder';
      })
      .addCase(deleteFolder.fulfilled, (state, action) => {
        state.folders = state.folders.filter(folder => folder.id !== action.payload);
        state.lists = state.lists.filter(list => list.folderId !== action.payload);
        if (state.folders.length === 0 || state.lists.length === 0) {
          state.lists = [];
        }
      })
      .addCase(deleteFolder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to delete folder';
      })
      .addCase(addList.fulfilled, (state, action) => {
        state.lists = [...state.lists.filter(list => list.id !== action.payload.id), action.payload];
      })
      .addCase(addList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to add list';
      })
      .addCase(deleteList.fulfilled, (state, action) => {
        state.lists = state.lists.filter(list => list.id !== action.payload);
        if (state.lists.length === 0) {
          state.lists = [];
        }
        if (state.selectedListId === action.payload) {
          state.selectedListId = null;
        }
      })
      .addCase(deleteList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to delete list';
      })
      .addCase(loadListsByFolder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadListsByFolder.fulfilled, (state, action) => {
        const folderId = action.meta.arg;
        const newLists = [
          ...state.lists.filter(list => list.folderId !== folderId),
          ...action.payload
        ];
        state.lists = Array.from(new Map(newLists.map(list => [list.id, list])).values());
        state.loading = false;
      })
      .addCase(loadListsByFolder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load lists';
      })
      .addCase(renameFolder.fulfilled, (state, action) => {
        const index = state.folders.findIndex(folder => folder.id === action.payload.id);
        if (index !== -1) {
          state.folders[index] = action.payload;
        }
      })
      .addCase(renameFolder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to rename folder';
      })
      .addCase(renameList.fulfilled, (state, action) => {
        const index = state.lists.findIndex(list => list.id === action.payload.id);
        if (index !== -1) {
          state.lists[index] = action.payload;
        }
      })
      .addCase(renameList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to rename list';
      });
  },
});

export const { setSelectedFolderId, setSelectedListId, clearSidebarState, clearError } = sidebarSlice.actions;
export default sidebarSlice.reducer; 