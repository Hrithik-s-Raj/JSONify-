import React, { useState, useEffect } from 'react';
import { isEqual } from '../utils/jsonUtils';

type ComparisonStatus = 'added' | 'removed' | 'changed' | 'unchanged';

interface ComparisonNode {
  key: string;
  path: string[];
  leftValue: any;
  rightValue: any;
  status: ComparisonStatus;
  children?: ComparisonNode[];
}

interface JsonComparerProps {
  leftJson: any;
  rightJson: any;
}

const JsonComparer: React.FC<JsonComparerProps> = ({ leftJson, rightJson }) => {
  const [diffTree, setDiffTree] = useState<ComparisonNode[]>([]);
  const [expandedPaths, setExpandedPaths] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (leftJson && rightJson) {
      const result = compareObjects(leftJson, rightJson);
      setDiffTree(result);
      
      // Auto-expand first level
      const initialExpanded: Record<string, boolean> = {};
      result.forEach(node => {
        initialExpanded[node.path.join('.')] = true;
      });
      setExpandedPaths(initialExpanded);
    }
  }, [leftJson, rightJson]);

  const compareObjects = (left: any, right: any, path: string[] = []): ComparisonNode[] => {
    const nodes: ComparisonNode[] = [];
    
    // Handle null cases
    if (left === null && right === null) {
      return [];
    }
    
    if (left === null) {
      return [{ 
        key: 'root', 
        path, 
        leftValue: null, 
        rightValue: right, 
        status: 'added' 
      }];
    }
    
    if (right === null) {
      return [{ 
        key: 'root', 
        path, 
        leftValue: left, 
        rightValue: null, 
        status: 'removed' 
      }];
    }
    
    // Compare primitive types
    if (typeof left !== 'object' || typeof right !== 'object') {
      return [{ 
        key: path[path.length - 1] || 'value', 
        path, 
        leftValue: left, 
        rightValue: right, 
        status: isEqual(left, right) ? 'unchanged' : 'changed' 
      }];
    }
    
    // Compare arrays
    if (Array.isArray(left) && Array.isArray(right)) {
      return compareArrays(left, right, path);
    }
    
    // Compare objects
    const allKeys = new Set([...Object.keys(left), ...Object.keys(right)]);
    
    allKeys.forEach(key => {
      const currentPath = [...path, key];
      
      if (!(key in left)) {
        nodes.push({ 
          key, 
          path: currentPath, 
          leftValue: undefined, 
          rightValue: right[key], 
          status: 'added' 
        });
      } else if (!(key in right)) {
        nodes.push({ 
          key, 
          path: currentPath, 
          leftValue: left[key], 
          rightValue: undefined, 
          status: 'removed' 
        });
      } else if (typeof left[key] === 'object' && typeof right[key] === 'object' && 
                 left[key] !== null && right[key] !== null) {
        const childNodes = compareObjects(left[key], right[key], currentPath);
        
        if (childNodes.length > 0) {
          // Check if all children are unchanged
          const allUnchanged = childNodes.every(node => node.status === 'unchanged');
          
          nodes.push({ 
            key, 
            path: currentPath, 
            leftValue: left[key], 
            rightValue: right[key], 
            status: allUnchanged ? 'unchanged' : 'changed',
            children: childNodes 
          });
        } else {
          nodes.push({ 
            key, 
            path: currentPath, 
            leftValue: left[key], 
            rightValue: right[key], 
            status: 'unchanged' 
          });
        }
      } else {
        const isEqualValue = isEqual(left[key], right[key]);
        nodes.push({ 
          key, 
          path: currentPath, 
          leftValue: left[key], 
          rightValue: right[key], 
          status: isEqualValue ? 'unchanged' : 'changed' 
        });
      }
    });
    
    return nodes;
  };
  
  const compareArrays = (left: any[], right: any[], path: string[]): ComparisonNode[] => {
    const nodes: ComparisonNode[] = [];
    const maxLength = Math.max(left.length, right.length);
    
    for (let i = 0; i < maxLength; i++) {
      const currentPath = [...path, i.toString()];
      
      if (i >= left.length) {
        nodes.push({ 
          key: i.toString(), 
          path: currentPath, 
          leftValue: undefined, 
          rightValue: right[i], 
          status: 'added' 
        });
      } else if (i >= right.length) {
        nodes.push({ 
          key: i.toString(), 
          path: currentPath, 
          leftValue: left[i], 
          rightValue: undefined, 
          status: 'removed' 
        });
      } else if (typeof left[i] === 'object' && typeof right[i] === 'object' && 
                 left[i] !== null && right[i] !== null) {
        const childNodes = compareObjects(left[i], right[i], currentPath);
        
        if (childNodes.length > 0) {
          const allUnchanged = childNodes.every(node => node.status === 'unchanged');
          
          nodes.push({ 
            key: i.toString(), 
            path: currentPath, 
            leftValue: left[i], 
            rightValue: right[i], 
            status: allUnchanged ? 'unchanged' : 'changed',
            children: childNodes 
          });
        } else {
          nodes.push({ 
            key: i.toString(), 
            path: currentPath, 
            leftValue: left[i], 
            rightValue: right[i], 
            status: 'unchanged' 
          });
        }
      } else {
        const isEqualValue = isEqual(left[i], right[i]);
        nodes.push({ 
          key: i.toString(), 
          path: currentPath, 
          leftValue: left[i], 
          rightValue: right[i], 
          status: isEqualValue ? 'unchanged' : 'changed' 
        });
      }
    }
    
    return nodes;
  };

  const toggleExpand = (path: string) => {
    setExpandedPaths(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  const getStatusColor = (status: ComparisonStatus) => {
    switch (status) {
      case 'added': return 'text-green-600 dark:text-green-400';
      case 'removed': return 'text-red-600 dark:text-red-400';
      case 'changed': return 'text-amber-600 dark:text-amber-400';
      default: return 'text-gray-800 dark:text-gray-200';
    }
  };

  const getValueDisplay = (value: any) => {
    if (value === undefined) return 'undefined';
    if (value === null) return 'null';
    if (typeof value === 'object') {
      return Array.isArray(value) ? '[...]' : '{...}';
    }
    if (typeof value === 'string') return `"${value}"`;
    return String(value);
  };

  const renderDiffNode = (node: ComparisonNode, level = 0) => {
    const pathKey = node.path.join('.');
    const isExpanded = expandedPaths[pathKey] || false;
    const hasChildren = node.children && node.children.length > 0;
    
    return (
      <div key={pathKey} className="font-mono">
        <div 
          className={`flex items-start py-1 pl-${level * 4} ${getStatusColor(node.status)}`}
          onClick={() => hasChildren && toggleExpand(pathKey)}
        >
          {hasChildren && (
            <span className="mr-2 cursor-pointer">
              {isExpanded ? '▼' : '▶'}
            </span>
          )}
          <span className="font-semibold">{node.key}:</span>
          <div className="ml-2 flex flex-col">
            <div className="flex">
              <span className="min-w-[50px] text-xs text-gray-500 dark:text-gray-400">Left:</span>
              <span>{getValueDisplay(node.leftValue)}</span>
            </div>
            <div className="flex">
              <span className="min-w-[50px] text-xs text-gray-500 dark:text-gray-400">Right:</span>
              <span>{getValueDisplay(node.rightValue)}</span>
            </div>
          </div>
        </div>
        
        {hasChildren && isExpanded && (
          <div className="ml-4">
            {node.children!.map(childNode => 
              renderDiffNode(childNode, level + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  if (!leftJson || !rightJson) {
    return (
      <div className="p-8 text-center text-gray-500 dark:text-gray-400">
        Please provide both JSON inputs to compare.
      </div>
    );
  }

  if (diffTree.length === 0) {
    return (
      <div className="p-8 text-center text-green-600 dark:text-green-400 font-medium">
        The JSONs are identical.
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-4 overflow-auto">
      <div className="flex space-x-4 mb-4">
        <div className={`px-3 py-1 rounded-full text-xs font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30`}>
          Added
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30`}>
          Removed
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30`}>
          Changed
        </div>
      </div>
      <div className="overflow-x-auto">
        {diffTree.map(node => renderDiffNode(node))}
      </div>
    </div>
  );
};

export default JsonComparer;