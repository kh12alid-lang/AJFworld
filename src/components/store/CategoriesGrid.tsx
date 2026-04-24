import { useEffect, useRef, useState } from 'react';
import { categories } from '@/data/products';
import { useLanguage } from '@/context/LanguageContext';

export default function CategoriesGrid() {
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
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const title = language === 'ar' ? 'تسوق حسب الفئة' : 'Shop by Category';
  const subtitle = language === 'ar' ? 'اكتشف مجموعتنا المتنوعة من المنتجات' : 'Discover our diverse collection of products';
  const productText = language === 'ar' ? 'منتج' : 'products';

  return (
    <section ref={sectionRef} className="section-padding bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2
            className={`text-2xl md:text-3xl font-bold text-gray-900 mb-3 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            {title}
          </h2>
          <p
            className={`text-gray-600 transition-all duration-700 delay-100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            {subtitle}
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <a
              key={category.id}
              href="#"
              className={`group relative overflow-hidden rounded-2xl aspect-square transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{ transitionDelay: `${200 + index * 80}ms` }}
            >
              {/* Image */}
              <img
                src={category.image}
                alt={language === 'ar' ? category.name : category.nameEn}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-300" />
              
              {/* Content */}
              <div className={`absolute inset-0 flex flex-col justify-end p-4 md:p-6 ${isRTL ? 'items-end' : 'items-start'}`}>
                <h3 className="text-white font-bold text-lg md:text-xl mb-1 transition-transform duration-300 group-hover:-translate-y-1">
                  {language === 'ar' ? category.name : category.nameEn}
                </h3>
                <p className="text-white/80 text-sm transition-all duration-300 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0">
                  {category.productCount} {productText}
                </p>
              </div>

              {/* Hover Border */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#2d5d2a] rounded-2xl transition-colors duration-300" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
