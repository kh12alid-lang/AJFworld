import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export interface Review {
  id: string;
  productId: number;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  helpful: number;
  verified: boolean;
  createdAt: string;
}

interface ReviewContextType {
  reviews: Review[];
  getProductReviews: (productId: number) => Review[];
  getProductRating: (productId: number) => { average: number; count: number; distribution: number[] };
  addReview: (review: Omit<Review, 'id' | 'createdAt' | 'helpful'>) => void;
  markHelpful: (reviewId: string) => void;
  hasUserReviewed: (productId: number, userId: string) => boolean;
  getUserReviews: (userId: string) => Review[];
}

// Mock reviews data
const MOCK_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: 1,
    userId: 'user-1',
    userName: 'محمد أحمد',
    userAvatar: 'https://ui-avatars.com/api/?name=Mohammed+Ahmed&background=2d5d2a&color=fff',
    rating: 5,
    title: 'منتج رائع جداً!',
    comment: 'جودة الصوت ممتازة والبطارية تدوم طويلاً. أنصح به بشدة.',
    helpful: 12,
    verified: true,
    createdAt: '2025-01-15',
  },
  {
    id: 'rev-2',
    productId: 1,
    userId: 'user-2',
    userName: 'فاطمة علي',
    userAvatar: 'https://ui-avatars.com/api/?name=Fatima+Ali&background=d32f2f&color=fff',
    rating: 4,
    title: 'جيد لكن يحتاج تحسين',
    comment: 'المنتج جيد بشكل عام، لكن التوصيل تأخر يومين.',
    helpful: 8,
    verified: true,
    createdAt: '2025-01-10',
  },
  {
    id: 'rev-3',
    productId: 2,
    userName: 'خالد سعيد',
    userId: 'user-3',
    rating: 5,
    title: 'أفضل ساعة ذكية',
    comment: 'تتبع اللياقة البدنية دقيق جداً والبطارية تكمل أسبوع.',
    helpful: 15,
    verified: true,
    createdAt: '2025-01-08',
  },
  {
    id: 'rev-4',
    productId: 3,
    userName: 'نورة خالد',
    userId: 'user-4',
    rating: 3,
    title: 'متوسط الجودة',
    comment: 'التصميم جميل لكن الأداء عادي مقابل السعر.',
    helpful: 5,
    verified: false,
    createdAt: '2025-01-05',
  },
  {
    id: 'rev-5',
    productId: 1,
    userName: 'عمر حسن',
    userId: 'user-5',
    rating: 5,
    title: 'شراء ممتاز',
    comment: 'سعر منافس وجودة عالية. شكراً AJFworld!',
    helpful: 20,
    verified: true,
    createdAt: '2025-01-03',
  },
];

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

export function ReviewProvider({ children }: { children: ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);

  const getProductReviews = useCallback((productId: number) => {
    return reviews.filter(r => r.productId === productId).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [reviews]);

  const getProductRating = useCallback((productId: number) => {
    const productReviews = reviews.filter(r => r.productId === productId);
    const count = productReviews.length;
    
    if (count === 0) {
      return { average: 0, count: 0, distribution: [0, 0, 0, 0, 0] };
    }

    const sum = productReviews.reduce((acc, r) => acc + r.rating, 0);
    const average = Math.round((sum / count) * 10) / 10;
    
    const distribution = [5, 4, 3, 2, 1].map(star => 
      productReviews.filter(r => r.rating === star).length
    );

    return { average, count, distribution };
  }, [reviews]);

  const addReview = useCallback((review: Omit<Review, 'id' | 'createdAt' | 'helpful'>) => {
    const newReview: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      helpful: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setReviews(prev => [newReview, ...prev]);
  }, []);

  const markHelpful = useCallback((reviewId: string) => {
    setReviews(prev => 
      prev.map(r => 
        r.id === reviewId ? { ...r, helpful: r.helpful + 1 } : r
      )
    );
  }, []);

  const hasUserReviewed = useCallback((productId: number, userId: string) => {
    return reviews.some(r => r.productId === productId && r.userId === userId);
  }, [reviews]);

  const getUserReviews = useCallback((userId: string) => {
    return reviews.filter(r => r.userId === userId).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [reviews]);

  return (
    <ReviewContext.Provider
      value={{
        reviews,
        getProductReviews,
        getProductRating,
        addReview,
        markHelpful,
        hasUserReviewed,
        getUserReviews,
      }}
    >
      {children}
    </ReviewContext.Provider>
  );
}

export function useReviews() {
  const context = useContext(ReviewContext);
  if (context === undefined) {
    throw new Error('useReviews must be used within a ReviewProvider');
  }
  return context;
}
