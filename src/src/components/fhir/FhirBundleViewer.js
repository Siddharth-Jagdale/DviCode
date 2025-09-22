import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ReactJsonView from 'react-json-view';
import { DocumentArrowDownIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const FhirBundleViewer = ({ bundle }) => {
  const [viewMode, setViewMode] = useState('pretty');

  const handleDownload = () => {
    const dataStr = JSON.stringify(bundle, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `fhir-bundle-${bundle.id || 'bundle'}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('FHIR Bundle downloaded successfully');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(bundle, null, 2));
      toast.success('FHIR Bundle copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  return (
    <motion.div
      className="mt-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Generated FHIR Bundle
        </h3>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('pretty')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                viewMode === 'pretty'
                  ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Pretty
            </button>
            <button
              onClick={() => setViewMode('raw')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                viewMode === 'raw'
                  ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Raw
            </button>
          </div>
          
          <button
            onClick={handleCopy}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Copy to clipboard"
          >
            <ClipboardDocumentIcon className="w-5 h-5" />
          </button>
          
          <button
            onClick={handleDownload}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Download JSON"
          >
            <DocumentArrowDownIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 overflow-auto max-h-96">
        {viewMode === 'pretty' ? (
          <ReactJsonView
            src={bundle}
            theme={document.documentElement.classList.contains('dark') ? 'monokai' : 'rjv-default'}
            collapsed={2}
            displayDataTypes={false}
            displayObjectSize={false}
            enableClipboard={false}
            style={{
              backgroundColor: 'transparent',
              fontSize: '0.875rem',
            }}
          />
        ) : (
          <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
            {JSON.stringify(bundle, null, 2)}
          </pre>
        )}
      </div>

      {/* Bundle Summary */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
          <div className="text-blue-600 dark:text-blue-400 text-sm font-medium">
            Resource Type
          </div>
          <div className="text-blue-800 dark:text-blue-200 font-semibold">
            {bundle.resourceType}
          </div>
        </div>
        
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
          <div className="text-green-600 dark:text-green-400 text-sm font-medium">
            Bundle Type
          </div>
          <div className="text-green-800 dark:text-green-200 font-semibold">
            {bundle.type}
          </div>
        </div>
        
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
          <div className="text-purple-600 dark:text-purple-400 text-sm font-medium">
            Entries
          </div>
          <div className="text-purple-800 dark:text-purple-200 font-semibold">
            {bundle.entry?.length || 0}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FhirBundleViewer;