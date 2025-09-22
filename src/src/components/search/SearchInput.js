import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const SearchInput = ({ value, onChange, onSearch, placeholder = "Search..." }) => {
  const [system, setSystem] = useState('all');
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (localValue.length >= 2) {
        onSearch(localValue, system);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [localValue, system, onSearch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (localValue.trim()) {
      onSearch(localValue, system);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={localValue}
            onChange={(e) => {
              setLocalValue(e.target.value);
              onChange(e.target.value);
            }}
            placeholder={placeholder}
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <select
          value={system}
          onChange={(e) => setSystem(e.target.value)}
          className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Systems</option>
          <option value="NAMASTE">NAMASTE</option>
          <option value="ICD-11-TM2">ICD-11 TM2</option>
          <option value="ICD-11-BIO">ICD-11 Bio</option>
        </select>
      </div>
    </form>
  );
};

export default SearchInput;