// Local storage utilities for POS system

export function saveToStorage<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getFromStorage<T>(key: string, fallback: T): T {
  const item = localStorage.getItem(key);
  if (!item) return fallback;
  try {
    return JSON.parse(item) as T;
  } catch {
    return fallback;
  }
}

export function removeFromStorage(key: string) {
  localStorage.removeItem(key);
}
