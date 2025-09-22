import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import {
  HomeIcon,
  BeakerIcon,
  MagnifyingGlassIcon,
  ArrowPathRoundedSquareIcon,
  CodeBracketIcon,
  ChartBarIcon,
  CogIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClipboardDocumentListIcon, // New icon for Access Log
} from '@heroicons/react/24/outline';

const Sidebar = ({ isOpen, onClose, isCollapsed, onToggleCollapse }) => {
  const location = useLocation();


  const menuItems = [
  { path: '/', icon: HomeIcon, label: 'Home' },
  { path: '/demo', icon: BeakerIcon, label: 'Demo' },
  { path: '/search', icon: MagnifyingGlassIcon, label: 'Search' },
  { path: '/mapping', icon: ArrowPathRoundedSquareIcon, label: 'Mapping' },
  { path: '/fhir', icon: CodeBracketIcon, label: 'FHIR' },
  { path: '/analytics', icon: ChartBarIcon, label: 'Analytics' },
  { path: '/access-log', icon: ClipboardDocumentListIcon, label: 'Access Log' }, // <-- NEW
  { path: '/settings', icon: CogIcon, label: 'Settings' },
];
// menuItems drives the sidebar links. Add new pages here with path, icon and label.

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside 
            className={`fixed left-0 top-16 bottom-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-r border-gray-200 dark:border-gray-700 z-40 lg:z-30 shadow-xl lg:shadow-none ${
              isCollapsed ? 'w-16' : 'w-64'
            } transition-all duration-300`}
            initial={{ x: -100 }}
            animate={{ x: 0 }}
            exit={{ x: -100 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="flex flex-col h-full">
              {/* Header with collapse toggle */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                {!isCollapsed && (
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    Navigation
                  </h2>
                )}
                <div className="flex items-center space-x-2">
                  {/* Collapse toggle - hidden on mobile */}
                  <button
                    onClick={onToggleCollapse}
                    className="hidden lg:flex p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    aria-label="Toggle sidebar width"
                  >
                    {isCollapsed ? (
                      <ChevronRightIcon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    ) : (
                      <ChevronLeftIcon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    )}
                  </button>
                  
                  {/* Close button - only on mobile */}
                  <button
                    onClick={onClose}
                    className="lg:hidden p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    aria-label="Close sidebar"
                  >
                    <XMarkIcon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  </button>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-4">
                  <nav className="space-y-2">
                    {menuItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.path;
                      
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => window.innerWidth < 1024 && onClose()}
                          className={`flex items-center ${
                            isCollapsed ? 'justify-center px-3 py-3' : 'space-x-3 px-3 py-2'
                          } rounded-lg transition-colors relative group ${
                            isActive
                              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                          }`}
                          title={isCollapsed ? item.label : ''}
                        >
                          <Icon className="w-5 h-5 flex-shrink-0" />
                          {!isCollapsed && <span className="font-medium">{item.label}</span>}
                          
                          {/* Tooltip for collapsed state */}
                          {isCollapsed && (
                            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                              {item.label}
                            </div>
                          )}
                          
                          {isActive && (
                            <motion.div
                              className={`absolute ${
                                isCollapsed ? 'right-1 top-1/2 -translate-y-1/2 w-1 h-6' : 'right-2 top-1/2 -translate-y-1/2 w-2 h-2'
                              } bg-blue-600 rounded-full`}
                              layoutId="activeIndicator"
                            />
                          )}
                        </Link>
                      );
                    })}
                  </nav>

                  {/* Quick Stats - only show when not collapsed */}
                  {!isCollapsed && (
                    <motion.div 
                      className="mt-8 p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                        Quick Stats
                      </h3>
                      <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                        <div className="flex justify-between">
                          <span>NAMASTE Codes:</span>
                          <span className="font-mono">16</span>
                        </div>
                        <div className="flex justify-between">
                          <span>ICD-11 TM2:</span>
                          <span className="font-mono">7</span>
                        </div>
                        <div className="flex justify-between">
                          <span>ICD-11 Bio:</span>
                          <span className="font-mono">10</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Mappings:</span>
                          <span className="font-mono">10</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Help Section - only show when not collapsed */}
                  {!isCollapsed && (
                    <motion.div 
                      className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h3 className="text-sm font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
                        Need Help?
                      </h3>
                      <p className="text-xs text-yellow-700 dark:text-yellow-300 mb-2">
                        Check our documentation for API usage and examples.
                      </p>
                      <button className="text-xs text-yellow-600 dark:text-yellow-400 hover:underline">
                        View Docs →
                      </button>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;