import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Ticket, 
  Copy, 
  Check, 
  Percent, 
  Tag,
  Clock,
  AlertCircle,
  ArrowRight,
  Gift
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useCoupons } from '@/context/CouponContext';
import { useLanguage } from '@/context/LanguageContext';
import Header from '@/components/store/Header';
import Footer from '@/components/store/Footer';

export default function Coupons() {
  const navigate = useNavigate();
  const { language, isRTL } = useLanguage();
  const { coupons, validateCoupon } = useCoupons();
  
  const [couponCode, setCouponCode] = useState('');
  const [validationResult, setValidationResult] = useState<{ valid: boolean; message: string } | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const activeCoupons = coupons.filter(c => c.isActive && c.usageCount < c.usageLimit);

  const handleValidate = () => {
    if (!couponCode.trim()) return;
    const result = validateCoupon(couponCode, 500); // Assume 500 AED cart for demo
    setValidationResult({ valid: result.valid, message: result.message });
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'ar' ? 'ar-AE' : 'en-US');
  };

  return (
    <div className="min-h-screen bg-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <Header />
      
      <main className="pt-20 pb-12">
        <div className="container-custom max-w-4xl">
          {/* Hero */}
          <div className="bg-gradient-to-r from-[#2d5d2a] to-[#1e401c] rounded-2xl p-8 mb-8 text-white text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gift className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold mb-2">
              {language === 'ar' ? 'كوبونات الخصم' : 'Discount Coupons'}
            </h1>
            <p className="text-white/80">
              {language === 'ar' 
                ? 'استخدم الكوبونات واحصل على خصومات حصرية'
                : 'Use coupons and get exclusive discounts'}
            </p>
          </div>

          {/* Coupon Validator */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <h2 className="text-lg font-bold mb-4">
              {language === 'ar' ? 'تحقق من كوبون' : 'Validate Coupon'}
            </h2>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Ticket className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400`} />
                <Input
                  value={couponCode}
                  onChange={(e) => {
                    setCouponCode(e.target.value);
                    setValidationResult(null);
                  }}
                  placeholder={language === 'ar' ? 'أدخل كود الكوبون' : 'Enter coupon code'}
                  className={`${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} h-12 uppercase`}
                />
              </div>
              <Button 
                onClick={handleValidate}
                className="h-12 px-8 bg-[#2d5d2a] hover:bg-[#1e401c]"
              >
                {language === 'ar' ? 'تحقق' : 'Validate'}
              </Button>
            </div>
            
            {validationResult && (
              <div className={`mt-4 p-4 rounded-xl flex items-center gap-3 ${
                validationResult.valid ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                {validationResult.valid ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
                <span>{validationResult.message}</span>
              </div>
            )}
          </div>

          {/* Available Coupons */}
          <div>
            <h2 className="text-xl font-bold mb-6">
              {language === 'ar' ? 'كوبونات متاحة' : 'Available Coupons'}
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              {activeCoupons.map((coupon) => (
                <div 
                  key={coupon.id} 
                  className="bg-white rounded-2xl shadow-sm p-6 border-2 border-dashed border-gray-200 hover:border-[#2d5d2a] transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#2d5d2a]/10 rounded-xl flex items-center justify-center">
                        {coupon.type === 'percentage' ? (
                          <Percent className="w-6 h-6 text-[#2d5d2a]" />
                        ) : (
                          <Tag className="w-6 h-6 text-[#2d5d2a]" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{coupon.code}</h3>
                        <p className="text-sm text-gray-500">
                          {language === 'ar' ? coupon.description.ar : coupon.description.en}
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-[#2d5d2a]">
                      {coupon.type === 'percentage' ? `${coupon.value}%` : `${coupon.value} AED`}
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <AlertCircle className="w-4 h-4" />
                      <span>
                        {language === 'ar' 
                          ? `الحد الأدنى للطلب: ${coupon.minOrder} درهم`
                          : `Min order: ${coupon.minOrder} AED`}
                      </span>
                    </div>
                    {coupon.maxDiscount && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Tag className="w-4 h-4" />
                        <span>
                          {language === 'ar' 
                            ? `الحد الأقصى للخصم: ${coupon.maxDiscount} درهم`
                            : `Max discount: ${coupon.maxDiscount} AED`}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>
                        {language === 'ar' 
                          ? `صالح حتى: ${formatDate(coupon.endDate)}`
                          : `Valid until: ${formatDate(coupon.endDate)}`}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      {coupon.usageCount} / {coupon.usageLimit} {language === 'ar' ? 'مستخدم' : 'used'}
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => copyCode(coupon.code)}
                      className={copiedCode === coupon.code ? 'bg-green-50 text-green-600 border-green-200' : ''}
                    >
                      {copiedCode === coupon.code ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          {language === 'ar' ? 'تم النسخ' : 'Copied'}
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          {language === 'ar' ? 'نسخ الكود' : 'Copy Code'}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {activeCoupons.length === 0 && (
              <div className="text-center py-12 bg-white rounded-2xl">
                <Ticket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {language === 'ar' ? 'لا توجد كوبونات متاحة' : 'No Coupons Available'}
                </h3>
                <p className="text-gray-500 mb-4">
                  {language === 'ar' 
                    ? 'تابعنا للحصول على أحدث الكوبونات'
                    : 'Stay tuned for new coupons'}
                </p>
                <Button 
                  onClick={() => navigate('/search')}
                  className="bg-[#2d5d2a] hover:bg-[#1e401c]"
                >
                  {language === 'ar' ? 'تسوق الآن' : 'Shop Now'}
                  <ArrowRight className={`w-4 h-4 ${isRTL ? 'mr-2' : 'ml-2'}`} />
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
