import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Task, getTasksByList, addTask as dbAddTask, updateTaskStatus as dbUpdateTaskStatus, deleteTask as dbDeleteTask } from '../../services/database';

interface TaskListState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TaskListState = {
  tasks: [],
  loading: false,
  error: null,
};

export const loadTasksByList = createAsyncThunk(
  'taskList/loadTasksByList',
  async (listId: string) => {
    return await getTasksByList(listId);
  }
);

export const addTask = createAsyncThunk(
  'taskList/addTask',
  async ({ listId, title, description }: { listId: string; title: string; description?: string }) => {
    return await dbAddTask(listId, title, description);
  }
);

export const updateTaskStatus = createAsyncThunk(
  'taskList/updateTaskStatus',
  async ({ taskId, done }: { taskId: string; done: boolean }) => {
    await dbUpdateTaskStatus(taskId, done);
    return { taskId, done };
  }
);

export const deleteTask = createAsyncThunk(
  'taskList/deleteTask',
  async (taskId: string) => {
    await dbDeleteTask(taskId);
    return taskId;
  }
);

const taskListSlice = createSlice({
  name: 'taskList',
  initialState,
  reducers: {
    clearTasks(state) {
      state.tasks = [];
      state.loading = false;
      state.error = null;
    },
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
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        const { taskId, done } = action.payload;
        const task = state.tasks.find(t => t.id === taskId);
        if (task) task.done = done;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(t => t.id !== action.payload);
      });
  },
});

export const { clearTasks } = taskListSlice.actions;
export default taskListSlice.reducer; 