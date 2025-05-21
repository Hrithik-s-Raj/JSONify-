import React, { useState } from 'react';
import JsonInput from '../components/JsonInput';
import JsonComparer from '../components/JsonComparer';
import ActionButton from '../components/ActionButton';
import { saveToHistory } from '../utils/historyManager';
import { ArrowRightLeft, MoveHorizontal } from 'lucide-react';

const JsonComparePage: React.FC = () => {
  const [leftJson, setLeftJson] = useState<any>(null);
  const [rightJson, setRightJson] = useState<any>(null);
  const [leftName, setLeftName] = useState('Left JSON');
  const [rightName, setRightName] = useState('Right JSON');
  
  const handleSwapJsons = () => {
    const tempJson = leftJson;
    const tempName = leftName;
    
    setLeftJson(rightJson);
    setLeftName(rightName);
    
    setRightJson(tempJson);
    setRightName(tempName);
  };
  
  const handleSaveComparison = () => {
    if (!leftJson || !rightJson) return;
    
    // Save both JSONs to history
    saveToHistory(leftJson, leftName);
    saveToHistory(rightJson, rightName);
    
    // You could also save the comparison result itself
    // For now we'll just save both sides
  };
  
  // Sample data for demonstration - could be removed for production
  const loadSampleData = () => {
    const sampleLeft = {
      name: "Product X",
      price: 99.99,
      features: ["Fast", "Reliable", "Easy to use"],
      specs: {
        weight: "2.5kg",
        dimensions: "10x20x30",
        color: "blue"
      },
      inStock: true,
      reviews: [
        { rating: 5, text: "Great product!" },
        { rating: 4, text: "Very good." }
      ]
    };
    
    const sampleRight = {
      name: "Product X Pro",
      price: 149.99,
      features: ["Fast", "Reliable", "Easy to use", "Premium"],
      specs: {
        weight: "2.2kg",
        dimensions: "10x20x30",
        color: "silver"
      },
      inStock: false,
      reviews: [
        { rating: 5, text: "Great product!" },
        { rating: 5, text: "Amazing upgrade!" }
      ],
      warranty: "2 years"
    };
    
    setLeftJson(sampleLeft);
    setRightJson(sampleRight);
    setLeftName("Product X");
    setRightName("Product X Pro");
  };
  
  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">JSON Comparer</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Compare two JSON structures and see the differences highlighted.
        </p>
      </div>
      
      <div className="flex justify-end mb-4">
        <ActionButton
          onClick={loadSampleData}
          variant="outline"
          size="sm"
        >
          Load Sample Data
        </ActionButton>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Left JSON Name
            </label>
            <input
              type="text"
              value={leftName}
              onChange={(e) => setLeftName(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                       focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:outline-none"
              placeholder="Left JSON Name"
            />
          </div>
          <JsonInput
            onJsonChange={setLeftJson}
            label="Left JSON"
            initialValue={leftJson ? JSON.stringify(leftJson, null, 2) : ''}
          />
        </div>
        
        <div className="flex items-center justify-center">
          <ActionButton
            onClick={handleSwapJsons}
            variant="outline"
            className="lg:rotate-0 rotate-90"
          >
            <MoveHorizontal className="w-5 h-5" />
          </ActionButton>
        </div>
        
        <div className="flex-1">
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Right JSON Name
            </label>
            <input
              type="text"
              value={rightName}
              onChange={(e) => setRightName(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                       focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:outline-none"
              placeholder="Right JSON Name"
            />
          </div>
          <JsonInput
            onJsonChange={setRightJson}
            label="Right JSON"
            initialValue={rightJson ? JSON.stringify(rightJson, null, 2) : ''}
          />
        </div>
      </div>
      
      <div className="mb-4 flex justify-end">
        <ActionButton
          onClick={handleSaveComparison}
          disabled={!leftJson || !rightJson}
        >
          <ArrowRightLeft className="w-4 h-4 mr-2" />
          Save Comparison
        </ActionButton>
      </div>
      
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Comparison Results</h3>
        </div>
        <JsonComparer leftJson={leftJson} rightJson={rightJson} />
      </div>
    </div>
  );
};

export default JsonComparePage;