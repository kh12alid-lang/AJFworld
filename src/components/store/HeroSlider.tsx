import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { heroSlides } from '@/data/products';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const { language, isRTL } = useLanguage();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const goToSlide = useCallback((index: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide(index);
    setTimeout(() => setIsAnimating(false), 800);
  }, [isAnimating]);

  const nextSlide = useCallback(() => {
    goToSlide((currentSlide + 1) % heroSlides.length);
  }, [currentSlide, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide((currentSlide - 1 + heroSlides.length) % heroSlides.length);
  }, [currentSlide, goToSlide]);

  useEffect(() => {
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <section className="relative h-[400px] md:h-[500px] lg:h-[550px] overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
      {heroSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-800 ${
            index === currentSlide
              ? 'opacity-100 z-10'
              : 'opacity-0 z-0'
          }`}
        >
          {/* Background Image */}
          <div
            className={`absolute inset-0 transition-transform duration-[8000ms] ${
              index === currentSlide ? 'scale-105' : 'scale-100'
            }`}
          >
            <img
              src={slide.image}
              alt={language === 'ar' ? slide.title : slide.titleEn}
              className="w-full h-full object-cover"
            />
            {/* Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-r ${slide.color}`} />
          </div>

          {/* Content */}
          <div className="relative z-20 h-full container-custom flex items-center">
            <div className={`max-w-xl text-white ${isRTL ? 'text-right mr-auto' : 'text-left ml-auto'}`}>
              <span
                className={`inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-4 transition-all duration-700 ${
                  isLoaded && index === currentSlide
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: '200ms' }}
              >
                {language === 'ar' ? slide.subtitle : slide.subtitleEn}
              </span>
              <h2
                className={`text-3xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight transition-all duration-700 ${
                  isLoaded && index === currentSlide
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: '400ms' }}
              >
                {language === 'ar' ? slide.title : slide.titleEn}
              </h2>
              <p
                className={`text-lg md:text-xl text-white/90 mb-8 transition-all duration-700 ${
                  isLoaded && index === currentSlide
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: '600ms' }}
              >
                {language === 'ar' ? slide.description : slide.descriptionEn}
              </p>
              <div
                className={`transition-all duration-700 ${
                  isLoaded && index === currentSlide
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: '800ms' }}
              >
                <Button
                  size="lg"
                  className="bg-white text-[#2d5d2a] hover:bg-gray-100 px-8 py-6 text-lg font-semibold rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  {language === 'ar' ? slide.cta : slide.ctaEn}
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className={`absolute ${isRTL ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 group`}
        aria-label={language === 'ar' ? 'السابق' : 'Previous'}
      >
        <ChevronLeft className="w-6 h-6 text-white group-hover:-translate-x-0.5 transition-transform" />
      </button>
      <button
        onClick={nextSlide}
        className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 group`}
        aria-label={language === 'ar' ? 'التالي' : 'Next'}
      >
        <ChevronRight className="w-6 h-6 text-white group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-white w-8'
                : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`${language === 'ar' ? 'الشريحة' : 'Slide'} ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
