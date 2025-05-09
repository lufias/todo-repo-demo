import { configureStore } from '@reduxjs/toolkit'
import sidebarReducer from './slices/sidebarSlice'
import tasksReducer from './slices/tasksSlice'

export const store = configureStore({
  reducer: {
    sidebar: sidebarReducer,
    tasks: tasksReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch 