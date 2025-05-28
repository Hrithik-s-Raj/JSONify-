import React, { useState, useEffect } from 'react';
import * as diff from 'diff';

interface TextComparerProps {
  leftText: string;
  rightText: string;
}

const TextComparer: React.FC<TextComparerProps> = ({ leftText, rightText }) => {
  const [differences, setDifferences] = useState<diff.Change[]>([]);

  useEffect(() => {
    const differences = diff.diffLines(leftText, rightText);
    setDifferences(differences);
  }, [leftText, rightText]);

  const getLineClass = (part: diff.Change) => {
    if (part.added) return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200';
    if (part.removed) return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200';
    return 'text-gray-800 dark:text-gray-200';
  };

  if (!leftText && !rightText) {
    return (
      <div className="p-8 text-center text-gray-500 dark:text-gray-400">
        Please provide both text inputs to compare.
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-4">
      <div className="flex space-x-4 mb-4">
        <div className="px-3 py-1 rounded-full text-xs font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30">
          Added
        </div>
        <div className="px-3 py-1 rounded-full text-xs font-medium text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30">
          Removed
        </div>
      </div>
      
      <div className="font-mono text-sm whitespace-pre-wrap">
        {differences.map((part, index) => (
          <div
            key={index}
            className={`py-1 ${getLineClass(part)}`}
          >
            {part.value}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TextComparer;