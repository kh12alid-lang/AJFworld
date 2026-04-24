import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Package, 
  Heart, 
  MapPin, 
  LogOut, 
  ChevronRight,
  Edit2,
  Trash2,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUser } from '@/context/UserContext';
import { useLanguage } from '@/context/LanguageContext';
import { currency, currencyEn } from '@/data/products';
import Header from '@/components/store/Header';
import Footer from '@/components/store/Footer';

const emiratesMap: Record<string, { ar: string; en: string }> = {
  dubai: { ar: 'دبي', en: 'Dubai' },
  'abu-dhabi': { ar: 'أبوظبي', en: 'Abu Dhabi' },
  sharjah: { ar: 'الشارقة', en: 'Sharjah' },
  ajman: { ar: 'عجمان', en: 'Ajman' },
  'ras-al-khaimah': { ar: 'رأس الخيمة', en: 'Ras Al Khaimah' },
  fujairah: { ar: 'الفجيرة', en: 'Fujairah' },
  'umm-al-quwain': { ar: 'أم القيوين', en: 'Umm Al Quwain' },
};

const statusMap: Record<string, { ar: string; en: string; color: string }> = {
  pending: { ar: 'معلق', en: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
  processing: { ar: 'قيد المعالجة', en: 'Processing', color: 'bg-blue-100 text-blue-700' },
  shipped: { ar: 'تم الشحن', en: 'Shipped', color: 'bg-purple-100 text-purple-700' },
  delivered: { ar: 'تم التوصيل', en: 'Delivered', color: 'bg-green-100 text-green-700' },
  cancelled: { ar: 'ملغي', en: 'Cancelled', color: 'bg-red-100 text-red-700' },
};

export default function Account() {
  const navigate = useNavigate();
  const { user, logout, isLoggedIn, deleteAddress } = useUser();
  const { language, isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'wishlist'>('orders');

  // Redirect if not logged in
  if (!isLoggedIn) {
    navigate('/auth');
    return null;
  }

  const curr = language === 'ar' ? currency : currencyEn;

  const tabs = [
    { id: 'orders', icon: Package, labelAr: 'طلباتي', labelEn: 'My Orders' },
    { id: 'addresses', icon: MapPin, labelAr: 'عناويني', labelEn: 'My Addresses' },
    { id: 'wishlist', icon: Heart, labelAr: 'المفضلة', labelEn: 'Wishlist' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <Header />
      
      <main className="pt-20 pb-12">
        <div className="container-custom">
          {/* Profile Header */}
          <div className="bg-gradient-to-br from-[#2d5d2a] to-[#1e401c] rounded-2xl p-8 mb-8 text-white">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <img 
                src={user?.avatar} 
                alt={user?.name}
                className="w-24 h-24 rounded-full border-4 border-white/20"
              />
              <div className="text-center md:text-left flex-1">
                <h1 className="text-2xl font-bold mb-1">{user?.name}</h1>
                <p className="text-white/80">{user?.email}</p>
                <p className="text-white/60 text-sm mt-1">{user?.phone}</p>
              </div>
              <Button
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
                onClick={handleLogout}
              >
                <LogOut className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {language === 'ar' ? 'تسجيل الخروج' : 'Logout'}
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as typeof activeTab)}
                      className={`w-full flex items-center gap-3 px-6 py-4 text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-[#2d5d2a] text-white'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="flex-1">{language === 'ar' ? tab.labelAr : tab.labelEn}</span>
                      <ChevronRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">
                    {language === 'ar' ? 'طلباتي' : 'My Orders'}
                  </h2>
                  
                  {user?.orders.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">
                        {language === 'ar' ? 'لا توجد طلبات بعد' : 'No orders yet'}
                      </p>
                      <Link 
                        to="/"
                        className="text-[#2d5d2a] hover:underline mt-2 inline-block"
                      >
                        {language === 'ar' ? 'تسوق الآن' : 'Start Shopping'}
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {user?.orders.map((order) => {
                        const status = statusMap[order.status];
                        return (
                          <div key={order.id} className="border border-gray-100 rounded-xl p-6">
                            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                              <div>
                                <p className="text-sm text-gray-500">
                                  {language === 'ar' ? 'رقم الطلب:' : 'Order:'} {order.id}
                                </p>
                                <p className="text-sm text-gray-400">{order.createdAt}</p>
                              </div>
                              <Badge className={status.color}>
                                {language === 'ar' ? status.ar : status.en}
                              </Badge>
                            </div>
                            
                            <div className="space-y-3 mb-4">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-4">
                                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                                    <Package className="w-6 h-6 text-gray-400" />
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-medium text-gray-900">
                                      {language === 'ar' ? item.name : item.nameEn}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      {item.quantity} x {item.price} {curr}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                            
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                              <div>
                                <p className="text-sm text-gray-500">
                                  {language === 'ar' ? 'الإجمالي:' : 'Total:'}
                                </p>
                                <p className="text-xl font-bold text-[#2d5d2a]">
                                  {order.total + order.shipping} {curr}
                                </p>
                              </div>
                              <Button variant="outline" size="sm">
                                {language === 'ar' ? 'تفاصيل الطلب' : 'Order Details'}
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Addresses Tab */}
              {activeTab === 'addresses' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">
                      {language === 'ar' ? 'عناويني' : 'My Addresses'}
                    </h2>
                    <Button size="sm" className="bg-[#2d5d2a] hover:bg-[#1e401c]">
                      <Plus className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      {language === 'ar' ? 'إضافة عنوان' : 'Add Address'}
                    </Button>
                  </div>
                  
                  {user?.addresses.length === 0 ? (
                    <div className="text-center py-12">
                      <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">
                        {language === 'ar' ? 'لا توجد عناوين مسجلة' : 'No saved addresses'}
                      </p>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                      {user?.addresses.map((addr) => (
                        <div 
                          key={addr.id} 
                          className={`border-2 rounded-xl p-5 ${
                            addr.isDefault ? 'border-[#2d5d2a] bg-[#2d5d2a]/5' : 'border-gray-100'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-5 h-5 text-[#2d5d2a]" />
                              <span className="font-medium text-gray-900">{addr.fullName}</span>
                            </div>
                            {addr.isDefault && (
                              <Badge className="bg-[#2d5d2a] text-white">
                                {language === 'ar' ? 'افتراضي' : 'Default'}
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm mb-1">{addr.phone}</p>
                          <p className="text-gray-600 text-sm mb-3">
                            {addr.street}, {addr.building && `${addr.building}, `}
                            {addr.apartment && `${language === 'ar' ? 'شقة' : 'Apt'} ${addr.apartment}, `}
                            {addr.city}, {emiratesMap[addr.emirate]?.[language === 'ar' ? 'ar' : 'en']}
                          </p>
                          <div className="flex gap-2">
                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            {!addr.isDefault && (
                              <button 
                                onClick={() => deleteAddress(addr.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Wishlist Tab */}
              {activeTab === 'wishlist' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">
                    {language === 'ar' ? 'المفضلة' : 'Wishlist'}
                  </h2>
                  
                  {user?.wishlist.length === 0 ? (
                    <div className="text-center py-12">
                      <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">
                        {language === 'ar' ? 'لا توجد منتجات في المفضلة' : 'No items in wishlist'}
                      </p>
                      <Link 
                        to="/"
                        className="text-[#2d5d2a] hover:underline mt-2 inline-block"
                      >
                        {language === 'ar' ? 'تصفح المنتجات' : 'Browse Products'}
                      </Link>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                      {user?.wishlist.map((productId) => (
                        <div key={productId} className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl">
                          <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Package className="w-8 h-8 text-gray-400" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              {language === 'ar' ? 'منتج #' : 'Product #'}{productId}
                            </p>
                            <Link 
                              to={`/product/${productId}`}
                              className="text-[#2d5d2a] text-sm hover:underline"
                            >
                              {language === 'ar' ? 'عرض المنتج' : 'View Product'}
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
