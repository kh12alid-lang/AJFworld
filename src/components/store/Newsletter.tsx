import { useEffect, useRef, useState } from 'react';
import { Mail, Send, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/context/LanguageContext';

export default function Newsletter() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { language, isRTL } = useLanguage();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setEmail('');
      }, 3000);
    }
  };

  const title = language === 'ar' ? 'اشترك في نشرتنا الإخبارية' : 'Subscribe to Our Newsletter';
  const description = language === 'ar' 
    ? 'احصل على أحدث العروض والخصومات مباشرة إلى بريدك الإلكتروني'
    : 'Get the latest offers and discounts directly to your email';
  const placeholder = language === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email';
  const subscribeBtn = language === 'ar' ? 'اشترك الآن' : 'Subscribe Now';
  const successMsg = language === 'ar' ? 'تم الاشتراك!' : 'Subscribed!';
  const privacyNote = language === 'ar' ? 'نحن نحترم خصوصيتك - لا رسائل مزعجة' : 'We respect your privacy - no spam';

  return (
    <section ref={sectionRef} className="section-padding bg-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container-custom">
        <div
          className={`max-w-3xl mx-auto bg-gradient-to-br from-[#2d5d2a] to-[#1e401c] rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden transition-all duration-700 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          {/* Decorative Elements */}
          <div className={`absolute top-0 ${isRTL ? 'right-0' : 'left-0'} w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 ${isRTL ? 'translate-x-1/2' : '-translate-x-1/2'}`} />
          <div className={`absolute bottom-0 ${isRTL ? 'left-0' : 'right-0'} w-32 h-32 bg-white/5 rounded-full translate-y-1/2 ${isRTL ? '-translate-x-1/2' : 'translate-x-1/2'}`} />
          
          <div className="relative z-10">
            {/* Icon */}
            <div
              className={`w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-700 delay-200 ${
                isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
              }`}
            >
              <Mail className="w-8 h-8" />
            </div>

            {/* Title */}
            <h2
              className={`text-2xl md:text-3xl font-bold mb-3 transition-all duration-700 delay-300 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              {title}
            </h2>

            {/* Description */}
            <p
              className={`text-white/80 mb-8 max-w-lg mx-auto transition-all duration-700 delay-400 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              {description}
            </p>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className={`flex flex-col sm:flex-row gap-3 max-w-md mx-auto transition-all duration-700 delay-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <div className="relative flex-1">
                <Input
                  type="email"
                  placeholder={placeholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full h-14 ${isRTL ? 'pr-4 pl-12' : 'pl-4 pr-12'} bg-white/10 border-white/20 text-white placeholder:text-white/60 rounded-xl focus-visible:ring-white/30 ${isRTL ? 'text-right' : 'text-left'}`}
                  disabled={isSubmitted}
                />
              </div>
              <Button
                type="submit"
                className={`h-14 px-6 rounded-xl font-semibold transition-all duration-300 ${
                  isSubmitted
                    ? 'bg-[#4caf50] hover:bg-[#4caf50]'
                    : 'bg-white text-[#2d5d2a] hover:bg-gray-100'
                }`}
                disabled={isSubmitted}
              >
                {isSubmitted ? (
                  <>
                    <Check className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {successMsg}
                  </>
                ) : (
                  <>
                    <Send className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {subscribeBtn}
                  </>
                )}
              </Button>
            </form>

            {/* Privacy Note */}
            <p
              className={`text-white/60 text-sm mt-4 transition-all duration-700 delay-600 ${
                isVisible ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {privacyNote}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
