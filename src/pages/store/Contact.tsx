import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/context/LanguageContext';
import Header from '@/components/store/Header';
import Footer from '@/components/store/Footer';

export default function Contact() {
  const { language, isRTL } = useLanguage();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 3000);
  };

  const title = language === 'ar' ? 'تواصل معنا' : 'Contact Us';
  const subtitle = language === 'ar'
    ? 'نحن هنا لمساعدتك! تواصل معنا وسنرد عليك في أقرب وقت'
    : 'We are here to help! Contact us and we will get back to you soon';
  
  const contactInfo = [
    {
      icon: MapPin,
      title: language === 'ar' ? 'العنوان' : 'Address',
      content: language === 'ar' ? 'دبي، الإمارات العربية المتحدة' : 'Dubai, United Arab Emirates',
    },
    {
      icon: Phone,
      title: language === 'ar' ? 'الهاتف' : 'Phone',
      content: '+971 50 839 3030',
    },
    {
      icon: Mail,
      title: language === 'ar' ? 'البريد الإلكتروني' : 'Email',
      content: 'support@ajfworld.ae',
    },
    {
      icon: Clock,
      title: language === 'ar' ? 'ساعات العمل' : 'Working Hours',
      content: language === 'ar' ? 'السبت - الخميس: 9 ص - 10 م' : 'Sat - Thu: 9 AM - 10 PM',
    },
  ];

  const formLabels = {
    name: language === 'ar' ? 'الاسم الكامل' : 'Full Name',
    email: language === 'ar' ? 'البريد الإلكتروني' : 'Email',
    phone: language === 'ar' ? 'رقم الهاتف' : 'Phone Number',
    subject: language === 'ar' ? 'الموضوع' : 'Subject',
    message: language === 'ar' ? 'الرسالة' : 'Message',
    send: language === 'ar' ? 'إرسال الرسالة' : 'Send Message',
    success: language === 'ar' ? 'تم إرسال رسالتك بنجاح!' : 'Your message has been sent successfully!',
  };

  return (
    <div className="min-h-screen bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#2d5d2a] to-[#1e401c] py-16">
          <div className="container-custom text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">{subtitle}</p>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-12 -mt-8">
          <div className="container-custom">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactInfo.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 text-center">
                    <div className="w-14 h-14 bg-[#2d5d2a] rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.content}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Contact Form & Map */}
        <section className="py-16 bg-gray-50">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Form */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {language === 'ar' ? 'أرسل لنا رسالة' : 'Send us a Message'}
                </h2>

                {isSubmitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{formLabels.success}</h3>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {formLabels.name}
                        </label>
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="h-12"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {formLabels.email}
                        </label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="h-12"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {formLabels.phone}
                        </label>
                        <Input
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="h-12"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {formLabels.subject}
                        </label>
                        <Input
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          className="h-12"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {formLabels.message}
                      </label>
                      <textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full h-32 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2d5d2a] focus:border-transparent resize-none"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 bg-[#2d5d2a] hover:bg-[#1e401c] text-lg"
                    >
                      <Send className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      {formLabels.send}
                    </Button>
                  </form>
                )}
              </div>

              {/* Map Placeholder */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {language === 'ar' ? 'موقعنا' : 'Our Location'}
                </h2>
                <div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-[#2d5d2a] mx-auto mb-3" />
                    <p className="text-gray-600">
                      {language === 'ar' ? 'دبي، الإمارات العربية المتحدة' : 'Dubai, UAE'}
                    </p>
                    <a 
                      href="https://maps.google.com/?q=Dubai,UAE" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#2d5d2a] hover:underline text-sm mt-2 inline-block"
                    >
                      {language === 'ar' ? 'فتح في خرائط Google' : 'Open in Google Maps'}
                    </a>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-[#2d5d2a]/5 rounded-xl">
                  <h3 className="font-bold text-gray-900 mb-2">
                    {language === 'ar' ? 'ملاحظة:' : 'Note:'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {language === 'ar'
                      ? 'نحن متجر إلكتروني فقط. لا يوجد لدينا متجر فعلي للزيارة. جميع الطلبات تتم عبر الموقع ويتم التوصيل للعنوان المحدد.'
                      : 'We are an online store only. We do not have a physical store for visits. All orders are placed through the website and delivered to the specified address.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
