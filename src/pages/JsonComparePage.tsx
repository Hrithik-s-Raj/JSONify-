import React, { useState } from 'react';
import JsonInput from '../components/JsonInput';
import JsonComparer from '../components/JsonComparer';
import TextComparer from '../components/TextComparer';
import ActionButton from '../components/ActionButton';
import { saveToHistory } from '../utils/historyManager';
import { ArrowRightLeft, MoveHorizontal, FileJson, FileText, Code } from 'lucide-react';

type CompareMode = 'json' | 'text' | 'code';

const JsonComparePage: React.FC = () => {
  const [leftJson, setLeftJson] = useState<any>(null);
  const [rightJson, setRightJson] = useState<any>(null);
  const [leftText, setLeftText] = useState('');
  const [rightText, setRightText] = useState('');
  const [leftName, setLeftName] = useState('Left Input');
  const [rightName, setRightName] = useState('Right Input');
  const [compareMode, setCompareMode] = useState<CompareMode>('json');
  
  const handleSwapInputs = () => {
    const tempJson = leftJson;
    const tempText = leftText;
    const tempName = leftName;
    
    setLeftJson(rightJson);
    setLeftText(rightText);
    setLeftName(rightName);
    
    setRightJson(tempJson);
    setRightText(tempText);
    setRightName(tempName);
  };
  
  const handleSaveComparison = () => {
    if (compareMode === 'json' && (!leftJson || !rightJson)) return;
    if (compareMode !== 'json' && (!leftText || !rightText)) return;
    
    if (compareMode === 'json') {
      saveToHistory(leftJson, leftName);
      saveToHistory(rightJson, rightName);
    } else {
      saveToHistory({ content: leftText }, leftName);
      saveToHistory({ content: rightText }, rightName);
    }
  };
  
  const loadSampleData = () => {
    if (compareMode === 'json') {
      const sampleLeft = {
        name: "Product X",
        price: 99.99,
        features: ["Fast", "Reliable", "Easy to use"],
        specs: {
          weight: "2.5kg",
          dimensions: "10x20x30",
          color: "blue"
        }
      };
      
      const sampleRight = {
        name: "Product X Pro",
        price: 149.99,
        features: ["Fast", "Reliable", "Easy to use", "Premium"],
        specs: {
          weight: "2.2kg",
          dimensions: "10x20x30",
          color: "silver"
        }
      };
      
      setLeftJson(sampleLeft);
      setRightJson(sampleRight);
      setLeftName("Product X");
      setRightName("Product X Pro");
    } else {
      setLeftText("Hello World\nThis is a test\nLine 3\nLine 4");
      setRightText("Hello World\nThis is a sample\nLine 3\nLine 4\nNew Line");
      setLeftName("Original Text");
      setRightName("Modified Text");
    }
  };
  
  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Compare</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Compare JSON structures, text files, or code and see the differences highlighted.
        </p>
      </div>
      
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setCompareMode('json')}
          className={`flex items-center px-4 py-2 rounded-md ${
            compareMode === 'json'
              ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200'
          }`}
        >
          <FileJson className="w-4 h-4 mr-2" />
          JSON
        </button>
        <button
          onClick={() => setCompareMode('text')}
          className={`flex items-center px-4 py-2 rounded-md ${
            compareMode === 'text'
              ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200'
          }`}
        >
          <FileText className="w-4 h-4 mr-2" />
          Text
        </button>
        <button
          onClick={() => setCompareMode('code')}
          className={`flex items-center px-4 py-2 rounded-md ${
            compareMode === 'code'
              ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200'
          }`}
        >
          <Code className="w-4 h-4 mr-2" />
          Code
        </button>
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
              Left Name
            </label>
            <input
              type="text"
              value={leftName}
              onChange={(e) => setLeftName(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                       focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:outline-none"
              placeholder="Left Input Name"
            />
          </div>
          {compareMode === 'json' ? (
            <JsonInput
              onJsonChange={setLeftJson}
              label="Left JSON"
              initialValue={leftJson ? JSON.stringify(leftJson, null, 2) : ''}
            />
          ) : (
            <textarea
              value={leftText}
              onChange={(e) => setLeftText(e.target.value)}
              className="w-full h-64 p-3 border rounded-md font-mono text-sm resize-none
                       border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800
                       focus:ring-2 focus:outline-none focus:ring-blue-500 dark:focus:ring-blue-600"
              placeholder={`Paste your ${compareMode === 'text' ? 'text' : 'code'} here`}
            />
          )}
        </div>
        
        <div className="flex items-center justify-center">
          <ActionButton
            onClick={handleSwapInputs}
            variant="outline"
            className="lg:rotate-0 rotate-90"
          >
            <MoveHorizontal className="w-5 h-5" />
          </ActionButton>
        </div>
        
        <div className="flex-1">
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Right Name
            </label>
            <input
              type="text"
              value={rightName}
              onChange={(e) => setRightName(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                       focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:outline-none"
              placeholder="Right Input Name"
            />
          </div>
          {compareMode === 'json' ? (
            <JsonInput
              onJsonChange={setRightJson}
              label="Right JSON"
              initialValue={rightJson ? JSON.stringify(rightJson, null, 2) : ''}
            />
          ) : (
            <textarea
              value={rightText}
              onChange={(e) => setRightText(e.target.value)}
              className="w-full h-64 p-3 border rounded-md font-mono text-sm resize-none
                       border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800
                       focus:ring-2 focus:outline-none focus:ring-blue-500 dark:focus:ring-blue-600"
              placeholder={`Paste your ${compareMode === 'text' ? 'text' : 'code'} here`}
            />
          )}
        </div>
      </div>
      
      <div className="mb-4 flex justify-end">
        <ActionButton
          onClick={handleSaveComparison}
          disabled={(compareMode === 'json' && (!leftJson || !rightJson)) ||
                   (compareMode !== 'json' && (!leftText || !rightText))}
        >
          <ArrowRightLeft className="w-4 h-4 mr-2" />
          Save Comparison
        </ActionButton>
      </div>
      
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Comparison Results</h3>
        </div>
        {compareMode === 'json' ? (
          <JsonComparer leftJson={leftJson} rightJson={rightJson} />
        ) : (
          <TextComparer leftText={leftText} rightText={rightText} />
        )}
      </div>
    </div>
  );
};

export default JsonComparePage;