import { useState } from 'react';
import { 
  Search, 
  Package, 
  Truck, 
  MapPin, 
  CheckCircle, 
  Clock,
  AlertCircle,
  Box,
  Navigation
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/context/LanguageContext';
import Header from '@/components/store/Header';
import Footer from '@/components/store/Footer';
import GPSTracker from '@/components/store/GPSTracker';

interface TrackingInfo {
  orderId: string;
  status: string;
  statusAr: string;
  currentLocation: string;
  estimatedDelivery: string;
  timeline: {
    date: string;
    time: string;
    status: string;
    statusAr: string;
    completed: boolean;
    icon: 'order' | 'process' | 'ship' | 'deliver';
  }[];
}

export default function TrackOrder() {
  const { language, isRTL } = useLanguage();
  const [orderId, setOrderId] = useState('');
  const [trackingInfo, setTrackingInfo] = useState<TrackingInfo | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showGPSTracker, setShowGPSTracker] = useState(false);

  const handleTrack = async () => {
    if (!orderId.trim()) {
      setError(language === 'ar' ? 'يرجى إدخال رقم الطلب' : 'Please enter order number');
      return;
    }
    
    setError('');
    setLoading(true);
    setTrackingInfo(null);
    
    try {
      // Try API first
      const response = await fetch(`/api/tracking/${orderId}`);
      const data = await response.json();
      
      if (data.success) {
        setTrackingInfo({
          orderId: data.order.order_number,
          status: data.order.status,
          statusAr: getStatusAr(data.order.status),
          currentLocation: data.tracking?.[0]?.location || '',
          estimatedDelivery: data.order.estimated_delivery || '',
          timeline: data.tracking?.map((t: any) => ({
            date: new Date(t.timestamp).toLocaleDateString(),
            time: new Date(t.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: t.status,
            statusAr: getStatusAr(t.status),
            completed: true,
            icon: getIconForStatus(t.status),
          })) || [],
        });
      } else {
        setError(language === 'ar' ? 'لم يتم العثور على الطلب' : 'Order not found');
      }
    } catch (err) {
      // Fallback to local if API is not available
      setError(language === 'ar' ? 'يرجى التحقق من رقم الطلب والمحاولة لاحقاً' : 'Please check the order number and try again later');
    } finally {
      setLoading(false);
    }
  };

  const getStatusAr = (status: string) => {
    const statuses: Record<string, string> = {
      'pending': 'قيد الانتظار',
      'processing': 'جاري التجهيز',
      'shipped': 'تم الشحن',
      'out_for_delivery': 'في الطريق',
      'delivered': 'تم التوصيل',
      'cancelled': 'ملغي',
    };
    return statuses[status] || status;
  };

  const getIconForStatus = (status: string) => {
    if (status === 'delivered') return 'deliver' as const;
    if (status === 'shipped' || status === 'out_for_delivery') return 'ship' as const;
    if (status === 'processing') return 'process' as const;
    return 'order' as const;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'processing': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'shipped': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'out_for_delivery': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'delivered': return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTimelineIcon = (icon: string, completed: boolean) => {
    const bgClass = completed ? 'bg-[#2d5d2a]' : 'bg-gray-200';
    
    switch (icon) {
      case 'order':
        return (
          <div className={`w-10 h-10 ${bgClass} rounded-full flex items-center justify-center flex-shrink-0`}>
            <Box className={`w-5 h-5 ${completed ? 'text-white' : 'text-gray-500'}`} />
          </div>
        );
      case 'process':
        return (
          <div className={`w-10 h-10 ${bgClass} rounded-full flex items-center justify-center flex-shrink-0`}>
            <Package className={`w-5 h-5 ${completed ? 'text-white' : 'text-gray-500'}`} />
          </div>
        );
      case 'ship':
        return (
          <div className={`w-10 h-10 ${bgClass} rounded-full flex items-center justify-center flex-shrink-0`}>
            <Truck className={`w-5 h-5 ${completed ? 'text-white' : 'text-gray-500'}`} />
          </div>
        );
      case 'deliver':
        return (
          <div className={`w-10 h-10 ${bgClass} rounded-full flex items-center justify-center flex-shrink-0`}>
            <CheckCircle className={`w-5 h-5 ${completed ? 'text-white' : 'text-gray-500'}`} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <Header />
      
      <main className="pt-20 pb-12">
        <div className="container-custom max-w-3xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#2d5d2a]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Truck className="w-8 h-8 text-[#2d5d2a]" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {language === 'ar' ? 'تتبع طلبك' : 'Track Your Order'}
            </h1>
            <p className="text-gray-600">
              {language === 'ar' 
                ? 'أدخل رقم الطلب لمتابعة حالة الشحن'
                : 'Enter your order number to track shipment status'}
            </p>
          </div>
          
          {/* Search Form */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400`} />
                <Input
                  placeholder={language === 'ar' ? 'أدخل رقم الطلب (مثال: AJ-001234)' : 'Enter order number (e.g., AJ-001234)'}
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className={`${isRTL ? 'pr-10' : 'pl-10'} h-14 text-lg`}
                  onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
                />
              </div>
              <Button 
                onClick={handleTrack}
                disabled={loading}
                className="h-14 px-8 bg-[#2d5d2a] hover:bg-[#1e401c]"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-2" />
                    {language === 'ar' ? 'تتبع' : 'Track'}
                  </>
                )}
              </Button>
            </div>
            
            {error && (
              <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>
          
          {/* Tracking Result */}
          {trackingInfo && (
            <div className="space-y-6">
              {/* Order Summary */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      {language === 'ar' ? 'رقم الطلب' : 'Order Number'}
                    </p>
                    <p className="text-xl font-bold">{trackingInfo.orderId}</p>
                  </div>
                  <Badge className={`${getStatusColor(trackingInfo.status)} px-4 py-2 text-sm font-medium`}>
                    {language === 'ar' ? trackingInfo.statusAr : trackingInfo.status}
                  </Badge>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        {language === 'ar' ? 'الموقع الحالي' : 'Current Location'}
                      </p>
                      <p className="font-medium">{trackingInfo.currentLocation || '-'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        {language === 'ar' ? 'التوصيل المتوقع' : 'Estimated Delivery'}
                      </p>
                      <p className="font-medium">{trackingInfo.estimatedDelivery || '-'}</p>
                    </div>
                  </div>
                </div>

                {/* GPS Live Tracking Button */}
                {trackingInfo.status === 'shipped' && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <Button
                      onClick={() => setShowGPSTracker(true)}
                      className="w-full bg-gradient-to-r from-[#2d5d2a] to-[#3d7d3a] hover:from-[#234a21] hover:to-[#2d5d2a] text-white h-14"
                    >
                      <Navigation className="w-5 h-5 mr-2" />
                      {language === 'ar' ? 'تتبع مباشر GPS' : 'Live GPS Tracking'}
                    </Button>
                  </div>
                )}
              </div>
              
              {/* Timeline */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-bold mb-6">
                  {language === 'ar' ? 'حالة الشحنة' : 'Shipment Status'}
                </h2>
                
                <div className="space-y-6">
                  {trackingInfo.timeline.map((step, index) => (
                    <div key={index} className={`flex gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      {getTimelineIcon(step.icon, step.completed)}
                      <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                        <p className="font-medium">{language === 'ar' ? step.statusAr : step.status}</p>
                        <div className={`flex items-center gap-2 mt-1 text-sm text-gray-500 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span>{step.date}</span>
                          <span>•</span>
                          <span>{step.time}</span>
                        </div>
                      </div>
                      {step.completed && (
                        <CheckCircle className="w-5 h-5 text-[#2d5d2a] flex-shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* GPS Tracker Modal */}
      <GPSTracker
        orderId={trackingInfo?.orderId || ''}
        isOpen={showGPSTracker}
        onClose={() => setShowGPSTracker(false)}
      />
    </div>
  );
}
