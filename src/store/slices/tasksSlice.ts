import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Task, getTasksByList, addTask as dbAddTask, updateTaskStatus as dbUpdateTaskStatus, deleteTask as dbDeleteTask, updateTask as dbUpdateTask } from '../../services/database';

interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TasksState = {
  tasks: [],
  loading: false,
  error: null,
};

export const loadTasksByList = createAsyncThunk(
  'tasks/loadTasksByList',
  async (listId: string, { rejectWithValue }) => {
    try {
      return await getTasksByList(listId);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to load tasks');
    }
  }
);

export const addTask = createAsyncThunk(
  'tasks/addTask',
  async ({ listId, title, description, tags }: { listId: string; title: string; description?: string; tags?: string[] }, { rejectWithValue }) => {
    try {
      return await dbAddTask(listId, title, description, tags);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to add task');
    }
  }
);

export const updateTaskStatus = createAsyncThunk(
  'tasks/updateTaskStatus',
  async ({ taskId, done }: { taskId: string; done: boolean }, { rejectWithValue }) => {
    try {
      await dbUpdateTaskStatus(taskId, done);
      return { taskId, done };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update task status');
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (taskId: string, { rejectWithValue }) => {
    try {
      await dbDeleteTask(taskId);
      return taskId;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete task');
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ taskId, updates }: { taskId: string; updates: Partial<Task> }, { rejectWithValue }) => {
    try {
      const updatedTask = await dbUpdateTask(taskId, updates);
      if (!updatedTask) throw new Error('Task not found');
      return updatedTask;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update task');
    }
  }
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearTasks(state) {
      state.tasks = [];
      state.loading = false;
      state.error = null;
    },
    clearError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadTasksByList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadTasksByList.fulfilled, (state, action) => {
        state.tasks = action.payload;
        state.loading = false;
      })
      .addCase(loadTasksByList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load tasks';
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      .addCase(addTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to add task';
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        const { taskId, done } = action.payload;
        const task = state.tasks.find(t => t.id === taskId);
        if (task) task.done = done;
      })
      .addCase(updateTaskStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to update task status';
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(t => t.id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to delete task';
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to update task';
      });
  },
});

export const { clearTasks, clearError } = tasksSlice.actions;
export default tasksSlice.reducer; 