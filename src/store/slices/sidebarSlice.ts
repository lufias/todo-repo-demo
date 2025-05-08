import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Folder, List, getAllFolders, getListsByFolder } from '../../services/database';

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