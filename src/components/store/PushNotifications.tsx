import { useState, useEffect } from 'react';
import { Bell, ShoppingBag, Tag, Truck, Gift, X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'promo' | 'delivery' | 'loyalty';
  read: boolean;
  timestamp: Date;
}

export default function PushNotifications() {
  const { language, isRTL } = useLanguage();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showPanel, setShowPanel] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [bannerDismissed, setBannerDismissed] = useState(() => {
    return sessionStorage.getItem('ajfworld_notif_dismissed') === 'true';
  });

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
    // Load notifications from API or localStorage
    const saved = localStorage.getItem('ajfworld_notifications');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setNotifications(parsed.map((n: any) => ({ ...n, timestamp: new Date(n.timestamp) })));
      } catch (e) {
        // ignore
      }
    }
  }, []);

  // Save notifications when they change
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem('ajfworld_notifications', JSON.stringify(notifications));
    }
  }, [notifications]);

  const dismissBanner = () => {
    setBannerDismissed(true);
    sessionStorage.setItem('ajfworld_notif_dismissed', 'true');
  };

  const requestPermission = async () => {
    if ('Notification' in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result === 'granted') {
        new Notification('AJFworld', {
          body: language === 'ar' 
            ? 'تم تفعيل الإشعارات بنجاح!'
            : 'Notifications enabled successfully!',
          icon: '/images/logo-192.png',
        });
      }
    }
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
    localStorage.removeItem('ajfworld_notifications');
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'order': return <ShoppingBag className="w-5 h-5 text-blue-500" />;
      case 'promo': return <Tag className="w-5 h-5 text-purple-500" />;
      case 'delivery': return <Truck className="w-5 h-5 text-green-500" />;
      case 'loyalty': return <Gift className="w-5 h-5 text-orange-500" />;
      default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (language === 'ar') {
      if (minutes < 1) return 'الآن';
      if (minutes < 60) return `منذ ${minutes} دقيقة`;
      if (hours < 24) return `منذ ${hours} ساعة`;
      return `منذ ${days} يوم`;
    } else {
      if (minutes < 1) return 'Just now';
      if (minutes < 60) return `${minutes}m ago`;
      if (hours < 24) return `${hours}h ago`;
      return `${days}d ago`;
    }
  };

  return (
    <div>
      {/* Permission Banner - Optional, dismissable */}
      {permission === 'default' && !bannerDismissed && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#2d5d2a] text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-4 max-w-md">
          <Bell className="w-6 h-6 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-medium">
              {language === 'ar' ? 'فعّل الإشعارات (اختياري)' : 'Enable Notifications (optional)'}
            </p>
            <p className="text-sm text-white/80">
              {language === 'ar'
                ? 'احصل على آخر العروض وتحديثات الطلبات - غير إلزامي'
                : 'Get latest offers and order updates - not mandatory'}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={requestPermission}
              className="bg-white text-[#2d5d2a] px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              {language === 'ar' ? 'تفعيل' : 'Enable'}
            </button>
            <button
              onClick={dismissBanner}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              title={language === 'ar' ? 'إغلاق' : 'Close'}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Notification Bell */}
      <div className="relative">
        <button
          onClick={() => setShowPanel(!showPanel)}
          className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <Bell className="w-5 h-5 text-gray-700" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Notification Panel */}
        {showPanel && (
          <div
            className="absolute top-full mt-2 right-0 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50"
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-lg">
                {language === 'ar' ? 'الإشعارات' : 'Notifications'}
              </h3>
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-[#2d5d2a] hover:underline"
                  >
                    {language === 'ar' ? 'تحديد الكل' : 'Mark all'}
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    onClick={clearAll}
                    className="text-sm text-red-500 hover:underline"
                  >
                    {language === 'ar' ? 'مسح' : 'Clear'}
                  </button>
                )}
              </div>
            </div>

            {/* Notifications List - Empty State */}
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">
                    {language === 'ar' 
                      ? 'لا توجد إشعارات حالياً'
                      : 'No notifications yet'}
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    {language === 'ar'
                      ? 'ستظهر هنا إشعارات طلباتك وعروضك'
                      : 'Your orders and offers will appear here'}
                  </p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => markAsRead(notification.id)}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                      !notification.read ? 'bg-[#2d5d2a]/5' : ''
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <h4 className="font-medium text-sm">{notification.title}</h4>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-[#2d5d2a] rounded-full" />
                          )}
                        </div>
                        <p className="text-gray-600 text-sm mt-1">{notification.message}</p>
                        <span className="text-gray-400 text-xs mt-2 block">
                          {formatTime(notification.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
