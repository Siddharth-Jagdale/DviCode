import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, color, description, icon: Icon }) => {
  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        text: 'text-blue-600 dark:text-blue-400',
        accent: 'text-blue-800 dark:text-blue-200'
      },
      purple: {
        bg: 'bg-purple-50 dark:bg-purple-900/20',
        text: 'text-purple-600 dark:text-purple-400',
        accent: 'text-purple-800 dark:text-purple-200'
      },
      green: {
        bg: 'bg-green-50 dark:bg-green-900/20',
        text: 'text-green-600 dark:text-green-400',
        accent: 'text-green-800 dark:text-green-200'
      },
      orange: {
        bg: 'bg-orange-50 dark:bg-orange-900/20',
        text: 'text-orange-600 dark:text-orange-400',
        accent: 'text-orange-800 dark:text-orange-200'
      }
    };
    return colors[color] || colors.blue;
  };

  const colorClasses = getColorClasses(color);

  return (
    <motion.div
      className={`${colorClasses.bg} rounded-xl p-6 border border-gray-200 dark:border-gray-700`}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${colorClasses.text}`}>
            {title}
          </p>
          <p className={`text-2xl font-bold ${colorClasses.accent} mt-1`}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {description && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {description}
            </p>
          )}
        </div>
        {Icon && (
          <Icon className={`w-8 h-8 ${colorClasses.text}`} />
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;