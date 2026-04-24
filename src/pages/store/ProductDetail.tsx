import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Heart, 
  Share2, 
  Star, 
  Truck, 
  Shield, 
  RotateCcw, 
  Check,
  Minus,
  Plus,
  ChevronRight,
  Package
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { useStoreProducts } from '@/hooks/useStoreData';
import { currency, currencyEn } from '@/data/products';
import type { Product } from '@/data/products';
import Header from '@/components/store/Header';
import Footer from '@/components/store/Footer';
import ProductCard from '@/components/store/ProductCard';

// Reviews data
const mockReviews = [
  { id: 1, name: 'أحمد محمد', rating: 5, date: '2025-01-10', comment: 'منتج ممتاز جداً، جودة عالية وسعر مناسب. أنصح به بشدة!' },
  { id: 2, name: 'سارة علي', rating: 4, date: '2025-01-08', comment: 'جيد ولكن التوصيل تأخر يوم واحد. المنتج نفسه رائع.' },
  { id: 3, name: 'خالد عمر', rating: 5, date: '2025-01-05', comment: 'أفضل منتج اشتريته هذا العام. شكراً AJFworld!' },
];

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();
  const { language, isRTL } = useLanguage();
  
  const products = useStoreProducts();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews' | 'shipping'>('description');

  useEffect(() => {
    const foundProduct = products.find(p => p.id === Number(id));
    if (foundProduct) {
      setProduct(foundProduct);
    } else {
      navigate('/');
    }
  }, [id, navigate]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-[#2d5d2a] border-t-transparent rounded-full" />
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const curr = language === 'ar' ? currency : currencyEn;
  
  // Generate additional images (mock)
  const productImages = [
    product.image,
    product.image.replace('w=400', 'w=600'),
    product.image.replace('w=400', 'w=800'),
    product.image.replace('w=400', 'w=500'),
  ];

  // Get related products
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const discountPercentage = product.oldPrice 
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  const productName = language === 'ar' ? product.name : product.nameEn;
  const productDesc = language === 'ar' ? product.description : product.descriptionEn;

  const tabs = [
    { id: 'description', labelAr: 'الوصف', labelEn: 'Description' },
    { id: 'reviews', labelAr: 'التقييمات', labelEn: 'Reviews' },
    { id: 'shipping', labelAr: 'الشحن', labelEn: 'Shipping' },
  ];

  return (
    <div className="min-h-screen bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
      <Header />
      
      <main className="pt-20">
        {/* Breadcrumb */}
        <div className="container-custom py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <a href="/" className="hover:text-[#2d5d2a]">{language === 'ar' ? 'الرئيسية' : 'Home'}</a>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900">{productName}</span>
          </nav>
        </div>

        {/* Product Section */}
        <section className="container-custom py-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Images */}
            <div>
              {/* Main Image */}
              <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden mb-4">
                <img 
                  src={productImages[selectedImage]} 
                  alt={productName}
                  className="w-full h-full object-cover"
                />
                {product.badge && (
                  <Badge className="absolute top-4 right-4 bg-[#d32f2f] text-white">
                    {language === 'ar' ? product.badge : product.badgeEn}
                  </Badge>
                )}
                {product.isNew && !product.badge && (
                  <Badge className="absolute top-4 right-4 bg-[#4caf50] text-white">
                    {language === 'ar' ? 'جديد' : 'New'}
                  </Badge>
                )}
              </div>
              
              {/* Thumbnail Images */}
              <div className="flex gap-3">
                {productImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? 'border-[#2d5d2a]' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div>
              {/* Rating */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'fill-[#ffc107] text-[#ffc107]' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.rating} ({product.reviews} {language === 'ar' ? 'تقييم' : 'reviews'})
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{productName}</h1>

              {/* Price */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-[#2d5d2a]">
                  {product.price} {curr}
                </span>
                {product.oldPrice && (
                  <>
                    <span className="text-xl text-gray-400 line-through">
                      {product.oldPrice} {curr}
                    </span>
                    <Badge className="bg-red-100 text-red-700">
                      -{discountPercentage}%
                    </Badge>
                  </>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-600 mb-6">{productDesc}</p>

              {/* Features */}
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Truck className="w-5 h-5 text-[#2d5d2a]" />
                  <span>{language === 'ar' ? 'شحن مجاني' : 'Free Shipping'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield className="w-5 h-5 text-[#2d5d2a]" />
                  <span>{language === 'ar' ? 'ضمان سنة' : '1 Year Warranty'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <RotateCcw className="w-5 h-5 text-[#2d5d2a]" />
                  <span>{language === 'ar' ? 'إرجاع 14 يوم' : '14 Days Return'}</span>
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-4 mb-6">
                <span className="font-medium text-gray-700">{language === 'ar' ? 'الكمية:' : 'Quantity:'}</span>
                <div className="flex items-center border border-gray-200 rounded-lg">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-100"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-100"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mb-8">
                <Button
                  onClick={handleAddToCart}
                  className={`flex-1 h-14 text-lg font-semibold transition-all ${
                    addedToCart 
                      ? 'bg-green-500 hover:bg-green-500' 
                      : 'bg-[#2d5d2a] hover:bg-[#1e401c]'
                  }`}
                >
                  {addedToCart ? (
                    <>
                      <Check className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      {language === 'ar' ? 'تمت الإضافة!' : 'Added!'}
                    </>
                  ) : (
                    <>
                      <ShoppingCart className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      {language === 'ar' ? 'أضف للسلة' : 'Add to Cart'}
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleWishlistToggle}
                  className={`w-14 h-14 ${inWishlist ? 'border-red-500 text-red-500' : ''}`}
                >
                  <Heart className={`w-6 h-6 ${inWishlist ? 'fill-current' : ''}`} />
                </Button>
                <Button
                  variant="outline"
                  className="w-14 h-14"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: productName,
                        url: window.location.href,
                      });
                    }
                  }}
                >
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>

              {/* Category */}
              <div className="text-sm text-gray-500">
                {language === 'ar' ? 'الفئة:' : 'Category:'}{' '}
                <a href="#" className="text-[#2d5d2a] hover:underline">
                  {language === 'ar' ? product.category : product.categoryEn}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Tabs Section */}
        <section className="container-custom py-12">
          <div className="border-b border-gray-200 mb-8">
            <div className="flex gap-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`pb-4 text-lg font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-[#2d5d2a] text-[#2d5d2a]'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {language === 'ar' ? tab.labelAr : tab.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="min-h-[200px]">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <h3 className="text-xl font-bold mb-4">
                  {language === 'ar' ? 'وصف المنتج' : 'Product Description'}
                </h3>
                <p className="text-gray-600 leading-relaxed">{productDesc}</p>
                <h4 className="text-lg font-bold mt-6 mb-3">
                  {language === 'ar' ? 'المميزات:' : 'Features:'}
                </h4>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>{language === 'ar' ? 'جودة عالية ومتانة' : 'High quality and durability'}</li>
                  <li>{language === 'ar' ? 'تصميم عصري وأنيق' : 'Modern and elegant design'}</li>
                  <li>{language === 'ar' ? 'ضمان سنة كاملة' : 'Full one year warranty'}</li>
                  <li>{language === 'ar' ? 'شحن مجاني وسريع' : 'Free and fast shipping'}</li>
                </ul>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">
                    {language === 'ar' ? 'تقييمات العملاء' : 'Customer Reviews'}
                  </h3>
                  <div className="flex items-center gap-2">
                    <Star className="w-6 h-6 fill-[#ffc107] text-[#ffc107]" />
                    <span className="text-2xl font-bold">{product.rating}</span>
                    <span className="text-gray-500">/ 5</span>
                  </div>
                </div>

                <div className="space-y-6">
                  {mockReviews.map((review) => (
                    <div key={review.id} className="bg-gray-50 p-6 rounded-xl">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#2d5d2a] rounded-full flex items-center justify-center text-white font-bold">
                            {review.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium">{review.name}</p>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`w-4 h-4 ${i < review.rating ? 'fill-[#ffc107] text-[#ffc107]' : 'text-gray-300'}`} 
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-sm text-gray-400">{review.date}</span>
                      </div>
                      <p className="text-gray-600">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div>
                <h3 className="text-xl font-bold mb-4">
                  {language === 'ar' ? 'معلومات الشحن' : 'Shipping Information'}
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <Truck className="w-8 h-8 text-[#2d5d2a] mb-3" />
                    <h4 className="font-bold mb-2">{language === 'ar' ? 'التوصيل السريع' : 'Express Delivery'}</h4>
                    <p className="text-gray-600">
                      {language === 'ar' 
                        ? 'خلال 24 ساعة في دبي وأبوظبي'
                        : 'Within 24 hours in Dubai & Abu Dhabi'
                      }
                    </p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <Package className="w-8 h-8 text-[#2d5d2a] mb-3" />
                    <h4 className="font-bold mb-2">{language === 'ar' ? 'التوصيل العادي' : 'Standard Delivery'}</h4>
                    <p className="text-gray-600">
                      {language === 'ar'
                        ? '1-3 أيام عمل في باقي الإمارات'
                        : '1-3 business days in other emirates'
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="container-custom py-12 bg-gray-50">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              {language === 'ar' ? 'منتجات مشابهة' : 'Related Products'}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((p, index) => (
                <ProductCard key={p.id} product={p} index={index} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
