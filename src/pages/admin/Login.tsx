import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        navigate('/admin/dashboard');
      } else {
        setError(
          language === 'ar' 
            ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
            : 'Invalid email or password'
        );
      }
    } catch (err) {
      setError(
        language === 'ar'
          ? 'حدث خطأ أثناء تسجيل الدخول'
          : 'An error occurred during login'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e3d1c] via-[#2d5d2a] to-[#1e3d1c] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <Building2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            AJFworld
          </h1>
          <p className="text-white/60">
            {language === 'ar' ? 'لوحة تحكم المالك' : 'Owner Dashboard'}
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            {language === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={language === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                className="h-12"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'ar' ? 'كلمة المرور' : 'Password'}
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={language === 'ar' ? 'أدخل كلمة المرور' : 'Enter password'}
                  className="h-12 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#2d5d2a] hover:bg-[#1e401c]"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                language === 'ar' ? 'تسجيل الدخول' : 'Sign In'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <a href="/" className="text-sm text-[#2d5d2a] hover:underline">
              {language === 'ar' ? '← العودة للموقع' : '← Back to store'}
            </a>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-white/40 text-sm mt-8">
          © 2026 AJFworld. {language === 'ar' ? 'جميع الحقوق محفوظة' : 'All rights reserved'}.
        </p>
      </div>
    </div>
  );
}
