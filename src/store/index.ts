import { configureStore } from '@reduxjs/toolkit'
import userReducer from './slices/userSlice'
import sidebarReducer from './slices/sidebarSlice'
import taskListReducer from './slices/taskListSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    sidebar: sidebarReducer,
    taskList: taskListReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch 