// API Configuration for different environments
const API_CONFIG = {
  // Development
  development: {
    baseURL: 'http://localhost:5000/api'
  },
  // Production (Vercel) - Use environment variable if available
  production: {
    baseURL: process.env.VITE_API_URL || process.env.REACT_APP_API_URL || process.env.NEXT_PUBLIC_API_URL || 'https://farmer-medicine-shop-backend.vercel.app/api'
  }
};

// Detect environment
const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
const environment = isProduction ? 'production' : 'development';

// Export the correct API base URL
const API_BASE_URL = API_CONFIG[environment].baseURL;

// API endpoints
const API_ENDPOINTS = {
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    signup: `${API_BASE_URL}/auth/signup`,
    reset: `${API_BASE_URL}/auth/reset`
  },
  products: {
    getAll: `${API_BASE_URL}/products`
  },
  orders: {
    place: `${API_BASE_URL}/orders/place`,
    getMyOrders: (email) => `${API_BASE_URL}/orders/my-orders/${email}`
  }
};

// Make it globally available
window.API_ENDPOINTS = API_ENDPOINTS;
window.API_BASE_URL = API_BASE_URL;
