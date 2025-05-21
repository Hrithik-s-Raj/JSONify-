import React, { ReactNode } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Moon, Sun, FileJson, GitCompare, History } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  activePage: 'viewer' | 'compare' | 'history';
  setActivePage: (page: 'viewer' | 'compare' | 'history') => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activePage, setActivePage }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <FileJson className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <h1 className="ml-2 text-xl font-bold">JSONify</h1>
            </div>
            <nav className="flex items-center space-x-4">
              <button
                onClick={() => setActivePage('viewer')}
                className={`px-3 py-2 rounded-md text-sm font-medium 
                  ${activePage === 'viewer' 
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200' 
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
              >
                <div className="flex items-center">
                  <FileJson className="w-4 h-4 mr-1" />
                  <span>Viewer</span>
                </div>
              </button>
              <button
                onClick={() => setActivePage('compare')}
                className={`px-3 py-2 rounded-md text-sm font-medium 
                  ${activePage === 'compare' 
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200' 
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
              >
                <div className="flex items-center">
                  <GitCompare className="w-4 h-4 mr-1" />
                  <span>Compare</span>
                </div>
              </button>
              <button
                onClick={() => setActivePage('history')}
                className={`px-3 py-2 rounded-md text-sm font-medium 
                  ${activePage === 'history' 
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200' 
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
              >
                <div className="flex items-center">
                  <History className="w-4 h-4 mr-1" />
                  <span>History</span>
                </div>
              </button>
              <button
                onClick={toggleTheme}
                className="ml-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? (
                  <Moon className="w-5 h-5" />
                ) : (
                  <Sun className="w-5 h-5" />
                )}
              </button>
            </nav>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
};

export default Layout;