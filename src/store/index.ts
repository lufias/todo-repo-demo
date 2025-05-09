import { configureStore } from '@reduxjs/toolkit'
import userReducer from './slices/userSlice'
import sidebarReducer from './slices/sidebarSlice'
import tasksReducer from './slices/tasksSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    sidebar: sidebarReducer,
    tasks: tasksReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch 