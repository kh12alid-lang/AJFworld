import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { MapPin, Navigation, Truck, Clock, Phone, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface DeliveryLocation {
  lat: number;
  lng: number;
  address: string;
}

interface DriverInfo {
  name: string;
  phone: string;
  photo: string;
  rating: number;
  vehicleType: string;
  vehicleNumber: string;
}

interface TrackingInfo {
  orderId: string;
  status: 'preparing' | 'picked_up' | 'in_transit' | 'nearby' | 'delivered';
  driver: DriverInfo;
  currentLocation: DeliveryLocation;
  deliveryLocation: DeliveryLocation;
  estimatedTime: string;
  distance: string;
  startedAt: string;
  steps: {
    title: string;
    completed: boolean;
    time: string;
  }[];
}

interface GPSTrackerProps {
  orderId: string;
  isOpen: boolean;
  onClose: () => void;
}

// Mock tracking data - In production, this would come from a real GPS API
const generateMockTracking = (orderId: string): TrackingInfo => ({
  orderId,
  status: 'in_transit',
  driver: {
    name: 'أحمد محمد',
    phone: '+971 50 123 4567',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    rating: 4.8,
    vehicleType: 'تويوتا هايس',
    vehicleNumber: 'Dubai 12345',
  },
  currentLocation: {
    lat: 25.2048,
    lng: 55.2708,
    address: 'شارع الشيخ زايد، دبي',
  },
  deliveryLocation: {
    lat: 25.276987,
    lng: 55.296249,
    address: 'المنطقة التجارية، دبي',
  },
  estimatedTime: '15 دقيقة',
  distance: '3.2 كم',
  startedAt: new Date().toISOString(),
  steps: [
    { title: 'تم تأكيد الطلب', completed: true, time: '10:00 ص' },
    { title: 'جاري التحضير', completed: true, time: '10:15 ص' },
    { title: 'تم استلام الطلب', completed: true, time: '10:30 ص' },
    { title: 'في الطريق إليك', completed: true, time: '10:45 ص' },
    { title: 'التوصيل', completed: false, time: '' },
  ],
});

export default function GPSTracker({ orderId, isOpen, onClose }: GPSTrackerProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const [tracking, setTracking] = useState<TrackingInfo | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (isOpen && orderId) {
      // Simulate API call to get tracking info
      setTracking(generateMockTracking(orderId));
      setTimeout(() => setMapLoaded(true), 500);
    }
  }, [isOpen, orderId]);

  // Simulate live location updates
  useEffect(() => {
    if (!tracking || !isOpen) return;

    const interval = setInterval(() => {
      setTracking(prev => {
        if (!prev) return null;
        // Simulate driver movement
        const newLat = prev.currentLocation.lat + (Math.random() - 0.5) * 0.001;
        const newLng = prev.currentLocation.lng + (Math.random() - 0.5) * 0.001;
        return {
          ...prev,
          currentLocation: {
            ...prev.currentLocation,
            lat: newLat,
            lng: newLng,
          },
        };
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [tracking, isOpen]);

  const handleCallDriver = useCallback(() => {
    if (tracking?.driver.phone) {
      window.open(`tel:${tracking.driver.phone}`);
    }
  }, [tracking]);

  const handleMessageDriver = useCallback(() => {
    if (tracking?.driver.phone) {
      window.open(`https://wa.me/${tracking.driver.phone.replace(/\D/g, '')}`);
    }
  }, [tracking]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'preparing': return 'bg-yellow-500';
      case 'picked_up': return 'bg-blue-500';
      case 'in_transit': return 'bg-[#2d5d2a]';
      case 'nearby': return 'bg-orange-500';
      case 'delivered': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, { ar: string; en: string }> = {
      preparing: { ar: 'جاري التحضير', en: 'Preparing' },
      picked_up: { ar: 'تم الاستلام', en: 'Picked Up' },
      in_transit: { ar: 'في الطريق', en: 'In Transit' },
      nearby: { ar: 'قريب منك', en: 'Nearby' },
      delivered: { ar: 'تم التوصيل', en: 'Delivered' },
    };
    return texts[status]?.[language] || status;
  };

  if (!tracking) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir={isRTL ? 'rtl' : 'ltr'}>
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-2 text-xl ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Navigation className="w-6 h-6 text-[#2d5d2a]" />
            {isRTL ? 'تتبع الطلب المباشر' : 'Live Order Tracking'}
          </DialogTitle>
        </DialogHeader>

        {/* Status Banner */}
        <div className={`${getStatusColor(tracking.status)} text-white p-4 rounded-lg flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Truck className="w-8 h-8" />
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <p className="font-bold text-lg">{getStatusText(tracking.status)}</p>
            <p className="text-sm opacity-90">
              {isRTL 
                ? `الوصول المتوقع: ${tracking.estimatedTime}` 
                : `Estimated arrival: ${tracking.estimatedTime}`}
            </p>
          </div>
        </div>

        {/* Map Simulation */}
        <Card>
          <CardContent className="p-0">
            <div className="relative h-64 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg overflow-hidden">
              {/* Simulated Map */}
              <div className="absolute inset-0 flex items-center justify-center">
                {!mapLoaded ? (
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2d5d2a]"></div>
                ) : (
                  <div className="relative w-full h-full">
                    {/* Route Line */}
                    <svg className="absolute inset-0 w-full h-full">
                      <line
                        x1="30%"
                        y1="70%"
                        x2="70%"
                        y2="30%"
                        stroke="#2d5d2a"
                        strokeWidth="3"
                        strokeDasharray="8,4"
                      />
                    </svg>
                    
                    {/* Delivery Location */}
                    <div 
                      className="absolute"
                      style={{ right: '30%', top: '30%' }}
                    >
                      <div className="relative">
                        <MapPin className="w-8 h-8 text-red-500" />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
                      </div>
                      <p className="text-xs mt-1 bg-white px-2 py-1 rounded shadow whitespace-nowrap">
                        {isRTL ? 'موقع التوصيل' : 'Delivery Location'}
                      </p>
                    </div>

                    {/* Driver Location */}
                    <div 
                      className="absolute transition-all duration-1000"
                      style={{ left: '30%', bottom: '30%' }}
                    >
                      <div className="relative">
                        <div className="w-10 h-10 bg-[#2d5d2a] rounded-full flex items-center justify-center shadow-lg">
                          <Truck className="w-5 h-5 text-white" />
                        </div>
                        <div className="absolute -inset-2 border-2 border-[#2d5d2a] rounded-full animate-pulse"></div>
                      </div>
                      <p className="text-xs mt-1 bg-white px-2 py-1 rounded shadow whitespace-nowrap">
                        {isRTL ? 'السائق' : 'Driver'}
                      </p>
                    </div>

                    {/* Distance Badge */}
                    <div className="absolute top-4 left-4 bg-white px-3 py-2 rounded-lg shadow-md">
                      <p className="text-sm font-medium text-[#2d5d2a]">{tracking.distance}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Driver Info */}
        <Card>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 text-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
              {isRTL ? 'معلومات السائق' : 'Driver Information'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <img
                src={tracking.driver.photo}
                alt={tracking.driver.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-[#2d5d2a]"
              />
              <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                <p className="font-bold text-lg">{tracking.driver.name}</p>
                <p className="text-sm text-gray-600">
                  {tracking.driver.vehicleType} • {tracking.driver.vehicleNumber}
                </p>
                <div className={`flex items-center gap-1 mt-1 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                  <span className="text-yellow-500">★</span>
                  <span className="text-sm font-medium">{tracking.driver.rating}</span>
                </div>
              </div>
              <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleMessageDriver}
                  className="text-green-600 border-green-600 hover:bg-green-50"
                >
                  <MessageSquare className="w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCallDriver}
                  className="text-[#2d5d2a] border-[#2d5d2a] hover:bg-[#2d5d2a]/10"
                >
                  <Phone className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tracking Steps */}
        <Card>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 text-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Clock className="w-5 h-5" />
              {isRTL ? 'حالة الطلب' : 'Order Status'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tracking.steps.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      step.completed
                        ? 'bg-[#2d5d2a] text-white'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {step.completed ? '✓' : index + 1}
                  </div>
                  <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                    <p className={`font-medium ${step.completed ? 'text-gray-900' : 'text-gray-400'}`}>
                      {step.title}
                    </p>
                    {step.time && (
                      <p className="text-sm text-gray-500">{step.time}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Button
            variant="outline"
            className="flex-1"
            onClick={onClose}
          >
            {isRTL ? 'إغلاق' : 'Close'}
          </Button>
          <Button
            className="flex-1 bg-[#2d5d2a] hover:bg-[#234a21]"
            onClick={() => window.open(`tel:+971501234567`)}
          >
            <Phone className="w-4 h-4 mr-2" />
            {isRTL ? 'الدعم الفني' : 'Support'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
