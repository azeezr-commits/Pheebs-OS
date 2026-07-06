import type { Storage } from '../../contracts/Storage';

export class LocalStorageAdapter implements Storage {
  async getItem<T>(key: string): Promise<T | null> {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (err) {
      console.error(`Error reading key "${key}" from localStorage:`, err);
      return null;
    }
  }

  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error(`Error writing key "${key}" to localStorage:`, err);
      throw err;
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      localStorage.removeItem(key);
    } catch (err) {
      console.error(`Error removing key "${key}" from localStorage:`, err);
      throw err;
    }
  }

  async clear(): Promise<void> {
    try {
      localStorage.clear();
    } catch (err) {
      console.error('Error clearing localStorage:', err);
      throw err;
    }
  }
}
