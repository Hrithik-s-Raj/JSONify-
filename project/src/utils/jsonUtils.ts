/**
 * Deep equality check for any two values
 */
export function isEqual(a: any, b: any): boolean {
  // Check if both are the same value or same reference
  if (a === b) return true;
  
  // If either is null or not an object, they can't be equal at this point
  if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') {
    return false;
  }
  
  // Check if both are arrays
  const aIsArray = Array.isArray(a);
  const bIsArray = Array.isArray(b);
  
  if (aIsArray !== bIsArray) return false;
  
  if (aIsArray && bIsArray) {
    if (a.length !== b.length) return false;
    
    // Compare each element
    for (let i = 0; i < a.length; i++) {
      if (!isEqual(a[i], b[i])) return false;
    }
    
    return true;
  }
  
  // Both are objects (not arrays)
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  
  if (aKeys.length !== bKeys.length) return false;
  
  // Check that all keys in a exist in b and have the same values
  for (const key of aKeys) {
    if (!b.hasOwnProperty(key) || !isEqual(a[key], b[key])) {
      return false;
    }
  }
  
  return true;
}

/**
 * Format a JSON object with proper indentation
 */
export function formatJson(json: any): string {
  return JSON.stringify(json, null, 2);
}

/**
 * Validates if a string is valid JSON
 */
export function isValidJson(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Copy text to clipboard
 */
export function copyToClipboard(text: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text)
        .then(() => resolve(true))
        .catch(() => resolve(false));
    } else {
      // Fallback for older browsers
      try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        resolve(true);
      } catch (err) {
        resolve(false);
      }
    }
  });
}

/**
 * Download JSON as a file
 */
export function downloadJson(json: any, filename = 'data.json'): void {
  const jsonString = typeof json === 'string' ? json : JSON.stringify(json, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  
  // Cleanup
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}

/**
 * Search for a string in a JSON object
 * Returns paths to all matching values
 */
export function searchInJson(json: any, searchTerm: string): string[] {
  const results: string[] = [];
  const termLower = searchTerm.toLowerCase();
  
  function search(obj: any, path: string[] = []): void {
    if (obj === null || obj === undefined) return;
    
    if (typeof obj === 'object') {
      for (const key in obj) {
        const value = obj[key];
        const currentPath = [...path, key];
        
        // Check if key matches
        if (key.toLowerCase().includes(termLower)) {
          results.push(currentPath.join('.'));
        }
        
        // Check if value matches (for primitive values)
        if (typeof value !== 'object' && 
            value !== null && 
            String(value).toLowerCase().includes(termLower)) {
          results.push(currentPath.join('.'));
        }
        
        // Recurse into nested objects
        if (typeof value === 'object' && value !== null) {
          search(value, currentPath);
        }
      }
    }
  }
  
  search(json);
  return results;
}