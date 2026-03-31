// Export all constants from single entry point
export * from './orderStatus';
export * from './userRole';

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const DEFAULT_PER_PAGE = 20;

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_INFO: 'user_info'
};

// Routes
export const APP_ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  CART: '/cart',
  LOGIN: '/login',
  USERS: '/users',
  USER_DETAIL: '/users/:id',
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_PRODUCTS_NEW: '/admin/products/new',
  ADMIN_PRODUCTS_EDIT: '/admin/products/edit/:id',
  ADMIN_CATEGORIES: '/admin/categories',
  ADMIN_CATEGORIES_NEW: '/admin/categories/new',
  ADMIN_CATEGORIES_EDIT: '/admin/categories/edit/:id',
  ADMIN_USERS: '/admin/users',
  ADMIN_USERS_NEW: '/admin/users/new',
  ADMIN_USERS_EDIT: '/admin/users/edit/:id',
  ADMIN_INVENTORY: '/admin/inventory',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_SETTINGS: '/admin/settings'
};
