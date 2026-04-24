import { useState, useEffect } from 'react';
import { Search, Package, Truck, CheckCircle, XCircle, ChevronDown, MapPin, Phone, Calendar, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/context/LanguageContext';
import { currency, currencyEn } from '@/data/products';

interface Order {
  id: string;
  customer: string;
  email: string;
  phone?: string;
  items: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
  address: string;
  notes?: string;
  trackingNumber?: string;
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('ajfworld_orders');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        return [];
      }
    }
    return [];
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const { language, isRTL } = useLanguage();

  const curr = language === 'ar' ? currency : currencyEn;

  // Save orders to localStorage when changed
  useEffect(() => {
    localStorage.setItem('ajfworld_orders', JSON.stringify(orders));
  }, [orders]);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { color: string; icon: React.ElementType; labelAr: string; labelEn: string }> = {
      pending: { color: 'bg-yellow-100 text-yellow-700', icon: Package, labelAr: 'معلق', labelEn: 'Pending' },
      processing: { color: 'bg-blue-100 text-blue-700', icon: Truck, labelAr: 'قيد المعالجة', labelEn: 'Processing' },
      shipped: { color: 'bg-purple-100 text-purple-700', icon: Truck, labelAr: 'تم الشحن', labelEn: 'Shipped' },
      delivered: { color: 'bg-green-100 text-green-700', icon: CheckCircle, labelAr: 'تم التوصيل', labelEn: 'Delivered' },
      cancelled: { color: 'bg-red-100 text-red-700', icon: XCircle, labelAr: 'ملغي', labelEn: 'Cancelled' },
    };
    return configs[status] || configs.pending;
  };

  const statusSteps = ['pending', 'processing', 'shipped', 'delivered'];
  const getStepIndex = (status: string) => statusSteps.indexOf(status);

  const t = {
    ar: {
      title: 'إدارة الطلبات',
      search: 'البحث برقم الطلب أو العميل...',
      allStatuses: 'جميع الحالات',
      totalOrders: 'إجمالي الطلبات',
      pending: 'معلق',
      processing: 'قيد المعالجة',
      shipped: 'تم الشحن',
      delivered: 'تم التوصيل',
      cancelled: 'ملغي',
      orderId: 'رقم الطلب',
      customer: 'العميل',
      items: 'العناصر',
      total: 'الإجمالي',
      status: 'الحالة',
      date: 'التاريخ',
      actions: 'الإجراءات',
      noOrders: 'لا توجد طلبات',
      orderDetails: 'تفاصيل الطلب',
      trackOrder: 'تتبع الطلب',
      address: 'العنوان',
      phone: 'الهاتف',
      email: 'البريد',
      notes: 'ملاحظات',
      trackingNumber: 'رقم التتبع',
      updateStatus: 'تحديث الحالة',
      stepPending: 'معلق',
      stepProcessing: 'قيد المعالجة',
      stepShipped: 'تم الشحن',
      stepDelivered: 'تم التوصيل',
    },
    en: {
      title: 'Orders Management',
      search: 'Search by order ID or customer...',
      allStatuses: 'All Statuses',
      totalOrders: 'Total Orders',
      pending: 'Pending',
      processing: 'Processing',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
      orderId: 'Order ID',
      customer: 'Customer',
      items: 'Items',
      total: 'Total',
      status: 'Status',
      date: 'Date',
      actions: 'Actions',
      noOrders: 'No orders yet',
      orderDetails: 'Order Details',
      trackOrder: 'Track Order',
      address: 'Address',
      phone: 'Phone',
      email: 'Email',
      notes: 'Notes',
      trackingNumber: 'Tracking Number',
      updateStatus: 'Update Status',
      stepPending: 'Pending',
      stepProcessing: 'Processing',
      stepShipped: 'Shipped',
      stepDelivered: 'Delivered',
    }
  }[language];

  return (
    <div className="p-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
        <div className="flex gap-3">
          <div className="bg-white px-4 py-2 rounded-lg border border-gray-200">
            <span className="text-sm text-gray-500">{t.totalOrders}: </span>
            <span className="font-bold text-[#2d5d2a]">{orders.length}</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400`} />
          <Input
            type="text"
            placeholder={t.search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} h-11`}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-11 px-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2d5d2a] focus:border-transparent"
        >
          <option value="all">{t.allStatuses}</option>
          <option value="pending">{t.pending}</option>
          <option value="processing">{t.processing}</option>
          <option value="shipped">{t.shipped}</option>
          <option value="delivered">{t.delivered}</option>
          <option value="cancelled">{t.cancelled}</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase">{t.orderId}</th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase">{t.customer}</th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase">{t.items}</th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase">{t.total}</th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase">{t.status}</th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase">{t.date}</th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((order) => {
                const statusConfig = getStatusConfig(order.status);
                const StatusIcon = statusConfig.icon;
                const isExpanded = expandedOrder === order.id;
                const currentStep = getStepIndex(order.status);

                return (
                  <>
                    <tr key={order.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setExpandedOrder(isExpanded ? null : order.id)}>
                      <td className="px-4 py-4">
                        <span className="font-medium text-gray-900">#{order.id}</span>
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{order.customer}</p>
                          <p className="text-xs text-gray-500">{order.email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-600">{order.items} {language === 'ar' ? 'منتج' : 'items'}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="font-medium text-gray-900">{order.total} {curr}</span>
                      </td>
                      <td className="px-4 py-4">
                        <Badge className={`${statusConfig.color} flex items-center gap-1 w-fit`}>
                          <StatusIcon className="w-3 h-3" />
                          {language === 'ar' ? statusConfig.labelAr : statusConfig.labelEn}
                        </Badge>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-600">{order.date}</span>
                      </td>
                      <td className="px-4 py-4">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>
                      </td>
                    </tr>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <tr>
                        <td colSpan={7} className="px-4 py-4 bg-gray-50">
                          <div className="space-y-4">
                            {/* Order Tracking Steps */}
                            {order.status !== 'cancelled' && (
                              <div className="flex items-center gap-2 mb-4">
                                {statusSteps.map((step, i) => {
                                  const stepConfig = getStatusConfig(step);
                                  const isActive = i <= currentStep;
                                  const isCurrent = i === currentStep;
                                  return (
                                    <div key={step} className="flex items-center gap-2 flex-1">
                                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                                        isActive ? 'bg-[#2d5d2a] text-white' : 'bg-gray-200 text-gray-500'
                                      } ${isCurrent ? 'ring-2 ring-offset-2 ring-[#2d5d2a]' : ''}`}>
                                        {i + 1}
                                      </div>
                                      <span className={`text-xs ${isActive ? 'text-[#2d5d2a] font-medium' : 'text-gray-500'}`}>
                                        {language === 'ar' 
                                          ? (step === 'pending' ? t.stepPending : step === 'processing' ? t.stepProcessing : step === 'shipped' ? t.stepShipped : t.stepDelivered)
                                          : stepConfig.labelEn
                                        }
                                      </span>
                                      {i < statusSteps.length - 1 && <ArrowRight className="w-4 h-4 text-gray-300" />}
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                                <div>
                                  <p className="text-sm font-medium">{t.address}</p>
                                  <p className="text-sm text-gray-600">{order.address}</p>
                                </div>
                              </div>
                              <div className="flex items-start gap-2">
                                <Phone className="w-4 h-4 text-gray-400 mt-1" />
                                <div>
                                  <p className="text-sm font-medium">{t.phone}</p>
                                  <p className="text-sm text-gray-600">{order.phone || '-'}</p>
                                </div>
                              </div>
                              {order.trackingNumber && (
                                <div className="flex items-start gap-2">
                                  <Truck className="w-4 h-4 text-gray-400 mt-1" />
                                  <div>
                                    <p className="text-sm font-medium">{t.trackingNumber}</p>
                                    <p className="text-sm text-gray-600">{order.trackingNumber}</p>
                                  </div>
                                </div>
                              )}
                              {order.notes && (
                                <div className="flex items-start gap-2">
                                  <Calendar className="w-4 h-4 text-gray-400 mt-1" />
                                  <div>
                                    <p className="text-sm font-medium">{t.notes}</p>
                                    <p className="text-sm text-gray-600">{order.notes}</p>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Status Update */}
                            <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                              <span className="text-sm font-medium">{t.updateStatus}:</span>
                              <div className="flex gap-2 flex-wrap">
                                {(['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const).map(s => (
                                  <button
                                    key={s}
                                    onClick={(e) => { e.stopPropagation(); updateOrderStatus(order.id, s); }}
                                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                                      order.status === s
                                        ? 'bg-[#2d5d2a] text-white'
                                        : 'bg-white text-gray-600 border hover:bg-gray-50'
                                    }`}
                                  >
                                    {language === 'ar' ? getStatusConfig(s).labelAr : getStatusConfig(s).labelEn}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">{t.noOrders}</p>
          </div>
        )}
      </div>
    </div>
  );
}
