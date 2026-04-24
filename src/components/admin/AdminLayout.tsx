import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import AdminSidebar from './AdminSidebar';
import { useLanguage } from '@/context/LanguageContext';

export default function AdminLayout() {
  const { isAuthenticated } = useAuth();
  const { isRTL } = useLanguage();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex" dir={isRTL ? 'rtl' : 'ltr'}>
      <AdminSidebar />
      <main className={`flex-1 lg:${isRTL ? 'mr-64' : 'ml-64'} transition-all duration-300`}>
        <Outlet />
      </main>
    </div>
  );
}
