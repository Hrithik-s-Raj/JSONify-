import React, { useState, useEffect } from 'react';
import { getHistory, deleteHistoryItem, clearHistory, renameHistoryItem, StoredJson } from '../utils/historyManager';
import JsonTree from '../components/JsonTree';
import ActionButton from '../components/ActionButton';
import { Copy, Download, Trash, Pencil, Eye, Clock, X, Check } from 'lucide-react';
import { copyToClipboard, downloadJson } from '../utils/jsonUtils';

const HistoryPage: React.FC = () => {
  const [history, setHistory] = useState<StoredJson[]>([]);
  const [selectedItem, setSelectedItem] = useState<StoredJson | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const historyItems = getHistory();
    setHistory(historyItems);
    
    // Select the first item if available and none is selected
    if (historyItems.length > 0 && !selectedItem) {
      setSelectedItem(historyItems[0]);
    }
  };

  const handleItemClick = (item: StoredJson) => {
    setSelectedItem(item);
  };

  const handleDeleteItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (deleteHistoryItem(id)) {
      // If we deleted the selected item, select the first one from the updated list
      if (selectedItem && selectedItem.id === id) {
        const updatedHistory = getHistory();
        setSelectedItem(updatedHistory.length > 0 ? updatedHistory[0] : null);
      }
      
      loadHistory();
    }
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all history items?')) {
      clearHistory();
      setHistory([]);
      setSelectedItem(null);
    }
  };

  const startEditing = (id: string, currentName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(id);
    setEditingName(currentName);
  };

  const saveEditing = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (editingName.trim()) {
      renameHistoryItem(id, editingName);
      loadHistory();
    }
    setEditingId(null);
  };

  const cancelEditing = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(null);
  };

  const handleCopyToClipboard = async (json: any) => {
    const success = await copyToClipboard(JSON.stringify(json, null, 2));
    
    if (success) {
      setShowCopiedMessage(true);
      setTimeout(() => setShowCopiedMessage(false), 2000);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">History</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          View and manage your previously saved JSON documents.
        </p>
      </div>

      {history.length === 0 ? (
        <div className="text-center p-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
          <Clock className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No history items yet</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Save JSON documents from the Viewer or Comparer to see them here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Saved Items</h3>
              <ActionButton onClick={handleClearAll} variant="outline" size="sm">
                <Trash className="w-4 h-4 mr-1" />
                Clear All
              </ActionButton>
            </div>
            
            <ul className="overflow-auto max-h-[600px] border border-gray-200 dark:border-gray-700 rounded-lg divide-y divide-gray-200 dark:divide-gray-700">
              {history.map((item) => (
                <li 
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className={`p-3 cursor-pointer flex items-center justify-between transition-colors 
                    ${selectedItem?.id === item.id 
                      ? 'bg-blue-50 dark:bg-blue-900/20' 
                      : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750'
                    }`}
                >
                  <div className="flex-1 min-w-0">
                    {editingId === item.id ? (
                      <div className="flex items-center space-x-2" onClick={e => e.stopPropagation()}>
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="block w-full p-1 border border-gray-300 dark:border-gray-600 rounded text-sm"
                          autoFocus
                        />
                        <button onClick={(e) => saveEditing(item.id, e)} className="text-green-600 dark:text-green-400">
                          <Check className="w-4 h-4" />
                        </button>
                        <button onClick={cancelEditing} className="text-gray-600 dark:text-gray-400">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                          {item.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(item.timestamp)}
                        </div>
                      </>
                    )}
                  </div>
                  
                  {editingId !== item.id && (
                    <div className="flex space-x-2 ml-2">
                      <button
                        onClick={(e) => startEditing(item.id, item.name, e)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteItem(item.id, e)}
                        className="text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="lg:col-span-2">
            {selectedItem ? (
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <div className="flex items-center">
                    <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{selectedItem.name}</h3>
                  </div>
                  
                  <div className="flex space-x-2">
                    <ActionButton 
                      onClick={() => handleCopyToClipboard(selectedItem.data)} 
                      variant="outline"
                      size="sm"
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </ActionButton>
                    <ActionButton 
                      onClick={() => downloadJson(selectedItem.data, `${selectedItem.name.replace(/\s+/g, '_')}.json`)} 
                      variant="outline"
                      size="sm"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </ActionButton>
                    
                    {showCopiedMessage && (
                      <span className="text-sm text-green-600 dark:text-green-400 self-center animate-fadeIn">
                        Copied!
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="p-4 overflow-auto max-h-[500px]">
                  <JsonTree data={selectedItem.data} />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                <p className="text-gray-500 dark:text-gray-400">
                  Select an item from the list to view its contents
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;