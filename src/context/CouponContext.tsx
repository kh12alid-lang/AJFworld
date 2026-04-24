import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrder: number;
  maxDiscount?: number;
  usageLimit: number;
  usageCount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  description: {
    ar: string;
    en: string;
  };
}

interface AppliedCoupon {
  coupon: Coupon;
  discount: number;
}

interface CouponContextType {
  coupons: Coupon[];
  appliedCoupon: AppliedCoupon | null;
  validateCoupon: (code: string, cartTotal: number) => { valid: boolean; message: string; coupon?: Coupon };
  applyCoupon: (code: string, cartTotal: number) => { success: boolean; message: string; discount?: number };
  removeCoupon: () => void;
  calculateDiscount: (coupon: Coupon, cartTotal: number) => number;
  addCoupon: (coupon: Omit<Coupon, 'id' | 'usageCount'>) => void;
  updateCoupon: (id: string, updates: Partial<Coupon>) => void;
  deleteCoupon: (id: string) => void;
  incrementUsage: (code: string) => void;
}

// Mock coupons
const MOCK_COUPONS: Coupon[] = [
  {
    id: 'coup-1',
    code: 'WELCOME20',
    type: 'percentage',
    value: 20,
    minOrder: 100,
    maxDiscount: 100,
    usageLimit: 1000,
    usageCount: 150,
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    isActive: true,
    description: { ar: 'خصم 20% على أول طلب', en: '20% off on first order' },
  },
  {
    id: 'coup-2',
    code: 'SAVE50',
    type: 'fixed',
    value: 50,
    minOrder: 300,
    usageLimit: 500,
    usageCount: 230,
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    isActive: true,
    description: { ar: 'خصم 50 درهم على الطلبات فوق 300', en: 'AED 50 off on orders above 300' },
  },
  {
    id: 'coup-3',
    code: 'FLASH30',
    type: 'percentage',
    value: 30,
    minOrder: 200,
    maxDiscount: 150,
    usageLimit: 100,
    usageCount: 85,
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    isActive: true,
    description: { ar: 'خصم 30% لفترة محدودة', en: '30% off for limited time' },
  },
  {
    id: 'coup-4',
    code: 'FREESHIP',
    type: 'fixed',
    value: 20,
    minOrder: 150,
    usageLimit: 2000,
    usageCount: 450,
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    isActive: true,
    description: { ar: 'توصيل مجاني', en: 'Free shipping' },
  },
];

const CouponContext = createContext<CouponContextType | undefined>(undefined);

export function CouponProvider({ children }: { children: ReactNode }) {
  const [coupons, setCoupons] = useState<Coupon[]>(MOCK_COUPONS);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);

  const validateCoupon = useCallback((code: string, cartTotal: number): { valid: boolean; message: string; coupon?: Coupon } => {
    const coupon = coupons.find(c => c.code.toUpperCase() === code.toUpperCase());
    
    if (!coupon) {
      return { valid: false, message: 'الكوبون غير موجود' };
    }

    if (!coupon.isActive) {
      return { valid: false, message: 'الكوبون غير نشط' };
    }

    const today = new Date().toISOString().split('T')[0];
    if (today < coupon.startDate || today > coupon.endDate) {
      return { valid: false, message: 'الكوبون منتهي الصلاحية' };
    }

    if (coupon.usageCount >= coupon.usageLimit) {
      return { valid: false, message: 'تم استنفاد الكوبون' };
    }

    if (cartTotal < coupon.minOrder) {
      return { valid: false, message: `الحد الأدنى للطلب ${coupon.minOrder} درهم` };
    }

    return { valid: true, message: 'الكوبون صالح', coupon };
  }, [coupons]);

  const calculateDiscount = useCallback((coupon: Coupon, cartTotal: number): number => {
    let discount = 0;
    
    if (coupon.type === 'percentage') {
      discount = (cartTotal * coupon.value) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.value;
    }

    return Math.round(discount * 100) / 100;
  }, []);

  const applyCoupon = useCallback((code: string, cartTotal: number): { success: boolean; message: string; discount?: number } => {
    const validation = validateCoupon(code, cartTotal);
    
    if (!validation.valid || !validation.coupon) {
      return { success: false, message: validation.message };
    }

    const discount = calculateDiscount(validation.coupon, cartTotal);
    setAppliedCoupon({ coupon: validation.coupon, discount });
    
    return { success: true, message: `تم تطبيق الخصم: ${discount} درهم`, discount };
  }, [validateCoupon, calculateDiscount]);

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
  }, []);

  const addCoupon = useCallback((coupon: Omit<Coupon, 'id' | 'usageCount'>) => {
    const newCoupon: Coupon = {
      ...coupon,
      id: `coup-${Date.now()}`,
      usageCount: 0,
    };
    setCoupons(prev => [...prev, newCoupon]);
  }, []);

  const updateCoupon = useCallback((id: string, updates: Partial<Coupon>) => {
    setCoupons(prev => 
      prev.map(c => c.id === id ? { ...c, ...updates } : c)
    );
  }, []);

  const deleteCoupon = useCallback((id: string) => {
    setCoupons(prev => prev.filter(c => c.id !== id));
  }, []);

  const incrementUsage = useCallback((code: string) => {
    setCoupons(prev => 
      prev.map(c => 
        c.code.toUpperCase() === code.toUpperCase() 
          ? { ...c, usageCount: c.usageCount + 1 } 
          : c
      )
    );
  }, []);

  return (
    <CouponContext.Provider
      value={{
        coupons,
        appliedCoupon,
        validateCoupon,
        applyCoupon,
        removeCoupon,
        calculateDiscount,
        addCoupon,
        updateCoupon,
        deleteCoupon,
        incrementUsage,
      }}
    >
      {children}
    </CouponContext.Provider>
  );
}

export function useCoupons() {
  const context = useContext(CouponContext);
  if (context === undefined) {
    throw new Error('useCoupons must be used within a CouponProvider');
  }
  return context;
}
