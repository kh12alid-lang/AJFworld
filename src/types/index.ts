// ==================== USER TYPES ====================

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role: 'customer' | 'admin' | 'owner' | 'employee';
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  preferences?: {
    language: 'ar' | 'en';
    currency: string;
    notifications: boolean;
  };
  loyaltyPoints?: number;
}

export interface UserAddress {
  id: string;
  userId: string;
  type: 'home' | 'work' | 'other';
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  isDefault: boolean;
  createdAt: string;
}

// ==================== PRODUCT TYPES ====================

export interface Product {
  id: string;
  name: string;
  nameEn?: string;
  slug: string;
  description: string;
  descriptionEn?: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  images: string[];
  category: string;
  categoryId: string;
  subcategory?: string;
  brand?: string;
  sku: string;
  barcode?: string;
  stock: number;
  minOrderQuantity?: number;
  maxOrderQuantity?: number;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  attributes?: ProductAttribute[];
  variants?: ProductVariant[];
  rating: number;
  reviewCount: number;
  isActive: boolean;
  isFeatured: boolean;
  isNew: boolean;
  isBestSeller: boolean;
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductAttribute {
  name: string;
  nameEn?: string;
  value: string;
  valueEn?: string;
}

export interface ProductVariant {
  id: string;
  sku: string;
  price: number;
  oldPrice?: number;
  stock: number;
  attributes: {
    color?: string;
    size?: string;
    [key: string]: string | undefined;
  };
  image?: string;
}

export interface Category {
  id: string;
  name: string;
  nameEn?: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  parentId?: string;
  children?: Category[];
  productCount: number;
  isActive: boolean;
  sortOrder: number;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
}

// ==================== CART TYPES ====================

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  variant?: {
    color?: string;
    size?: string;
    [key: string]: string | undefined;
  };
  price: number;
  total: number;
}

export interface Cart {
  id: string;
  userId?: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  couponDiscount?: number;
  shipping: number;
  tax: number;
  total: number;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
}

// ==================== ORDER TYPES ====================

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'returned'
  | 'refunded';

export type PaymentStatus = 
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded'
  | 'partially_refunded';

export type PaymentMethod = 
  | 'credit_card'
  | 'debit_card'
  | 'cash_on_delivery'
  | 'apple_pay'
  | 'google_pay'
  | 'paypal'
  | 'tabby'
  | 'tamara';

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  user?: User;
  guestInfo?: {
    name: string;
    email: string;
    phone: string;
  };
  items: OrderItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  couponDiscount?: number;
  shipping: number;
  shippingMethod: string;
  tax: number;
  total: number;
  currency: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  paymentTransactionId?: string;
  shippingAddress: OrderAddress;
  billingAddress: OrderAddress;
  notes?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  estimatedDeliveryDate?: string;
  deliveredAt?: string;
  invoiceUrl?: string;
  returns?: OrderReturn[];
  timeline?: OrderTimelineEvent[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  variant?: {
    color?: string;
    size?: string;
    [key: string]: string | undefined;
  };
  price: number;
  total: number;
}

export interface OrderAddress {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export interface OrderReturn {
  id: string;
  orderId: string;
  items: string[];
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  refundAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderTimelineEvent {
  id: string;
  status: string;
  description: string;
  location?: string;
  timestamp: string;
  completed: boolean;
}

// ==================== REVIEW TYPES ====================

export interface Review {
  id: string;
  productId: string;
  userId: string;
  user: User;
  rating: number;
  title?: string;
  comment: string;
  images?: string[];
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  isActive: boolean;
  reply?: ReviewReply;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewReply {
  id: string;
  reviewId: string;
  userId: string;
  comment: string;
  createdAt: string;
}

// ==================== COUPON TYPES ====================

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  usageCount: number;
  userLimit?: number;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  applicableCategories?: string[];
  applicableProducts?: string[];
  excludedProducts?: string[];
  createdAt: string;
  updatedAt: string;
}

// ==================== NOTIFICATION TYPES ====================

export type NotificationType = 
  | 'order'
  | 'promotion'
  | 'system'
  | 'review'
  | 'wishlist'
  | 'loyalty';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  image?: string;
  actionUrl?: string;
  actionText?: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

// ==================== WISHLIST TYPES ====================

export interface Wishlist {
  id: string;
  userId: string;
  items: WishlistItem[];
  createdAt: string;
  updatedAt: string;
}

export interface WishlistItem {
  id: string;
  productId: string;
  product: Product;
  addedAt: string;
}

// ==================== LOYALTY TYPES ====================

export interface LoyaltyTransaction {
  id: string;
  userId: string;
  type: 'earned' | 'redeemed' | 'expired' | 'bonus';
  points: number;
  description: string;
  orderId?: string;
  createdAt: string;
}

export interface LoyaltyReward {
  id: string;
  name: string;
  description: string;
  pointsRequired: number;
  discountValue: number;
  discountType: 'percentage' | 'fixed';
  isActive: boolean;
  image?: string;
}

// ==================== EMPLOYEE TYPES ====================

export type EmployeeRole = 'owner' | 'manager' | 'employee';

export interface Employee {
  id: string;
  userId: string;
  user: User;
  role: EmployeeRole;
  department?: string;
  permissions: EmployeePermission[];
  isActive: boolean;
  joinedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeePermission {
  module: string;
  actions: ('view' | 'create' | 'edit' | 'delete')[];
}

// ==================== ANALYTICS TYPES ====================

export interface SalesAnalytics {
  period: string;
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  totalProducts: number;
  newCustomers: number;
  returningCustomers: number;
  revenueChange: number;
  ordersChange: number;
}

export interface ProductAnalytics {
  productId: string;
  productName: string;
  totalSales: number;
  totalRevenue: number;
  views: number;
  conversionRate: number;
  stockLevel: number;
}

export interface CustomerAnalytics {
  totalCustomers: number;
  newCustomers: number;
  activeCustomers: number;
  averageLifetimeValue: number;
  retentionRate: number;
}

// ==================== SETTINGS TYPES ====================

export interface AppSettings {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  storeAddress: string;
  currency: string;
  language: string;
  timezone: string;
  maintenanceMode: boolean;
  allowGuestCheckout: boolean;
  minOrderAmount: number;
  freeShippingThreshold?: number;
  taxRate: number;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
    whatsapp?: string;
  };
}

export interface ShippingMethod {
  id: string;
  name: string;
  nameEn?: string;
  description?: string;
  price: number;
  freeThreshold?: number;
  estimatedDays: string;
  isActive: boolean;
}

export interface PaymentMethodConfig {
  id: string;
  name: string;
  code: string;
  description?: string;
  isActive: boolean;
  config?: Record<string, unknown>;
}

// ==================== TRACKING TYPES ====================

export interface TrackingInfo {
  orderId: string;
  status: OrderStatus;
  currentLocation?: {
    lat: number;
    lng: number;
    address: string;
    timestamp: string;
  };
  driver?: {
    name: string;
    phone: string;
    photo?: string;
    vehicleType?: string;
    vehicleNumber?: string;
  };
  estimatedDelivery?: string;
  timeline: TrackingTimelineEvent[];
}

export interface TrackingTimelineEvent {
  status: string;
  description: string;
  location?: string;
  timestamp: string;
  completed: boolean;
}

// ==================== API RESPONSE TYPES ====================

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

// ==================== SEARCH TYPES ====================

export interface SearchFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  inStock?: boolean;
  brand?: string[];
  attributes?: Record<string, string[]>;
}

export interface SearchResult {
  products: Product[];
  categories: Category[];
  filters: SearchFilters;
  total: number;
  suggestions: string[];
}

// ==================== FLASH SALE TYPES ====================

export interface FlashSale {
  id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  products: FlashSaleProduct[];
  createdAt: string;
  updatedAt: string;
}

export interface FlashSaleProduct {
  productId: string;
  product: Product;
  salePrice: number;
  originalPrice: number;
  discount: number;
  stock: number;
  soldCount: number;
}

// ==================== BANNER TYPES ====================

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  mobileImage?: string;
  link?: string;
  buttonText?: string;
  position: 'home_hero' | 'home_middle' | 'home_bottom' | 'category' | 'product';
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

// ==================== PAGE TYPES ====================

export interface Page {
  id: string;
  slug: string;
  title: string;
  titleEn?: string;
  content: string;
  contentEn?: string;
  metaTitle?: string;
  metaDescription?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ==================== CONTACT TYPES ====================

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  isRead: boolean;
  repliedAt?: string;
  reply?: string;
  createdAt: string;
}

// ==================== NEWSLETTER TYPES ====================

export interface NewsletterSubscriber {
  id: string;
  email: string;
  name?: string;
  isActive: boolean;
  subscribedAt: string;
  unsubscribedAt?: string;
}

// ==================== COMPARE TYPES ====================

export interface CompareItem {
  productId: string;
  product: Product;
  addedAt: string;
}

export interface CompareList {
  id: string;
  userId?: string;
  items: CompareItem[];
  maxItems: number;
  createdAt: string;
  updatedAt: string;
}
