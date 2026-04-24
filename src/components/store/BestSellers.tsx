import { useEffect, useRef, useState } from 'react';
import { useStoreProducts } from '@/hooks/useStoreData';
import ProductCard from './ProductCard';
import { Button } from '@/components/ui/button';
import { Award } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function BestSellers() {
  const [isVisible, setIsVisible] = useState(false);
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
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const products = useStoreProducts();
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 8);

  const badgeText = language === 'ar' ? 'الأكثر طلباً' : 'Most Requested';
  const title = language === 'ar' ? 'الأكثر مبيعاً' : 'Best Sellers';
  const subtitle = language === 'ar' 
    ? 'منتجات اختارها عملاؤنا وحققت أعلى المبيعات'
    : 'Products chosen by our customers with the highest sales';
  const viewAll = language === 'ar' ? 'عرض جميع المنتجات الأكثر مبيعاً' : 'View All Best Sellers';

  return (
    <section ref={sectionRef} className="section-padding bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 bg-[#ffc107]/10 rounded-full mb-4 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <Award className="w-5 h-5 text-[#ffc107]" />
            <span className="text-[#ffc107] font-medium">{badgeText}</span>
          </div>
          <h2
            className={`text-2xl md:text-3xl font-bold text-gray-900 mb-3 transition-all duration-700 delay-100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            {title}
          </h2>
          <p
            className={`text-gray-600 max-w-xl mx-auto transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            {subtitle}
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {bestSellers.map((product, index) => (
            <div
              key={product.id}
              className={`transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{ transitionDelay: `${300 + index * 80}ms` }}
            >
              <ProductCard product={product} index={index} />
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div
          className={`text-center mt-10 transition-all duration-700 delay-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <Button
            variant="outline"
            size="lg"
            className="border-2 border-[#2d5d2a] text-[#2d5d2a] hover:bg-[#2d5d2a] hover:text-white px-8"
          >
            {viewAll}
          </Button>
        </div>
      </div>
    </section>
  );
}
