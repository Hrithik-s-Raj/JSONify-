import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (term: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  placeholder = 'Search in JSON...' 
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-md">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={handleChange}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 
                     rounded-md leading-5 bg-white dark:bg-gray-800 
                     placeholder-gray-500 focus:outline-none focus:ring-blue-500 
                     focus:border-blue-500 sm:text-sm transition-colors duration-200"
          placeholder={placeholder}
        />
      </div>
    </form>
  );
};

export default SearchBar;