import { RefreshCw, Truck, Shield, Clock, Package, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import Header from '@/components/store/Header';
import Footer from '@/components/store/Footer';

const returnSteps = [
  {
    icon: Package,
    titleAr: 'تقديم طلب الإرجاع',
    titleEn: 'Submit Return Request',
    descAr: 'سجل دخولك واذهب إلى "طلباتي" ثم اختر "إرجاع"',
    descEn: 'Log in and go to "My Orders" then select "Return"',
  },
  {
    icon: CheckCircle,
    titleAr: 'الموافقة على الإرجاع',
    titleEn: 'Return Approval',
    descAr: 'سنراجع طلبك ونوافق عليه خلال 24 ساعة',
    descEn: 'We will review and approve your request within 24 hours',
  },
  {
    icon: Truck,
    titleAr: 'استلام المنتج',
    titleEn: 'Product Pickup',
    descAr: 'سنرسل مندوب لاستلام المنتج من عنوانك',
    descEn: 'We will send a representative to pick up the product from your address',
  },
  {
    icon: RefreshCw,
    titleAr: 'استرداد المبلغ',
    titleEn: 'Refund',
    descAr: 'بعد فحص المنتج، يتم استرداد المبلغ خلال 5-7 أيام',
    descEn: 'After product inspection, refund within 5-7 days',
  },
];

const conditions = [
  {
    allowed: true,
    textAr: 'المنتج في حالته الأصلية وغير مستخدم',
    textEn: 'Product in original condition and unused',
  },
  {
    allowed: true,
    textAr: 'جميع الملحقات والتغليف الأصلي موجودة',
    textEn: 'All accessories and original packaging present',
  },
  {
    allowed: true,
    textAr: 'الفاتورة الأصلية أو إيصال الطلب متوفر',
    textEn: 'Original invoice or order receipt available',
  },
  {
    allowed: true,
    textAr: 'الطلب خلال 14 يوماً من تاريخ الاستلام',
    textEn: 'Request within 14 days of receipt',
  },
  {
    allowed: false,
    textAr: 'المنتجات المخصصة أو المصنعة حسب الطلب',
    textEn: 'Customized or made-to-order products',
  },
  {
    allowed: false,
    textAr: 'المنتجات القابلة للتلف مثل الطعام',
    textEn: 'Perishable products such as food',
  },
  {
    allowed: false,
    textAr: 'بطاقات الهدايا والقسائم الشرائية',
    textEn: 'Gift cards and vouchers',
  },
  {
    allowed: false,
    textAr: 'المنتجات المستخدمة أو التالفة',
    textEn: 'Used or damaged products',
  },
];

export default function Returns() {
  const { language, isRTL } = useLanguage();

  const title = language === 'ar' ? 'سياسة الإرجاع والاستبدال' : 'Return & Exchange Policy';
  const subtitle = language === 'ar'
    ? 'نحن نريدك أن تكون راضياً تماماً عن مشترياتك'
    : 'We want you to be completely satisfied with your purchases';
  const returnWindow = language === 'ar' ? 'فترة الإرجاع' : 'Return Window';
  const days = language === 'ar' ? '14 يوماً' : '14 Days';
  const fromDelivery = language === 'ar' ? 'من تاريخ الاستلام' : 'From delivery date';
  const freeReturns = language === 'ar' ? 'إرجاع مجاني' : 'Free Returns';
  const noFees = language === 'ar' ? 'بدون أي رسوم إضافية' : 'No additional fees';
  const refundTime = language === 'ar' ? 'مدة الاسترداد' : 'Refund Time';
  const fiveToSeven = language === 'ar' ? '5-7 أيام عمل' : '5-7 Business days';
  const originalMethod = language === 'ar' ? 'لنفس طريقة الدفع' : 'To original payment method';
  const howToReturn = language === 'ar' ? 'كيفية إرجاع منتج' : 'How to Return a Product';
  const returnConditions = language === 'ar' ? 'شروط الإرجاع' : 'Return Conditions';
  const allowed = language === 'ar' ? 'مسموح' : 'Allowed';
  const notAllowed = language === 'ar' ? 'غير مسموح' : 'Not Allowed';
  const shippingPolicy = language === 'ar' ? 'سياسة الشحن' : 'Shipping Policy';
  const expressDelivery = language === 'ar' ? 'توصيل سريع' : 'Express Delivery';
  const expressDesc = language === 'ar' ? 'خلال 24 ساعة في دبي وأبوظبي' : 'Within 24 hours in Dubai & Abu Dhabi';
  const standardDelivery = language === 'ar' ? 'توصيل عادي' : 'Standard Delivery';
  const standardDesc = language === 'ar' ? '1-3 أيام عمل في باقي الإمارات' : '1-3 business days in other emirates';
  const freeShipping = language === 'ar' ? 'شحن مجاني' : 'Free Shipping';
  const freeShippingDesc = language === 'ar' ? 'للطلبات فوق 200 درهم' : 'For orders over 200 AED';
  const trackOrder = language === 'ar' ? 'تتبع الطلب' : 'Track Order';
  const trackDesc = language === 'ar' ? 'تتبع شحنتك في الوقت الفعلي' : 'Track your shipment in real-time';

  return (
    <div className="min-h-screen bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#2d5d2a] to-[#1e401c] py-16">
          <div className="container-custom text-center text-white">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <RefreshCw className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">{subtitle}</p>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 -mt-8">
          <div className="container-custom">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 text-center">
                <div className="w-14 h-14 bg-[#2d5d2a]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-7 h-7 text-[#2d5d2a]" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{days}</h3>
                <p className="text-gray-500">{returnWindow}</p>
                <p className="text-sm text-gray-400">{fromDelivery}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 text-center">
                <div className="w-14 h-14 bg-[#2d5d2a]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Truck className="w-7 h-7 text-[#2d5d2a]" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{freeReturns}</h3>
                <p className="text-gray-500">{noFees}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 text-center">
                <div className="w-14 h-14 bg-[#2d5d2a]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-7 h-7 text-[#2d5d2a]" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{fiveToSeven}</h3>
                <p className="text-gray-500">{refundTime}</p>
                <p className="text-sm text-gray-400">{originalMethod}</p>
              </div>
            </div>
          </div>
        </section>

        {/* How to Return */}
        <section className="py-16 bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{howToReturn}</h2>
              <div className="w-20 h-1 bg-[#2d5d2a] mx-auto rounded-full" />
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {returnSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={index} className="relative">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center h-full">
                      <div className="w-14 h-14 bg-[#2d5d2a] rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 text-sm font-bold text-gray-600">
                        {index + 1}
                      </div>
                      <h3 className="font-bold text-gray-900 mb-2">
                        {language === 'ar' ? step.titleAr : step.titleEn}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {language === 'ar' ? step.descAr : step.descEn}
                      </p>
                    </div>
                    {index < returnSteps.length - 1 && (
                      <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                        <div className="w-6 h-6 bg-[#2d5d2a] rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">→</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Conditions */}
        <section className="py-16">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{returnConditions}</h2>
              <div className="w-20 h-1 bg-[#2d5d2a] mx-auto rounded-full" />
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Allowed */}
              <div className="bg-green-50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-green-700">{allowed}</h3>
                </div>
                <ul className="space-y-3">
                  {conditions.filter(c => c.allowed).map((condition, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">
                        {language === 'ar' ? condition.textAr : condition.textEn}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Not Allowed */}
              <div className="bg-red-50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                    <XCircle className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-red-700">{notAllowed}</h3>
                </div>
                <ul className="space-y-3">
                  {conditions.filter(c => !c.allowed).map((condition, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">
                        {language === 'ar' ? condition.textAr : condition.textEn}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Shipping Policy */}
        <section className="py-16 bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{shippingPolicy}</h2>
              <div className="w-20 h-1 bg-[#2d5d2a] mx-auto rounded-full" />
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                <div className="w-14 h-14 bg-[#2d5d2a]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Truck className="w-7 h-7 text-[#2d5d2a]" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{expressDelivery}</h3>
                <p className="text-sm text-gray-600">{expressDesc}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                <div className="w-14 h-14 bg-[#2d5d2a]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Package className="w-7 h-7 text-[#2d5d2a]" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{standardDelivery}</h3>
                <p className="text-sm text-gray-600">{standardDesc}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                <div className="w-14 h-14 bg-[#2d5d2a]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-7 h-7 text-[#2d5d2a]" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{freeShipping}</h3>
                <p className="text-sm text-gray-600">{freeShippingDesc}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                <div className="w-14 h-14 bg-[#2d5d2a]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-7 h-7 text-[#2d5d2a]" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{trackOrder}</h3>
                <p className="text-sm text-gray-600">{trackDesc}</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
