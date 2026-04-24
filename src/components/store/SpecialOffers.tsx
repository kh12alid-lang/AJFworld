import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';

export default function SpecialOffers() {
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 14,
    minutes: 35,
    seconds: 42,
  });
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

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { days, hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) {
          seconds = 59;
          minutes--;
        }
        if (minutes < 0) {
          minutes = 59;
          hours--;
        }
        if (hours < 0) {
          hours = 23;
          days--;
        }
        if (days < 0) {
          days = 2;
          hours = 14;
          minutes = 35;
          seconds = 42;
        }
        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  const title = language === 'ar' ? 'خصومات حصرية تنتهي قريباً' : 'Exclusive Offers Ending Soon';
  const subtitle = language === 'ar' ? 'عروض محدودة' : 'Limited Offers';
  const description = language === 'ar' 
    ? 'لا تفوت فرصتك للحصول على أفضل المنتجات بأسعار لا تُقاوم'
    : 'Don\'t miss your chance to get the best products at unbeatable prices';
  const cta = language === 'ar' ? 'تسوق العروض' : 'Shop Offers';
  
  const timeLabels = {
    days: language === 'ar' ? 'يوم' : 'Days',
    hours: language === 'ar' ? 'ساعة' : 'Hours',
    minutes: language === 'ar' ? 'دقيقة' : 'Mins',
    seconds: language === 'ar' ? 'ثانية' : 'Secs',
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-16 md:py-24 overflow-hidden"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#2d5d2a] to-[#4caf50]" />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="container-custom relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
          {/* Content */}
          <div className={`text-center lg:${isRTL ? 'text-right' : 'text-left'} text-white`}>
            <span
              className={`inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-4 transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              {subtitle}
            </span>
            <h2
              className={`text-3xl md:text-5xl font-bold mb-4 transition-all duration-700 delay-100 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              {title}
            </h2>
            <p
              className={`text-white/90 text-lg mb-8 max-w-xl transition-all duration-700 delay-200 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              {description}
            </p>
            <div
              className={`transition-all duration-700 delay-300 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              <Button
                size="lg"
                className="bg-white text-[#2d5d2a] hover:bg-gray-100 px-8 py-6 text-lg font-semibold rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {cta}
              </Button>
            </div>
          </div>

          {/* Countdown */}
          <div
            className={`flex gap-4 transition-all duration-700 delay-400 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {[
              { value: timeLeft.days, label: timeLabels.days },
              { value: timeLeft.hours, label: timeLabels.hours },
              { value: timeLeft.minutes, label: timeLabels.minutes },
              { value: timeLeft.seconds, label: timeLabels.seconds },
            ].map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-2">
                  <span className="text-2xl md:text-3xl font-bold text-white">
                    {formatNumber(item.value)}
                  </span>
                </div>
                <span className="text-white/80 text-sm">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
