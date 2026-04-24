import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, User, Heart, ShoppingCart, Menu, X, Minus, Plus, Trash2, Globe, Bell, Scale } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { useUser } from '@/context/UserContext';
import { useNotifications } from '@/context/NotificationContext';
import { useSearch } from '@/context/SearchContext';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { currency, currencyEn } from '@/data/products';

const navCategories = [
  { ar: 'الكل', en: 'All' },
  { ar: 'إلكترونيات', en: 'Electronics' },
  { ar: 'أزياء', en: 'Fashion' },
  { ar: 'المنزل والمطبخ', en: 'Home & Kitchen' },
  { ar: 'الجمال', en: 'Beauty' },
  { ar: 'الرياضة', en: 'Sports' },
  { ar: 'الأطفال', en: 'Kids' },
  { ar: 'السوبر ماركت', en: 'Supermarket' },
  { ar: 'عقارات', en: 'Real Estate', isNew: true },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  
  const { language, setLanguage, isRTL, t } = useLanguage();
  const { user, isLoggedIn } = useUser();
  const { unreadCount } = useNotifications();
  const { compareList } = useSearch();
  const {
    cartItems,
    wishlistCount,
    cartCount,
    cartTotal,
    removeFromCart,
    updateQuantity,
  } = useCart();

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchFocus = () => {
    navigate('/search');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 bg-white transition-all duration-300 ${
          isScrolled ? 'shadow-lg' : ''
        }`}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className="container-custom">
          {/* Main Header */}
          <div className="flex items-center justify-between h-16 md:h-20 gap-4">
            {/* Logo */}
            <a
              href="/"
              className="flex items-center gap-3 group"
            >
              <div className="w-10 h-10 transition-transform duration-300 group-hover:scale-110">
                <img 
                  src="/images/logo-64.png" 
                  alt="AJFworld Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-[#2d5d2a] to-[#1e401c] bg-clip-text text-transparent hidden sm:block">
                AJFworld
              </span>
            </a>

            {/* Search Bar - Desktop */}
            <div
              className={`hidden md:flex flex-1 max-w-xl mx-8 relative transition-all duration-300 ${
                isSearchFocused ? 'scale-105' : ''
              }`}
            >
              <div
                className={`relative w-full transition-all duration-300 ${
                  isSearchFocused ? 'ring-2 ring-[#2d5d2a] rounded-full' : ''
                }`}
              >
                <Search className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400`} />
                <Input
                  ref={searchInputRef}
                  type="text"
                  placeholder={t('ابحث عن منتجات...', 'Search products...')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className={`w-full ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3 h-12 bg-gray-100 border-0 rounded-full ${isRTL ? 'text-right' : 'text-left'} focus-visible:ring-0 focus-visible:ring-offset-0`}
                />
              </div>
            </div>

            {/* Icons */}
            <div className="flex items-center gap-1 md:gap-3">
              {/* Language Switcher */}
              <button
                onClick={toggleLanguage}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 hover:bg-gray-100 rounded-full transition-all duration-200"
              >
                <Globe className="w-4 h-4 text-gray-700" />
                <span className="text-sm font-medium text-gray-700">
                  {language === 'ar' ? 'EN' : 'عربي'}
                </span>
              </button>

              {/* Search Mobile */}
              <button
                onClick={handleSearchFocus}
                className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Search className="w-5 h-5 text-gray-700" />
              </button>

              {/* Account */}
              {isLoggedIn ? (
                <button 
                  onClick={() => navigate('/account')}
                  className="hidden sm:flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-full transition-all duration-200"
                >
                  <img 
                    src={user?.avatar} 
                    alt={user?.name}
                    className="w-7 h-7 rounded-full"
                  />
                  <span className="text-sm font-medium text-gray-700 hidden lg:block">
                    {language === 'ar' ? 'حسابي' : 'My Account'}
                  </span>
                </button>
              ) : (
                <button 
                  onClick={() => navigate('/auth')}
                  className="hidden sm:flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-full transition-all duration-200"
                >
                  <User className="w-5 h-5 text-gray-700" />
                  <span className="text-sm font-medium text-gray-700 hidden lg:block">
                    {language === 'ar' ? 'تسجيل الدخول' : 'Login'}
                  </span>
                </button>
              )}

              {/* Compare */}
              <button 
                onClick={() => navigate('/compare')}
                className="relative p-2 hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-110"
              >
                <Scale className="w-5 h-5 text-gray-700" />
                {compareList.length > 0 && (
                  <Badge className={`absolute -top-1 ${isRTL ? '-left-1' : '-right-1'} w-5 h-5 p-0 flex items-center justify-center bg-blue-500 text-[10px] animate-bounceIn`}>
                    {compareList.length}
                  </Badge>
                )}
              </button>

              {/* Notifications */}
              <button 
                onClick={() => navigate('/notifications')}
                className="relative p-2 hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-110"
              >
                <Bell className="w-5 h-5 text-gray-700" />
                {unreadCount > 0 && (
                  <Badge className={`absolute -top-1 ${isRTL ? '-left-1' : '-right-1'} w-5 h-5 p-0 flex items-center justify-center bg-orange-500 text-[10px] animate-bounceIn`}>
                    {unreadCount}
                  </Badge>
                )}
              </button>

              {/* Wishlist */}
              <button className="relative p-2 hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-110">
                <Heart className="w-5 h-5 text-gray-700" />
                {wishlistCount > 0 && (
                  <Badge className={`absolute -top-1 ${isRTL ? '-left-1' : '-right-1'} w-5 h-5 p-0 flex items-center justify-center bg-[#d32f2f] text-[10px] animate-bounceIn`}>
                    {wishlistCount}
                  </Badge>
                )}
              </button>

              {/* Cart */}
              <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
                <SheetTrigger asChild>
                  <button className="relative p-2 hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-110">
                    <ShoppingCart className="w-5 h-5 text-gray-700" />
                    {cartCount > 0 && (
                      <Badge className={`absolute -top-1 ${isRTL ? '-left-1' : '-right-1'} w-5 h-5 p-0 flex items-center justify-center bg-[#2d5d2a] text-[10px] animate-bounceIn`}>
                        {cartCount}
                      </Badge>
                    )}
                  </button>
                </SheetTrigger>
                <SheetContent side={isRTL ? 'left' : 'right'} className="w-full sm:max-w-md">
                  <SheetHeader>
                    <SheetTitle className={`${isRTL ? 'text-right' : 'text-left'} flex items-center gap-2`}>
                      <ShoppingCart className="w-5 h-5" />
                      {t('سلة التسوق', 'Shopping Cart')} ({cartCount})
                    </SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 flex flex-col h-[calc(100vh-180px)]">
                    {cartItems.length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                        <ShoppingCart className="w-16 h-16 text-gray-300 mb-4" />
                        <p className="text-gray-500 text-lg">{t('سلة التسوق فارغة', 'Your cart is empty')}</p>
                        <p className="text-gray-400 text-sm mt-2">{t('أضف بعض المنتجات للبدء', 'Add some products to get started')}</p>
                      </div>
                    ) : (
                      <>
                        <div className="flex-1 overflow-auto space-y-4">
                          {cartItems.map((item) => (
                            <div
                              key={item.id}
                              className="flex gap-4 p-3 bg-gray-50 rounded-lg"
                            >
                              <img
                                src={item.image}
                                alt={language === 'ar' ? item.name : item.nameEn}
                                className="w-20 h-20 object-cover rounded-lg"
                              />
                              <div className="flex-1">
                                <h4 className="font-medium text-sm line-clamp-2">{language === 'ar' ? item.name : item.nameEn}</h4>
                                <p className="text-[#2d5d2a] font-bold mt-1">
                                  {item.price} {language === 'ar' ? currency : currencyEn}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="w-6 h-6 flex items-center justify-center bg-white rounded border hover:bg-gray-100"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="w-8 text-center text-sm">{item.quantity}</span>
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="w-6 h-6 flex items-center justify-center bg-white rounded border hover:bg-gray-100"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() => removeFromCart(item.id)}
                                    className={`${isRTL ? 'mr-auto' : 'ml-auto'} p-1 text-red-500 hover:bg-red-50 rounded`}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="border-t pt-4 mt-4 space-y-4">
                          <div className="flex justify-between text-lg font-bold">
                            <span>{t('الإجمالي:', 'Total:')}</span>
                            <span className="text-[#2d5d2a]">{cartTotal.toFixed(2)} {language === 'ar' ? currency : currencyEn}</span>
                          </div>
                          <Button 
                            className="w-full bg-[#2d5d2a] hover:bg-[#1e401c] h-12 text-lg"
                            onClick={handleCheckout}
                          >
                            {t('إتمام الشراء', 'Checkout')}
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </SheetContent>
              </Sheet>

              {/* Mobile Menu */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-gray-700" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-700" />
                )}
              </button>
            </div>
          </div>

          {/* Category Navigation - Desktop */}
          <nav className="hidden md:flex items-center justify-center gap-1 py-3 border-t border-gray-100">
            {navCategories.map((category, index) => (
              <a
                key={category.ar}
                href={category.ar === 'عقارات' ? '/real-estate' : '#'}
                className={`px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#2d5d2a] rounded-lg hover:bg-gray-50 transition-all duration-200 relative group ${
                  index === 0 ? 'text-[#2d5d2a]' : ''
                }`}
              >
                <span className="flex items-center gap-1">
                  {language === 'ar' ? category.ar : category.en}
                  {(category as { ar: string; en: string; isNew?: boolean }).isNew && (
                    <span className="px-1.5 py-0.5 text-[10px] bg-red-500 text-white rounded-full">{language === 'ar' ? 'جديد' : 'New'}</span>
                  )}
                </span>
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#2d5d2a] transition-all duration-300 group-hover:w-3/4" />
              </a>
            ))}
          </nav>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t animate-fadeIn">
            <div className="container-custom py-4">
              {/* Mobile Search */}
              <div className="relative mb-4">
                <Search className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400`} />
                <Input
                  type="text"
                  placeholder={t('ابحث عن منتجات...', 'Search products...')}
                  className={`w-full ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3 bg-gray-100 border-0 rounded-full ${isRTL ? 'text-right' : 'text-left'}`}
                />
              </div>
              {/* Mobile Language Switcher */}
              <button
                onClick={toggleLanguage}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 mb-4 bg-gray-50 rounded-lg"
              >
                <Globe className="w-5 h-5 text-gray-700" />
                <span className="font-medium text-gray-700">
                  {language === 'ar' ? 'Switch to English' : 'التبديل للعربية'}
                </span>
              </button>
              
              {/* Mobile Account Link */}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  navigate(isLoggedIn ? '/account' : '/auth');
                }}
                className="w-full flex items-center gap-3 px-4 py-3 mb-4 bg-gray-50 rounded-lg"
              >
                {isLoggedIn ? (
                  <>
                    <img src={user?.avatar} alt="" className="w-6 h-6 rounded-full" />
                    <span className="font-medium text-gray-700">
                      {language === 'ar' ? 'حسابي' : 'My Account'}
                    </span>
                  </>
                ) : (
                  <>
                    <User className="w-5 h-5 text-gray-700" />
                    <span className="font-medium text-gray-700">
                      {language === 'ar' ? 'تسجيل الدخول' : 'Login'}
                    </span>
                  </>
                )}
              </button>
              
              {/* Quick Links */}
              <div className="border-t pt-4 mb-4">
                <p className="text-sm text-gray-500 mb-2 px-4">
                  {language === 'ar' ? 'روابط سريعة' : 'Quick Links'}
                </p>
                <div className="space-y-1">
                  <button
                    onClick={() => { setIsMobileMenuOpen(false); navigate('/flash-sales'); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                  >
                    <span className="w-2 h-2 bg-red-500 rounded-full" />
                    {language === 'ar' ? 'عروض فلاش' : 'Flash Sales'}
                  </button>
                  <button
                    onClick={() => { setIsMobileMenuOpen(false); navigate('/coupons'); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                  >
                    <span className="w-2 h-2 bg-green-500 rounded-full" />
                    {language === 'ar' ? 'كوبونات الخصم' : 'Coupons'}
                  </button>
                  <button
                    onClick={() => { setIsMobileMenuOpen(false); navigate('/loyalty'); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                  >
                    <span className="w-2 h-2 bg-yellow-500 rounded-full" />
                    {language === 'ar' ? 'نقاط الولاء' : 'Loyalty Points'}
                  </button>
                  <button
                    onClick={() => { setIsMobileMenuOpen(false); navigate('/track-order'); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                  >
                    <span className="w-2 h-2 bg-blue-500 rounded-full" />
                    {language === 'ar' ? 'تتبع الطلب' : 'Track Order'}
                  </button>
                </div>
              </div>

              {/* Mobile Categories */}
              <div className="space-y-2">
                <p className="text-sm text-gray-500 mb-2 px-4">
                  {language === 'ar' ? 'الفئات' : 'Categories'}
                </p>
                {navCategories.map((category) => (
                  <a
                    key={category.ar}
                    href={category.ar === 'عقارات' ? '/real-estate' : '#'}
                    className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      {language === 'ar' ? category.ar : category.en}
                      {(category as { ar: string; en: string; isNew?: boolean }).isNew && (
                        <span className="px-1.5 py-0.5 text-[10px] bg-red-500 text-white rounded-full">{language === 'ar' ? 'جديد' : 'New'}</span>
                      )}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
