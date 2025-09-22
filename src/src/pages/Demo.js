import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { searchAPI, mappingAPI, fhirAPI, terminologyAPI } from '../services/api';
import SearchInput from '../components/search/SearchInput';
import SearchResults from '../components/search/SearchResults';
import MappingResults from '../components/search/MappingResults';
import FhirBundleViewer from '../components/fhir/FhirBundleViewer';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { 
  MagnifyingGlassIcon, 
  ArrowPathRoundedSquareIcon, 
  CodeBracketIcon 
} from '@heroicons/react/24/outline';

const Demo = () => {
  const [activeTab, setActiveTab] = useState('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCode, setSelectedCode] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [mappingResults, setMappingResults] = useState([]);
  const [fhirBundle, setFhirBundle] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { data: namasteCodes } = useQuery('namaste-codes', terminologyAPI.getNamesteCodes);

  const tabs = [
    { id: 'search', label: 'Smart Search', icon: MagnifyingGlassIcon },
    { id: 'mapping', label: 'Code Mapping', icon: ArrowPathRoundedSquareIcon },
    { id: 'fhir', label: 'FHIR Bundle', icon: CodeBracketIcon },
  ];

  const handleSearch = async (query, system = 'all') => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await searchAPI.autocomplete(query, system, 10);
      setSearchResults(response.data);
    } catch (error) {
      toast.error('Search failed');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMapping = async (code) => {
    if (!code) return;
    
    setIsLoading(true);
    try {
      const response = await mappingAPI.generateMappings(code);
      setMappingResults(response.data);
      setSelectedCode(code);
    } catch (error) {
      toast.error('Mapping generation failed');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFhirGeneration = async (code) => {
    if (!code) return;
    
    setIsLoading(true);
    try {
      const response = await fhirAPI.generateBundle(code);
      setFhirBundle(response.data);
    } catch (error) {
      toast.error('FHIR bundle generation failed');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Interactive Demo
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Experience the ML-powered terminology mapping system in action
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center">
        <div className="flex space-x-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        {activeTab === 'search' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Smart Search & Discovery
            </h2>
            
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={handleSearch}
              placeholder="Search for medical terms across all systems..."
            />

            {isLoading && (
              <div className="flex justify-center mt-6">
                <LoadingSpinner />
              </div>
            )}

            {searchResults.length > 0 && (
              <SearchResults
                results={searchResults}
                onSelectCode={(code) => {
                  setSelectedCode(code);
                  setActiveTab('mapping');
                  handleMapping(code);
                }}
              />
            )}
          </motion.div>
        )}

        {activeTab === 'mapping' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              AI-Powered Code Mapping
            </h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select NAMASTE Code:
              </label>
              <select
                value={selectedCode}
                onChange={(e) => {
                  setSelectedCode(e.target.value);
                  handleMapping(e.target.value);
                }}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose a code...</option>
                {namasteCodes?.map((code) => (
                  <option key={code.code} value={code.code}>
                    {code.code} - {code.display_name}
                  </option>
                ))}
              </select>
            </div>

            {isLoading && (
              <div className="flex justify-center mt-6">
                <LoadingSpinner />
              </div>
            )}

            {mappingResults.length > 0 && (
              <MappingResults
                results={mappingResults}
                sourceCode={selectedCode}
                onGenerateFhir={() => {
                  setActiveTab('fhir');
                  handleFhirGeneration(selectedCode);
                }}
              />
            )}
          </motion.div>
        )}

        {activeTab === 'fhir' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              FHIR R4 Bundle Generation
            </h2>

            <div className="mb-4">
              <button
                onClick={() => selectedCode && handleFhirGeneration(selectedCode)}
                disabled={!selectedCode || isLoading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Generate FHIR Bundle
              </button>
              {selectedCode && (
                <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">
                  for code: {selectedCode}
                </span>
              )}
            </div>

            {isLoading && (
              <div className="flex justify-center mt-6">
                <LoadingSpinner />
              </div>
            )}

            {fhirBundle && <FhirBundleViewer bundle={fhirBundle} />}
          </motion.div>
        )}
      </div>

      {/* Help Section */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
          How to Use This Demo
        </h3>
        <div className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
          <p>• <strong>Search:</strong> Type any medical term to find matching codes across all systems</p>
          <p>• <strong>Mapping:</strong> Select a NAMASTE code to generate automatic mappings to ICD-11</p>
          <p>• <strong>FHIR:</strong> Generate standards-compliant FHIR bundles for EMR integration</p>
        </div>
      </div>
    </div>
  );
};

export default Demo;