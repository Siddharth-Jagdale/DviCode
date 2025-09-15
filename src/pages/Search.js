import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { searchAPI } from '../services/api';
import SearchInput from '../components/search/SearchInput';
import SearchResults from '../components/search/SearchResults';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSystem, setSearchSystem] = useState('all');
  const [searchType, setSearchType] = useState('autocomplete');
  const [showFilters, setShowFilters] = useState(false);

  const { 
    data: searchResults = [], 
    isLoading, 
    error,
    refetch 
  } = useQuery(
    ['search', searchQuery, searchSystem, searchType],
    () => {
      if (!searchQuery || searchQuery.length < 2) return [];
      
      if (searchType === 'similarity') {
        return searchAPI.similarity(searchQuery, searchSystem, 15);
      } else {
        return searchAPI.autocomplete(searchQuery, searchSystem, 20);
      }
    },
    {
      enabled: searchQuery.length >= 2,
      staleTime: 30 * 1000, // 30 seconds
    }
  );

  const handleSearch = (query, system = searchSystem) => {
    setSearchQuery(query);
    setSearchSystem(system);
  };

  const results = searchResults?.data || searchResults || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Smart Terminology Search
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Advanced search across NAMASTE, ICD-11 TM2, and Biomedicine codes
        </p>
      </div>

      {/* Search Interface */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
            <MagnifyingGlassIcon className="w-6 h-6 mr-2" />
            Search Interface
          </h2>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <AdjustmentsHorizontalIcon className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>

        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          onSearch={handleSearch}
          placeholder="Enter medical terms, conditions, or code descriptions..."
        />

        {/* Advanced Filters */}
        {showFilters && (
          <motion.div
            className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Search Options
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Search Type
                </label>
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-900 dark:text-white text-sm"
                >
                  <option value="autocomplete">Exact Match</option>
                  <option value="similarity">Semantic Similarity</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Target System
                </label>
                <select
                  value={searchSystem}
                  onChange={(e) => setSearchSystem(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-900 dark:text-white text-sm"
                >
                  <option value="all">All Systems</option>
                  <option value="NAMASTE">NAMASTE Only</option>
                  <option value="ICD-11-TM2">ICD-11 TM2 Only</option>
                  <option value="ICD-11-BIO">ICD-11 Bio Only</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Search Results */}
      {isLoading && (
        <div className="flex justify-center py-8">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-700 dark:text-red-400">
            Search failed: {error.message}
          </p>
        </div>
      )}

      {!isLoading && !error && searchQuery.length >= 2 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <SearchResults 
            results={results}
            onSelectCode={(code) => {
              // Navigate to mapping page with selected code
              window.location.href = `/mapping?code=${code}`;
            }}
          />
        </div>
      )}

      {/* Search Tips */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3">
          Search Tips
        </h3>
        <div className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
          <p>• <strong>Exact Match:</strong> Find codes with exact text matches in names or descriptions</p>
          <p>• <strong>Semantic Similarity:</strong> Use AI to find conceptually similar codes even with different wording</p>
          <p>• <strong>System Filtering:</strong> Focus your search on specific terminology systems</p>
          <p>• <strong>Minimum Length:</strong> Enter at least 2 characters to start searching</p>
        </div>
      </div>
    </div>
  );
};

export default Search;