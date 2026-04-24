import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Zap, 
  Clock, 
  TrendingUp, 
  Flame,
  ArrowRight,
  ShoppingCart,
  Percent
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useFlashSales } from '@/context/FlashSaleContext';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { currency, currencyEn, products } from '@/data/products';
import Header from '@/components/store/Header';
import Footer from '@/components/store/Footer';

function CountdownTimer({ endTime }: { endTime: string }) {
  const { getTimeRemaining } = useFlashSales();
  const [time, setTime] = useState(getTimeRemaining(endTime));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getTimeRemaining(endTime));
    }, 1000);
    return () => clearInterval(interval);
  }, [endTime, getTimeRemaining]);

  const formatNumber = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="flex items-center gap-2">
      <div className="bg-white/20 rounded-lg px-3 py-2 text-center min-w-[50px]">
        <span className="text-xl font-bold">{formatNumber(time.hours)}</span>
        <span className="text-xs block opacity-70">س</span>
      </div>
      <span className="text-xl font-bold">:</span>
      <div className="bg-white/20 rounded-lg px-3 py-2 text-center min-w-[50px]">
        <span className="text-xl font-bold">{formatNumber(time.minutes)}</span>
        <span className="text-xs block opacity-70">د</span>
      </div>
      <span className="text-xl font-bold">:</span>
      <div className="bg-white/20 rounded-lg px-3 py-2 text-center min-w-[50px]">
        <span className="text-xl font-bold">{formatNumber(time.seconds)}</span>
        <span className="text-xs block opacity-70">ث</span>
      </div>
    </div>
  );
}

export default function FlashSales() {
  const navigate = useNavigate();
  const { language, isRTL } = useLanguage();
  const { 
    getActiveFlashSales, 
    getActiveDailyDeals
  } = useFlashSales();
  const { addToCart } = useCart();

  const curr = language === 'ar' ? currency : currencyEn;
  
  const flashSales = getActiveFlashSales();
  const dailyDeals = getActiveDailyDeals();
  
  // Get product details for flash sales
  const flashSaleProducts = flashSales.map(flashSale => {
    const product = products.find(p => p.id === flashSale.productId);
    return { flashSale, product };
  }).filter(item => item.product);

  // Get product details for daily deals
  const dailyDealProducts = dailyDeals.map(dailyDeal => {
    const product = products.find(p => p.id === dailyDeal.productId);
    return { dailyDeal, product };
  }).filter(item => item.product);

  return (
    <div className="min-h-screen bg-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <Header />
      
      <main className="pt-20 pb-12">
        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-[#d32f2f] to-[#b71c1c] text-white py-12 mb-8">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-6 h-6" />
                  <Badge className="bg-white/20 text-white border-0">
                    {language === 'ar' ? 'لفترة محدودة' : 'Limited Time'}
                  </Badge>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  {language === 'ar' ? 'عروض فلاش' : 'Flash Sales'}
                </h1>
                <p className="text-white/80">
                  {language === 'ar' 
                    ? 'خصومات تصل إلى 50% على منتجات مختارة'
                    : 'Up to 50% off on selected products'}
                </p>
              </div>
              
              {flashSales.length > 0 && (
                <div className="text-center">
                  <p className="text-sm text-white/70 mb-2">
                    {language === 'ar' ? 'ينتهي العرض خلال:' : 'Offer ends in:'}
                  </p>
                  <CountdownTimer endTime={flashSales[0]?.endTime} />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="container-custom">
          {/* Flash Sales Section */}
          {flashSaleProducts.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                    <Flame className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">
                      {language === 'ar' ? 'عروض فلاش نشطة' : 'Active Flash Sales'}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {flashSaleProducts.length} {language === 'ar' ? 'عروض' : 'offers'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {flashSaleProducts.map(({ flashSale, product }) => (
                  <div key={flashSale.id} className="bg-white rounded-2xl shadow-sm overflow-hidden group">
                    {/* Image */}
                    <div className="relative">
                      <img
                        src={product!.image}
                        alt={language === 'ar' ? product!.name : product!.nameEn}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-red-500 text-white">
                          <Percent className="w-3 h-3 mr-1" />
                          {flashSale.discount}%
                        </Badge>
                      </div>
                      <div className="absolute top-3 right-3">
                        <div className="bg-black/70 text-white text-xs px-2 py-1 rounded-lg flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <CountdownTimer endTime={flashSale.endTime} />
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="font-bold mb-2 line-clamp-1">
                        {language === 'ar' ? product!.name : product!.nameEn}
                      </h3>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-2xl font-bold text-red-600">
                          {flashSale.salePrice} {curr}
                        </span>
                        <span className="text-gray-400 line-through">
                          {flashSale.originalPrice} {curr}
                        </span>
                      </div>

                      {/* Stock Progress */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-500">
                            {language === 'ar' ? 'تم بيع' : 'Sold'} {flashSale.soldCount}/{flashSale.stockLimit}
                          </span>
                          <span className="text-red-500">
                            {flashSale.stockLimit - flashSale.soldCount} {language === 'ar' ? 'متبقي' : 'left'}
                          </span>
                        </div>
                        <Progress 
                          value={(flashSale.soldCount / flashSale.stockLimit) * 100} 
                          className="h-2"
                        />
                      </div>

                      <Button 
                        onClick={() => addToCart(product!)}
                        className="w-full bg-red-500 hover:bg-red-600"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        {language === 'ar' ? 'أضف للسلة' : 'Add to Cart'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Daily Deals Section */}
          {dailyDealProducts.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">
                      {language === 'ar' ? 'صفقات اليوم' : 'Today\'s Deals'}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {language === 'ar' ? 'تنتهي منتصف الليل' : 'Ends at midnight'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {dailyDealProducts.map(({ dailyDeal, product }) => (
                  <div key={dailyDeal.id} className="bg-white rounded-2xl shadow-sm p-6 flex gap-4 group cursor-pointer"
                       onClick={() => navigate(`/product/${product!.id}`)}>
                    <img
                      src={product!.image}
                      alt={language === 'ar' ? product!.name : product!.nameEn}
                      className="w-32 h-32 object-cover rounded-xl group-hover:scale-105 transition-transform"
                    />
                    <div className="flex-1">
                      <Badge className="bg-orange-500 text-white mb-2">
                        {language === 'ar' ? 'صفقة اليوم' : 'Deal of the Day'}
                      </Badge>
                      <h3 className="font-bold mb-2">
                        {language === 'ar' ? product!.name : product!.nameEn}
                      </h3>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xl font-bold text-orange-600">
                          {dailyDeal.dealPrice} {curr}
                        </span>
                        <span className="text-gray-400 line-through text-sm">
                          {dailyDeal.originalPrice} {curr}
                        </span>
                        <Badge variant="outline" className="text-orange-600 border-orange-200">
                          -{dailyDeal.discount}%
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <TrendingUp className="w-4 h-4" />
                        <span>{dailyDeal.soldToday} {language === 'ar' ? 'تم بيعها' : 'sold'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Coming Soon */}
          {flashSaleProducts.length === 0 && dailyDealProducts.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl">
              <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {language === 'ar' ? 'لا توجد عروض حالياً' : 'No Active Offers'}
              </h2>
              <p className="text-gray-500 mb-6">
                {language === 'ar' 
                  ? 'تابعنا للحصول على أحدث العروض'
                  : 'Stay tuned for upcoming deals'}
              </p>
              <Button 
                onClick={() => navigate('/search')}
                className="bg-[#2d5d2a] hover:bg-[#1e401c]"
              >
                {language === 'ar' ? 'تصفح المنتجات' : 'Browse Products'}
                <ArrowRight className={`w-4 h-4 ${isRTL ? 'mr-2' : 'ml-2'}`} />
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
