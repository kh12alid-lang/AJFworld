import { useState } from 'react';
import { ChevronDown, Search, HelpCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/context/LanguageContext';
import Header from '@/components/store/Header';
import Footer from '@/components/store/Footer';

interface FAQItem {
  questionAr: string;
  questionEn: string;
  answerAr: string;
  answerEn: string;
  category: string;
}

const faqData: FAQItem[] = [
  {
    questionAr: 'كيف أقوم بالطلب من الموقع؟',
    questionEn: 'How do I place an order?',
    answerAr: 'اختر المنتجات التي تريدها، أضفها إلى سلة التسوق، ثم اضغط على "إتمام الشراء". اتبع خطوات إدخال عنوانك واختيار طريقة الدفع، ثم أكد الطلب.',
    answerEn: 'Select the products you want, add them to your cart, then click "Checkout". Follow the steps to enter your address and choose payment method, then confirm your order.',
    category: 'orders',
  },
  {
    questionAr: 'ما هي طرق الدفع المتاحة؟',
    questionEn: 'What payment methods are available?',
    answerAr: 'نقبل الدفع عبر: بطاقات الائتمان/الخصم (Visa, Mastercard)، Apple Pay، Google Pay، Samsung Pay، والدفع عند الاستلام.',
    answerEn: 'We accept: Credit/Debit cards (Visa, Mastercard), Apple Pay, Google Pay, Samsung Pay, and Cash on Delivery.',
    category: 'payment',
  },
  {
    questionAr: 'كم تستغرق عملية التوصيل؟',
    questionEn: 'How long does delivery take?',
    answerAr: 'التوصيل السريع خلال 24 ساعة في دبي وأبوظبي. باقي الإمارات خلال 1-3 أيام عمل.',
    answerEn: 'Express delivery within 24 hours in Dubai and Abu Dhabi. Other emirates within 1-3 business days.',
    category: 'shipping',
  },
  {
    questionAr: 'هل يوجد شحن مجاني؟',
    questionEn: 'Is there free shipping?',
    answerAr: 'نعم! الشحن مجاني للطلبات فوق 200 درهم إماراتي.',
    answerEn: 'Yes! Free shipping on orders over 200 AED.',
    category: 'shipping',
  },
  {
    questionAr: 'كيف يمكنني تتبع طلبي؟',
    questionEn: 'How can I track my order?',
    answerAr: 'بعد تأكيد الطلب، ستصلك رسالة بريد إلكتروني تحتوي على رقم التتبع. يمكنك استخدامه في صفحة "تتبع الطلب".',
    answerEn: 'After order confirmation, you will receive an email with a tracking number. You can use it on the "Track Order" page.',
    category: 'orders',
  },
  {
    questionAr: 'ما هي سياسة الإرجاع؟',
    questionEn: 'What is the return policy?',
    answerAr: 'يمكنك إرجاع المنتجات خلال 14 يوماً من تاريخ الاستلام، شريطة أن تكون في حالتها الأصلية مع الفاتورة.',
    answerEn: 'You can return products within 14 days of receipt, provided they are in their original condition with the invoice.',
    category: 'returns',
  },
  {
    questionAr: 'كيف أسترد أموالي؟',
    questionEn: 'How do I get a refund?',
    answerAr: 'بعد استلام المرتجع والتحقق منه، يتم استرداد المبلغ خلال 5-7 أيام عمل بنفس طريقة الدفع الأصلية.',
    answerEn: 'After receiving and verifying the return, the refund will be processed within 5-7 business days using the original payment method.',
    category: 'returns',
  },
  {
    questionAr: 'هل المنتجات أصلية؟',
    questionEn: 'Are the products authentic?',
    answerAr: 'نعم 100%! جميع منتجاتنا أصلية ومن مصادر موثوقة. نضمن جودة كل منتج نبيعه.',
    answerEn: 'Yes 100%! All our products are authentic and from trusted sources. We guarantee the quality of every product we sell.',
    category: 'products',
  },
  {
    questionAr: 'هل يمكنني تغيير عنوان التوصيل بعد الطلب؟',
    questionEn: 'Can I change the delivery address after ordering?',
    answerAr: 'نعم، يمكنك تغيير العنوان قبل شحن الطلب. تواصل مع خدمة العملاء على الفور.',
    answerEn: 'Yes, you can change the address before the order is shipped. Contact customer service immediately.',
    category: 'orders',
  },
  {
    questionAr: 'كيف أتواصل مع خدمة العملاء؟',
    questionEn: 'How do I contact customer service?',
    answerAr: 'يمكنك التواصل معنا عبر: البريد الإلكتروني support@ajfworld.ae، أو الهاتف +971 50 839 3030، أو نموذج التواصل في موقعنا.',
    answerEn: 'You can contact us via: Email support@ajfworld.ae, Phone +971 50 839 3030, or the contact form on our website.',
    category: 'support',
  },
];

const categories = [
  { id: 'all', labelAr: 'الكل', labelEn: 'All' },
  { id: 'orders', labelAr: 'الطلبات', labelEn: 'Orders' },
  { id: 'payment', labelAr: 'الدفع', labelEn: 'Payment' },
  { id: 'shipping', labelAr: 'الشحن', labelEn: 'Shipping' },
  { id: 'returns', labelAr: 'الإرجاع', labelEn: 'Returns' },
  { id: 'products', labelAr: 'المنتجات', labelEn: 'Products' },
  { id: 'support', labelAr: 'الدعم', labelEn: 'Support' },
];

export default function FAQ() {
  const { language, isRTL } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [openItems, setOpenItems] = useState<number[]>([]);

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = language === 'ar'
      ? faq.questionAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answerAr.toLowerCase().includes(searchQuery.toLowerCase())
      : faq.questionEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answerEn.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleItem = (index: number) => {
    setOpenItems(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const title = language === 'ar' ? 'الأسئلة الشائعة' : 'Frequently Asked Questions';
  const subtitle = language === 'ar'
    ? 'إجابات على أكثر الأسئلة التي يطرحها عملاؤنا'
    : 'Answers to the most common questions our customers ask';
  const searchPlaceholder = language === 'ar' ? 'ابحث في الأسئلة...' : 'Search questions...';
  const stillHaveQuestions = language === 'ar' ? 'لم تجد إجابتك؟' : 'Still have questions?';
  const contactUs = language === 'ar' ? 'تواصل معنا' : 'Contact Us';

  return (
    <div className="min-h-screen bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#2d5d2a] to-[#1e401c] py-16">
          <div className="container-custom text-center text-white">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <HelpCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">{subtitle}</p>
          </div>
        </section>

        {/* Search & Filter */}
        <section className="py-8 bg-gray-50">
          <div className="container-custom">
            <div className="max-w-2xl mx-auto">
              <div className="relative mb-6">
                <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400`} />
                <Input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} h-12`}
                />
              </div>

              <div className="flex flex-wrap gap-2 justify-center">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === cat.id
                        ? 'bg-[#2d5d2a] text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {language === 'ar' ? cat.labelAr : cat.labelEn}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ List */}
        <section className="py-12">
          <div className="container-custom max-w-3xl">
            <div className="space-y-4">
              {filteredFAQs.map((faq, index) => {
                const isOpen = openItems.includes(index);
                return (
                  <div
                    key={index}
                    className="bg-white rounded-xl border border-gray-100 overflow-hidden"
                  >
                    <button
                      onClick={() => toggleItem(index)}
                      className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium text-gray-900 pr-4">
                        {language === 'ar' ? faq.questionAr : faq.questionEn}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5">
                        <p className="text-gray-600 leading-relaxed">
                          {language === 'ar' ? faq.answerAr : faq.answerEn}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {filteredFAQs.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  {language === 'ar' ? 'لا توجد نتائج مطابقة للبحث' : 'No matching results found'}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-12 bg-gray-50">
          <div className="container-custom text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{stillHaveQuestions}</h2>
            <p className="text-gray-600 mb-6">
              {language === 'ar'
                ? 'فريق خدمة العملاء جاهز لمساعدتك على مدار الساعة'
                : 'Our customer service team is ready to help you 24/7'}
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3 bg-[#2d5d2a] text-white rounded-xl font-medium hover:bg-[#1e401c] transition-colors"
            >
              {contactUs}
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
