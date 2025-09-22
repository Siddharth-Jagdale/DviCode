import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { fhirAPI } from '../services/api';
import FhirBundleViewer from '../components/fhir/FhirBundleViewer';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import {
  CodeBracketIcon,
  PlayIcon,
  DocumentArrowUpIcon,
  InformationCircleIcon,
  MagnifyingGlassIcon,
  ArrowPathRoundedSquareIcon,
  CubeIcon,
  CloudArrowUpIcon,
  BeakerIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

const FhirPlayground = () => {
  const [activeTab, setActiveTab] = useState('lookup');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [validationError, setValidationError] = useState(null);

  // Form states
  const [lookupForm, setLookupForm] = useState({ system: 'NAMASTE', code: 'NAM001' });
  const [translateForm, setTranslateForm] = useState({
    sourceSystem: 'NAMASTE',
    sourceCode: 'NAM006',
    targetSystem: 'ICD-11-TM2'
  });
  const [bundleCode, setBundleCode] = useState('NAM006');
  const [uploadBundle, setUploadBundle] = useState('');

  const tabs = [
    { 
      id: 'lookup', 
      label: '$lookup', 
      description: 'Look up code details',
      icon: MagnifyingGlassIcon,
      color: 'blue'
    },
    { 
      id: 'translate', 
      label: '$translate', 
      description: 'Translate between systems',
      icon: ArrowPathRoundedSquareIcon,
      color: 'purple'
    },
    { 
      id: 'bundle', 
      label: 'Bundle', 
      description: 'Generate FHIR bundles',
      icon: CubeIcon,
      color: 'green'
    },
    { 
      id: 'upload', 
      label: 'Upload', 
      description: 'Upload FHIR bundle',
      icon: CloudArrowUpIcon,
      color: 'orange'
    },
  ];

  const sampleBundles = {
    basic: {
      "resourceType": "Bundle",
      "id": "example-bundle",
      "type": "collection",
      "timestamp": "2024-01-01T00:00:00Z",
      "entry": [
        {
          "resource": {
            "resourceType": "CodeSystem",
            "id": "namaste-codes",
            "url": "http://terminology.hl7.org/CodeSystem/namaste",
            "concept": [
              {
                "code": "NAM001",
                "display": "Vata Dosha Imbalance"
              }
            ]
          }
        }
      ]
    }
  };

  const validateJSON = (jsonString) => {
    try {
      JSON.parse(jsonString);
      setValidationError(null);
      return true;
    } catch (error) {
      setValidationError(error.message);
      return false;
    }
  };

  const handleLookup = async () => {
    if (!lookupForm.system || !lookupForm.code) {
      toast.error('Please provide both system and code');
      return;
    }

    setIsLoading(true);
    setResult(null);
    try {
      const response = await fhirAPI.lookup(lookupForm.system, lookupForm.code);
      setResult(response.data);
      toast.success('Lookup operation successful');
    } catch (error) {
      const errorData = error.response?.data || { error: error.message };
      setResult(errorData);
      toast.error('Lookup operation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTranslate = async () => {
    if (!translateForm.sourceSystem || !translateForm.sourceCode || !translateForm.targetSystem) {
      toast.error('Please fill in all translation fields');
      return;
    }

    setIsLoading(true);
    setResult(null);
    try {
      const response = await fhirAPI.translate(
        translateForm.sourceSystem,
        translateForm.sourceCode,
        translateForm.targetSystem
      );
      setResult(response.data);
      toast.success('Translation operation successful');
    } catch (error) {
      const errorData = error.response?.data || { error: error.message };
      setResult(errorData);
      toast.error('Translation operation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBundleGeneration = async () => {
    if (!bundleCode) {
      toast.error('Please select a code for bundle generation');
      return;
    }

    setIsLoading(true);
    setResult(null);
    try {
      const response = await fhirAPI.generateBundle(bundleCode);
      setResult(response.data);
      toast.success('Bundle generated successfully');
    } catch (error) {
      const errorData = error.response?.data || { error: error.message };
      setResult(errorData);
      toast.error('Bundle generation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBundleUpload = async () => {
    if (!uploadBundle.trim()) {
      toast.error('Please provide JSON content to upload');
      return;
    }

    if (!validateJSON(uploadBundle)) {
      toast.error('Invalid JSON format');
      return;
    }

    setIsLoading(true);
    setResult(null);
    try {
      const bundle = JSON.parse(uploadBundle);
      const response = await fhirAPI.uploadBundle(bundle);
      setResult(response.data);
      toast.success('Bundle uploaded successfully');
    } catch (error) {
      const errorData = error.response?.data || { error: error.message };
      setResult(errorData);
      toast.error('Bundle upload failed');
    } finally {
      setIsLoading(false);
    }
  };

  const insertSampleBundle = () => {
    setUploadBundle(JSON.stringify(sampleBundles.basic, null, 2));
    setValidationError(null);
  };

  const clearResults = () => {
    setResult(null);
    setValidationError(null);
  };

  const getTabColorClasses = (color, isActive) => {
    const colors = {
      blue: isActive 
        ? 'bg-blue-600 text-white border-blue-600' 
        : 'text-blue-600 border-blue-200 hover:bg-blue-50 dark:hover:bg-blue-900/20',
      purple: isActive 
        ? 'bg-purple-600 text-white border-purple-600' 
        : 'text-purple-600 border-purple-200 hover:bg-purple-50 dark:hover:bg-purple-900/20',
      green: isActive 
        ? 'bg-green-600 text-white border-green-600' 
        : 'text-green-600 border-green-200 hover:bg-green-50 dark:hover:bg-green-900/20',
      orange: isActive 
        ? 'bg-orange-600 text-white border-orange-600' 
        : 'text-orange-600 border-orange-200 hover:bg-orange-50 dark:hover:bg-orange-900/20',
    };
    return colors[color];
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="inline-flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-full text-blue-700 dark:text-blue-300 text-sm font-medium mb-4">
          <BeakerIcon className="w-4 h-4 mr-2" />
          Interactive FHIR R4 Testing Environment
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          FHIR R4 Playground
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Test and explore FHIR operations interactively with real-time validation 
          and comprehensive response visualization
        </p>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        className="flex flex-wrap justify-center gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                clearResults();
              }}
              className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-300 min-w-[120px] ${
                getTabColorClasses(tab.color, isActive)
              }`}
            >
              <Icon className="w-6 h-6 mb-2" />
              <span className="font-semibold text-sm">{tab.label}</span>
              <span className="text-xs opacity-75 text-center mt-1">
                {tab.description}
              </span>
            </button>
          );
        })}
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Panel */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {tabs.find(t => t.id === activeTab)?.label} Operation
            </h2>
            {result && (
              <button
                onClick={clearResults}
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Clear Results
              </button>
            )}
          </div>

          {/* Lookup Form */}
          {activeTab === 'lookup' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  System
                </label>
                <select
                  value={lookupForm.system}
                  onChange={(e) => setLookupForm({ ...lookupForm, system: e.target.value })}
                  className="w-full input-field"
                >
                  <option value="NAMASTE">NAMASTE</option>
                  <option value="ICD-11-TM2">ICD-11 TM2</option>
                  <option value="ICD-11-BIO">ICD-11 Bio</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Code
                </label>
                <input
                  type="text"
                  value={lookupForm.code}
                  onChange={(e) => setLookupForm({ ...lookupForm, code: e.target.value })}
                  placeholder="Enter code (e.g., NAM001)"
                  className="w-full input-field"
                />
              </div>

              <button
                onClick={handleLookup}
                disabled={isLoading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <LoadingSpinner size="sm" color="white" />
                ) : (
                  <>
                    <PlayIcon className="w-5 h-5 mr-2" />
                    Execute Lookup
                  </>
                )}
              </button>
            </div>
          )}

          {/* Translate Form */}
          {activeTab === 'translate' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Source System
                </label>
                <select
                  value={translateForm.sourceSystem}
                  onChange={(e) => setTranslateForm({ ...translateForm, sourceSystem: e.target.value })}
                  className="w-full input-field"
                >
                  <option value="NAMASTE">NAMASTE</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Source Code
                </label>
                <input
                  type="text"
                  value={translateForm.sourceCode}
                  onChange={(e) => setTranslateForm({ ...translateForm, sourceCode: e.target.value })}
                  placeholder="Enter source code (e.g., NAM006)"
                  className="w-full input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Target System
                </label>
                <select
                  value={translateForm.targetSystem}
                  onChange={(e) => setTranslateForm({ ...translateForm, targetSystem: e.target.value })}
                  className="w-full input-field"
                >
                  <option value="ICD-11-TM2">ICD-11 TM2</option>
                  <option value="ICD-11-BIO">ICD-11 Bio</option>
                </select>
              </div>

              <button
                onClick={handleTranslate}
                disabled={isLoading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <LoadingSpinner size="sm" color="white" />
                ) : (
                  <>
                    <PlayIcon className="w-5 h-5 mr-2" />
                    Execute Translation
                  </>
                )}
              </button>
            </div>
          )}

          {/* Bundle Generation Form */}
          {activeTab === 'bundle' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  NAMASTE Code
                </label>
                <select
                  value={bundleCode}
                  onChange={(e) => setBundleCode(e.target.value)}
                  className="w-full input-field"
                >
                  <option value="NAM001">NAM001 - Vata Dosha Imbalance</option>
                  <option value="NAM002">NAM002 - Pitta Dosha Excess</option>
                  <option value="NAM003">NAM003 - Kapha Dosha Stagnation</option>
                  <option value="NAM004">NAM004 - Jwara (Fever)</option>
                  <option value="NAM005">NAM005 - Arsha (Hemorrhoids)</option>
                  <option value="NAM006">NAM006 - Prameha (Diabetes)</option>
                  <option value="NAM007">NAM007 - Shirahshool (Headache)</option>
                  <option value="NAM008">NAM008 - Amlapitta (Hyperacidity)</option>
                </select>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <div className="flex items-start">
                  <InformationCircleIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-700 dark:text-blue-300">
                    <strong>Bundle Contents:</strong> The generated bundle will include CodeSystem, 
                    ConceptMap for TM2, and ConceptMap for Biomedicine mappings.
                  </div>
                </div>
              </div>

              <button
                onClick={handleBundleGeneration}
                disabled={isLoading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <LoadingSpinner size="sm" color="white" />
                ) : (
                  <>
                    <PlayIcon className="w-5 h-5 mr-2" />
                    Generate Bundle
                  </>
                )}
              </button>
            </div>
          )}

          {/* Bundle Upload Form */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    JSON Bundle Content
                  </label>
                  <button
                    onClick={insertSampleBundle}
                    className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Insert Sample
                  </button>
                </div>
                <textarea
                  value={uploadBundle}
                  onChange={(e) => {
                    setUploadBundle(e.target.value);
                    if (e.target.value.trim()) {
                      validateJSON(e.target.value);
                    } else {
                      setValidationError(null);
                    }
                  }}
                  placeholder="Paste your FHIR Bundle JSON here..."
                  rows={10}
                  className="w-full input-field font-mono text-sm"
                />
                {validationError && (
                  <div className="flex items-center mt-2 text-red-600 dark:text-red-400 text-sm">
                    <XCircleIcon className="w-4 h-4 mr-1" />
                    Invalid JSON: {validationError}
                  </div>
                )}
                {uploadBundle && !validationError && (
                  <div className="flex items-center mt-2 text-green-600 dark:text-green-400 text-sm">
                    <CheckCircleIcon className="w-4 h-4 mr-1" />
                    Valid JSON format
                  </div>
                )}
              </div>

              <button
                onClick={handleBundleUpload}
                disabled={isLoading || !uploadBundle.trim() || !!validationError}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <LoadingSpinner size="sm" color="white" />
                ) : (
                  <>
                    <DocumentArrowUpIcon className="w-5 h-5 mr-2" />
                    Upload Bundle
                  </>
                )}
              </button>
            </div>
          )}
        </motion.div>

        {/* Results Panel */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Response
          </h2>

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12">
              <LoadingSpinner size="lg" />
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Processing FHIR operation...
              </p>
            </div>
          )}

          {!isLoading && !result && (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
              <CodeBracketIcon className="w-16 h-16 mb-4 opacity-50" />
              <p className="text-center">
                Execute a FHIR operation to see the response here
              </p>
            </div>
          )}

          {!isLoading && result && (
            <div>
              {/* Response Status */}
              <div className="mb-4">
                {result.error ? (
                  <div className="flex items-center p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <XCircleIcon className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
                    <span className="text-red-700 dark:text-red-300 font-medium">
                      Operation Failed
                    </span>
                  </div>
                ) : result.resourceType === 'OperationOutcome' ? (
                  <div className="flex items-center p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2" />
                    <span className="text-yellow-700 dark:text-yellow-300 font-medium">
                      {result.issue?.[0]?.severity === 'error' ? 'Operation Failed' : 'Warning'}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <CheckCircleIcon className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
                    <span className="text-green-700 dark:text-green-300 font-medium">
                      Operation Successful
                    </span>
                  </div>
                )}
              </div>

              {/* Response Content */}
              {result.resourceType === 'Bundle' ? (
                <FhirBundleViewer bundle={result} />
              ) : (
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                  <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap overflow-auto max-h-96">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>

      {/* FHIR Operations Guide */}
      <motion.div
        className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          FHIR Operations Guide
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            return (
              <div key={tab.id} className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <div className={`inline-flex p-2 rounded-lg bg-${tab.color}-100 dark:bg-${tab.color}-900/30 mb-3`}>
                  <Icon className={`w-5 h-5 text-${tab.color}-600 dark:text-${tab.color}-400`} />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {tab.label}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {tab.description}
                </p>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default FhirPlayground;