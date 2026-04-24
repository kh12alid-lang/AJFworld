import { useEffect, useState } from 'react';
import {
  ShoppingBag,
  Users,
  Package,
  TrendingUp,
  DollarSign,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Star,
  BarChart3,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { currency, currencyEn } from '@/data/products';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ElementType;
  color: string;
}

function StatCard({ title, value, change, isPositive, icon: Icon, color }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
          <div className={`flex items-center gap-1 mt-2 text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            <span>{change}</span>
          </div>
        </div>
        <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}

// Simple bar chart component
function BarChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-2 h-32">
      {data.map((val, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full rounded-t-md transition-all duration-500"
            style={{ height: `${(val / max) * 100}%`, backgroundColor: color }}
          />
          <span className="text-xs text-gray-500">{i + 1}</span>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const { language, isRTL } = useLanguage();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState({
    sales: '0',
    orders: '0',
    customers: '0',
    products: '0',
    profit: '0',
    visitors: '0',
  });
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [salesChart, setSalesChart] = useState<number[]>([]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const savedProducts = localStorage.getItem('ajfworld_products');
    const savedOrders = localStorage.getItem('ajfworld_orders');
    const savedUsers = localStorage.getItem('ajfworld_users');
    const savedVisits = localStorage.getItem('ajfworld_visitor_stats');

    const products = savedProducts ? JSON.parse(savedProducts) : [];
    const orders = savedOrders ? JSON.parse(savedOrders) : [];
    const users = savedUsers ? JSON.parse(savedUsers) : [];
    const visits = savedVisits ? JSON.parse(savedVisits) : { today: 0 };

    const totalRevenue = orders.reduce((sum: number, o: any) => sum + (o.total || 0), 0);
    const totalCost = orders.reduce((sum: number, o: any) => sum + ((o.total || 0) * 0.6), 0);
    const profit = totalRevenue - totalCost;

    // Generate chart data (last 7 days)
    const chartData = Array.from({ length: 7 }, (_, i) => {
      const dayOrders = orders.filter((o: any) => {
        const orderDate = new Date(o.created_at || o.date || Date.now());
        const daysDiff = Math.floor((Date.now() - orderDate.getTime()) / 86400000);
        return daysDiff === 6 - i;
      });
      return dayOrders.reduce((sum: number, o: any) => sum + (o.total || 0), 0);
    });

    // Top selling products
    const sortedBySold = [...products].sort((a: any, b: any) => (b.sold || 0) - (a.sold || 0)).slice(0, 5);

    setStats({
      sales: totalRevenue.toLocaleString(),
      orders: orders.length.toString(),
      customers: Object.keys(users).length.toString(),
      products: products.length.toString(),
      profit: Math.round(profit).toLocaleString(),
      visitors: visits.today?.toString() || '0',
    });
    setSalesChart(chartData);
    setTopProducts(sortedBySold);
  }, []);

  const curr = language === 'ar' ? currency : currencyEn;

  const statCards = [
    {
      title: language === 'ar' ? 'إجمالي المبيعات' : 'Total Sales',
      value: `${stats.sales} ${curr}`,
      change: '+12.5%',
      isPositive: true,
      icon: ShoppingBag,
      color: 'bg-blue-500',
    },
    {
      title: language === 'ar' ? 'الأرباح' : 'Profits',
      value: `${stats.profit} ${curr}`,
      change: '+8.2%',
      isPositive: true,
      icon: DollarSign,
      color: 'bg-emerald-500',
    },
    {
      title: language === 'ar' ? 'الطلبات' : 'Orders',
      value: stats.orders,
      change: '+8.2%',
      isPositive: true,
      icon: Package,
      color: 'bg-green-500',
    },
    {
      title: language === 'ar' ? 'العملاء' : 'Customers',
      value: stats.customers,
      change: '+15.3%',
      isPositive: true,
      icon: Users,
      color: 'bg-purple-500',
    },
    {
      title: language === 'ar' ? 'المنتجات' : 'Products',
      value: stats.products,
      change: '+5',
      isPositive: true,
      icon: TrendingUp,
      color: 'bg-orange-500',
    },
    {
      title: language === 'ar' ? 'زوار اليوم' : 'Today Visitors',
      value: stats.visitors,
      change: '+3.2%',
      isPositive: true,
      icon: Eye,
      color: 'bg-cyan-500',
    },
  ];

  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('ajfworld_orders');
    if (saved) {
      setRecentOrders(JSON.parse(saved).slice(0, 5));
    }
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': case 'delivered': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'processing': case 'confirmed': return 'bg-blue-100 text-blue-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    if (language === 'en') return status.charAt(0).toUpperCase() + status.slice(1);
    switch (status) {
      case 'completed': case 'delivered': return 'مكتمل';
      case 'pending': return 'معلق';
      case 'processing': return 'قيد المعالجة';
      case 'confirmed': return 'مؤكد';
      case 'cancelled': return 'ملغي';
      default: return status;
    }
  };

  const t = {
    ar: {
      welcome: 'مرحباً',
      todayInfo: 'هذا ما يحدث في متجرك اليوم',
      recentOrders: 'أحدث الطلبات',
      viewAll: 'عرض الكل',
      salesChart: 'رسم بياني للمبيعات (آخر 7 أيام)',
      topProducts: 'المنتجات الأكثر مبيعاً',
      orderId: 'رقم الطلب',
      customer: 'العميل',
      date: 'التاريخ',
      total: 'الإجمالي',
      status: 'الحالة',
      noOrders: 'لا توجد طلبات حالياً',
      sold: 'مباع',
      daily: 'يومي',
      monthly: 'شهري',
    },
    en: {
      welcome: 'Welcome',
      todayInfo: 'Here is what is happening in your store today',
      recentOrders: 'Recent Orders',
      viewAll: 'View All',
      salesChart: 'Sales Chart (Last 7 Days)',
      topProducts: 'Top Selling Products',
      orderId: 'Order ID',
      customer: 'Customer',
      date: 'Date',
      total: 'Total',
      status: 'Status',
      noOrders: 'No orders yet',
      sold: 'Sold',
      daily: 'Daily',
      monthly: 'Monthly',
    }
  }[language];

  return (
    <div className="p-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {t.welcome}, {user?.name || 'Owner'}!
        </h1>
        <p className="text-gray-500">
          {t.todayInfo} - {currentTime.toLocaleDateString(language === 'ar' ? 'ar-AE' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts & Top Products Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Sales Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-[#2d5d2a]" />
            <h2 className="text-lg font-bold text-gray-900">{t.salesChart}</h2>
          </div>
          <BarChart data={salesChart} color="#2d5d2a" />
          <div className="flex justify-between mt-4 text-xs text-gray-500">
            {Array.from({ length: 7 }, (_, i) => {
              const d = new Date();
              d.setDate(d.getDate() - (6 - i));
              return <span key={i}>{d.toLocaleDateString(language === 'ar' ? 'ar-AE' : 'en-US', { weekday: 'short' })}</span>;
            })}
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-yellow-500" />
            <h2 className="text-lg font-bold text-gray-900">{t.topProducts}</h2>
          </div>
          {topProducts.length > 0 ? (
            <div className="space-y-3">
              {topProducts.map((product: any, i: number) => (
                <div key={product.id} className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-[#2d5d2a] text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </span>
                  <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{language === 'ar' ? product.name : product.nameEn}</p>
                    <p className="text-xs text-gray-500">{product.sold || 0} {t.sold}</p>
                  </div>
                  <span className="font-bold text-[#2d5d2a]">{product.price} {curr}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">{language === 'ar' ? 'لا توجد بيانات مبيعات بعد' : 'No sales data yet'}</p>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">{t.recentOrders}</h2>
          <a href="#/admin/orders" className="text-[#2d5d2a] hover:underline text-sm">
            {t.viewAll}
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">{t.orderId}</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">{t.customer}</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">{t.date}</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">{t.total}</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">{t.status}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{order.order_number || order.id}</td>
                    <td className="px-6 py-4 text-gray-600">{order.guest_name || order.user_name || '-'}</td>
                    <td className="px-6 py-4 text-gray-600">{order.created_at || order.date || '-'}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{order.total} {curr}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">{t.noOrders}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
