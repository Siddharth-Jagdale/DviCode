import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const MappingResults = ({ results, sourceCode, onGenerateFhir }) => {
  const getConfidenceColor = (score) => {
    if (score >= 0.8) return 'text-green-600 dark:text-green-400';
    if (score >= 0.5) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getConfidenceBg = (score) => {
    if (score >= 0.8) return 'bg-green-100 dark:bg-green-900';
    if (score >= 0.5) return 'bg-yellow-100 dark:bg-yellow-900';
    return 'bg-red-100 dark:bg-red-900';
  };

  const getSystemColor = (system) => {
    switch (system) {
      case 'ICD-11-TM2':
        return 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/20';
      case 'ICD-11-BIO':
        return 'border-l-purple-500 bg-purple-50 dark:bg-purple-900/20';
      default:
        return 'border-l-gray-500 bg-gray-50 dark:bg-gray-700';
    }
  };

  const tm2Mappings = results.filter(r => r.target_system === 'ICD-11-TM2');
  const bioMappings = results.filter(r => r.target_system === 'ICD-11-BIO');

  return (
    <motion.div
      className="mt-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Generated Mappings for {sourceCode}
        </h3>
        
        {tm2Mappings.length > 0 && bioMappings.length > 0 && (
          <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
            <CheckCircleIcon className="w-5 h-5" />
            <span className="text-sm font-medium">Dual Coding Available</span>
          </div>
        )}
      </div>

      {/* Traditional Medicine Mappings */}
      {tm2Mappings.length > 0 && (
        <div className="mb-6">
          <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3">
            ICD-11 Traditional Medicine Module 2 (TM2)
          </h4>
          <div className="space-y-3">
            {tm2Mappings.map((mapping, index) => (
              <motion.div
                key={index}
                className={`p-4 rounded-lg border-l-4 ${getSystemColor(mapping.target_system)}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.1 }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h5 className="font-semibold text-gray-900 dark:text-white">
                        {mapping.target_display}
                      </h5>
                      <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                        {mapping.target_code}
                      </span>
                    </div>
                    
                    {mapping.target_description && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        {mapping.target_description}
                      </p>
                    )}
                    
                    <div className="flex items-center space-x-4">
                      <div className={`px-2 py-1 rounded-full ${getConfidenceBg(mapping.confidence_score)}`}>
                        <span className={`text-xs font-medium ${getConfidenceColor(mapping.confidence_score)}`}>
                          Confidence: {(mapping.confidence_score * 100).toFixed(1)}%
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {mapping.mapping_type}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Biomedicine Mappings */}
      {bioMappings.length > 0 && (
        <div className="mb-6">
          <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3">
            ICD-11 Biomedicine
          </h4>
          <div className="space-y-3">
            {bioMappings.map((mapping, index) => (
              <motion.div
                key={index}
                className={`p-4 rounded-lg border-l-4 ${getSystemColor(mapping.target_system)}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: (tm2Mappings.length + index) * 0.1 }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h5 className="font-semibold text-gray-900 dark:text-white">
                        {mapping.target_display}
                      </h5>
                      <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                        {mapping.target_code}
                      </span>
                    </div>
                    
                    {mapping.target_description && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        {mapping.target_description}
                      </p>
                    )}
                    
                    <div className="flex items-center space-x-4">
                      <div className={`px-2 py-1 rounded-full ${getConfidenceBg(mapping.confidence_score)}`}>
                        <span className={`text-xs font-medium ${getConfidenceColor(mapping.confidence_score)}`}>
                          Confidence: {(mapping.confidence_score * 100).toFixed(1)}%
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {mapping.mapping_type}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {results.length === 0 && (
        <div className="text-center py-8">
          <ExclamationTriangleIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">
            No mappings found for this code
          </p>
        </div>
      )}

      {/* Action Button */}
      {results.length > 0 && (
        <div className="mt-6 text-center">
          <button
            onClick={onGenerateFhir}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Generate FHIR Bundle
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default MappingResults;