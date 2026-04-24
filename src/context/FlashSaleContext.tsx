import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { products } from '@/data/products';

export interface FlashSale {
  id: string;
  productId: number;
  originalPrice: number;
  salePrice: number;
  discount: number;
  startTime: string;
  endTime: string;
  stockLimit: number;
  soldCount: number;
  isActive: boolean;
}

export interface DailyDeal {
  id: string;
  productId: number;
  dealPrice: number;
  originalPrice: number;
  discount: number;
  maxQuantity: number;
  soldToday: number;
  validUntil: string;
}

interface FlashSaleContextType {
  flashSales: FlashSale[];
  dailyDeals: DailyDeal[];
  getActiveFlashSales: () => FlashSale[];
  getActiveDailyDeals: () => DailyDeal[];
  getFlashSaleProduct: (productId: number) => FlashSale | undefined;
  getDailyDealProduct: (productId: number) => DailyDeal | undefined;
  getTimeRemaining: (endTime: string) => { hours: number; minutes: number; seconds: number; total: number };
  isFlashSaleActive: (productId: number) => boolean;
  isDailyDealActive: (productId: number) => boolean;
  getDiscountedPrice: (productId: number) => number | undefined;
  getBestDeal: (productId: number) => { price: number; discount: number; type: 'flash' | 'daily' | 'none' };
  addFlashSale: (sale: Omit<FlashSale, 'id' | 'soldCount'>) => void;
  addDailyDeal: (deal: Omit<DailyDeal, 'id' | 'soldToday'>) => void;
  incrementSold: (type: 'flash' | 'daily', id: string, quantity: number) => void;
}

// Mock flash sales
const MOCK_FLASH_SALES: FlashSale[] = [
  {
    id: 'flash-1',
    productId: 1,
    originalPrice: 299,
    salePrice: 199,
    discount: 33,
    startTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // Started 2 hours ago
    endTime: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(), // Ends in 6 hours
    stockLimit: 50,
    soldCount: 32,
    isActive: true,
  },
  {
    id: 'flash-2',
    productId: 3,
    originalPrice: 1299,
    salePrice: 899,
    discount: 31,
    startTime: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    stockLimit: 30,
    soldCount: 18,
    isActive: true,
  },
  {
    id: 'flash-3',
    productId: 5,
    originalPrice: 449,
    salePrice: 299,
    discount: 33,
    startTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 7 * 60 * 60 * 1000).toISOString(),
    stockLimit: 100,
    soldCount: 45,
    isActive: true,
  },
];

// Mock daily deals
const MOCK_DAILY_DEALS: DailyDeal[] = [
  {
    id: 'deal-1',
    productId: 2,
    dealPrice: 399,
    originalPrice: 599,
    discount: 33,
    maxQuantity: 20,
    soldToday: 12,
    validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'deal-2',
    productId: 4,
    dealPrice: 2499,
    originalPrice: 3499,
    discount: 29,
    maxQuantity: 10,
    soldToday: 7,
    validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  },
];

const FlashSaleContext = createContext<FlashSaleContextType | undefined>(undefined);

export function FlashSaleProvider({ children }: { children: ReactNode }) {
  const [flashSales, setFlashSales] = useState<FlashSale[]>(MOCK_FLASH_SALES);
  const [dailyDeals, setDailyDeals] = useState<DailyDeal[]>(MOCK_DAILY_DEALS);
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const getActiveFlashSales = useCallback(() => {
    const now = new Date().toISOString();
    return flashSales.filter(s => 
      s.isActive && 
      s.startTime <= now && 
      s.endTime > now &&
      s.soldCount < s.stockLimit
    );
  }, [flashSales]);

  const getActiveDailyDeals = useCallback(() => {
    const now = new Date().toISOString();
    return dailyDeals.filter(d => 
      d.validUntil > now && 
      d.soldToday < d.maxQuantity
    );
  }, [dailyDeals]);

  const getFlashSaleProduct = useCallback((productId: number) => {
    return flashSales.find(s => s.productId === productId);
  }, [flashSales]);

  const getDailyDealProduct = useCallback((productId: number) => {
    return dailyDeals.find(d => d.productId === productId);
  }, [dailyDeals]);

  const getTimeRemaining = useCallback((endTime: string) => {
    const end = new Date(endTime).getTime();
    const total = Math.max(0, end - currentTime);
    
    const hours = Math.floor(total / (1000 * 60 * 60));
    const minutes = Math.floor((total % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((total % (1000 * 60)) / 1000);
    
    return { hours, minutes, seconds, total };
  }, [currentTime]);

  const isFlashSaleActive = useCallback((productId: number) => {
    const sale = getFlashSaleProduct(productId);
    if (!sale) return false;
    
    const now = new Date().toISOString();
    return sale.isActive && 
           sale.startTime <= now && 
           sale.endTime > now &&
           sale.soldCount < sale.stockLimit;
  }, [getFlashSaleProduct]);

  const isDailyDealActive = useCallback((productId: number) => {
    const deal = getDailyDealProduct(productId);
    if (!deal) return false;
    
    const now = new Date().toISOString();
    return deal.validUntil > now && deal.soldToday < deal.maxQuantity;
  }, [getDailyDealProduct]);

  const getDiscountedPrice = useCallback((productId: number): number | undefined => {
    const flashSale = getFlashSaleProduct(productId);
    if (flashSale && isFlashSaleActive(productId)) {
      return flashSale.salePrice;
    }
    
    const dailyDeal = getDailyDealProduct(productId);
    if (dailyDeal && isDailyDealActive(productId)) {
      return dailyDeal.dealPrice;
    }
    
    return undefined;
  }, [getFlashSaleProduct, getDailyDealProduct, isFlashSaleActive, isDailyDealActive]);

  const getBestDeal = useCallback((productId: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return { price: 0, discount: 0, type: 'none' as const };
    
    const originalPrice = product.oldPrice || product.price;
    
    const flashSale = getFlashSaleProduct(productId);
    if (flashSale && isFlashSaleActive(productId)) {
      return { 
        price: flashSale.salePrice, 
        discount: flashSale.discount, 
        type: 'flash' as const 
      };
    }
    
    const dailyDeal = getDailyDealProduct(productId);
    if (dailyDeal && isDailyDealActive(productId)) {
      return { 
        price: dailyDeal.dealPrice, 
        discount: dailyDeal.discount, 
        type: 'daily' as const 
      };
    }
    
    return { price: originalPrice, discount: 0, type: 'none' as const };
  }, [getFlashSaleProduct, getDailyDealProduct, isFlashSaleActive, isDailyDealActive]);

  const addFlashSale = useCallback((sale: Omit<FlashSale, 'id' | 'soldCount'>) => {
    const newSale: FlashSale = {
      ...sale,
      id: `flash-${Date.now()}`,
      soldCount: 0,
    };
    setFlashSales(prev => [...prev, newSale]);
  }, []);

  const addDailyDeal = useCallback((deal: Omit<DailyDeal, 'id' | 'soldToday'>) => {
    const newDeal: DailyDeal = {
      ...deal,
      id: `deal-${Date.now()}`,
      soldToday: 0,
    };
    setDailyDeals(prev => [...prev, newDeal]);
  }, []);

  const incrementSold = useCallback((type: 'flash' | 'daily', id: string, quantity: number) => {
    if (type === 'flash') {
      setFlashSales(prev =>
        prev.map(s => s.id === id ? { ...s, soldCount: s.soldCount + quantity } : s)
      );
    } else {
      setDailyDeals(prev =>
        prev.map(d => d.id === id ? { ...d, soldToday: d.soldToday + quantity } : d)
      );
    }
  }, []);

  return (
    <FlashSaleContext.Provider
      value={{
        flashSales,
        dailyDeals,
        getActiveFlashSales,
        getActiveDailyDeals,
        getFlashSaleProduct,
        getDailyDealProduct,
        getTimeRemaining,
        isFlashSaleActive,
        isDailyDealActive,
        getDiscountedPrice,
        getBestDeal,
        addFlashSale,
        addDailyDeal,
        incrementSold,
      }}
    >
      {children}
    </FlashSaleContext.Provider>
  );
}

export function useFlashSales() {
  const context = useContext(FlashSaleContext);
  if (context === undefined) {
    throw new Error('useFlashSales must be used within a FlashSaleProvider');
  }
  return context;
}
