// src/pages/Login.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { EyeIcon, EyeSlashIcon, UserIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import { Doctor } from 'healthicons-react';
import { ReactComponent as Logo } from '../logo.svg';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { ReactComponent as AbhaLogo } from '../abhalogo.svg';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('patient');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const categories = [
    { id: 'patient', name: 'Patient', icon: UserIcon },
    { id: 'doctor', name: 'Doctor', icon: Doctor },
    { id: 'hospitalAdmin', name: 'Hospital Admin', icon: BuildingOfficeIcon },
  ];

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    reset(); // Reset form when switching categories
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    const result = await login({ ...data, userType: selectedCategory });
    
    if (result.success) {
      navigate('/');
    }
    setIsLoading(false);
  };

  const handleAbhaLogin = () => {
    // Redirect to ABHA authentication
    window.location.href = 'https://abha.gov.in/api/oauth/authorize'; // Replace with actual ABHA OAuth URL
  };

  const getCategoryTitle = () => {
    const category = categories.find(cat => cat.id === selectedCategory);
    return category ? `${category.name} Login` : 'Login';
  };

  const renderPatientLogin = () => (
    <div className="space-y-6">
      {/* ABHA Login Button */}
      <button
        onClick={handleAbhaLogin}
        className="w-full flex items-center justify-center px-4 py-3 border-2 border-blue-200 dark:border-blue-700 rounded-lg bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group"
      >
        <div className="flex items-center space-x-3">
          {/* ABHA Logo placeholder */}
          <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
            <AbhaLogo className="w-6 h-6 text-white" />
          </div>
          <div className="text-left">
            <div className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
              Login with ABHA
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Secure authentication via Ayushman Bharat Health Account
            </div>
          </div>
        </div>
      </button>

      {/* Don't have ABHA ID */}
      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Don't have ABHA ID?{' '}
          <a
            href="https://xyz.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Create now!
          </a>
        </p>
      </div>
    </div>
  );

  const renderDoctorHospitalLogin = () => (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Email ID */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Email ID
        </label>
        <input
          {...register('email', { required: 'Email ID is required' })}
          type="text"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter your email id"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Password
        </label>
        <div className="relative">
          <input
            {...register('password', { required: 'Password is required' })}
            type={showPassword ? 'text' : 'password'}
            className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            {showPassword ? (
              <EyeSlashIcon className="w-5 h-5" />
            ) : (
              <EyeIcon className="w-5 h-5" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? <LoadingSpinner size="sm" color="white" /> : 'Sign In'}
      </button>
    </form>
  );

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-md w-full space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Logo className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome Back
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Sign in to your DviCode account
          </p>
        </div>

        {/* Category Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Select Login Type
          </h3>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <Icon className="w-6 h-6 mx-auto mb-2" />
                  <span className="text-xs font-medium">{category.name}</span>
                </button>
              );
            })}
          </div>

          {/* Login Form */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              {getCategoryTitle()}
            </h4>
            
            {/* Conditional rendering based on selected category */}
            {selectedCategory === 'patient' ? renderPatientLogin() : renderDoctorHospitalLogin()}

            {/* Register Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Create one here
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Demo Credentials - only show for doctor and hospital admin */}
        {selectedCategory !== 'patient' && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
            <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
              Demo Credentials
            </h3>
            <div className="text-xs text-yellow-700 dark:text-yellow-300 space-y-1">
              <p>Email ID: <code className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">admin@mail.com</code></p>
              <p>Password: <code className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">admin123</code></p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Login;