/**
 * Configuration for API and Image URLs
 * Supports both local development and production (Render)
 */

/**
 * Get the base URL for backend API
 * Priority:
 * 1. Environment variable VITE_API_URL
 * 2. Auto-detect from window.location (convert frontend → backend domain)
 * 3. Fallback to localhost:8000
 */
export const getApiBaseUrl = () => {
  // 1. Check environment variable (set in .env or Render dashboard)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // 2. Auto-detect from window.location
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    const protocol = window.location.protocol; // https: or http:
    const hostname = window.location.hostname;

    // Convert frontend domain to backend domain
    // web-ban-dt-fe.onrender.com → web-ban-dt-be.onrender.com
    // web-ban-dt-frontend.onrender.com → web-ban-dt-backend.onrender.com
    if (hostname.includes('fe.onrender.com')) {
      const backendHost = hostname.replace('-fe.onrender.com', '-be.onrender.com');
      console.log(`[Config] Auto-detected backend: ${protocol}//${backendHost}`);
      return `${protocol}//${backendHost}`;
    }
    
    if (hostname.includes('frontend')) {
      const backendHost = hostname.replace('frontend', 'backend');
      console.log(`[Config] Auto-detected backend: ${protocol}//${backendHost}`);
      return `${protocol}//${backendHost}`;
    }

    // If same host (e.g., both on same domain)
    console.log(`[Config] Using same host: ${protocol}//${hostname}`);
    return `${protocol}//${hostname}`;
  }

  // 3. Fallback for local development
  console.log('[Config] Using localhost:8000');
  return 'http://localhost:8000';
};

/**
 * Get API endpoint for a resource
 * @example
 * getApiEndpoint('/products') → 'https://backend.onrender.com/api/products'
 */
export const getApiEndpoint = (path) => {
  const base = getApiBaseUrl();
  const route = path.startsWith('/') ? path : `/${path}`;
  return `${base}/api${route}`;
};

/**
 * Get static file URL (images, etc)
 * @example
 * getFileUrl('/images/products/13.jpg') → 'https://backend.onrender.com/images/products/13.jpg'
 */
export const getFileUrl = (path) => {
  const base = getApiBaseUrl();
  return `${base}${path}`;
};

/**
 * Environment info for debugging
 */
export const getEnvironmentInfo = () => ({
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  apiUrl: import.meta.env.VITE_API_URL || 'auto-detect',
  detectedBase: getApiBaseUrl(),
  hostname: typeof window !== 'undefined' ? window.location.hostname : 'N/A',
  protocol: typeof window !== 'undefined' ? window.location.protocol : 'N/A',
});

/**
 * Log environment info (useful for debugging)
 */
export const logEnvironmentInfo = () => {
  const info = getEnvironmentInfo();
  console.table(info);
};

export default {
  getApiBaseUrl,
  getApiEndpoint,
  getFileUrl,
  getEnvironmentInfo,
  logEnvironmentInfo,
};
