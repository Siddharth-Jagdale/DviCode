import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { mappingAPI, terminologyAPI } from '../services/api';
import MappingResults from '../components/search/MappingResults';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { 
  ArrowPathRoundedSquareIcon, 
  BeakerIcon,
  ClipboardDocumentCheckIcon 
} from '@heroicons/react/24/outline';

const Mapping = () => {
  const [searchParams] = useSearchParams();
  const [selectedCode, setSelectedCode] = useState(searchParams.get('code') || '');
  const [mappingHistory, setMappingHistory] = useState([]);

  const { data: namasteCodes = [] } = useQuery(
    'namaste-codes',
    () => terminologyAPI.getNamesteCodes(),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  const { 
    data: mappings = [], 
    isLoading: isMappingLoading,
    error: mappingError,
    refetch: refetchMappings 
  } = useQuery(
    ['mappings', selectedCode],
    () => mappingAPI.generateMappings(selectedCode),
    {
      enabled: !!selectedCode,
      staleTime: 2 * 60 * 1000, // 2 minutes
      onSuccess: (data) => {
        if (data?.data && selectedCode) {
          setMappingHistory(prev => [
            { code: selectedCode, mappings: data.data, timestamp: new Date() },
            ...prev.slice(0, 4) // Keep last 5 mappings
          ]);
        }
      }
    }
  );

  const { 
    data: dualCoding,
    isLoading: isDualCodingLoading 
  } = useQuery(
    ['dual-coding', selectedCode],
    () => mappingAPI.getDualCoding(selectedCode),
    {
      enabled: !!selectedCode,
      staleTime: 2 * 60 * 1000,
    }
  );

  const handleCodeSelect = (code) => {
    setSelectedCode(code);
    // Update URL without navigation
    window.history.replaceState({}, '', `?code=${code}`);
  };

  const handleGenerateMapping = () => {
    if (selectedCode) {
      refetchMappings();
    }
  };

  const mappingResults = mappings?.data || mappings || [];
  const dualCodingData = dualCoding?.data || dualCoding;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Code Mapping Generator
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Generate AI-powered mappings from NAMASTE to ICD-11 codes with confidence scoring
        </p>
      </div>

      {/* Code Selection */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <BeakerIcon className="w-6 h-6 mr-2" />
          Select NAMASTE Code
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              NAMASTE Code
            </label>
            <select
              value={selectedCode}
              onChange={(e) => handleCodeSelect(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Select a code...</option>
              {namasteCodes?.data?.map((code) => (
                <option key={code.code} value={code.code}>
                  {code.code} - {code.display_name}
                </option>
              )) || []}
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={handleGenerateMapping}
              disabled={!selectedCode || isMappingLoading}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {isMappingLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <ArrowPathRoundedSquareIcon className="w-5 h-5 mr-2" />
                  Generate Mappings
                </>
              )}
            </button>
          </div>
        </div>

        {selectedCode && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>Selected Code:</strong> {selectedCode}
            </p>
            <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
              {namasteCodes?.data?.find(c => c.code === selectedCode)?.display_name}
            </p>
          </div>
        )}
      </div>

      {/* Mapping Results */}
      {selectedCode && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Auto-Generated Mappings */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <ArrowPathRoundedSquareIcon className="w-5 h-5 mr-2" />
              Auto-Generated Mappings
            </h3>
            
            {isMappingLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner size="lg" />
              </div>
            ) : mappingError ? (
              <div className="text-red-600 dark:text-red-400 text-center py-4">
                Error generating mappings: {mappingError.message}
              </div>
            ) : mappingResults.length > 0 ? (
              <MappingResults 
                mappings={mappingResults}
                onSaveFeedback={(mappingId, feedback) => {
                  // Handle feedback saving
                  console.log('Saving feedback:', mappingId, feedback);
                }}
              />
            ) : (
              <div className="text-gray-500 dark:text-gray-400 text-center py-8">
                Click "Generate Mappings" to see AI-powered suggestions
              </div>
            )}
          </div>

          {/* Dual Coding Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <ClipboardDocumentCheckIcon className="w-5 h-5 mr-2" />
              Dual Coding Summary
            </h3>
            
            {isDualCodingLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner size="lg" />
              </div>
            ) : dualCodingData ? (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">
                    TM2 Mapping
                  </h4>
                  {dualCodingData.tm2_mapping ? (
                    <div>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        <strong>{dualCodingData.tm2_mapping.target_code}</strong> - {dualCodingData.tm2_mapping.target_display}
                      </p>
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                        Confidence: {(dualCodingData.tm2_mapping.confidence_score * 100).toFixed(1)}%
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No TM2 mapping found</p>
                  )}
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                    Biomedicine Mapping
                  </h4>
                  {dualCodingData.bio_mapping ? (
                    <div>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        <strong>{dualCodingData.bio_mapping.target_code}</strong> - {dualCodingData.bio_mapping.target_display}
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                        Confidence: {(dualCodingData.bio_mapping.confidence_score * 100).toFixed(1)}%
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No biomedicine mapping found</p>
                  )}
                </div>

                <div className={`p-3 rounded-lg text-center ${
                  dualCodingData.dual_coding_available 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                    : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200'
                }`}>
                  {dualCodingData.dual_coding_available 
                    ? '✅ Dual coding available'
                    : '⚠️ Partial mapping only'
                  }
                </div>
              </div>
            ) : (
              <div className="text-gray-500 dark:text-gray-400 text-center py-8">
                Select a code to see dual coding summary
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mapping History */}
      {mappingHistory.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Mappings
          </h3>
          <div className="space-y-3">
            {mappingHistory.map((item, index) => (
              <motion.div
                key={`${item.code}-${item.timestamp.getTime()}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {item.code}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {item.mappings.length} mappings generated
                  </p>
                </div>
                <button
                  onClick={() => handleCodeSelect(item.code)}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                >
                  View Again
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Mapping;
