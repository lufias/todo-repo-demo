import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ThemeProvider } from '../contexts/ThemeContext';
import taskListReducer from '../store/slices/taskListSlice';
import sidebarReducer from '../store/slices/sidebarSlice';

const createTestStore = () => {
  return configureStore({
    reducer: {
      taskList: taskListReducer,
      sidebar: sidebarReducer
    },
    preloadedState: {
      sidebar: {
        folders: [],
        lists: [],
        activeListId: null,
        loading: false,
        error: null,
        selectedFolderId: null,
        selectedListId: null
      }
    }
  });
};

interface TestWrapperProps {
  children: ReactNode;
}

export const TestWrapper = ({ children }: TestWrapperProps) => {
  const store = createTestStore();

  return (
    <Provider store={store}>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </Provider>
  );
}; 