import React, { useState, useRef } from 'react';
import JsonTree from '../components/JsonTree';
import JsonInput from '../components/JsonInput';
import SearchBar from '../components/SearchBar';
import ActionButton from '../components/ActionButton';
import { Download, Copy, Save } from 'lucide-react';
import { copyToClipboard, downloadJson, searchInJson } from '../utils/jsonUtils';
import { saveToHistory } from '../utils/historyManager';

const JsonViewerPage: React.FC = () => {
  const [jsonData, setJsonData] = useState<any>(null);
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [highlightedPaths, setHighlightedPaths] = useState<Set<string>>(new Set());
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);
  const [jsonName, setJsonName] = useState('Untitled JSON');
  const jsonViewerRef = useRef<HTMLDivElement>(null);

  const handleJsonChange = (data: any) => {
    setJsonData(data);
    setSearchResults([]);
    setHighlightedPaths(new Set());
  };

  const handleSearch = (term: string) => {
    if (!jsonData || !term.trim()) {
      setSearchResults([]);
      setHighlightedPaths(new Set());
      return;
    }

    const results = searchInJson(jsonData, term);
    setSearchResults(results);
    setHighlightedPaths(new Set(results));
  };

  const handleCopyToClipboard = async () => {
    if (!jsonData) return;
    
    const success = await copyToClipboard(JSON.stringify(jsonData, null, 2));
    
    if (success) {
      setShowCopiedMessage(true);
      setTimeout(() => setShowCopiedMessage(false), 2000);
    }
  };

  const handleDownload = () => {
    if (!jsonData) return;
    downloadJson(jsonData, `${jsonName.replace(/\s+/g, '_')}.json`);
  };

  const handleSaveToHistory = () => {
    if (!jsonData) return;
    saveToHistory(jsonData, jsonName);
    setShowCopiedMessage(true);
    setTimeout(() => setShowCopiedMessage(false), 2000);
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">JSON Viewer</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Paste your JSON below to visualize and explore it in a tree view.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <JsonInput onJsonChange={handleJsonChange} />
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              JSON Name
            </label>
            <input
              type="text"
              value={jsonName}
              onChange={(e) => setJsonName(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                       focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:outline-none"
              placeholder="Enter a name for this JSON"
            />
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2">
            <ActionButton
              onClick={handleCopyToClipboard}
              disabled={!jsonData}
              variant="outline"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy JSON
            </ActionButton>
            
            <ActionButton
              onClick={handleDownload}
              disabled={!jsonData}
              variant="outline"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </ActionButton>
            
            <ActionButton
              onClick={handleSaveToHistory}
              disabled={!jsonData}
              variant="primary"
            >
              <Save className="w-4 h-4 mr-2" />
              Save to History
            </ActionButton>
            
            {showCopiedMessage && (
              <span className="ml-2 text-sm text-green-600 dark:text-green-400 self-center animate-fadeIn">
                {jsonName} saved!
              </span>
            )}
          </div>
        </div>
        
        <div ref={jsonViewerRef}>
          <div className="mb-4">
            <SearchBar onSearch={handleSearch} />
            
            {searchResults.length > 0 && (
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Found {searchResults.length} matches
              </div>
            )}
          </div>
          
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 p-4 overflow-auto max-h-[600px]">
            {jsonData ? (
              <JsonTree data={jsonData} />
            ) : (
              <div className="text-center p-8 text-gray-500 dark:text-gray-400">
                Your JSON will appear here
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JsonViewerPage;