/**
 * AJFworld API Service
 * RESTful API for mobile app integration
 * Base URL: https://api.ajfworld.ae/v1
 */

import type { Product, Order, User } from '@/types';

// API URL - points to live API server
const API_BASE_URL = 'https://sulphate-widen-elliptic.ngrok-free.dev/api';

// API Response Types
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Auth Types
interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: User;
  expiresIn: number;
}

// Cart Types
interface CartItem {
  productId: string;
  quantity: number;
  variant?: {
    color?: string;
    size?: string;
  };
}

// Helper function for API calls
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = localStorage.getItem('auth_token');
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-API-Version': 'v1',
    ...((options.headers as Record<string, string>) || {}),
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `API Error: ${response.status}`);
  }
  
  return response.json();
}

// ==================== AUTHENTICATION ====================

export const authAPI = {
  /**
   * Login user
   * POST /auth/login
   */
  login: (credentials: LoginCredentials) =>
    apiCall<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  /**
   * Register new user
   * POST /auth/register
   */
  register: (data: RegisterData) =>
    apiCall<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /**
   * Logout user
   * POST /auth/logout
   */
  logout: () =>
    apiCall<void>('/auth/logout', {
      method: 'POST',
    }),

  /**
   * Refresh token
   * POST /auth/refresh
   */
  refreshToken: () =>
    apiCall<AuthResponse>('/auth/refresh', {
      method: 'POST',
    }),

  /**
   * Request password reset
   * POST /auth/forgot-password
   */
  forgotPassword: (email: string) =>
    apiCall<void>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  /**
   * Reset password
   * POST /auth/reset-password
   */
  resetPassword: (token: string, password: string) =>
    apiCall<void>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    }),

  /**
   * Verify email
   * GET /auth/verify-email/:token
   */
  verifyEmail: (token: string) =>
    apiCall<void>(`/auth/verify-email/${token}`),

  /**
   * Get current user
   * GET /auth/me
   */
  getCurrentUser: () =>
    apiCall<User>('/auth/me'),

  /**
   * Update user profile
   * PUT /auth/profile
   */
  updateProfile: (data: Partial<User>) =>
    apiCall<User>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  /**
   * Change password
   * PUT /auth/change-password
   */
  changePassword: (oldPassword: string, newPassword: string) =>
    apiCall<void>('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify({ oldPassword, newPassword }),
    }),
};

// ==================== PRODUCTS ====================

export const productsAPI = {
  /**
   * Get all products
   * GET /products?page=1&limit=20&category=&search=&sort=
   */
  getProducts: (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    sort?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.category) queryParams.append('category', params.category);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.sort) queryParams.append('sort', params.sort);
    if (params?.minPrice) queryParams.append('minPrice', params.minPrice.toString());
    if (params?.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString());
    if (params?.inStock) queryParams.append('inStock', params.inStock.toString());
    
    return apiCall<Product[]>(`/products?${queryParams.toString()}`);
  },

  /**
   * Get product by ID
   * GET /products/:id
   */
  getProduct: (id: string) =>
    apiCall<Product>(`/products/${id}`),

  /**
   * Get product by slug
   * GET /products/slug/:slug
   */
  getProductBySlug: (slug: string) =>
    apiCall<Product>(`/products/slug/${slug}`),

  /**
   * Get featured products
   * GET /products/featured
   */
  getFeaturedProducts: () =>
    apiCall<Product[]>('/products/featured'),

  /**
   * Get new arrivals
   * GET /products/new-arrivals
   */
  getNewArrivals: () =>
    apiCall<Product[]>('/products/new-arrivals'),

  /**
   * Get best sellers
   * GET /products/best-sellers
   */
  getBestSellers: () =>
    apiCall<Product[]>('/products/best-sellers'),

  /**
   * Get related products
   * GET /products/:id/related
   */
  getRelatedProducts: (id: string) =>
    apiCall<Product[]>(`/products/${id}/related`),

  /**
   * Get product reviews
   * GET /products/:id/reviews
   */
  getProductReviews: (id: string) =>
    apiCall(`/products/${id}/reviews`),

  /**
   * Add product review
   * POST /products/:id/reviews
   */
  addProductReview: (id: string, data: { rating: number; comment: string }) =>
    apiCall(`/products/${id}/reviews`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /**
   * Get categories
   * GET /categories
   */
  getCategories: () =>
    apiCall('/categories'),

  /**
   * Get category by ID
   * GET /categories/:id
   */
  getCategory: (id: string) =>
    apiCall(`/categories/${id}`),
};

// ==================== CART ====================

export const cartAPI = {
  /**
   * Get cart
   * GET /cart
   */
  getCart: () =>
    apiCall('/cart'),

  /**
   * Add item to cart
   * POST /cart/items
   */
  addItem: (item: CartItem) =>
    apiCall('/cart/items', {
      method: 'POST',
      body: JSON.stringify(item),
    }),

  /**
   * Update cart item
   * PUT /cart/items/:productId
   */
  updateItem: (productId: string, quantity: number) =>
    apiCall(`/cart/items/${productId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    }),

  /**
   * Remove item from cart
   * DELETE /cart/items/:productId
   */
  removeItem: (productId: string) =>
    apiCall(`/cart/items/${productId}`, {
      method: 'DELETE',
    }),

  /**
   * Clear cart
   * DELETE /cart
   */
  clearCart: () =>
    apiCall('/cart', {
      method: 'DELETE',
    }),

  /**
   * Apply coupon
   * POST /cart/coupon
   */
  applyCoupon: (code: string) =>
    apiCall('/cart/coupon', {
      method: 'POST',
      body: JSON.stringify({ code }),
    }),

  /**
   * Remove coupon
   * DELETE /cart/coupon
   */
  removeCoupon: () =>
    apiCall('/cart/coupon', {
      method: 'DELETE',
    }),
};

// ==================== ORDERS ====================

export const ordersAPI = {
  /**
   * Get user orders
   * GET /orders
   */
  getOrders: (params?: { page?: number; limit?: number; status?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    
    return apiCall<Order[]>(`/orders?${queryParams.toString()}`);
  },

  /**
   * Get order by ID
   * GET /orders/:id
   */
  getOrder: (id: string) =>
    apiCall<Order>(`/orders/${id}`),

  /**
   * Create order
   * POST /orders
   */
  createOrder: (data: {
    items: CartItem[];
    shippingAddress: object;
    billingAddress?: object;
    paymentMethod: string;
    couponCode?: string;
    notes?: string;
  }) =>
    apiCall<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /**
   * Cancel order
   * PUT /orders/:id/cancel
   */
  cancelOrder: (id: string, reason?: string) =>
    apiCall<Order>(`/orders/${id}/cancel`, {
      method: 'PUT',
      body: JSON.stringify({ reason }),
    }),

  /**
   * Track order
   * GET /orders/:id/track
   */
  trackOrder: (id: string) =>
    apiCall(`/orders/${id}/track`),

  /**
   * Get order invoice
   * GET /orders/:id/invoice
   */
  getInvoice: (id: string) =>
    apiCall(`/orders/${id}/invoice`),

  /**
   * Request return
   * POST /orders/:id/returns
   */
  requestReturn: (id: string, data: { items: string[]; reason: string }) =>
    apiCall(`/orders/${id}/returns`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// ==================== ADDRESSES ====================

export const addressesAPI = {
  /**
   * Get user addresses
   * GET /addresses
   */
  getAddresses: () =>
    apiCall('/addresses'),

  /**
   * Add address
   * POST /addresses
   */
  addAddress: (data: {
    type: 'home' | 'work' | 'other';
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    isDefault?: boolean;
  }) =>
    apiCall('/addresses', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /**
   * Update address
   * PUT /addresses/:id
   */
  updateAddress: (id: string, data: object) =>
    apiCall(`/addresses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  /**
   * Delete address
   * DELETE /addresses/:id
   */
  deleteAddress: (id: string) =>
    apiCall(`/addresses/${id}`, {
      method: 'DELETE',
    }),

  /**
   * Set default address
   * PUT /addresses/:id/default
   */
  setDefault: (id: string) =>
    apiCall(`/addresses/${id}/default`, {
      method: 'PUT',
    }),
};

// ==================== WISHLIST ====================

export const wishlistAPI = {
  /**
   * Get wishlist
   * GET /wishlist
   */
  getWishlist: () =>
    apiCall<Product[]>('/wishlist'),

  /**
   * Add to wishlist
   * POST /wishlist
   */
  addToWishlist: (productId: string) =>
    apiCall('/wishlist', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    }),

  /**
   * Remove from wishlist
   * DELETE /wishlist/:productId
   */
  removeFromWishlist: (productId: string) =>
    apiCall(`/wishlist/${productId}`, {
      method: 'DELETE',
    }),

  /**
   * Check if in wishlist
   * GET /wishlist/check/:productId
   */
  checkWishlist: (productId: string) =>
    apiCall<{ inWishlist: boolean }>(`/wishlist/check/${productId}`),
};

// ==================== NOTIFICATIONS ====================

export const notificationsAPI = {
  /**
   * Get notifications
   * GET /notifications
   */
  getNotifications: (params?: { page?: number; limit?: number; unreadOnly?: boolean }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.unreadOnly) queryParams.append('unreadOnly', 'true');
    
    return apiCall(`/notifications?${queryParams.toString()}`);
  },

  /**
   * Mark notification as read
   * PUT /notifications/:id/read
   */
  markAsRead: (id: string) =>
    apiCall(`/notifications/${id}/read`, {
      method: 'PUT',
    }),

  /**
   * Mark all as read
   * PUT /notifications/read-all
   */
  markAllAsRead: () =>
    apiCall('/notifications/read-all', {
      method: 'PUT',
    }),

  /**
   * Delete notification
   * DELETE /notifications/:id
   */
  deleteNotification: (id: string) =>
    apiCall(`/notifications/${id}`, {
      method: 'DELETE',
    }),

  /**
   * Get unread count
   * GET /notifications/unread-count
   */
  getUnreadCount: () =>
    apiCall<{ count: number }>('/notifications/unread-count'),

  /**
   * Subscribe to push notifications
   * POST /notifications/subscribe
   */
  subscribe: (subscription: object) =>
    apiCall('/notifications/subscribe', {
      method: 'POST',
      body: JSON.stringify(subscription),
    }),

  /**
   * Unsubscribe from push notifications
   * POST /notifications/unsubscribe
   */
  unsubscribe: () =>
    apiCall('/notifications/unsubscribe', {
      method: 'POST',
    }),
};

// ==================== COUPONS ====================

export const couponsAPI = {
  /**
   * Get available coupons
   * GET /coupons
   */
  getCoupons: () =>
    apiCall('/coupons'),

  /**
   * Validate coupon
   * POST /coupons/validate
   */
  validateCoupon: (code: string, cartTotal: number) =>
    apiCall('/coupons/validate', {
      method: 'POST',
      body: JSON.stringify({ code, cartTotal }),
    }),

  /**
   * Apply coupon
   * POST /coupons/apply
   */
  applyCoupon: (code: string) =>
    apiCall('/coupons/apply', {
      method: 'POST',
      body: JSON.stringify({ code }),
    }),
};

// ==================== LOYALTY ====================

export const loyaltyAPI = {
  /**
   * Get loyalty points
   * GET /loyalty/points
   */
  getPoints: () =>
    apiCall('/loyalty/points'),

  /**
   * Get loyalty history
   * GET /loyalty/history
   */
  getHistory: () =>
    apiCall('/loyalty/history'),

  /**
   * Get available rewards
   * GET /loyalty/rewards
   */
  getRewards: () =>
    apiCall('/loyalty/rewards'),

  /**
   * Redeem reward
   * POST /loyalty/redeem
   */
  redeemReward: (rewardId: string) =>
    apiCall('/loyalty/redeem', {
      method: 'POST',
      body: JSON.stringify({ rewardId }),
    }),
};

// ==================== SEARCH ====================

export const searchAPI = {
  /**
   * Search products
   * GET /search?q=&page=&limit=
   */
  search: (query: string, params?: { page?: number; limit?: number }) => {
    const queryParams = new URLSearchParams();
    queryParams.append('q', query);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    return apiCall<Product[]>(`/search?${queryParams.toString()}`);
  },

  /**
   * Get search suggestions
   * GET /search/suggestions?q=
   */
  getSuggestions: (query: string) =>
    apiCall<string[]>(`/search/suggestions?q=${encodeURIComponent(query)}`),

  /**
   * Get popular searches
   * GET /search/popular
   */
  getPopularSearches: () =>
    apiCall<string[]>('/search/popular'),

  /**
   * Get recent searches
   * GET /search/recent
   */
  getRecentSearches: () =>
    apiCall<string[]>('/search/recent'),

  /**
   * Clear recent searches
   * DELETE /search/recent
   */
  clearRecentSearches: () =>
    apiCall('/search/recent', {
      method: 'DELETE',
    }),
};

// ==================== SETTINGS ====================

export const settingsAPI = {
  /**
   * Get app settings
   * GET /settings
   */
  getSettings: () =>
    apiCall('/settings'),

  /**
   * Get shipping methods
   * GET /settings/shipping
   */
  getShippingMethods: () =>
    apiCall('/settings/shipping'),

  /**
   * Get payment methods
   * GET /settings/payment
   */
  getPaymentMethods: () =>
    apiCall('/settings/payment'),

  /**
   * Get delivery areas
   * GET /settings/delivery-areas
   */
  getDeliveryAreas: () =>
    apiCall('/settings/delivery-areas'),
};

// ==================== CONTACT ====================

export const contactAPI = {
  /**
   * Send contact message
   * POST /contact
   */
  sendMessage: (data: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }) =>
    apiCall('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /**
   * Subscribe to newsletter
   * POST /newsletter/subscribe
   */
  subscribeNewsletter: (email: string) =>
    apiCall('/newsletter/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  /**
   * Unsubscribe from newsletter
   * POST /newsletter/unsubscribe
   */
  unsubscribeNewsletter: (email: string) =>
    apiCall('/newsletter/unsubscribe', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
};

// ==================== GPS TRACKING ====================

export const trackingAPI = {
  /**
   * Get order tracking info
   * GET /tracking/:orderId
   */
  getTracking: (orderId: string) =>
    apiCall(`/tracking/${orderId}`),

  /**
   * Get driver location
   * GET /tracking/:orderId/location
   */
  getDriverLocation: (orderId: string) =>
    apiCall(`/tracking/${orderId}/location`),

  /**
   * Subscribe to location updates (WebSocket)
   * ws://api.ajfworld.ae/ws/tracking/:orderId
   */
  subscribeToLocation: (orderId: string, onUpdate: (location: { lat: number; lng: number }) => void) => {
    const ws = new WebSocket(`wss://api.ajfworld.ae/ws/tracking/${orderId}`);
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onUpdate(data);
    };
    return ws;
  },
};

// Export all APIs
export default {
  auth: authAPI,
  products: productsAPI,
  cart: cartAPI,
  orders: ordersAPI,
  addresses: addressesAPI,
  wishlist: wishlistAPI,
  notifications: notificationsAPI,
  coupons: couponsAPI,
  loyalty: loyaltyAPI,
  search: searchAPI,
  settings: settingsAPI,
  contact: contactAPI,
  tracking: trackingAPI,
};
