import { useState } from 'react';
import { Search, Star, Eye, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useReviews, type Review } from '@/context/ReviewContext';
import { useLanguage } from '@/context/LanguageContext';
import { products } from '@/data/products';

export default function AdminReviews() {
  const { language, isRTL } = useLanguage();
  const { reviews } = useReviews();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [filterRating, setFilterRating] = useState<number | null>(null);

  const filteredReviews = reviews.filter(r => {
    const matchesSearch = 
      r.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRating = filterRating ? r.rating === filterRating : true;
    
    return matchesSearch && matchesRating;
  });

  const getProductName = (productId: number) => {
    const product = products.find(p => p.id === productId);
    return language === 'ar' ? product?.name : product?.nameEn;
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '0';

  const ratingDistribution = [5, 4, 3, 2, 1].map(stars => ({
    stars,
    count: reviews.filter(r => r.rating === stars).length,
    percentage: reviews.length > 0 ? (reviews.filter(r => r.rating === stars).length / reviews.length) * 100 : 0
  }));

  return (
    <div className="p-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {language === 'ar' ? 'إدارة المراجعات' : 'Review Management'}
          </h1>
          <p className="text-gray-500">
            {reviews.length} {language === 'ar' ? 'مراجعة' : 'reviews'}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">{language === 'ar' ? 'متوسط التقييم' : 'Average Rating'}</p>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold">{averageRating}</p>
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">{language === 'ar' ? 'الكل' : 'Total'}</p>
          <p className="text-2xl font-bold">{reviews.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">{language === 'ar' ? 'تم التحقق' : 'Verified'}</p>
          <p className="text-2xl font-bold text-green-600">
            {reviews.filter(r => r.verified).length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">{language === 'ar' ? 'مفيدة' : 'Helpful'}</p>
          <p className="text-2xl font-bold text-blue-600">
            {reviews.reduce((acc, r) => acc + r.helpful, 0)}
          </p>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
        <h3 className="font-bold mb-4">{language === 'ar' ? 'توزيع التقييمات' : 'Rating Distribution'}</h3>
        <div className="space-y-2">
          {ratingDistribution.map(({ stars, count, percentage }) => (
            <div key={stars} className="flex items-center gap-3">
              <div className="flex items-center gap-1 w-16">
                <span className="font-medium">{stars}</span>
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              </div>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-yellow-400 rounded-full"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm text-gray-500 w-12 text-right">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400`} />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'ar' ? 'بحث في المراجعات...' : 'Search reviews...'}
            className={`${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} h-12`}
          />
        </div>
        <div className="flex gap-2">
          {[5, 4, 3, 2, 1].map((stars) => (
            <button
              key={stars}
              onClick={() => setFilterRating(filterRating === stars ? null : stars)}
              className={`px-3 py-2 rounded-lg border transition-colors ${
                filterRating === stars 
                  ? 'bg-yellow-100 border-yellow-400 text-yellow-700' 
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              {stars} <Star className="w-3 h-3 inline" />
            </button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                  {language === 'ar' ? 'المنتج' : 'Product'}
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                  {language === 'ar' ? 'المستخدم' : 'User'}
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                  {language === 'ar' ? 'التقييم' : 'Rating'}
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                  {language === 'ar' ? 'العنوان' : 'Title'}
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                  {language === 'ar' ? 'مفيدة' : 'Helpful'}
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                  {language === 'ar' ? 'الإجراءات' : 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredReviews.map((review) => (
                <tr key={review.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium">{getProductName(review.productId)}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <img 
                        src={review.userAvatar} 
                        alt={review.userName}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <p className="text-sm font-medium">{review.userName}</p>
                        {review.verified && (
                          <Badge className="bg-green-100 text-green-700 text-[10px]">
                            {language === 'ar' ? 'تم التحقق' : 'Verified'}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium line-clamp-1">{review.title}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <ThumbsUp className="w-4 h-4" />
                      {review.helpful}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedReview(review)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      {language === 'ar' ? 'عرض' : 'View'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredReviews.length === 0 && (
          <div className="text-center py-12">
            <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">
              {language === 'ar' ? 'لا توجد مراجعات' : 'No reviews found'}
            </p>
          </div>
        )}
      </div>

      {/* Review Detail Dialog */}
      <Dialog open={!!selectedReview} onOpenChange={() => setSelectedReview(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{language === 'ar' ? 'تفاصيل المراجعة' : 'Review Details'}</DialogTitle>
          </DialogHeader>
          {selectedReview && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img 
                  src={selectedReview.userAvatar} 
                  alt={selectedReview.userName}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="font-medium">{selectedReview.userName}</p>
                  <p className="text-sm text-gray-500">{selectedReview.createdAt}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < selectedReview.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                {selectedReview.verified && (
                  <Badge className="bg-green-100 text-green-700">
                    {language === 'ar' ? 'تم التحقق' : 'Verified Purchase'}
                  </Badge>
                )}
              </div>

              <h4 className="font-bold text-lg">{selectedReview.title}</h4>
              <p className="text-gray-600">{selectedReview.comment}</p>

              <div className="flex items-center gap-4 pt-4 border-t">
                <div className="flex items-center gap-1 text-gray-500">
                  <ThumbsUp className="w-4 h-4" />
                  <span>{selectedReview.helpful} {language === 'ar' ? 'وجدوها مفيدة' : 'found this helpful'}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
