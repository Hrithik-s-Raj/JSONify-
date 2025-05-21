import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

interface JsonInputProps {
  onJsonChange: (json: any) => void;
  initialValue?: string;
  label?: string;
}

const JsonInput: React.FC<JsonInputProps> = ({ 
  onJsonChange, 
  initialValue = '', 
  label = 'JSON Input' 
}) => {
  const [jsonString, setJsonString] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialValue && initialValue !== jsonString) {
      setJsonString(initialValue);
      parseJson(initialValue);
    }
  }, [initialValue]);

  const parseJson = (input: string) => {
    try {
      if (!input.trim()) {
        onJsonChange(null);
        setError(null);
        return;
      }
      
      const parsed = JSON.parse(input);
      onJsonChange(parsed);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setJsonString(value);
    parseJson(value);
  };

  const formatJson = () => {
    try {
      if (!jsonString.trim()) return;
      
      const parsed = JSON.parse(jsonString);
      const formatted = JSON.stringify(parsed, null, 2);
      setJsonString(formatted);
      onJsonChange(parsed);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
        <button
          onClick={formatJson}
          className="px-2 py-1 text-xs font-medium text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900/30 rounded"
        >
          Format
        </button>
      </div>
      <textarea
        value={jsonString}
        onChange={handleChange}
        className={`w-full h-64 p-3 border rounded-md font-mono text-sm resize-none transition-colors duration-200
          ${error 
            ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/10' 
            : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800'
          }
          focus:ring-2 focus:outline-none focus:ring-blue-500 dark:focus:ring-blue-600`}
        placeholder='{\n  "example": "Paste your JSON here"\n}'
      />
      {error && (
        <div className="mt-2 flex items-start text-red-600 dark:text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
          <span>Error: {error}</span>
        </div>
      )}
    </div>
  );
};

export default JsonInput;