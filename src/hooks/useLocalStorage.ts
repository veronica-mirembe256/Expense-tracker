import { useEffect, useState } from 'react';

/**
 * A generic hook that syncs a piece of state with Local Storage.
 *
 * It behaves like `useState`, but persists the value under `key` on every
 * change and hydrates from Local Storage (or `initialValue`) on mount.
 * Kept intentionally generic (not expense-specific) so it can be reused
 * for any future piece of persisted state, e.g. the dark-mode preference.
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      // Corrupt or inaccessible storage should not crash the app; fall back silently.
      console.warn(`useLocalStorage: failed to read key "${key}"`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn(`useLocalStorage: failed to write key "${key}"`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
