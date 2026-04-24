import { useEffect, useRef, useState } from 'react';
import { Store, MapPin, Mail, Clock, Facebook, Twitter, Instagram, Youtube, CreditCard, Shield } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const quickLinksAr = [
  { name: 'من نحن', href: '/about' },
  { name: 'تواصل معنا', href: '/contact' },
  { name: 'الأسئلة الشائعة', href: '/faq' },
  { name: 'سياسة الإرجاع', href: '/returns' },
  { name: 'شروط الاستخدام', href: '#' },
  { name: 'سياسة الخصوصية', href: '#' },
];

const quickLinksEn = [
  { name: 'About Us', href: '/about' },
  { name: 'Contact Us', href: '/contact' },
  { name: 'FAQ', href: '/faq' },
  { name: 'Return Policy', href: '/returns' },
  { name: 'Terms of Use', href: '#' },
  { name: 'Privacy Policy', href: '#' },
];

const categoriesAr = [
  { name: 'إلكترونيات', href: '#' },
  { name: 'أزياء', href: '#' },
  { name: 'المنزل والمطبخ', href: '#' },
  { name: 'الجمال', href: '#' },
  { name: 'الرياضة', href: '#' },
  { name: 'الأطفال', href: '#' },
];

const categoriesEn = [
  { name: 'Electronics', href: '#' },
  { name: 'Fashion', href: '#' },
  { name: 'Home & Kitchen', href: '#' },
  { name: 'Beauty', href: '#' },
  { name: 'Sports', href: '#' },
  { name: 'Kids', href: '#' },
];

const socialLinks = [
  { name: 'Facebook', icon: Facebook, href: '#' },
  { name: 'Twitter', icon: Twitter, href: '#' },
  { name: 'Instagram', icon: Instagram, href: '#' },
  { name: 'Youtube', icon: Youtube, href: '#' },
];

export default function Footer() {
  const [isVisible, setIsVisible] = useState(false);
  const footerRef = useRef<HTMLElement>(null);
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

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const quickLinks = language === 'ar' ? quickLinksAr : quickLinksEn;
  const categories = language === 'ar' ? categoriesAr : categoriesEn;
  
  const quickLinksTitle = language === 'ar' ? 'روابط سريعة' : 'Quick Links';
  const categoriesTitle = language === 'ar' ? 'الفئات' : 'Categories';
  const contactTitle = language === 'ar' ? 'تواصل معنا' : 'Contact Us';
  const paymentMethods = language === 'ar' ? 'طرق الدفع:' : 'Payment Methods:';
  const copyright = language === 'ar' ? 'جميع الحقوق محفوظة.' : 'All rights reserved.';
  
  const aboutText = language === 'ar' 
    ? 'وجهتك المثالية للتسوق الإلكتروني في الإمارات العربية المتحدة. نقدم لك مجموعة واسعة من المنتجات عالية الجودة بأسعار مميزة، مع خدمة توصيل سريعة وآمنة.'
    : 'Your ultimate destination for online shopping in the UAE. We offer a wide range of high-quality products at competitive prices, with fast and secure delivery service.';

  const contactInfo = [
    { icon: MapPin, text: language === 'ar' ? 'الإمارات العربية المتحدة' : 'United Arab Emirates' },
    { icon: Mail, text: 'support@ajfworld.ae' },
    { icon: Clock, text: language === 'ar' ? 'السبت - الخميس: 9 ص - 10 م' : 'Sat - Thu: 9 AM - 10 PM' },
  ];

  return (
    <footer ref={footerRef} className="bg-[#1a1a1a] text-white" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Main Footer */}
      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* About Column */}
          <div
            className={`transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-[#2d5d2a] rounded-lg flex items-center justify-center">
                <Store className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">AJFworld</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              {aboutText}
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className={`w-10 h-10 bg-white/10 hover:bg-[#2d5d2a] rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-6 ${
                      isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                    }`}
                    style={{ transitionDelay: `${200 + index * 50}ms` }}
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div
            className={`transition-all duration-700 delay-100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <h3 className="text-lg font-bold mb-6">{quickLinksTitle}</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li
                  key={link.name}
                  className={`transition-all duration-500 ${
                    isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                  }`}
                  style={{ transitionDelay: `${300 + index * 50}ms` }}
                >
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-[#4caf50] transition-colors duration-200 inline-flex items-center gap-2 group"
                  >
                    <span className="w-0 h-0.5 bg-[#4caf50] transition-all duration-200 group-hover:w-3" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div
            className={`transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <h3 className="text-lg font-bold mb-6">{categoriesTitle}</h3>
            <ul className="space-y-3">
              {categories.map((category, index) => (
                <li
                  key={category.name}
                  className={`transition-all duration-500 ${
                    isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                  }`}
                  style={{ transitionDelay: `${400 + index * 50}ms` }}
                >
                  <a
                    href={category.href}
                    className="text-gray-400 hover:text-[#4caf50] transition-colors duration-200 inline-flex items-center gap-2 group"
                  >
                    <span className="w-0 h-0.5 bg-[#4caf50] transition-all duration-200 group-hover:w-3" />
                    {category.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div
            className={`transition-all duration-700 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <h3 className="text-lg font-bold mb-6">{contactTitle}</h3>
            <ul className="space-y-4">
              {contactInfo.map((item, index) => {
                const Icon = item.icon;
                return (
                  <li
                    key={index}
                    className={`flex items-start gap-3 transition-all duration-500 ${
                      isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                    }`}
                    style={{ transitionDelay: `${500 + index * 50}ms` }}
                  >
                    <Icon className="w-5 h-5 text-[#4caf50] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-400 text-sm">{item.text}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      {/* Payment Methods & Copyright */}
      <div className="border-t border-white/10">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Payment Methods */}
            <div
              className={`flex items-center gap-4 transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: '700ms' }}
            >
              <span className="text-gray-400 text-sm">{paymentMethods}</span>
              <div className="flex gap-3">
                <div className="w-12 h-8 bg-white/10 rounded flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-gray-400" />
                </div>
                <div className="w-12 h-8 bg-white/10 rounded flex items-center justify-center">
                  <Shield className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Copyright */}
            <p
              className={`text-gray-500 text-sm text-center transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: '800ms' }}
            >
              © 2025 AJFworld. {copyright}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
