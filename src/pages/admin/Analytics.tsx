import { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package,
  Calendar,
  Download,
  MapPin,
  Target,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Chart component (simplified)
function SimpleChart({ data, color = '#2d5d2a' }: { data: number[]; color?: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  return (
    <div className="flex items-end gap-1 h-32">
      {data.map((value, index) => {
        const height = ((value - min) / range) * 100;
        return (
          <div
            key={index}
            className="flex-1 rounded-t transition-all duration-300 hover:opacity-80"
            style={{ 
              height: `${Math.max(height, 10)}%`, 
              backgroundColor: color,
              opacity: 0.6 + (index / data.length) * 0.4
            }}
            title={`${value}`}
          />
        );
      })}
    </div>
  );
}

// Donut chart component
function DonutChart({ 
  data, 
  colors 
}: { 
  data: { label: string; value: number }[]; 
  colors: string[] 
}) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;
  
  return (
    <div className="relative w-40 h-40 mx-auto">
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        {data.map((item, index) => {
          const percentage = (item.value / total) * 100;
          const angle = (percentage / 100) * 360;
          const startAngle = currentAngle;
          currentAngle += angle;
          
          const x1 = 50 + 40 * Math.cos((Math.PI * startAngle) / 180);
          const y1 = 50 + 40 * Math.sin((Math.PI * startAngle) / 180);
          const x2 = 50 + 40 * Math.cos((Math.PI * (startAngle + angle)) / 180);
          const y2 = 50 + 40 * Math.sin((Math.PI * (startAngle + angle)) / 180);
          
          const largeArc = angle > 180 ? 1 : 0;
          
          return (
            <path
              key={index}
              d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
              fill={colors[index % colors.length]}
              className="hover:opacity-80 transition-opacity cursor-pointer"
            />
          );
        })}
        <circle cx="50" cy="50" r="25" fill="white" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold text-gray-700">{total}</span>
      </div>
    </div>
  );
}

export default function Analytics() {
  const { language, isRTL } = useLanguage();
  const curr = language === 'ar' ? 'د.إ' : 'AED';
  const [dateRange, setDateRange] = useState('7days');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Simulate data refresh
  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  // Revenue data for chart
  const revenueData = [45000, 52000, 48000, 61000, 55000, 72000, 68000];
  
  // Traffic sources
  const trafficSources = [
    { label: language === 'ar' ? 'بحث مباشر' : 'Direct', value: 45 },
    { label: language === 'ar' ? 'وسائل التواصل' : 'Social Media', value: 30 },
    { label: language === 'ar' ? 'إعلانات' : 'Ads', value: 15 },
    { label: language === 'ar' ? 'بريد إلكتروني' : 'Email', value: 10 },
  ];

  const stats = [
    { 
      title: language === 'ar' ? 'إجمالي الإيرادات' : 'Total Revenue', 
      value: `245,000 ${curr}`, 
      change: '+15.3%', 
      isPositive: true,
      icon: DollarSign,
      subtext: language === 'ar' ? 'هذا الشهر' : 'This month'
    },
    { 
      title: language === 'ar' ? 'متوسط قيمة الطلب' : 'Average Order Value', 
      value: `350 ${curr}`, 
      change: '+5.2%', 
      isPositive: true,
      icon: ShoppingCart,
      subtext: language === 'ar' ? 'لكل طلب' : 'Per order'
    },
    { 
      title: language === 'ar' ? 'العملاء الجدد' : 'New Customers', 
      value: '1,234', 
      change: '+22.1%', 
      isPositive: true,
      icon: Users,
      subtext: language === 'ar' ? 'هذا الشهر' : 'This month'
    },
    { 
      title: language === 'ar' ? 'المنتجات المباعة' : 'Products Sold', 
      value: '8,567', 
      change: '-2.4%', 
      isPositive: false,
      icon: Package,
      subtext: language === 'ar' ? 'إجمالي الوحدات' : 'Total units'
    },
  ];

  const topProducts = [
    { name: language === 'ar' ? 'آيفون 15 برو ماكس' : 'iPhone 15 Pro Max', sales: 156, revenue: 717240, growth: 23 },
    { name: language === 'ar' ? 'سماعات لاسلكية فاخرة' : 'Premium Wireless Headphones', sales: 234, revenue: 69966, growth: 15 },
    { name: language === 'ar' ? 'ساعة ذكية متطورة' : 'Advanced Smartwatch', sales: 189, revenue: 86751, growth: -5 },
    { name: language === 'ar' ? 'ماكينة قهوة احترافية' : 'Professional Coffee Machine', sales: 123, revenue: 110577, growth: 8 },
    { name: language === 'ar' ? 'حذاء رياضي خفيف' : 'Lightweight Sports Shoes', sales: 312, revenue: 87048, growth: 31 },
  ];

  const recentActivity = [
    { action: language === 'ar' ? 'طلب جديد' : 'New Order', detail: '#ORD-009 - 2,499 AED', time: '5 دقائق', type: 'order' },
    { action: language === 'ar' ? 'عميل جديد' : 'New Customer', detail: 'محمد أحمد - mohammed@email.com', time: '12 دقيقة', type: 'customer' },
    { action: language === 'ar' ? 'تم التوصيل' : 'Delivered', detail: '#ORD-007 - 1,899 AED', time: '25 دقيقة', type: 'delivery' },
    { action: language === 'ar' ? 'مراجعة جديدة' : 'New Review', detail: '⭐⭐⭐⭐⭐ - آيفون 15 برو ماكس', time: '45 دقيقة', type: 'review' },
    { action: language === 'ar' ? 'إرجاع منتج' : 'Product Return', detail: '#RET-003 - 599 AED', time: '1 ساعة', type: 'return' },
  ];

  const salesByCategory = [
    { category: language === 'ar' ? 'إلكترونيات' : 'Electronics', sales: 45, amount: 450000 },
    { category: language === 'ar' ? 'أزياء' : 'Fashion', sales: 28, amount: 280000 },
    { category: language === 'ar' ? 'منزل' : 'Home', sales: 15, amount: 150000 },
    { category: language === 'ar' ? 'رياضة' : 'Sports', sales: 12, amount: 120000 },
  ];

  const cityPerformance = [
    { city: language === 'ar' ? 'دبي' : 'Dubai', orders: 2450, revenue: 875000, growth: 18 },
    { city: language === 'ar' ? 'أبوظبي' : 'Abu Dhabi', orders: 1890, revenue: 650000, growth: 12 },
    { city: language === 'ar' ? 'الشارقة' : 'Sharjah', orders: 980, revenue: 320000, growth: 25 },
    { city: language === 'ar' ? 'عجمان' : 'Ajman', orders: 450, revenue: 145000, growth: 8 },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'order': return <ShoppingCart className="w-4 h-4" />;
      case 'customer': return <Users className="w-4 h-4" />;
      case 'delivery': return <Package className="w-4 h-4" />;
      case 'review': return <Activity className="w-4 h-4" />;
      case 'return': return <ArrowDownRight className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'order': return 'bg-blue-100 text-blue-600';
      case 'customer': return 'bg-green-100 text-green-600';
      case 'delivery': return 'bg-purple-100 text-purple-600';
      case 'review': return 'bg-yellow-100 text-yellow-600';
      case 'return': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="p-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {language === 'ar' ? 'التحليلات والإحصائيات المتقدمة' : 'Advanced Analytics & Statistics'}
          </h1>
          <p className="text-gray-500 mt-1">
            {language === 'ar' ? 'نظرة شاملة على أداء متجرك' : 'Comprehensive overview of your store performance'}
          </p>
        </div>
        
        <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">{language === 'ar' ? 'اليوم' : 'Today'}</SelectItem>
              <SelectItem value="7days">{language === 'ar' ? 'آخر 7 أيام' : 'Last 7 Days'}</SelectItem>
              <SelectItem value="30days">{language === 'ar' ? 'آخر 30 يوم' : 'Last 30 Days'}</SelectItem>
              <SelectItem value="90days">{language === 'ar' ? 'آخر 3 أشهر' : 'Last 3 Months'}</SelectItem>
              <SelectItem value="year">{language === 'ar' ? 'هذا العام' : 'This Year'}</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={refreshData} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {language === 'ar' ? 'تحديث' : 'Refresh'}
          </Button>
          
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            {language === 'ar' ? 'تصدير' : 'Export'}
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className={`flex items-start justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={isRTL ? 'text-right' : 'text-left'}>
                    <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
                    <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                    <div className={`flex items-center gap-1 mt-2 text-sm ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      <span>{stat.change}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{stat.subtext}</p>
                  </div>
                  <div className="w-12 h-12 bg-[#2d5d2a] rounded-xl flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full md:w-auto grid-cols-4 md:inline-flex">
          <TabsTrigger value="overview">{language === 'ar' ? 'نظرة عامة' : 'Overview'}</TabsTrigger>
          <TabsTrigger value="products">{language === 'ar' ? 'المنتجات' : 'Products'}</TabsTrigger>
          <TabsTrigger value="customers">{language === 'ar' ? 'العملاء' : 'Customers'}</TabsTrigger>
          <TabsTrigger value="locations">{language === 'ar' ? 'المواقع' : 'Locations'}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenue Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 text-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <TrendingUp className="w-5 h-5 text-[#2d5d2a]" />
                  {language === 'ar' ? 'الإيرادات اليومية' : 'Daily Revenue'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SimpleChart data={revenueData} />
                <div className={`flex justify-between mt-4 text-sm text-gray-500 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span>{language === 'ar' ? 'السبت' : 'Sat'}</span>
                  <span>{language === 'ar' ? 'الأحد' : 'Sun'}</span>
                  <span>{language === 'ar' ? 'الإثنين' : 'Mon'}</span>
                  <span>{language === 'ar' ? 'الثلاثاء' : 'Tue'}</span>
                  <span>{language === 'ar' ? 'الأربعاء' : 'Wed'}</span>
                  <span>{language === 'ar' ? 'الخميس' : 'Thu'}</span>
                  <span>{language === 'ar' ? 'الجمعة' : 'Fri'}</span>
                </div>
              </CardContent>
            </Card>

            {/* Traffic Sources */}
            <Card>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 text-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Target className="w-5 h-5 text-[#2d5d2a]" />
                  {language === 'ar' ? 'مصادر الزيارات' : 'Traffic Sources'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DonutChart 
                  data={trafficSources} 
                  colors={['#2d5d2a', '#4a9d46', '#7bc777', '#a8e0a5']} 
                />
                <div className="mt-4 space-y-2">
                  {trafficSources.map((source, index) => (
                    <div key={index} className={`flex items-center justify-between text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: ['#2d5d2a', '#4a9d46', '#7bc777', '#a8e0a5'][index] }}
                        />
                        <span>{source.label}</span>
                      </div>
                      <span className="font-medium">{source.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sales by Category */}
          <Card>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 text-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Package className="w-5 h-5 text-[#2d5d2a]" />
                {language === 'ar' ? 'المبيعات حسب الفئة' : 'Sales by Category'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {salesByCategory.map((item, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-900">{item.category}</p>
                    <div className={`flex items-center justify-between mt-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className="text-2xl font-bold text-[#2d5d2a]">{item.sales}%</span>
                      <span className="text-sm text-gray-500">{item.amount.toLocaleString()} {curr}</span>
                    </div>
                    <Progress value={item.sales} className="mt-2 h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="mt-6">
          {/* Top Products Table */}
          <Card>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 text-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Package className="w-5 h-5 text-[#2d5d2a]" />
                {language === 'ar' ? 'أفضل المنتجات مبيعاً' : 'Top Selling Products'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={index} className={`flex items-center justify-between p-4 bg-gray-50 rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className="w-8 h-8 bg-[#2d5d2a] text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      <div className={isRTL ? 'text-right' : 'text-left'}>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.sales} {language === 'ar' ? 'مبيعة' : 'sold'}</p>
                      </div>
                    </div>
                    <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Badge className={product.growth >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                        {product.growth >= 0 ? '+' : ''}{product.growth}%
                      </Badge>
                      <span className="font-bold text-[#2d5d2a]">{product.revenue.toLocaleString()} {curr}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="mt-6">
          {/* Customer Activity */}
          <Card>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 text-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Activity className="w-5 h-5 text-[#2d5d2a]" />
                {language === 'ar' ? 'النشاط الأخير' : 'Recent Activity'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className={`flex items-center gap-4 p-4 bg-gray-50 rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                      <p className="font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-600">{activity.detail}</p>
                    </div>
                    <span className="text-xs text-gray-400">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="locations" className="mt-6">
          {/* City Performance */}
          <Card>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 text-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
                <MapPin className="w-5 h-5 text-[#2d5d2a]" />
                {language === 'ar' ? 'الأداء حسب المدينة' : 'Performance by City'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cityPerformance.map((city, index) => (
                  <div key={index} className={`flex items-center justify-between p-4 bg-gray-50 rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className="w-10 h-10 bg-[#2d5d2a]/10 rounded-full flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-[#2d5d2a]" />
                      </div>
                      <div className={isRTL ? 'text-right' : 'text-left'}>
                        <p className="font-medium text-gray-900">{city.city}</p>
                        <p className="text-sm text-gray-500">{city.orders} {language === 'ar' ? 'طلب' : 'orders'}</p>
                      </div>
                    </div>
                    <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className={`flex items-center gap-1 text-sm ${city.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {city.growth >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                        <span>{city.growth}%</span>
                      </div>
                      <span className="font-bold text-[#2d5d2a]">{city.revenue.toLocaleString()} {curr}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-[#2d5d2a] to-[#3d7d3a] text-white">
          <CardContent className="p-6">
            <h3 className="font-bold text-lg mb-2">
              {language === 'ar' ? 'تقرير المبيعات' : 'Sales Report'}
            </h3>
            <p className="text-white/80 text-sm mb-4">
              {language === 'ar' ? 'تحميل تقرير مفصل عن المبيعات' : 'Download detailed sales report'}
            </p>
            <Button variant="secondary" className="w-full">
              <Download className="w-4 h-4 mr-2" />
              {language === 'ar' ? 'تحميل PDF' : 'Download PDF'}
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white">
          <CardContent className="p-6">
            <h3 className="font-bold text-lg mb-2">
              {language === 'ar' ? 'تحليل العملاء' : 'Customer Analytics'}
            </h3>
            <p className="text-white/80 text-sm mb-4">
              {language === 'ar' ? 'عرض سلوك وتفضيلات العملاء' : 'View customer behavior and preferences'}
            </p>
            <Button variant="secondary" className="w-full">
              <Users className="w-4 h-4 mr-2" />
              {language === 'ar' ? 'عرض التفاصيل' : 'View Details'}
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-600 to-purple-700 text-white">
          <CardContent className="p-6">
            <h3 className="font-bold text-lg mb-2">
              {language === 'ar' ? 'توقعات المبيعات' : 'Sales Forecast'}
            </h3>
            <p className="text-white/80 text-sm mb-4">
              {language === 'ar' ? 'توقعات المبيعات للشهر القادم' : 'Sales predictions for next month'}
            </p>
            <Button variant="secondary" className="w-full">
              <TrendingUp className="w-4 h-4 mr-2" />
              {language === 'ar' ? 'عرض التوقعات' : 'View Forecast'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
