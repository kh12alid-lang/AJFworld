import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  UserCog,
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  X,
  ChevronRight,
  Ticket,
  Star,
  Truck,
  ClipboardList,
  Palette,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

interface NavItem {
  path: string;
  icon: React.ElementType;
  labelAr: string;
  labelEn: string;
  roles: ('owner' | 'manager' | 'employee')[];
}

const navItems: NavItem[] = [
  { path: '/admin/dashboard', icon: LayoutDashboard, labelAr: 'الرئيسية', labelEn: 'Dashboard', roles: ['owner', 'manager', 'employee'] },
  { path: '/admin/products', icon: Package, labelAr: 'المنتجات', labelEn: 'Products', roles: ['owner', 'manager', 'employee'] },
  { path: '/admin/orders', icon: ShoppingCart, labelAr: 'الطلبات', labelEn: 'Orders', roles: ['owner', 'manager', 'employee'] },
  { path: '/admin/customers', icon: Users, labelAr: 'العملاء', labelEn: 'Customers', roles: ['owner', 'manager'] },
  { path: '/admin/suppliers', icon: Truck, labelAr: 'الموردين', labelEn: 'Suppliers', roles: ['owner', 'manager'] },
  { path: '/admin/inventory', icon: ClipboardList, labelAr: 'الجرد والمخزون', labelEn: 'Inventory', roles: ['owner', 'manager'] },
  { path: '/admin/reviews', icon: Star, labelAr: 'المراجعات', labelEn: 'Reviews', roles: ['owner', 'manager', 'employee'] },
  { path: '/admin/coupons', icon: Ticket, labelAr: 'الكوبونات', labelEn: 'Coupons', roles: ['owner', 'manager'] },
  { path: '/admin/analytics', icon: BarChart3, labelAr: 'التحليلات', labelEn: 'Analytics', roles: ['owner', 'manager'] },
  { path: '/admin/visitors', icon: Eye, labelAr: 'الزوار', labelEn: 'Visitors', roles: ['owner', 'manager'] },
  { path: '/admin/employees', icon: UserCog, labelAr: 'الموظفين', labelEn: 'Employees', roles: ['owner'] },
  { path: '/admin/site-customizer', icon: Palette, labelAr: 'تخصيص الموقع', labelEn: 'Site Customizer', roles: ['owner'] },
  { path: '/admin/settings', icon: Settings, labelAr: 'الإعدادات', labelEn: 'Settings', roles: ['owner'] },
];

export default function AdminSidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { language, isRTL } = useLanguage();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const filteredNavItems = navItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10">
            <img 
              src="/images/logo-64.png" 
              alt="AJFworld Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="font-bold text-lg bg-gradient-to-r from-[#2d5d2a] to-[#1e401c] bg-clip-text text-transparent">AJFworld</h1>
            <p className="text-xs text-gray-500">{language === 'ar' ? 'لوحة التحكم' : 'Admin Panel'}</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <img 
            src={user?.avatar} 
            alt={user?.name}
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm text-gray-900 truncate">{user?.name}</p>
            <p className="text-xs text-gray-500">
              {user?.role === 'owner' ? (language === 'ar' ? 'المالك' : 'Owner') :
               user?.role === 'manager' ? (language === 'ar' ? 'مدير' : 'Manager') :
               (language === 'ar' ? 'موظف' : 'Employee')}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-[#2d5d2a] text-white' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span className="flex-1">{language === 'ar' ? item.labelAr : item.labelEn}</span>
              <ChevronRight className={`w-4 h-4 opacity-0 group-hover:opacity-100 ${isRTL ? '' : 'rotate-180'}`} />
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <Button
          variant="outline"
          className="w-full justify-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          {language === 'ar' ? 'تسجيل الخروج' : 'Logout'}
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center"
      >
        {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed lg:static inset-y-0 ${isRTL ? 'right-0' : 'left-0'} z-50
          w-64 bg-white border-${isRTL ? 'l' : 'r'} border-gray-200
          flex flex-col
          transform transition-transform duration-300 lg:transform-none
          ${isMobileMenuOpen ? 'translate-x-0' : isRTL ? 'translate-x-full lg:translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
