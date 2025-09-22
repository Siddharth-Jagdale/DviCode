import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import { analyticsAPI } from '../services/api';
import StatCard from '../components/common/StatCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
  ChartBarIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';

// Fallback data in case API fails
const fallbackStats = {
  total_searches: 25847,
  total_mappings: 0,
  active_users: 1234,
  avg_latency: '245ms',
};

const Analytics = () => {
  const {
    data: stats,
    isLoading: statsLoading,
    isError: statsError,
  } = useQuery(['stats'], analyticsAPI.getStats);

  const {
    data: popularMappings,
    isLoading: popularLoading,
    isError: popularError,
  } = useQuery(['popular-mappings'], analyticsAPI.getPopularMappings);

  const {
    data: confidenceData,
    isLoading: confidenceLoading,
    isError: confidenceError,
  } = useQuery(['confidence-distribution'], analyticsAPI.getConfidenceDistribution);

  // Mock data for demonstration
  const usageOverTime = [
    { month: 'Jan', searches: 1200, mappings: 800 },
    { month: 'Feb', searches: 1900, mappings: 1200 },
    { month: 'Mar', searches: 3000, mappings: 2100 },
    { month: 'Apr', searches: 5000, mappings: 3800 },
    { month: 'May', searches: 7200, mappings: 5400 },
    { month: 'Jun', searches: 8500, mappings: 6700 },
  ];

  const systemUsage = [
    { name: 'NAMASTE', value: 45, color: '#f59e0b' },
    { name: 'ICD-11 TM2', value: 30, color: '#3b82f6' },
    { name: 'ICD-11 Bio', value: 25, color: '#8b5cf6' },
  ];

  const COLORS = ['#f59e0b', '#3b82f6', '#8b5cf6'];

  if (statsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (statsError) {
    return (
      <div className="flex justify-center items-center h-64 text-red-600 dark:text-red-400">
        Failed to load statistics. Please try again later.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Analytics Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          System usage and mapping performance insights
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Searches"
          value="25,847"
          color="blue"
          description="This month"
          icon={ChartBarIcon}
        />
        <StatCard
          title="Successful Mappings"
          value={stats?.total_mappings || 0}
          color="green"
          description="High confidence"
          icon={ArrowTrendingUpIcon}
        />
        <StatCard
          title="Active Users"
          value="1,234"
          color="purple"
          description="Last 30 days"
          icon={UsersIcon}
        />
        <StatCard
          title="Avg Response Time"
          value="245ms"
          color="orange"
          description="API latency"
          icon={ClockIcon}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Usage Over Time */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Usage Trends
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={usageOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#f9fafb'
                }}
              />
              <Line
                type="monotone"
                dataKey="searches"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6' }}
              />
              <Line
                type="monotone"
                dataKey="mappings"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: '#10b981' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* System Usage Distribution */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            System Usage Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={systemUsage}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {systemUsage.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Popular Mappings and Confidence Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Mappings */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Most Popular Mappings
          </h3>
          {popularLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="space-y-3">
              {popularMappings?.data?.slice(0, 5).map((mapping, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {mapping.source_code}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      → {mapping.target_system}
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                    {mapping.usage_count} uses
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Confidence Distribution */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Mapping Confidence Distribution
          </h3>
          {confidenceLoading ? (
            <LoadingSpinner />
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={confidenceData?.data || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="confidence_range" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#f9fafb'
                  }}
                />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>
      </div>

      {/* Performance Insights */}
      <motion.div
        className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Performance Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <div className="font-medium text-green-600 dark:text-green-400 mb-1">
              High Accuracy
            </div>
            <div className="text-gray-600 dark:text-gray-300">
              87% of mappings have confidence scores above 0.8
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <div className="font-medium text-blue-600 dark:text-blue-400 mb-1">
              Fast Response
            </div>
            <div className="text-gray-600 dark:text-gray-300">
              Average API response time under 250ms
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <div className="font-medium text-purple-600 dark:text-purple-400 mb-1">
              Growing Usage
            </div>
            <div className="text-gray-600 dark:text-gray-300">
              42% increase in monthly active users
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Analytics;