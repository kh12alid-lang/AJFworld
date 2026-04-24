import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  Check, 
  Trash2, 
  Package, 
  Tag, 
  Info, 
  AlertTriangle,
  X,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNotifications, type NotificationType } from '@/context/NotificationContext';
import { useLanguage } from '@/context/LanguageContext';
import Header from '@/components/store/Header';
import Footer from '@/components/store/Footer';

const iconMap: Record<NotificationType, typeof Package> = {
  order: Package,
  promo: Tag,
  success: Check,
  info: Info,
  warning: AlertTriangle,
  error: X,
};

const colorMap: Record<NotificationType, string> = {
  order: 'bg-blue-100 text-blue-600',
  promo: 'bg-purple-100 text-purple-600',
  success: 'bg-green-100 text-green-600',
  info: 'bg-gray-100 text-gray-600',
  warning: 'bg-yellow-100 text-yellow-600',
  error: 'bg-red-100 text-red-600',
};

export default function Notifications() {
  const navigate = useNavigate();
  const { language, isRTL } = useLanguage();
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    clearAll 
  } = useNotifications();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return language === 'ar' ? 'الآن' : 'Just now';
    if (minutes < 60) return `${minutes} ${language === 'ar' ? 'دقيقة' : 'min'}`;
    if (hours < 24) return `${hours} ${language === 'ar' ? 'ساعة' : 'h'}`;
    if (days < 7) return `${days} ${language === 'ar' ? 'يوم' : 'd'}`;
    
    return date.toLocaleDateString(language === 'ar' ? 'ar-AE' : 'en-US');
  };

  return (
    <div className="min-h-screen bg-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <Header />
      
      <main className="pt-20 pb-12">
        <div className="container-custom max-w-3xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Bell className="w-6 h-6 text-[#2d5d2a]" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center bg-red-500 text-[10px]">
                    {unreadCount}
                  </Badge>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {language === 'ar' ? 'الإشعارات' : 'Notifications'}
                </h1>
                <p className="text-gray-500 text-sm">
                  {unreadCount} {language === 'ar' ? 'غير مقروءة' : 'unread'}
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={markAllAsRead}
                >
                  <Check className="w-4 h-4 mr-2" />
                  {language === 'ar' ? 'تحديد الكل مقروء' : 'Mark All Read'}
                </Button>
              )}
              {notifications.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAll}
                  className="text-red-500 border-red-200 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {language === 'ar' ? 'مسح الكل' : 'Clear All'}
                </Button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          {notifications.length > 0 ? (
            <div className="space-y-3">
              {notifications.map((notification) => {
                const Icon = iconMap[notification.type];
                const colorClass = colorMap[notification.type];
                
                return (
                  <div
                    key={notification.id}
                    onClick={() => {
                      if (!notification.read) markAsRead(notification.id);
                      if (notification.actionUrl) navigate(notification.actionUrl);
                    }}
                    className={`relative bg-white rounded-xl p-4 shadow-sm border transition-all cursor-pointer ${
                      notification.read 
                        ? 'border-gray-100 opacity-75' 
                        : 'border-[#2d5d2a]/20 bg-[#2d5d2a]/5'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                        <Icon className="w-6 h-6" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-bold text-gray-900">
                            {language === 'ar' ? notification.title.ar : notification.title.en}
                          </h3>
                          <span className="text-xs text-gray-400 flex items-center gap-1 flex-shrink-0">
                            <Clock className="w-3 h-3" />
                            {formatDate(notification.createdAt)}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 text-sm mt-1">
                          {language === 'ar' ? notification.message.ar : notification.message.en}
                        </p>

                        {/* Action Button */}
                        {notification.actionUrl && (
                          <Button
                            variant="link"
                            size="sm"
                            className="mt-2 p-0 h-auto text-[#2d5d2a]"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(notification.actionUrl!);
                            }}
                          >
                            {language === 'ar' 
                              ? notification.actionLabel?.ar 
                              : notification.actionLabel?.en}
                            <span className={`${isRTL ? 'mr-1' : 'ml-1'}`}>→</span>
                          </Button>
                        )}
                      </div>

                      {/* Delete Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Unread Indicator */}
                    {!notification.read && (
                      <div className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} w-2 h-2 bg-[#2d5d2a] rounded-full`} />
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {language === 'ar' ? 'لا توجد إشعارات' : 'No Notifications'}
              </h2>
              <p className="text-gray-500">
                {language === 'ar' 
                  ? 'سنخبرك عندما يكون هناك جديد'
                  : 'We\'ll let you know when there\'s something new'}
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
