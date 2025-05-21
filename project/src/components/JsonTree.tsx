import React, { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';

type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
type JsonObject = { [key: string]: JsonValue };
type JsonArray = JsonValue[];

interface JsonTreeProps {
  data: JsonValue;
  level?: number;
  path?: string;
  isExpanded?: boolean;
}

const JsonTree: React.FC<JsonTreeProps> = ({ data, level = 0, path = '', isExpanded = true }) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleExpand = (key: string) => {
    setExpanded(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const isExpandable = (value: JsonValue) => 
    value !== null && 
    typeof value === 'object' && 
    Object.keys(value).length > 0;

  const getNodeClass = (key: string) => {
    return `font-mono transition-colors duration-200 ${
      key.startsWith('"') ? 'text-purple-600 dark:text-purple-400' : 'text-gray-800 dark:text-gray-200'
    }`;
  };
  
  const getValueClass = (value: JsonValue) => {
    if (value === null) return 'text-gray-500 dark:text-gray-400';
    switch (typeof value) {
      case 'boolean': return 'text-orange-600 dark:text-orange-400';
      case 'number': return 'text-blue-600 dark:text-blue-400';
      case 'string': return 'text-green-600 dark:text-green-400';
      default: return 'text-gray-800 dark:text-gray-200';
    }
  };
  
  if (data === null) {
    return <span className="text-gray-500 dark:text-gray-400">null</span>;
  }

  if (typeof data !== 'object') {
    return (
      <span className={getValueClass(data)}>
        {typeof data === 'string' ? `"${data}"` : String(data)}
      </span>
    );
  }

  const isArray = Array.isArray(data);
  
  if (Object.keys(data).length === 0) {
    return <span>{isArray ? '[]' : '{}'}</span>;
  }

  return (
    <div className="flex flex-col">
      {Object.entries(data).map(([key, value], index) => {
        const displayKey = isArray ? index.toString() : key;
        const nodePath = path ? `${path}.${displayKey}` : displayKey;
        const isNodeExpandable = isExpandable(value);
        const isNodeExpanded = expanded[nodePath] ?? isExpanded;
        
        return (
          <div key={nodePath} className={`ml-${level * 4} font-mono`}>
            <div className="flex items-start">
              {isNodeExpandable ? (
                <button 
                  onClick={() => toggleExpand(nodePath)}
                  className="mr-1 focus:outline-none p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  {isNodeExpanded ? 
                    <ChevronDown className="w-3 h-3 text-gray-500" /> : 
                    <ChevronRight className="w-3 h-3 text-gray-500" />
                  }
                </button>
              ) : (
                <span className="mr-1 w-5"></span>
              )}
              <div>
                <span className={getNodeClass(displayKey)}>
                  {isArray ? '' : `"${displayKey}"`}
                </span>
                {!isArray && <span className="text-gray-800 dark:text-gray-200">: </span>}
                
                {isNodeExpandable ? (
                  <span>
                    {isArray ? '[' : '{'}
                    {!isNodeExpanded && '...'}
                    {isNodeExpanded ? '' : isArray ? ']' : '}'}
                  </span>
                ) : (
                  <span className={getValueClass(value)}>
                    {typeof value === 'string' ? `"${value}"` : String(value)}
                  </span>
                )}
              </div>
            </div>
            
            {isNodeExpandable && isNodeExpanded && (
              <div className="ml-4">
                <JsonTree 
                  data={value} 
                  level={level + 1} 
                  path={nodePath} 
                  isExpanded={isExpanded}
                />
              </div>
            )}
            
            {isNodeExpandable && isNodeExpanded && (
              <div className={`ml-${level * 4}`}>
                <span>{isArray ? ']' : '}'}</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default JsonTree;