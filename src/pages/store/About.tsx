import { Store, Award, Users, Truck, Shield, Headphones } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import Header from '@/components/store/Header';
import Footer from '@/components/store/Footer';

const values = [
  {
    icon: Award,
    titleAr: 'الجودة',
    titleEn: 'Quality',
    descAr: 'نقدم منتجات عالية الجودة من أفضل الماركات العالمية',
    descEn: 'We offer high-quality products from the best global brands',
  },
  {
    icon: Users,
    titleAr: 'العملاء أولاً',
    titleEn: 'Customers First',
    descAr: 'رضا العملاء هو هدفنا الأول ونسعى دائماً لتجربة تسوق ممتعة',
    descEn: 'Customer satisfaction is our top priority',
  },
  {
    icon: Truck,
    titleAr: 'السرعة',
    titleEn: 'Speed',
    descAr: 'توصيل سريع خلال 24 ساعة في جميع أنحاء الإمارات',
    descEn: 'Fast delivery within 24 hours across the UAE',
  },
  {
    icon: Shield,
    titleAr: 'الأمان',
    titleEn: 'Security',
    descAr: 'دفع آمن 100% وحماية كاملة لبياناتك الشخصية',
    descEn: '100% secure payment and full data protection',
  },
];

const stats = [
  { value: '50,000+', labelAr: 'عميل سعيد', labelEn: 'Happy Customers' },
  { value: '10,000+', labelAr: 'منتج', labelEn: 'Products' },
  { value: '99%', labelAr: 'رضا العملاء', labelEn: 'Customer Satisfaction' },
  { value: '24/7', labelAr: 'دعم فني', labelEn: 'Support' },
];

export default function About() {
  const { language, isRTL } = useLanguage();

  const title = language === 'ar' ? 'من نحن' : 'About Us';
  const subtitle = language === 'ar' 
    ? 'AJFworld - وجهتك المثالية للتسوق الإلكتروني في الإمارات'
    : 'AJFworld - Your ultimate destination for online shopping in the UAE';
  const ourStory = language === 'ar' ? 'قصتنا' : 'Our Story';
  const storyText = language === 'ar'
    ? 'تأسست AJFworld في عام 2024 بهدف تغيير تجربة التسوق الإلكتروني في الإمارات العربية المتحدة. نحن نؤمن بأن التسوق يجب أن يكون سهلاً، آمناً، وممتعاً. منذ انطلاقنا، ونحن نعمل بجد لتوفير أفضل المنتجات بأسعار تنافسية، مع التركيز على خدمة العملاء المتميزة.'
    : 'AJFworld was founded in 2024 with the goal of changing the online shopping experience in the UAE. We believe shopping should be easy, safe, and enjoyable. Since our launch, we have worked hard to provide the best products at competitive prices, with a focus on excellent customer service.';
  const ourVision = language === 'ar' ? 'رؤيتنا' : 'Our Vision';
  const visionText = language === 'ar'
    ? 'أن نكون المنصة الإلكترونية الرائدة في الإمارات العربية المتحدة، نقدم تجربة تسوق استثنائية تجمع بين الجودة والسعر المناسب والخدمة الممتازة.'
    : 'To be the leading e-commerce platform in the UAE, offering an exceptional shopping experience that combines quality, fair pricing, and excellent service.';
  const ourMission = language === 'ar' ? 'مهمتنا' : 'Our Mission';
  const missionText = language === 'ar'
    ? 'توفير مجموعة واسعة من المنتجات عالية الجودة مع توصيل سريع وخدمة عملاء متميزة، لجعل تجربة التسوق عبر الإنترنت سهلة وممتعة للجميع.'
    : 'Provide a wide range of high-quality products with fast delivery and excellent customer service, making online shopping easy and enjoyable for everyone.';
  const ourValues = language === 'ar' ? 'قيمنا' : 'Our Values';

  return (
    <div className="min-h-screen bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#2d5d2a] to-[#1e401c] py-20">
          <div className="container-custom text-center text-white">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Store className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">{subtitle}</p>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 bg-gray-50">
          <div className="container-custom">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="text-3xl md:text-4xl font-bold text-[#2d5d2a] mb-2">{stat.value}</p>
                  <p className="text-gray-600">{language === 'ar' ? stat.labelAr : stat.labelEn}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16">
          <div className="container-custom">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">{ourStory}</h2>
                <p className="text-gray-600 leading-relaxed mb-6">{storyText}</p>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3">{ourVision}</h3>
                <p className="text-gray-600 leading-relaxed mb-6">{visionText}</p>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3">{ourMission}</h3>
                <p className="text-gray-600 leading-relaxed">{missionText}</p>
              </div>
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=500&fit=crop" 
                  alt="About AJFworld"
                  className="rounded-2xl shadow-xl w-full"
                />
                <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#2d5d2a] rounded-full flex items-center justify-center">
                      <Headphones className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{language === 'ar' ? 'دعم على مدار الساعة' : '24/7 Support'}</p>
                      <p className="text-sm text-gray-500">{language === 'ar' ? 'فريق متخصص جاهز لمساعدتك' : 'Dedicated team ready to help'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{ourValues}</h2>
              <div className="w-20 h-1 bg-[#2d5d2a] mx-auto rounded-full" />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                    <div className="w-14 h-14 bg-[#2d5d2a]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-7 h-7 text-[#2d5d2a]" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">
                      {language === 'ar' ? value.titleAr : value.titleEn}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {language === 'ar' ? value.descAr : value.descEn}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
