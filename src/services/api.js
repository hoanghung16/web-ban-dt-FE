import axios from 'axios';
import { getApiBaseUrl } from '../config/apiConfig';

const api = axios.create({
  baseURL: `${getApiBaseUrl()}/api`,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) config.headers.Authorization = "Bearer " + token;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorData = error.response?.data;
    
    // Log error for debugging
    console.error('API Error:', errorData || error.message);
    
    // Re-throw error with structured error data
    const apiError = new Error(
      errorData?.message || 
      errorData?.error || 
      error.message || 
      'Có lỗi xảy ra từ server'
    );
    
    // Preserve response data cho component access
    apiError.response = error.response;
    apiError.status = error.response?.status;
    apiError.validationErrors = errorData?.errors || errorData?.validation || null;
    
    throw apiError;
  }
);

export default api;

