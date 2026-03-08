import axios from 'axios';

// Cấu hình Base URL trở về Backend Laravel đang deploy trên Render
const api = axios.create({
  baseURL: 'https://web-ban-dt-be.onrender.com', // Thay URL thật của BE nếu cần
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 10000 // 10 giây timeout do bản Free trên Render có thể châm
});

// Interceptor cho Request (có thể gắn Token ở đây sau này)
api.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem('token');
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor cho Response (xử lý lỗi Global)
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error?.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
