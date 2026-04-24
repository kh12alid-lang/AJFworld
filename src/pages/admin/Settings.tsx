import { useState, useEffect } from 'react';
import { Store, User, Lock, Bell, CreditCard, MapPin, Percent, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

interface LoginRecord {
  id: string;
  email: string;
  role: string;
  ip: string;
  date: string;
  status: 'success' | 'failed';
}

export default function Settings() {
  const { user } = useAuth();
  const { language, isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState('store');
  const [saved, setSaved] = useState(false);
  const [loginHistory, setLoginHistory] = useState<LoginRecord[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('ajfworld_login_history');
    if (saved) {
      try {
        setLoginHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse login history', e);
      }
    }
  }, []);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs = [
    { id: 'store', icon: Store, labelAr: 'إعدادات المتجر', labelEn: 'Store Settings' },
    { id: 'address', icon: MapPin, labelAr: 'العنوان', labelEn: 'Address' },
    { id: 'taxes', icon: Percent, labelAr: 'الضرائب', labelEn: 'Taxes' },
    { id: 'profile', icon: User, labelAr: 'الملف الشخصي', labelEn: 'Profile' },
    { id: 'security', icon: Lock, labelAr: 'الأمان', labelEn: 'Security' },
    { id: 'notifications', icon: Bell, labelAr: 'الإشعارات', labelEn: 'Notifications' },
    { id: 'payment', icon: CreditCard, labelAr: 'طرق الدفع', labelEn: 'Payment Methods' },
    { id: 'history', icon: History, labelAr: 'سجل الدخول', labelEn: 'Login History' },
  ];

  const t = {
    ar: {
      title: 'الإعدادات',
      save: 'حفظ التغييرات',
      saved: 'تم الحفظ!',
      storeName: 'اسم المتجر',
      storeEmail: 'بريد المتجر',
      storePhone: 'هاتف المتجر',
      currency: 'العملة',
      language: 'اللغة',
      description: 'وصف المتجر',
      fullName: 'الاسم الكامل',
      email: 'البريد الإلكتروني',
      changePhoto: 'تغيير الصورة',
      currentPassword: 'كلمة المرور الحالية',
      newPassword: 'كلمة المرور الجديدة',
      confirmPassword: 'تأكيد كلمة المرور',
      twoFactor: 'المصادقة الثنائية',
      enable2FA: 'تفعيل المصادقة الثنائية',
      twoFADesc: 'أضف طبقة إضافية من الأمان',
      newOrders: 'طلبات جديدة',
      newCustomers: 'عملاء جدد',
      newReviews: 'تقييمات جديدة',
      lowStock: 'منتجات منخفضة المخزون',
      creditCard: 'بطاقة ائتمان/خصم',
      applePay: 'Apple Pay',
      googlePay: 'Google Pay',
      samsungPay: 'Samsung Pay',
      cashOnDelivery: 'الدفع عند الاستلام',
      bankTransfer: 'التحويل البنكي',
      digitalWallet: 'المحافظ الإلكترونية',
      address: 'عنوان المتجر',
      city: 'المدينة',
      country: 'الدولة',
      postalCode: 'الرمز البريدي',
      taxRate: 'نسبة الضريبة (%)',
      enableTax: 'تفعيل الضريبة',
      taxNumber: 'الرقم الضريبي',
      loginHistory: 'سجل تسجيل الدخول',
      date: 'التاريخ',
      user: 'المستخدم',
      ip: 'IP',
      status: 'الحالة',
      success: 'نجاح',
      failed: 'فشل',
      noHistory: 'لا يوجد سجل دخول',
    },
    en: {
      title: 'Settings',
      save: 'Save Changes',
      saved: 'Saved!',
      storeName: 'Store Name',
      storeEmail: 'Store Email',
      storePhone: 'Store Phone',
      currency: 'Currency',
      language: 'Language',
      description: 'Store Description',
      fullName: 'Full Name',
      email: 'Email',
      changePhoto: 'Change Photo',
      currentPassword: 'Current Password',
      newPassword: 'New Password',
      confirmPassword: 'Confirm Password',
      twoFactor: 'Two-Factor Authentication',
      enable2FA: 'Enable 2FA',
      twoFADesc: 'Add an extra layer of security',
      newOrders: 'New Orders',
      newCustomers: 'New Customers',
      newReviews: 'New Reviews',
      lowStock: 'Low Stock Alerts',
      creditCard: 'Credit/Debit Card',
      applePay: 'Apple Pay',
      googlePay: 'Google Pay',
      samsungPay: 'Samsung Pay',
      cashOnDelivery: 'Cash on Delivery',
      bankTransfer: 'Bank Transfer',
      digitalWallet: 'Digital Wallet',
      address: 'Store Address',
      city: 'City',
      country: 'Country',
      postalCode: 'Postal Code',
      taxRate: 'Tax Rate (%)',
      enableTax: 'Enable Tax',
      taxNumber: 'Tax Number',
      loginHistory: 'Login History',
      date: 'Date',
      user: 'User',
      ip: 'IP',
      status: 'Status',
      success: 'Success',
      failed: 'Failed',
      noHistory: 'No login history',
    }
  }[language];

  const saveBtn = saved ? t.saved : t.save;

  return (
    <div className="p-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t.title}</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:w-64 space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-[#2d5d2a] text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{language === 'ar' ? tab.labelAr : tab.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          {/* Store Settings */}
          {activeTab === 'store' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-gray-900">{language === 'ar' ? 'إعدادات المتجر' : 'Store Settings'}</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.storeName}</label>
                  <Input defaultValue="AJFworld" className="h-11" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.storeEmail}</label>
                  <Input defaultValue="support@ajfworld.ae" className="h-11" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.storePhone}</label>
                  <Input defaultValue="+971 4 000 0000" className="h-11" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.currency}</label>
                  <select className="w-full h-11 px-4 border border-gray-200 rounded-lg">
                    <option value="AED">AED - درهم إماراتي</option>
                    <option value="USD">USD - دولار أمريكي</option>
                    <option value="SAR">SAR - ريال سعودي</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.language}</label>
                  <select className="w-full h-11 px-4 border border-gray-200 rounded-lg">
                    <option value="ar">العربية</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t.description}</label>
                <textarea
                  className="w-full h-24 px-4 py-3 border border-gray-200 rounded-lg resize-none"
                  defaultValue={language === 'ar'
                    ? 'وجهتك المثالية للتسوق الإلكتروني في الإمارات العربية المتحدة'
                    : 'Your ultimate destination for online shopping in the UAE'
                  }
                />
              </div>
            </div>
          )}

          {/* Address */}
          {activeTab === 'address' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-[#2d5d2a]" />
                <h2 className="text-lg font-bold text-gray-900">{language === 'ar' ? 'عنوان المتجر' : 'Store Address'}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.address}</label>
                  <Input defaultValue="شارع الشيخ زايد، دبي" className="h-11" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.city}</label>
                  <Input defaultValue="دبي" className="h-11" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.country}</label>
                  <Input defaultValue="الإمارات العربية المتحدة" className="h-11" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.postalCode}</label>
                  <Input defaultValue="00000" className="h-11" />
                </div>
              </div>
            </div>
          )}

          {/* Taxes */}
          {activeTab === 'taxes' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Percent className="w-5 h-5 text-[#2d5d2a]" />
                <h2 className="text-lg font-bold text-gray-900">{language === 'ar' ? 'إعدادات الضريبة' : 'Tax Settings'}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{t.enableTax}</p>
                    <p className="text-sm text-gray-500">{language === 'ar' ? 'تفعيل احتساب الضريبة على الطلبات' : 'Enable tax calculation on orders'}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2d5d2a]"></div>
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.taxRate}</label>
                  <Input type="number" defaultValue="5" className="h-11" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.taxNumber}</label>
                  <Input defaultValue="TRN123456789" className="h-11" />
                </div>
              </div>
            </div>
          )}

          {/* Profile */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-gray-900">{language === 'ar' ? 'الملف الشخصي' : 'Profile'}</h2>

              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <img 
                    src={(() => {
                      const saved = localStorage.getItem('ajfworld_profile_avatar');
                      return saved || '';
                    })() || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'A')}&background=2d5d2a&color=fff&size=128`}
                    alt="Avatar"
                    className="w-20 h-20 rounded-full object-cover border-2 border-[#2d5d2a]"
                    onError={e => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'A')}&background=2d5d2a&color=fff&size=128`;
                    }}
                  />
                  <label className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#2d5d2a] rounded-full flex items-center justify-center cursor-pointer shadow-md hover:bg-[#1e401c] transition-colors">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = () => {
                            const result = reader.result as string;
                            localStorage.setItem('ajfworld_profile_avatar', result);
                            setSaved(true);
                            setTimeout(() => setSaved(false), 2000);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{language === 'ar' ? 'انقر على الأيقونة لتغيير الصورة' : 'Click the icon to change photo'}</p>
                  <p className="text-xs text-gray-400">{language === 'ar' ? 'JPG, PNG - الحد الأقصى 2MB' : 'JPG, PNG - Max 2MB'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.fullName}</label>
                  <Input defaultValue={user?.name} className="h-11" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.email}</label>
                  <Input defaultValue={user?.email} className="h-11" disabled />
                </div>
              </div>
            </div>
          )}

          {/* Security */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-gray-900">{language === 'ar' ? 'الأمان' : 'Security'}</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.currentPassword}</label>
                  <Input type="password" className="h-11" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.newPassword}</label>
                  <Input type="password" className="h-11" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.confirmPassword}</label>
                  <Input type="password" className="h-11" />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <h3 className="font-medium text-gray-900 mb-3">{t.twoFactor}</h3>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{t.enable2FA}</p>
                    <p className="text-sm text-gray-500">{t.twoFADesc}</p>
                  </div>
                  <Button variant="outline">{language === 'ar' ? 'تفعيل' : 'Enable'}</Button>
                </div>
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-gray-900">{language === 'ar' ? 'الإشعارات' : 'Notifications'}</h2>

              <div className="space-y-4">
                {[
                  { id: 'orders', label: t.newOrders },
                  { id: 'customers', label: t.newCustomers },
                  { id: 'reviews', label: t.newReviews },
                  { id: 'lowStock', label: t.lowStock },
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-900">{item.label}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2d5d2a]"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payment Methods */}
          {activeTab === 'payment' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-gray-900">{language === 'ar' ? 'طرق الدفع' : 'Payment Methods'}</h2>

              <div className="space-y-4">
                {[
                  { id: 'card', label: t.creditCard },
                  { id: 'apple', label: t.applePay },
                  { id: 'google', label: t.googlePay },
                  { id: 'samsung', label: t.samsungPay },
                  { id: 'cod', label: t.cashOnDelivery },
                  { id: 'bank', label: t.bankTransfer },
                  { id: 'wallet', label: t.digitalWallet },
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-900">{item.label}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked={item.id === 'card' || item.id === 'cod'} />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2d5d2a]"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Login History */}
          {activeTab === 'history' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <History className="w-5 h-5 text-[#2d5d2a]" />
                <h2 className="text-lg font-bold text-gray-900">{t.loginHistory}</h2>
              </div>

              {loginHistory.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="text-left p-4 text-xs font-medium text-gray-500">{t.date}</th>
                        <th className="text-left p-4 text-xs font-medium text-gray-500">{t.user}</th>
                        <th className="text-left p-4 text-xs font-medium text-gray-500">{t.ip}</th>
                        <th className="text-left p-4 text-xs font-medium text-gray-500">{t.status}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {loginHistory.map((record) => (
                        <tr key={record.id} className="hover:bg-gray-50">
                          <td className="p-4">{record.date}</td>
                          <td className="p-4">{record.email} ({record.role})</td>
                          <td className="p-4">{record.ip}</td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${record.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {record.status === 'success' ? t.success : t.failed}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <History className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">{t.noHistory}</p>
                </div>
              )}
            </div>
          )}

          <div className="pt-6 border-t border-gray-100">
            <Button className={saved ? 'bg-green-600' : 'bg-[#2d5d2a] hover:bg-[#1e401c] px-8'} onClick={handleSave}>
              {saveBtn}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
