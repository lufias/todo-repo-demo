import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Folder, List, getAllFolders, getListsByFolder, addFolder as dbAddFolder, deleteFolder as dbDeleteFolder, addList as dbAddList, deleteList as dbDeleteList } from '../../services/database';

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

export const addFolder = createAsyncThunk('sidebar/addFolder', async (name: string) => {
  return await dbAddFolder(name);
});

export const deleteFolder = createAsyncThunk('sidebar/deleteFolder', async (id: string) => {
  await dbDeleteFolder(id);
  return id;
});

export const addList = createAsyncThunk('sidebar/addList', async ({ folderId, content }: { folderId: string; content: string }) => {
  return await dbAddList(folderId, content);
});

export const deleteList = createAsyncThunk('sidebar/deleteList', async (id: string) => {
  await dbDeleteList(id);
  return id;
});

export const loadListsByFolder = createAsyncThunk(
  'sidebar/loadListsByFolder',
  async (folderId: string) => {
    return await getListsByFolder(folderId);
  }
);

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    setSelectedFolderId(state, action: PayloadAction<string | null>) {
      state.selectedFolderId = action.payload;
      state.selectedListId = null; // Reset selected list when folder changes
      state.lists = [];
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
      .addCase(deleteFolder.fulfilled, (state, action) => {
        state.folders = state.folders.filter(folder => folder.id !== action.payload);
      })
      .addCase(addList.fulfilled, (state, action) => {
        state.lists.push(action.payload);
      })
      .addCase(deleteList.fulfilled, (state, action) => {
        state.lists = state.lists.filter(list => list.id !== action.payload);
      })
      .addCase(loadListsByFolder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadListsByFolder.fulfilled, (state, action) => {
        state.lists = action.payload;
        state.loading = false;
      })
      .addCase(loadListsByFolder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load lists';
      });
  },
});

export const { setSelectedFolderId, setSelectedListId, clearSidebarState } = sidebarSlice.actions;
export default sidebarSlice.reducer; 