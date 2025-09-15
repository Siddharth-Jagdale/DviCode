import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  verifyToken: () => api.get('/auth/verify'),
};

// Search API
export const searchAPI = {
  autocomplete: (query, system = 'all', limit = 10) => 
    api.get('/autocomplete', { params: { q: query, system, limit } }),
  
  similarity: (query, target = 'all', limit = 5) =>
    api.get('/similarity', { params: { q: query, target, limit } }),
};

// Mapping API
export const mappingAPI = {
  generateMappings: (code, system = 'NAMASTE') =>
    api.get(`/map/${code}`, { params: { system } }),
  
  getDualCoding: (code) =>
    api.get(`/dual-coding/${code}`),
  
  saveMappingFeedback: (mappingId, feedback) =>
    api.post(`/mappings/${mappingId}/feedback`, feedback),
};

// FHIR API
export const fhirAPI = {
  lookup: (system, code) =>
    api.get('/fhir/$lookup', { params: { system, code } }),
  
  translate: (sourceSystem, sourceCode, targetSystem) =>
    api.get('/fhir/$translate', { 
      params: { sourceSystem, sourceCode, targetSystem } 
    }),
  
  generateBundle: (code) =>
    api.get(`/fhir/bundle/${code}`),
  
  uploadBundle: (bundle) =>
    api.post('/fhir/upload', bundle),
};

// Analytics API
export const analyticsAPI = {
  getStats: () => api.get('/stats'),
  getPopularMappings: () => api.get('/analytics/popular-mappings'),
  getConfidenceDistribution: () => api.get('/analytics/confidence-distribution'),
  getUsageMetrics: () => api.get('/analytics/usage-metrics'),
};

// Terminology API
export const terminologyAPI = {
  getNamesteCodes: () => api.get('/namaste-codes'),
  getSystemInfo: (system) => api.get(`/systems/${system}`),
  exportData: (type) => api.get(`/export/${type}`),
};

export default api;