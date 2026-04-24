import { useState, useEffect } from 'react';
import { X, Truck } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function TopBanner() {
  const [isVisible, setIsVisible] = useState(false); // Hidden by default
  const [isAnimated, setIsAnimated] = useState(false);
  const { language, isRTL } = useLanguage();

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  const text = language === 'ar' 
    ? 'شحن مجاني للطلبات فوق 200 درهم | توصيل سريع خلال 24 ساعة'
    : 'Free shipping on orders over 200 AED | Fast delivery within 24 hours';

  return (
    <div
      className={`bg-[#2d5d2a] text-white py-2.5 px-4 relative overflow-hidden transition-all duration-500 ${
        isAnimated ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="absolute inset-0 animate-shimmer" />
      <div className="container-custom flex items-center justify-center gap-2 text-sm">
        <Truck className="w-4 h-4" />
        <span className="font-medium">{text}</span>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className={`absolute ${isRTL ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full transition-colors`}
        aria-label={language === 'ar' ? 'إغلاق' : 'Close'}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
