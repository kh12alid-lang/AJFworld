import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { products } from '@/data/products';
import ProductCard from './ProductCard';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';

export default function FeaturedProducts() {
  const [isVisible, setIsVisible] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
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

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      const scrollDirection = isRTL 
        ? (direction === 'left' ? 1 : -1)
        : (direction === 'left' ? -1 : 1);
      scrollRef.current.scrollBy({
        left: scrollAmount * scrollDirection,
        behavior: 'smooth',
      });
    }
  };

  const featuredProducts = products.filter((p) => p.badge || p.isNew).slice(0, 8);

  const title = language === 'ar' ? 'منتجات مميزة' : 'Featured Products';
  const subtitle = language === 'ar' ? 'اكتشف أفضل العروض والخصومات' : 'Discover the best deals and discounts';
  const viewAll = language === 'ar' ? 'عرض الكل' : 'View All';

  return (
    <section ref={sectionRef} className="section-padding bg-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container-custom">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2
              className={`text-2xl md:text-3xl font-bold text-gray-900 mb-2 transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
              }`}
            >
              {title}
            </h2>
            <p
              className={`text-gray-600 transition-all duration-700 delay-100 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
              }`}
            >
              {subtitle}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('left')}
              className="rounded-full hover:bg-[#2d5d2a] hover:text-white transition-colors"
            >
              {isRTL ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('right')}
              className="rounded-full hover:bg-[#2d5d2a] hover:text-white transition-colors"
            >
              {isRTL ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </Button>
            <a
              href="#"
              className={`hidden md:flex items-center gap-1 text-[#2d5d2a] font-medium hover:underline ${isRTL ? 'mr-4' : 'ml-4'}`}
            >
              {viewAll}
              {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </a>
          </div>
        </div>

        {/* Products Scroll Container */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {featuredProducts.map((product, index) => (
            <div
              key={product.id}
              className={`flex-shrink-0 w-[280px] snap-start transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${200 + index * 100}ms` }}
            >
              <ProductCard product={product} index={index} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
