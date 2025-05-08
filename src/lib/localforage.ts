import localforage from 'localforage';

// Configure localforage
localforage.config({
  driver: localforage.LOCALSTORAGE, // Use localStorage as the driver
  name: 'todo-app', // Name of your application
  version: 1.0, // Version of your database
  storeName: 'todos', // Name of the store
  description: 'Todo application storage'
});

// Initialize localforage
localforage.ready().then(() => {
  console.log('LocalForage is ready to use');
}).catch((error) => {
  console.error('LocalForage initialization error:', error);
});

// Type-safe wrapper functions for common operations
export const storage = {
  async setItem<T>(key: string, value: T): Promise<T> {
    try {
      return await localforage.setItem(key, value);
    } catch (error) {
      console.error('Error setting item:', error);
      throw error;
    }
  },

  async getItem<T>(key: string): Promise<T | null> {
    try {
      return await localforage.getItem<T>(key);
    } catch (error) {
      console.error('Error getting item:', error);
      return null;
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      await localforage.removeItem(key);
    } catch (error) {
      console.error('Error removing item:', error);
      throw error;
    }
  },

  async clear(): Promise<void> {
    try {
      await localforage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  },

  async keys(): Promise<string[]> {
    try {
      return await localforage.keys();
    } catch (error) {
      console.error('Error getting keys:', error);
      return [];
    }
  }
};

export default storage; 