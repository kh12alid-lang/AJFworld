import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'order' | 'promo';

export interface Notification {
  id: string;
  type: NotificationType;
  title: {
    ar: string;
    en: string;
  };
  message: {
    ar: string;
    en: string;
  };
  read: boolean;
  createdAt: string;
  actionUrl?: string;
  actionLabel?: {
    ar: string;
    en: string;
  };
  image?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
  getUnread: () => Notification[];
}

// Mock notifications
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    type: 'order',
    title: { ar: 'تم توصيل طلبك', en: 'Order Delivered' },
    message: { ar: 'تم توصيل طلبك #AJ-001234 بنجاح', en: 'Your order #AJ-001234 has been delivered' },
    read: false,
    createdAt: '2025-01-15T10:30:00',
    actionUrl: '/account',
    actionLabel: { ar: 'عرض الطلب', en: 'View Order' },
  },
  {
    id: 'notif-2',
    type: 'promo',
    title: { ar: 'عرض خاص!', en: 'Special Offer!' },
    message: { ar: 'خصم 30% على جميع السماعات لفترة محدودة', en: '30% off on all headphones for limited time' },
    read: false,
    createdAt: '2025-01-14T14:00:00',
    actionUrl: '/',
    actionLabel: { ar: 'تسوق الآن', en: 'Shop Now' },
  },
  {
    id: 'notif-3',
    type: 'success',
    title: { ar: 'تم إضافة النقاط', en: 'Points Added' },
    message: { ar: 'تم إضافة 299 نقطة إلى رصيدك', en: '299 points added to your balance' },
    read: true,
    createdAt: '2025-01-10T09:15:00',
  },
  {
    id: 'notif-4',
    type: 'info',
    title: { ar: 'مرحباً بك!', en: 'Welcome!' },
    message: { ar: 'تم إنشاء حسابك بنجاح. استمتع بالتسوق!', en: 'Your account has been created. Happy shopping!' },
    read: true,
    createdAt: '2024-12-01T16:00:00',
  },
];

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}`,
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const getUnread = useCallback(() => {
    return notifications.filter(n => !n.read);
  }, [notifications]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
        getUnread,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
