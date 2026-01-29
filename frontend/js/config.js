// Simple client-side config (no process.env in browser)
(() => {
  const API_BASE_URL = 'http://localhost:5001/api';

  // Only set globals if they are not already defined
  if (!window.API_ENDPOINTS) {
    window.API_ENDPOINTS = {
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
  }

  if (!window.API_BASE_URL) {
    window.API_BASE_URL = API_BASE_URL;
  }
})();
