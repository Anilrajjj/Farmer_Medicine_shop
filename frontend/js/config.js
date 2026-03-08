// Simple client-side config (no process.env in browser)
(async () => {
  const isLiveSite = !/^(localhost|127\.0\.0\.1)$/i.test(window.location.hostname);
  const sanitizeApiBase = (apiBase) => {
    const candidate = (apiBase || '').trim();
    if (!candidate) return '/api';
    if (isLiveSite && /localhost|127\.0\.0\.1/i.test(candidate)) return '/api';
    return candidate;
  };

  try {
    const res = await fetch('/api/config');
    const configData = await res.json();
    const API_BASE_URL = sanitizeApiBase(configData.API_BASE_URL || '/api');

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
    if (!window.APP_CONFIG) {
      window.APP_CONFIG = { API_BASE_URL };
    }

    window.dispatchEvent(new Event('configReady'));
  } catch (error) {
    console.error("Could not load API_BASE_URL from backend config, falling back to static config.");
    const API_BASE_URL = sanitizeApiBase('/api');
    if (!window.API_BASE_URL) window.API_BASE_URL = API_BASE_URL;
    if (!window.APP_CONFIG) window.APP_CONFIG = { API_BASE_URL };
  }
})();
