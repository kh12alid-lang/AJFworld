// API Client for AJFworld
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

function getToken() {
  return localStorage.getItem('ajfworld_token');
}

async function api(endpoint: string, options: RequestInit = {}) {
  const url = `${API_URL}${endpoint}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || `API Error: ${response.status}`);
  }

  return response.json();
}

export const apiAuth = {
  register: (data: { name: string; email: string; phone?: string; password: string }) =>
    api('/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  login: (data: { email: string; password: string }) =>
    api('/auth/login', { method: 'POST', body: JSON.stringify(data) }),

  me: () => api('/auth/me'),
};

export const apiProducts = {
  getAll: (params?: { category?: string; search?: string; page?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.append('category', params.category);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.page) queryParams.append('page', params.page.toString());
    return api(`/products?${queryParams.toString()}`);
  },

  getById: (id: number) => api(`/products/${id}`),
};

export const apiCategories = {
  getAll: () => api('/categories'),
};

export const apiCart = {
  get: () => api('/cart'),
  add: (product_id: number, quantity: number = 1) =>
    api('/cart', { method: 'POST', body: JSON.stringify({ product_id, quantity }) }),
  update: (id: number, quantity: number) =>
    api(`/cart/${id}`, { method: 'PUT', body: JSON.stringify({ quantity }) }),
  remove: (id: number) => api(`/cart/${id}`, { method: 'DELETE' }),
};

export const apiOrders = {
  getAll: () => api('/orders'),
  create: (data: any) => api('/orders', { method: 'POST', body: JSON.stringify(data) }),
  getById: (id: number) => api(`/orders/${id}`),
};

export const apiTracking = {
  getByNumber: (orderNumber: string) => api(`/tracking/${orderNumber}`),
};

export const apiAddresses = {
  getAll: () => api('/addresses'),
  add: (data: any) => api('/addresses', { method: 'POST', body: JSON.stringify(data) }),
};

export const apiWishlist = {
  get: () => api('/wishlist'),
  add: (product_id: number) => api('/wishlist', { method: 'POST', body: JSON.stringify({ product_id }) }),
  remove: (productId: number) => api(`/wishlist/${productId}`, { method: 'DELETE' }),
};

export default api;
