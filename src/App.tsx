import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from '@/context/CartContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { EmployeeProvider } from '@/context/EmployeeContext';
import { UserProvider } from '@/context/UserContext';
import { ReviewProvider } from '@/context/ReviewContext';
import { CouponProvider } from '@/context/CouponContext';
import { LoyaltyProvider } from '@/context/LoyaltyContext';
import { SearchProvider } from '@/context/SearchContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { FlashSaleProvider } from '@/context/FlashSaleContext';
import { SiteSettingsProvider } from '@/context/SiteSettingsContext';

// Global Components
import LiveChat from '@/components/store/LiveChat';
import PushNotifications from '@/components/store/PushNotifications';

// Store Pages
import Home from '@/pages/store/Home';
import About from '@/pages/store/About';
import Contact from '@/pages/store/Contact';
import FAQ from '@/pages/store/FAQ';
import Returns from '@/pages/store/Returns';
import ProductDetail from '@/pages/store/ProductDetail';
import Checkout from '@/pages/store/Checkout';
import Auth from '@/pages/store/Auth';
import Account from '@/pages/store/Account';
import Search from '@/pages/store/Search';
import Compare from '@/pages/store/Compare';
import Notifications from '@/pages/store/Notifications';
import Loyalty from '@/pages/store/Loyalty';
import FlashSales from '@/pages/store/FlashSales';
import Coupons from '@/pages/store/Coupons';
import TrackOrder from '@/pages/store/TrackOrder';
import RealEstate from '@/pages/store/RealEstate';

// Admin Pages
import Login from '@/pages/admin/Login';
import AdminLayout from '@/components/admin/AdminLayout';
import Dashboard from '@/pages/admin/Dashboard';
import Products from '@/pages/admin/Products';
import Orders from '@/pages/admin/Orders';
import Customers from '@/pages/admin/Customers';
import Analytics from '@/pages/admin/Analytics';
import Settings from '@/pages/admin/Settings';
import Employees from '@/pages/admin/Employees';
import AdminCoupons from '@/pages/admin/Coupons';
import AdminReviews from '@/pages/admin/Reviews';
import Suppliers from '@/pages/admin/Suppliers';
import Inventory from '@/pages/admin/Inventory';
import SiteCustomizer from '@/pages/admin/SiteCustomizer';
import VisitorAnalytics from '@/pages/admin/VisitorAnalytics';

// Protected Route Component
function ProtectedRoute({ children, requiredRoles }: { children: React.ReactNode; requiredRoles: ('owner' | 'manager' | 'employee')[] }) {
  const { isAuthenticated, hasPermission } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  
  if (!hasPermission(requiredRoles)) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Store Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/returns" element={<Returns />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/account" element={<Account />} />
      <Route path="/search" element={<Search />} />
      <Route path="/compare" element={<Compare />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/loyalty" element={<Loyalty />} />
      <Route path="/flash-sales" element={<FlashSales />} />
      <Route path="/coupons" element={<Coupons />} />
      <Route path="/track-order" element={<TrackOrder />} />
      <Route path="/real-estate" element={<RealEstate />} />
      
      {/* Admin Routes */}
      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={
          <ProtectedRoute requiredRoles={['owner', 'manager', 'employee']}>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="products" element={
          <ProtectedRoute requiredRoles={['owner', 'manager', 'employee']}>
            <Products />
          </ProtectedRoute>
        } />
        <Route path="orders" element={
          <ProtectedRoute requiredRoles={['owner', 'manager', 'employee']}>
            <Orders />
          </ProtectedRoute>
        } />
        <Route path="customers" element={
          <ProtectedRoute requiredRoles={['owner', 'manager']}>
            <Customers />
          </ProtectedRoute>
        } />
        <Route path="analytics" element={
          <ProtectedRoute requiredRoles={['owner', 'manager']}>
            <Analytics />
          </ProtectedRoute>
        } />
        <Route path="settings" element={
          <ProtectedRoute requiredRoles={['owner']}>
            <Settings />
          </ProtectedRoute>
        } />
        <Route path="employees" element={
          <ProtectedRoute requiredRoles={['owner']}>
            <Employees />
          </ProtectedRoute>
        } />
        <Route path="coupons" element={
          <ProtectedRoute requiredRoles={['owner', 'manager']}>
            <AdminCoupons />
          </ProtectedRoute>
        } />
        <Route path="reviews" element={
          <ProtectedRoute requiredRoles={['owner', 'manager', 'employee']}>
            <AdminReviews />
          </ProtectedRoute>
        } />
        <Route path="suppliers" element={
          <ProtectedRoute requiredRoles={['owner', 'manager']}>
            <Suppliers />
          </ProtectedRoute>
        } />
        <Route path="inventory" element={
          <ProtectedRoute requiredRoles={['owner', 'manager']}>
            <Inventory />
          </ProtectedRoute>
        } />
        <Route path="site-customizer" element={
          <ProtectedRoute requiredRoles={['owner']}>
            <SiteCustomizer />
          </ProtectedRoute>
        } />
        <Route path="visitors" element={
          <ProtectedRoute requiredRoles={['owner', 'manager']}>
            <VisitorAnalytics />
          </ProtectedRoute>
        } />
      </Route>
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <HashRouter>
      <LanguageProvider>
        <AuthProvider>
          <UserProvider>
            <CartProvider>
              <EmployeeProvider>
                <ReviewProvider>
                  <CouponProvider>
                    <LoyaltyProvider>
                      <SearchProvider>
                        <NotificationProvider>
                          <FlashSaleProvider>
                            <SiteSettingsProvider>
                              <AppRoutes />
                              <LiveChat />
                              <PushNotifications />
                            </SiteSettingsProvider>
                          </FlashSaleProvider>
                        </NotificationProvider>
                      </SearchProvider>
                    </LoyaltyProvider>
                  </CouponProvider>
                </ReviewProvider>
              </EmployeeProvider>
            </CartProvider>
          </UserProvider>
        </AuthProvider>
      </LanguageProvider>
    </HashRouter>
  );
}

export default App;
