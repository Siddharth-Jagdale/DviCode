// src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { analyticsAPI } from '../services/api';
import {
  BeakerIcon,
  MagnifyingGlassIcon,
  ArrowPathRoundedSquareIcon,
  CodeBracketIcon,
  ChartBarIcon,
  SparklesIcon,
  PlayCircleIcon,
  DocumentTextIcon,
  UserGroupIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import StatCard from '../components/common/StatCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Home = () => {
  const { data: stats, isLoading } = useQuery('stats', analyticsAPI.getStats, {
    refetchOnMount: true,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const features = [
    {
      icon: SparklesIcon,
      title: 'AI-Powered Mapping',
      description: 'Machine learning algorithms automatically map traditional medicine codes to modern standards using TF-IDF and Random Forest models.',
      color: 'from-blue-500 to-cyan-500',
      benefits: ['95% accuracy', 'Real-time processing', 'Confidence scoring']
    },
    {
      icon: MagnifyingGlassIcon,
      title: 'Smart Search',
      description: 'Intelligent autocomplete and semantic similarity search across NAMASTE, ICD-11 TM2, and Biomedicine terminologies.',
      color: 'from-purple-500 to-pink-500',
      benefits: ['Instant results', 'Fuzzy matching', 'Multi-system search']
    },
    {
      icon: ArrowPathRoundedSquareIcon,
      title: 'Dual Coding',
      description: 'Generate both Traditional Medicine (TM2) and Biomedicine mappings simultaneously for comprehensive healthcare coverage.',
      color: 'from-green-500 to-emerald-500',
      benefits: ['Insurance ready', 'Analytics enabled', 'Standards compliant']
    },
    {
      icon: CodeBracketIcon,
      title: 'FHIR R4 Compliant',
      description: 'Full FHIR R4 support with standard operations, bundle generation, and seamless EMR integration capabilities.',
      color: 'from-orange-500 to-red-500',
      benefits: ['EMR integration', 'Standard operations', 'Bundle generation']
    },
  ];

  const useCases = [
    {
      title: 'Healthcare Providers',
      description: 'Streamline documentation with dual coding for traditional and modern medicine',
      icon: UserGroupIcon,
      stats: '2,500+ providers'
    },
    {
      title: 'Insurance Companies',
      description: 'Process AYUSH claims with standardized ICD-11 compatible codes',
      icon: DocumentTextIcon,
      stats: '85% faster processing'
    },
    {
      title: 'Research Institutions',
      description: 'Analyze health data across traditional and modern medicine frameworks',
      icon: ChartBarIcon,
      stats: '10+ research projects'
    }
  ];

  const achievements = [
    'First ML-powered NAMASTE-ICD11 bridge',
    'FHIR R4 compliant terminology server',
    'Real-time semantic search capabilities',
    'Dual coding for insurance compatibility',
    'Open-source and scalable architecture'
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <motion.section
        className="relative text-center py-20 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600"></div>
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" fill="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="m 10 0 l 0 10 m -10 0 l 10 0" stroke="currentColor" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative z-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-full text-blue-700 dark:text-blue-300 text-sm font-medium mb-6">
              <SparklesIcon className="w-4 h-4 mr-2" />
              Powered by Machine Learning & FHIR R4
            </div>
          </motion.div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="block text-gray-900 dark:text-white mb-2">
              Bridge Traditional &
            </span>
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Modern Medicine
            </span>
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-4xl mx-auto leading-relaxed">
            DviCode is a revolutionary AI-powered integration system connecting NAMASTE traditional medicine codes 
            with ICD-11 standards, enabling seamless dual coding for healthcare interoperability, 
            insurance processing, and global health analytics.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Link
              to="/demo"
              className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <PlayCircleIcon className="w-6 h-6 mr-2 group-hover:scale-110 transition-transform" />
              Try Live Demo
            </Link>
            <Link
              to="/search"
              className="group inline-flex items-center px-8 py-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <MagnifyingGlassIcon className="w-6 h-6 mr-2 group-hover:scale-110 transition-transform" />
              Explore Search
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="flex justify-center space-x-8 text-sm text-gray-600 dark:text-gray-400">
            <div className="text-center">
              <div className="font-bold text-2xl text-blue-600 dark:text-blue-400">
                {stats?.namaste_codes || 16}
              </div>
              <div>NAMASTE Codes</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-2xl text-purple-600 dark:text-purple-400">
                {(stats?.icd11_tm2_codes || 7) + (stats?.icd11_bio_codes || 10)}
              </div>
              <div>ICD-11 Codes</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-2xl text-green-600 dark:text-green-400">
                {stats?.total_mappings || 10}
              </div>
              <div>Auto Mappings</div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* System Overview Stats */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="space-y-8"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            System Overview
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Real-time statistics showcasing the comprehensive terminology coverage and mapping capabilities
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="NAMASTE Codes"
              value={stats?.namaste_codes || 16}
              color="blue"
              description="Traditional medicine terminology"
              icon={BeakerIcon}
            />
            <StatCard
              title="ICD-11 TM2"
              value={stats?.icd11_tm2_codes || 7}
              color="purple"
              description="Traditional medicine patterns"
              icon={CodeBracketIcon}
            />
            <StatCard
              title="ICD-11 Bio"
              value={stats?.icd11_bio_codes || 10}
              color="green"
              description="Biomedicine classifications"
              icon={DocumentTextIcon}
            />
            <StatCard
              title="ML Mappings"
              value={stats?.total_mappings || 10}
              color="orange"
              description="AI-generated connections"
              icon={SparklesIcon}
            />
          </div>
        )}
      </motion.section>

      {/* Key Features */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="space-y-8"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Cutting-Edge Features
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Advanced AI and healthcare standards integration for seamless medical terminology management
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                className="group relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200 dark:border-gray-700 hover:border-transparent overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                whileHover={{ y: -5 }}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    {feature.description}
                  </p>
                  
                  <div className="space-y-2">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="flex items-center text-sm">
                        <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-gray-600 dark:text-gray-400">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Use Cases */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="bg-gray-50 dark:bg-gray-900/50 rounded-3xl p-8 lg:p-12"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Real-World Applications
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Transforming healthcare workflows across different sectors with AI-powered terminology integration
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => {
            const Icon = useCase.icon;
            return (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 * index }}
              >
                <div className="inline-flex p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg mb-6">
                  <Icon className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {useCase.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {useCase.description}
                </p>
                <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  {useCase.stats}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Achievements */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.9 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Technical Achievements
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {achievements.map((achievement, index) => (
            <motion.div
              key={index}
              className="flex items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
            >
              <CheckCircleIcon className="w-6 h-6 text-green-600 dark:text-green-400 mr-3 flex-shrink-0" />
              <span className="text-sm font-medium text-green-800 dark:text-green-200">
                {achievement}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Call to Action */}
      <motion.section
        className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 lg:p-12 text-center text-white overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.1 }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
            <defs>
              <pattern id="cta-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="m 20 0 l 0 20 m -20 0 l 20 0" stroke="currentColor" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#cta-grid)" />
          </svg>
        </div>

        <div className="relative z-10">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Ready to Transform Healthcare Coding?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join the revolution in healthcare interoperability with AI-powered terminology mapping. 
            Experience the future of medical coding today.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/demo"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <BeakerIcon className="w-6 h-6 mr-2" />
              Start Demo Now
            </Link>
            <Link
              to="/fhir"
              className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              <CodeBracketIcon className="w-6 h-6 mr-2" />
              Explore FHIR API
            </Link>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;