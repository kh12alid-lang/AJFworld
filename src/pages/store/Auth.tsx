import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUser } from '@/context/UserContext';
import { useLanguage } from '@/context/LanguageContext';
import Header from '@/components/store/Header';
import Footer from '@/components/store/Footer';

export default function Auth() {
  const navigate = useNavigate();
  const { login, register, isLoggedIn } = useUser();
  const { language, isRTL } = useLanguage();
  
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  // Redirect if already logged in
  if (isLoggedIn) {
    navigate('/account');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (mode === 'login') {
      const success = await login(formData.email, formData.password);
      if (success) {
        navigate('/account');
      } else {
        setError(language === 'ar' 
          ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
          : 'Invalid email or password'
        );
      }
    } else {
      const success = await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });
      if (success) {
        setIsSuccess(true);
        setTimeout(() => {
          navigate('/account');
        }, 1500);
      } else {
        setError(language === 'ar'
          ? 'البريد الإلكتروني مستخدم بالفعل'
          : 'Email already in use'
        );
      }
    }
    setIsLoading(false);
  };

  const labels = {
    login: {
      title: language === 'ar' ? 'تسجيل الدخول' : 'Login',
      subtitle: language === 'ar' ? 'مرحباً بعودتك!' : 'Welcome back!',
      button: language === 'ar' ? 'تسجيل الدخول' : 'Login',
      switchText: language === 'ar' ? 'ليس لديك حساب؟' : 'Don\'t have an account?',
      switchLink: language === 'ar' ? 'سجل الآن' : 'Register',
    },
    register: {
      title: language === 'ar' ? 'إنشاء حساب' : 'Create Account',
      subtitle: language === 'ar' ? 'انضم إلينا اليوم!' : 'Join us today!',
      button: language === 'ar' ? 'إنشاء حساب' : 'Create Account',
      switchText: language === 'ar' ? 'لديك حساب بالفعل؟' : 'Already have an account?',
      switchLink: language === 'ar' ? 'تسجيل الدخول' : 'Login',
    },
  };

  const formLabels = {
    name: language === 'ar' ? 'الاسم الكامل' : 'Full Name',
    email: language === 'ar' ? 'البريد الإلكتروني' : 'Email',
    phone: language === 'ar' ? 'رقم الهاتف' : 'Phone Number',
    password: language === 'ar' ? 'كلمة المرور' : 'Password',
  };

  const currentLabels = labels[mode];

  return (
    <div className="min-h-screen bg-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <Header />
      
      <main className="pt-20 pb-12">
        <div className="container-custom">
          <div className="max-w-md mx-auto">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-4">
                <img 
                  src="/images/logo-128.png" 
                  alt="AJFworld Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{currentLabels.title}</h1>
              <p className="text-gray-500">{currentLabels.subtitle}</p>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              {isSuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {language === 'ar' ? 'تم إنشاء الحساب!' : 'Account Created!'}
                  </h2>
                  <p className="text-gray-500">
                    {language === 'ar' ? 'جاري تحويلك...' : 'Redirecting...'}
                  </p>
                </div>
              ) : (
                <>
                  {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {mode === 'register' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {formLabels.name}
                        </label>
                        <div className="relative">
                          <User className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400`} />
                          <Input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className={`${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} h-12`}
                            placeholder={language === 'ar' ? 'محمد أحمد' : 'John Doe'}
                            required
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {formLabels.email}
                      </label>
                      <div className="relative">
                        <Mail className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400`} />
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className={`${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} h-12`}
                          placeholder="email@example.com"
                          required
                        />
                      </div>
                    </div>

                    {mode === 'register' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {formLabels.phone}
                        </label>
                        <div className="relative">
                          <Phone className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400`} />
                          <Input
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className={`${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} h-12`}
                            placeholder="+971 50 000 0000"
                            required
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {formLabels.password}
                      </label>
                      <div className="relative">
                        <Lock className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400`} />
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          className={`${isRTL ? 'pr-12 pl-10' : 'pl-10 pr-12'} h-12`}
                          placeholder="••••••••"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className={`absolute ${isRTL ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600`}
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 bg-[#2d5d2a] hover:bg-[#1e401c] text-lg"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="animate-pulse">
                          {language === 'ar' ? 'جاري...' : 'Loading...'}
                        </span>
                      ) : (
                        currentLabels.button
                      )}
                    </Button>
                  </form>

                  {/* Switch Mode */}
                  <div className="mt-6 text-center">
                    <span className="text-gray-500">{currentLabels.switchText} </span>
                    <button
                      onClick={() => {
                        setMode(mode === 'login' ? 'register' : 'login');
                        setError('');
                      }}
                      className="text-[#2d5d2a] font-medium hover:underline"
                    >
                      {currentLabels.switchLink}
                    </button>
                  </div>

                  {/* Forgot Password */}
                  {mode === 'login' && (
                    <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                      <button 
                        type="button"
                        className="text-sm text-[#2d5d2a] hover:underline"
                        onClick={() => setError(language === 'ar' ? 'اتصل بالدعم لإعادة تعيين كلمة المرور' : 'Contact support to reset password')}
                      >
                        {language === 'ar' ? 'نسيت كلمة المرور؟' : 'Forgot password?'}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
