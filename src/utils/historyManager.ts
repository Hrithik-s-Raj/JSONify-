interface StoredJson {
  id: string;
  name: string;
  data: any;
  timestamp: number;
}

const STORAGE_KEY = 'jsonify-history';
const MAX_ITEMS = 20;

/**
 * Save a JSON to local storage history
 */
export function saveToHistory(json: any, name = 'Untitled'): string {
  const history = getHistory();
  
  // Generate a unique ID
  const id = `json_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  
  // Add the new entry to the beginning
  history.unshift({
    id,
    name,
    data: json,
    timestamp: Date.now()
  });
  
  // Limit history size
  if (history.length > MAX_ITEMS) {
    history.pop();
  }
  
  // Save back to storage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  
  return id;
}

/**
 * Get all history items
 */
export function getHistory(): StoredJson[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error('Error retrieving history:', e);
    return [];
  }
}

/**
 * Get a specific JSON by ID
 */
export function getHistoryItem(id: string): StoredJson | null {
  const history = getHistory();
  return history.find(item => item.id === id) || null;
}

/**
 * Delete a history item by ID
 */
export function deleteHistoryItem(id: string): boolean {
  const history = getHistory();
  const newHistory = history.filter(item => item.id !== id);
  
  if (newHistory.length === history.length) {
    return false; // Item not found
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
  return true;
}

/**
 * Clear all history
 */
export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Rename a history item
 */
export function renameHistoryItem(id: string, newName: string): boolean {
  const history = getHistory();
  const item = history.find(item => item.id === id);
  
  if (!item) return false;
  
  item.name = newName;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  return true;
}

export type { StoredJson };