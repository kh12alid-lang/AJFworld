import { useState, useEffect } from 'react';
import { Search, Mail, Phone, ShoppingBag, Calendar, UserX, Star, Heart, Gift, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/context/LanguageContext';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  orders: number;
  totalSpent: number;
  joinedDate: string;
  status: 'active' | 'inactive';
  address?: string;
  loyaltyPoints?: number;
  reviews?: number;
  favorites?: number;
}

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null);
  const { language, isRTL } = useLanguage();

  useEffect(() => {
    const savedUsers = localStorage.getItem('ajfworld_users');
    const savedOrders = localStorage.getItem('ajfworld_orders');
    const savedReviews = localStorage.getItem('ajfworld_reviews');
    const savedFavorites = localStorage.getItem('ajfworld_favorites');
    const savedLoyalty = localStorage.getItem('ajfworld_loyalty');
    
    if (savedUsers) {
      try {
        const usersData = JSON.parse(savedUsers);
        const ordersData = savedOrders ? JSON.parse(savedOrders) : [];
        const reviewsData = savedReviews ? JSON.parse(savedReviews) : [];
        const favoritesData = savedFavorites ? JSON.parse(savedFavorites) : {};
        const loyaltyData = savedLoyalty ? JSON.parse(savedLoyalty) : {};
        
        const registeredCustomers: Customer[] = Object.values(usersData).map((user: any) => {
          const userOrders = ordersData.filter((o: any) => o.userId === user.id || o.email === user.email);
          const totalSpent = userOrders.reduce((sum: number, o: any) => sum + (o.total || 0), 0);
          const userReviews = reviewsData.filter((r: any) => r.userId === user.id || r.email === user.email);
          const userFavorites = favoritesData[user.id]?.length || 0;
          
          return {
            id: user.id || Date.now(),
            name: user.name || user.fullName || (language === 'ar' ? 'مستخدم' : 'User'),
            email: user.email || '',
            phone: user.phone || '',
            orders: userOrders.length,
            totalSpent,
            joinedDate: user.createdAt || user.joinedDate || new Date().toISOString().split('T')[0],
            status: 'active',
            address: user.address || '',
            loyaltyPoints: loyaltyData[user.id]?.points || 0,
            reviews: userReviews.length,
            favorites: userFavorites,
          };
        });
        
        setCustomers(registeredCustomers);
      } catch (e) {
        console.error('Failed to parse users', e);
        setCustomers([]);
      }
    }
  }, [language]);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone.includes(searchQuery)
  );

  const curr = language === 'ar' ? 'د.إ' : 'AED';

  const t = {
    ar: {
      title: 'إدارة العملاء',
      searchPlaceholder: 'البحث بالاسم أو البريد أو الهاتف...',
      totalCustomers: 'إجمالي العملاء',
      activeCustomers: 'العملاء النشطين',
      totalOrders: 'إجمالي الطلبات',
      name: 'الاسم',
      email: 'البريد الإلكتروني',
      phone: 'الهاتف',
      orders: 'الطلبات',
      totalSpent: 'إجمالي الإنفاق',
      joinedDate: 'تاريخ الانضمام',
      address: 'العنوان',
      noCustomers: 'لا يوجد عملاء مسجلين بعد',
      registerPrompt: 'سيتم عرض العملاء الذين يسجلون في الموقع هنا',
      loyaltyPoints: 'نقاط الولاء',
      reviews: 'التقييمات',
      favorites: 'المفضلة',
      viewDetails: 'عرض التفاصيل',
      customerDetails: 'تفاصيل العميل',
      orderHistory: 'سجل الطلبات',
      noOrders: 'لا توجد طلبات',
    },
    en: {
      title: 'Customers Management',
      searchPlaceholder: 'Search by name, email or phone...',
      totalCustomers: 'Total Customers',
      activeCustomers: 'Active Customers',
      totalOrders: 'Total Orders',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      orders: 'Orders',
      totalSpent: 'Total Spent',
      joinedDate: 'Joined Date',
      address: 'Address',
      noCustomers: 'No registered customers yet',
      registerPrompt: 'Customers who register on the site will appear here',
      loyaltyPoints: 'Loyalty Points',
      reviews: 'Reviews',
      favorites: 'Favorites',
      viewDetails: 'View Details',
      customerDetails: 'Customer Details',
      orderHistory: 'Order History',
      noOrders: 'No orders',
    }
  }[language];

  const totalOrders = customers.reduce((sum, c) => sum + c.orders, 0);

  return (
    <div className="p-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#2d5d2a]/10 rounded-lg flex items-center justify-center">
              <UserX className="w-5 h-5 text-[#2d5d2a]" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{t.totalCustomers}</p>
              <p className="text-2xl font-bold">{customers.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <UserX className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{t.activeCustomers}</p>
              <p className="text-2xl font-bold">{customers.filter(c => c.status === 'active').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{t.totalOrders}</p>
              <p className="text-2xl font-bold">{totalOrders}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <Gift className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{language === 'ar' ? 'نقاط الولاء' : 'Loyalty'}</p>
              <p className="text-2xl font-bold">{customers.reduce((sum, c) => sum + (c.loyaltyPoints || 0), 0)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400`} />
        <Input
          type="text"
          placeholder={t.searchPlaceholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} h-11`}
        />
      </div>

      {/* Customers Grid */}
      {filteredCustomers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.map((customer) => {
            const isExpanded = selectedCustomer === customer.id;
            return (
              <div key={customer.id} className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#2d5d2a] rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {customer.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{customer.name}</h3>
                        <Badge className={customer.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                          {language === 'ar' 
                            ? (customer.status === 'active' ? 'نشط' : 'غير نشط')
                            : customer.status
                          }
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span>{customer.email || '-'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{customer.phone || '-'}</span>
                    </div>
                    {customer.address && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <ShoppingBag className="w-4 h-4" />
                        <span>{customer.address}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{t.joinedDate}: {customer.joinedDate}</span>
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-3 mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <Gift className="w-4 h-4 text-purple-500 mx-auto mb-1" />
                      <p className="text-xs text-gray-500">{t.loyaltyPoints}</p>
                      <p className="font-bold">{customer.loyaltyPoints || 0}</p>
                    </div>
                    <div className="text-center">
                      <Star className="w-4 h-4 text-yellow-500 mx-auto mb-1" />
                      <p className="text-xs text-gray-500">{t.reviews}</p>
                      <p className="font-bold">{customer.reviews || 0}</p>
                    </div>
                    <div className="text-center">
                      <Heart className="w-4 h-4 text-red-500 mx-auto mb-1" />
                      <p className="text-xs text-gray-500">{t.favorites}</p>
                      <p className="font-bold">{customer.favorites || 0}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{customer.orders} {language === 'ar' ? 'طلب' : 'orders'}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-gray-500">{language === 'ar' ? 'إجمالي:' : 'Total:'}</span>
                      <span className="font-bold text-[#2d5d2a] ml-1">{customer.totalSpent} {curr}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedCustomer(isExpanded ? null : customer.id)}
                    className="w-full mt-4 flex items-center justify-center gap-2 p-2 text-[#2d5d2a] hover:bg-[#2d5d2a]/5 rounded-lg transition-colors text-sm font-medium"
                  >
                    {t.viewDetails}
                    <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-6 pb-6 border-t border-gray-100 pt-4">
                    <h4 className="font-bold text-gray-900 mb-3">{t.customerDetails}</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-600">{t.loyaltyPoints}</span>
                        <span className="font-bold text-purple-600">{customer.loyaltyPoints || 0} {language === 'ar' ? 'نقطة' : 'pts'}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-600">{t.reviews}</span>
                        <span className="font-bold text-yellow-600">{customer.reviews || 0}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-600">{t.favorites}</span>
                        <span className="font-bold text-red-600">{customer.favorites || 0}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
          <UserX className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-2">{t.noCustomers}</p>
          <p className="text-gray-400 text-sm">{t.registerPrompt}</p>
        </div>
      )}
    </div>
  );
}
