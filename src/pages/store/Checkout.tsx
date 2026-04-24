import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Truck, 
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Plus,
  Minus,
  Trash2,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { currency, currencyEn } from '@/data/products';
import Header from '@/components/store/Header';
import Footer from '@/components/store/Footer';

interface Address {
  fullName: string;
  phone: string;
  email: string;
  street: string;
  city: string;
  emirate: string;
  building?: string;
  apartment?: string;
}

const emirates = [
  { value: 'dubai', labelAr: 'دبي', labelEn: 'Dubai' },
  { value: 'abu-dhabi', labelAr: 'أبوظبي', labelEn: 'Abu Dhabi' },
  { value: 'sharjah', labelAr: 'الشارقة', labelEn: 'Sharjah' },
  { value: 'ajman', labelAr: 'عجمان', labelEn: 'Ajman' },
  { value: 'ras-al-khaimah', labelAr: 'رأس الخيمة', labelEn: 'Ras Al Khaimah' },
  { value: 'fujairah', labelAr: 'الفجيرة', labelEn: 'Fujairah' },
  { value: 'umm-al-quwain', labelAr: 'أم القيوين', labelEn: 'Umm Al Quwain' },
];

const paymentMethods = [
  { id: 'cod', labelAr: 'الدفع عند الاستلام', labelEn: 'Cash on Delivery', icon: '💵' },
  { id: 'card', labelAr: 'بطاقة ائتمان/خصم', labelEn: 'Credit/Debit Card', icon: '💳' },
  { id: 'apple', labelAr: 'Apple Pay', labelEn: 'Apple Pay', icon: '🍎' },
  { id: 'google', labelAr: 'Google Pay', labelEn: 'Google Pay', icon: '🔵' },
];

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const { language, isRTL } = useLanguage();
  
  const [step, setStep] = useState<'cart' | 'address' | 'payment' | 'confirmation'>('cart');
  const [address, setAddress] = useState<Address>({
    fullName: '',
    phone: '',
    email: '',
    street: '',
    city: '',
    emirate: 'dubai',
    building: '',
    apartment: '',
  });
  const [selectedPayment, setSelectedPayment] = useState('cod');
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const curr = language === 'ar' ? currency : currencyEn;
  const shippingCost = cartTotal >= 200 ? 0 : 20;
  const totalWithShipping = cartTotal + shippingCost;

  // Redirect if cart is empty
  if (cartItems.length === 0 && !isOrderPlaced) {
    return (
      <div className="min-h-screen bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
        <Header />
        <main className="pt-20">
          <div className="container-custom py-20 text-center">
            <ShoppingCart className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {language === 'ar' ? 'سلة التسوق فارغة' : 'Your cart is empty'}
            </h1>
            <p className="text-gray-500 mb-8">
              {language === 'ar' ? 'أضف بعض المنتجات للمتابعة مع الطلب' : 'Add some products to continue with your order'}
            </p>
            <Button 
              className="bg-[#2d5d2a] hover:bg-[#1e401c]"
              onClick={() => navigate('/')}
            >
              {language === 'ar' ? 'تسوق الآن' : 'Start Shopping'}
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handlePlaceOrder = () => {
    const orderNum = 'AJ-' + Date.now().toString().slice(-8);
    setOrderNumber(orderNum);
    setIsOrderPlaced(true);
    clearCart();
  };

  const isAddressValid = () => {
    return address.fullName && address.phone && address.street && address.city;
  };

  // Order Success Page
  if (isOrderPlaced) {
    return (
      <div className="min-h-screen bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
        <Header />
        <main className="pt-20">
          <div className="container-custom py-20 text-center max-w-lg">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {language === 'ar' ? 'تم تأكيد طلبك!' : 'Order Confirmed!'}
            </h1>
            <p className="text-gray-600 mb-2">
              {language === 'ar' ? 'رقم الطلب:' : 'Order Number:'}
            </p>
            <p className="text-2xl font-bold text-[#2d5d2a] mb-6">{orderNumber}</p>
            <p className="text-gray-500 mb-8">
              {language === 'ar' 
                ? 'سنرسل لك تأكيداً عبر البريد الإلكتروني مع تفاصيل الطلب'
                : 'We will send you a confirmation email with order details'
              }
            </p>
            <div className="flex gap-4 justify-center">
              <Button 
                variant="outline"
                onClick={() => navigate('/')}
              >
                {language === 'ar' ? 'مواصلة التسوق' : 'Continue Shopping'}
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const steps = [
    { id: 'cart', labelAr: 'السلة', labelEn: 'Cart' },
    { id: 'address', labelAr: 'العنوان', labelEn: 'Address' },
    { id: 'payment', labelAr: 'الدفع', labelEn: 'Payment' },
  ];

  return (
    <div className="min-h-screen bg-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <Header />
      
      <main className="pt-20 pb-12">
        <div className="container-custom">
          {/* Header */}
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            {language === 'ar' ? 'إتمام الشراء' : 'Checkout'}
          </h1>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            {steps.map((s, index) => (
              <div key={s.id} className="flex items-center">
                <div className={`flex flex-col items-center ${step === s.id ? 'text-[#2d5d2a]' : 'text-gray-400'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    step === s.id ? 'bg-[#2d5d2a] text-white' : 
                    steps.findIndex(st => st.id === step) > index ? 'bg-green-500 text-white' : 'bg-gray-200'
                  }`}>
                    {steps.findIndex(st => st.id === step) > index ? '✓' : index + 1}
                  </div>
                  <span className="text-sm mt-1">{language === 'ar' ? s.labelAr : s.labelEn}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-2 ${
                    steps.findIndex(st => st.id === step) > index ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Cart Step */}
              {step === 'cart' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-xl font-bold mb-6">
                    {language === 'ar' ? 'منتجات السلة' : 'Cart Items'}
                  </h2>
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                        <img
                          src={item.image}
                          alt={language === 'ar' ? item.name : item.nameEn}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">
                            {language === 'ar' ? item.name : item.nameEn}
                          </h3>
                          <p className="text-[#2d5d2a] font-bold mt-1">
                            {item.price} {curr}
                          </p>
                          <div className="flex items-center gap-3 mt-3">
                            <div className="flex items-center border border-gray-200 rounded-lg">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-10 text-center">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">
                            {(item.price * item.quantity).toFixed(2)} {curr}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button
                    className="w-full mt-6 bg-[#2d5d2a] hover:bg-[#1e401c] h-12"
                    onClick={() => setStep('address')}
                  >
                    {language === 'ar' ? 'متابعة' : 'Continue'}
                    <ChevronRight className={`w-5 h-5 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
                  </Button>
                </div>
              )}

              {/* Address Step */}
              {step === 'address' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-xl font-bold mb-6">
                    {language === 'ar' ? 'عنوان التوصيل' : 'Delivery Address'}
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                      </label>
                      <Input
                        value={address.fullName}
                        onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                        className="h-11"
                        placeholder={language === 'ar' ? 'مثال: أحمد محمد' : 'e.g. Ahmed Mohammed'}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
                      </label>
                      <Input
                        value={address.phone}
                        onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                        className="h-11"
                        placeholder="+971 50 000 0000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                      </label>
                      <Input
                        type="email"
                        value={address.email}
                        onChange={(e) => setAddress({ ...address, email: e.target.value })}
                        className="h-11"
                        placeholder="email@example.com"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar' ? 'الشارع' : 'Street'}
                      </label>
                      <Input
                        value={address.street}
                        onChange={(e) => setAddress({ ...address, street: e.target.value })}
                        className="h-11"
                        placeholder={language === 'ar' ? 'اسم الشارع ورقم المبنى' : 'Street name and building number'}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar' ? 'المدينة' : 'City'}
                      </label>
                      <Input
                        value={address.city}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                        className="h-11"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar' ? 'الإمارة' : 'Emirate'}
                      </label>
                      <select
                        value={address.emirate}
                        onChange={(e) => setAddress({ ...address, emirate: e.target.value })}
                        className="w-full h-11 px-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2d5d2a]"
                      >
                        {emirates.map((em) => (
                          <option key={em.value} value={em.value}>
                            {language === 'ar' ? em.labelAr : em.labelEn}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar' ? 'رقم المبنى (اختياري)' : 'Building No. (Optional)'}
                      </label>
                      <Input
                        value={address.building}
                        onChange={(e) => setAddress({ ...address, building: e.target.value })}
                        className="h-11"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar' ? 'الشقة (اختياري)' : 'Apartment (Optional)'}
                      </label>
                      <Input
                        value={address.apartment}
                        onChange={(e) => setAddress({ ...address, apartment: e.target.value })}
                        className="h-11"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <Button
                      variant="outline"
                      className="flex-1 h-12"
                      onClick={() => setStep('cart')}
                    >
                      <ChevronLeft className={`w-5 h-5 ${isRTL ? 'ml-2 rotate-180' : 'mr-2'}`} />
                      {language === 'ar' ? 'رجوع' : 'Back'}
                    </Button>
                    <Button
                      className="flex-1 h-12 bg-[#2d5d2a] hover:bg-[#1e401c]"
                      onClick={() => setStep('payment')}
                      disabled={!isAddressValid()}
                    >
                      {language === 'ar' ? 'متابعة' : 'Continue'}
                      <ChevronRight className={`w-5 h-5 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
                    </Button>
                  </div>
                </div>
              )}

              {/* Payment Step */}
              {step === 'payment' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-xl font-bold mb-6">
                    {language === 'ar' ? 'طريقة الدفع' : 'Payment Method'}
                  </h2>
                  <div className="space-y-3 mb-6">
                    {paymentMethods.map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-colors ${
                          selectedPayment === method.id
                            ? 'border-[#2d5d2a] bg-[#2d5d2a]/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={method.id}
                          checked={selectedPayment === method.id}
                          onChange={(e) => setSelectedPayment(e.target.value)}
                          className="w-5 h-5 text-[#2d5d2a]"
                        />
                        <span className="text-2xl">{method.icon}</span>
                        <span className="flex-1 font-medium">
                          {language === 'ar' ? method.labelAr : method.labelEn}
                        </span>
                        {selectedPayment === method.id && (
                          <CheckCircle className="w-5 h-5 text-[#2d5d2a]" />
                        )}
                      </label>
                    ))}
                  </div>

                  <div className="bg-green-50 p-4 rounded-xl flex items-center gap-3 mb-6">
                    <Shield className="w-6 h-6 text-green-600" />
                    <p className="text-sm text-green-700">
                      {language === 'ar'
                        ? 'جميع المعاملات آمنة ومشفرة. بياناتك محمية 100%.'
                        : 'All transactions are secure and encrypted. Your data is 100% protected.'}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1 h-12"
                      onClick={() => setStep('address')}
                    >
                      <ChevronLeft className={`w-5 h-5 ${isRTL ? 'ml-2 rotate-180' : 'mr-2'}`} />
                      {language === 'ar' ? 'رجوع' : 'Back'}
                    </Button>
                    <Button
                      className="flex-1 h-12 bg-[#2d5d2a] hover:bg-[#1e401c]"
                      onClick={handlePlaceOrder}
                    >
                      {language === 'ar' ? 'تأكيد الطلب' : 'Place Order'}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
                <h2 className="text-lg font-bold mb-4">
                  {language === 'ar' ? 'ملخص الطلب' : 'Order Summary'}
                </h2>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-gray-600">
                    <span>{language === 'ar' ? 'المجموع الفرعي' : 'Subtotal'}</span>
                    <span>{cartTotal.toFixed(2)} {curr}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>{language === 'ar' ? 'الشحن' : 'Shipping'}</span>
                    <span className={shippingCost === 0 ? 'text-green-600' : ''}>
                      {shippingCost === 0 
                        ? (language === 'ar' ? 'مجاني' : 'Free') 
                        : `${shippingCost} ${curr}`
                      }
                    </span>
                  </div>
                  {shippingCost === 0 && (
                    <div className="text-sm text-green-600">
                      {language === 'ar' 
                        ? '✓ لقد حصلت على شحن مجاني!' 
                        : '✓ You got free shipping!'}
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-200 pt-4 mb-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>{language === 'ar' ? 'الإجمالي' : 'Total'}</span>
                    <span className="text-[#2d5d2a]">{totalWithShipping.toFixed(2)} {curr}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Truck className="w-4 h-4" />
                  <span>
                    {language === 'ar' 
                      ? 'التوصيل خلال 1-3 أيام عمل'
                      : 'Delivery within 1-3 business days'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
