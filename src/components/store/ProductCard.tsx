import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import type { Product } from '@/data/products';
import { currency, currencyEn } from '@/data/products';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();
  const { language, isRTL } = useLanguage();

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1500);
  };

  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const productName = language === 'ar' ? product.name : product.nameEn;
  const productDesc = language === 'ar' ? product.description : product.descriptionEn;
  const productBadge = language === 'ar' ? product.badge : product.badgeEn;
  const newLabel = language === 'ar' ? 'جديد' : 'New';
  const addToCartText = language === 'ar' ? 'أضف للسلة' : 'Add to Cart';
  const addedText = language === 'ar' ? 'تمت الإضافة!' : 'Added!';
  const quickViewText = language === 'ar' ? 'عرض سريع' : 'Quick View';
  const curr = language === 'ar' ? currency : currencyEn;

  return (
    <>
      <div
        className="group bg-white rounded-xl overflow-hidden border border-gray-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
        style={{ animationDelay: `${index * 100}ms` }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Link to={`/product/${product.id}`} className="block w-full h-full">
            <img
              src={product.image}
              alt={productName}
              className={`w-full h-full object-cover transition-transform duration-500 ${
                isHovered ? 'scale-110' : 'scale-100'
              }`}
            />
          </Link>
          
          {/* Badges */}
          <div className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} flex flex-col gap-2`}>
            {productBadge && (
              <Badge className="bg-[#d32f2f] text-white text-xs px-2 py-1 animate-bounceIn">
                {productBadge}
              </Badge>
            )}
            {product.isNew && !product.badge && (
              <Badge className="bg-[#4caf50] text-white text-xs px-2 py-1 animate-bounceIn">
                {newLabel}
              </Badge>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            className={`absolute top-3 ${isRTL ? 'left-3' : 'right-3'} w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
              inWishlist
                ? 'bg-[#d32f2f] text-white'
                : 'bg-white/90 text-gray-600 hover:bg-[#d32f2f] hover:text-white'
            } opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0`}
          >
            <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
          </button>

          {/* Quick View Button */}
          <button
            onClick={() => setShowQuickView(true)}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/95 text-gray-800 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-[#2d5d2a] hover:text-white"
          >
            <Eye className="w-4 h-4" />
            {quickViewText}
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <Star className="w-4 h-4 fill-[#ffc107] text-[#ffc107]" />
            <span className="text-sm font-medium">{product.rating}</span>
            <span className="text-xs text-gray-500">({product.reviews})</span>
          </div>

          {/* Name */}
          <Link to={`/product/${product.id}`}>
            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#2d5d2a] transition-colors text-sm md:text-base">
              {productName}
            </h3>
          </Link>

          {/* Price */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg font-bold text-[#2d5d2a]">
              {product.price} {curr}
            </span>
            {product.oldPrice && (
              <span className="text-sm text-gray-400 line-through">
                {product.oldPrice} {curr}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            className={`w-full transition-all duration-300 ${
              addedToCart
                ? 'bg-[#4caf50] hover:bg-[#4caf50]'
                : 'bg-gray-900 hover:bg-[#2d5d2a]'
            }`}
          >
            <ShoppingCart className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {addedToCart ? addedText : addToCartText}
          </Button>
        </div>
      </div>

      {/* Quick View Dialog */}
      <Dialog open={showQuickView} onOpenChange={setShowQuickView}>
        <DialogContent className="sm:max-w-2xl" dir={isRTL ? 'rtl' : 'ltr'}>
          <DialogHeader>
            <DialogTitle className={isRTL ? 'text-right' : 'text-left'}>
              {language === 'ar' ? 'نظرة سريعة' : 'Quick View'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid md:grid-cols-2 gap-6 mt-4">
            <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
              <img
                src={product.image}
                alt={productName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1 mb-2">
                <Star className="w-5 h-5 fill-[#ffc107] text-[#ffc107]" />
                <span className="font-medium">{product.rating}</span>
                <span className="text-gray-500">({product.reviews} {language === 'ar' ? 'تقييم' : 'reviews'})</span>
              </div>
              <h2 className="text-2xl font-bold mb-2">{productName}</h2>
              <p className="text-gray-600 mb-4">{productDesc}</p>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl font-bold text-[#2d5d2a]">
                  {product.price} {curr}
                </span>
                {product.oldPrice && (
                  <span className="text-lg text-gray-400 line-through">
                    {product.oldPrice} {curr}
                  </span>
                )}
              </div>
              <div className="flex gap-3 mt-auto">
                <Button
                  onClick={() => {
                    handleAddToCart();
                    setShowQuickView(false);
                  }}
                  className="flex-1 bg-[#2d5d2a] hover:bg-[#1e401c]"
                >
                  <ShoppingCart className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {addToCartText}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleWishlistToggle}
                  className={inWishlist ? 'border-[#d32f2f] text-[#d32f2f]' : ''}
                >
                  <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
                </Button>
              </div>
              <Link 
                to={`/product/${product.id}`}
                className="mt-3 block text-center text-[#2d5d2a] hover:underline"
                onClick={() => setShowQuickView(false)}
              >
                {language === 'ar' ? 'عرض تفاصيل المنتج ←' : 'View Product Details →'}
              </Link>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
