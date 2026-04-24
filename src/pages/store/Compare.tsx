import { useNavigate } from 'react-router-dom';
import { X, ShoppingCart, ArrowRight, Scale, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSearch } from '@/context/SearchContext';
import { useLanguage } from '@/context/LanguageContext';
import { useReviews } from '@/context/ReviewContext';
import { useCart } from '@/context/CartContext';
import { currency, currencyEn } from '@/data/products';
import Header from '@/components/store/Header';
import Footer from '@/components/store/Footer';

export default function Compare() {
  const navigate = useNavigate();
  const { language, isRTL } = useLanguage();
  const { removeFromCompare, clearCompare, getCompareProducts } = useSearch();
  const { getProductRating } = useReviews();
  const { addToCart } = useCart();

  const compareProducts = getCompareProducts();
  const curr = language === 'ar' ? currency : currencyEn;

  if (compareProducts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
        <Header />
        <main className="pt-20 pb-12">
          <div className="container-custom">
            <div className="text-center py-16 bg-white rounded-2xl">
              <Scale className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {language === 'ar' ? 'قائمة المقارنة فارغة' : 'Compare List is Empty'}
              </h2>
              <p className="text-gray-500 mb-6">
                {language === 'ar' 
                  ? 'أضف منتجات للمقارنة بينها'
                  : 'Add products to compare them side by side'}
              </p>
              <Button 
                onClick={() => navigate('/search')}
                className="bg-[#2d5d2a] hover:bg-[#1e401c]"
              >
                {language === 'ar' ? 'تصفح المنتجات' : 'Browse Products'}
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <Header />
      
      <main className="pt-20 pb-12">
        <div className="container-custom">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {language === 'ar' ? 'مقارنة المنتجات' : 'Compare Products'}
              </h1>
              <p className="text-gray-500">
                {compareProducts.length} {language === 'ar' ? 'منتجات' : 'products'}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={clearCompare}
              className="text-red-500 border-red-200 hover:bg-red-50"
            >
              <X className="w-4 h-4 mr-2" />
              {language === 'ar' ? 'مسح الكل' : 'Clear All'}
            </Button>
          </div>

          {/* Comparison Table */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="p-4 text-left bg-gray-50 border-b min-w-[150px]">
                      {language === 'ar' ? 'المنتج' : 'Product'}
                    </th>
                    {compareProducts.map((product) => (
                      <th key={product.id} className="p-4 border-b min-w-[200px]">
                        <div className="relative">
                          <button
                            onClick={() => removeFromCompare(product.id)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-100 text-red-500 rounded-full flex items-center justify-center hover:bg-red-200"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          <img
                            src={product.image}
                            alt={language === 'ar' ? product.name : product.nameEn}
                            className="w-24 h-24 object-cover rounded-lg mx-auto mb-3"
                          />
                          <h3 className="font-medium text-sm line-clamp-2">
                            {language === 'ar' ? product.name : product.nameEn}
                          </h3>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Price */}
                  <tr>
                    <td className="p-4 bg-gray-50 font-medium border-b">
                      {language === 'ar' ? 'السعر' : 'Price'}
                    </td>
                    {compareProducts.map((product) => (
                      <td key={product.id} className="p-4 border-b text-center">
                        {product.oldPrice ? (
                          <div>
                            <span className="text-[#d32f2f] font-bold text-lg">
                              {product.price} {curr}
                            </span>
                            <span className="text-gray-400 line-through text-sm ml-2">
                              {product.oldPrice} {curr}
                            </span>
                          </div>
                        ) : (
                          <span className="font-bold text-lg">{product.price} {curr}</span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Rating */}
                  <tr>
                    <td className="p-4 bg-gray-50 font-medium border-b">
                      {language === 'ar' ? 'التقييم' : 'Rating'}
                    </td>
                    {compareProducts.map((product) => {
                      const rating = getProductRating(product.id);
                      return (
                        <td key={product.id} className="p-4 border-b text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="font-medium">{rating.average || product.rating}</span>
                            <span className="text-gray-400 text-sm">({rating.count})</span>
                          </div>
                        </td>
                      );
                    })}
                  </tr>

                  {/* Category */}
                  <tr>
                    <td className="p-4 bg-gray-50 font-medium border-b">
                      {language === 'ar' ? 'الفئة' : 'Category'}
                    </td>
                    {compareProducts.map((product) => (
                      <td key={product.id} className="p-4 border-b text-center">
                        <Badge variant="secondary">{product.category}</Badge>
                      </td>
                    ))}
                  </tr>

                  {/* Badge */}
                  <tr>
                    <td className="p-4 bg-gray-50 font-medium border-b">
                      {language === 'ar' ? 'الحالة' : 'Status'}
                    </td>
                    {compareProducts.map((product) => (
                      <td key={product.id} className="p-4 border-b text-center">
                        {product.isNew ? (
                          <Badge className="bg-green-100 text-green-700">
                            {language === 'ar' ? 'جديد' : 'New'}
                          </Badge>
                        ) : product.isBestSeller ? (
                          <Badge className="bg-orange-100 text-orange-700">
                            {language === 'ar' ? 'الأكثر مبيعاً' : 'Best Seller'}
                          </Badge>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Description */}
                  <tr>
                    <td className="p-4 bg-gray-50 font-medium border-b">
                      {language === 'ar' ? 'الوصف' : 'Description'}
                    </td>
                    {compareProducts.map((product) => (
                      <td key={product.id} className="p-4 border-b text-center text-sm text-gray-600">
                        <p className="line-clamp-3">{language === 'ar' ? product.description : product.descriptionEn}</p>
                      </td>
                    ))}
                  </tr>

                  {/* Actions */}
                  <tr>
                    <td className="p-4 bg-gray-50 font-medium">
                      {language === 'ar' ? 'الإجراءات' : 'Actions'}
                    </td>
                    {compareProducts.map((product) => (
                      <td key={product.id} className="p-4 text-center">
                        <div className="space-y-2">
                          <Button
                            onClick={() => addToCart(product)}
                            className="w-full bg-[#2d5d2a] hover:bg-[#1e401c]"
                          >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            {language === 'ar' ? 'أضف للسلة' : 'Add to Cart'}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => navigate(`/product/${product.id}`)}
                            className="w-full"
                          >
                            {language === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                            <ArrowRight className={`w-4 h-4 ${isRTL ? 'mr-2' : 'ml-2'}`} />
                          </Button>
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
