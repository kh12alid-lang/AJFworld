import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export interface LoyaltyTransaction {
  id: string;
  userId: string;
  type: 'earn' | 'redeem' | 'bonus' | 'expire';
  points: number;
  description: {
    ar: string;
    en: string;
  };
  orderId?: string;
  createdAt: string;
  expiresAt?: string;
}

export interface LoyaltyTier {
  id: string;
  name: {
    ar: string;
    en: string;
  };
  minPoints: number;
  multiplier: number;
  benefits: {
    ar: string[];
    en: string[];
  };
  color: string;
}

interface LoyaltyContextType {
  points: number;
  lifetimePoints: number;
  tier: LoyaltyTier;
  transactions: LoyaltyTransaction[];
  earnPoints: (userId: string, amount: number, orderId: string, description: { ar: string; en: string }) => number;
  redeemPoints: (userId: string, points: number, description: { ar: string; en: string }) => { success: boolean; value: number };
  getPointsValue: (points: number) => number;
  getNextTier: () => LoyaltyTier | null;
  getProgressToNextTier: () => { current: number; target: number; percentage: number };
  getTransactions: (userId: string) => LoyaltyTransaction[];
}

// Loyalty tiers
export const LOYALTY_TIERS: LoyaltyTier[] = [
  {
    id: 'bronze',
    name: { ar: 'برونزي', en: 'Bronze' },
    minPoints: 0,
    multiplier: 1,
    benefits: {
      ar: ['نقطة لكل درهم', 'عروض حصرية'],
      en: ['1 point per AED', 'Exclusive offers'],
    },
    color: '#cd7f32',
  },
  {
    id: 'silver',
    name: { ar: 'فضي', en: 'Silver' },
    minPoints: 1000,
    multiplier: 1.25,
    benefits: {
      ar: ['1.25 نقطة لكل درهم', 'خصم 5% إضافي', 'توصيل مجاني'],
      en: ['1.25 points per AED', '5% extra discount', 'Free shipping'],
    },
    color: '#c0c0c0',
  },
  {
    id: 'gold',
    name: { ar: 'ذهبي', en: 'Gold' },
    minPoints: 5000,
    multiplier: 1.5,
    benefits: {
      ar: ['1.5 نقطة لكل درهم', 'خصم 10% إضافي', 'أولوية الشحن', 'دعم مميز'],
      en: ['1.5 points per AED', '10% extra discount', 'Priority shipping', 'VIP support'],
    },
    color: '#ffd700',
  },
  {
    id: 'platinum',
    name: { ar: 'بلاتيني', en: 'Platinum' },
    minPoints: 15000,
    multiplier: 2,
    benefits: {
      ar: ['2 نقطة لكل درهم', 'خصم 15% إضافي', 'توصيل سريع مجاني', 'دعم على مدار الساعة', 'هدايا حصرية'],
      en: ['2 points per AED', '15% extra discount', 'Free express shipping', '24/7 support', 'Exclusive gifts'],
    },
    color: '#e5e4e2',
  },
];

// Points value: 100 points = 1 AED
const POINTS_VALUE_RATE = 0.01;

// Mock transactions
const MOCK_TRANSACTIONS: LoyaltyTransaction[] = [
  {
    id: 'trans-1',
    userId: 'user-1',
    type: 'earn',
    points: 299,
    description: { ar: 'نقاط من طلب #AJ-001234', en: 'Points from order #AJ-001234' },
    orderId: 'AJ-001234',
    createdAt: '2025-01-10',
  },
  {
    id: 'trans-2',
    userId: 'user-1',
    type: 'bonus',
    points: 100,
    description: { ar: 'مكافأة ترحيبية', en: 'Welcome bonus' },
    createdAt: '2024-12-01',
  },
];

const LoyaltyContext = createContext<LoyaltyContextType | undefined>(undefined);

export function LoyaltyProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<LoyaltyTransaction[]>(MOCK_TRANSACTIONS);
  const [userPoints, setUserPoints] = useState<Record<string, { current: number; lifetime: number }>>({
    'user-1': { current: 399, lifetime: 399 },
  });

  const getUserPoints = useCallback((userId: string) => {
    return userPoints[userId] || { current: 0, lifetime: 0 };
  }, [userPoints]);

  const getTier = useCallback((lifetimePoints: number) => {
    for (let i = LOYALTY_TIERS.length - 1; i >= 0; i--) {
      if (lifetimePoints >= LOYALTY_TIERS[i].minPoints) {
        return LOYALTY_TIERS[i];
      }
    }
    return LOYALTY_TIERS[0];
  }, []);

  const earnPoints = useCallback((userId: string, amount: number, orderId: string, description: { ar: string; en: string }): number => {
    const userData = getUserPoints(userId);
    const tier = getTier(userData.lifetime);
    const points = Math.round(amount * tier.multiplier);

    const transaction: LoyaltyTransaction = {
      id: `trans-${Date.now()}`,
      userId,
      type: 'earn',
      points,
      description,
      orderId,
      createdAt: new Date().toISOString().split('T')[0],
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    };

    setTransactions(prev => [transaction, ...prev]);
    setUserPoints(prev => ({
      ...prev,
      [userId]: {
        current: (prev[userId]?.current || 0) + points,
        lifetime: (prev[userId]?.lifetime || 0) + points,
      },
    }));

    return points;
  }, [getUserPoints, getTier]);

  const redeemPoints = useCallback((userId: string, points: number, description: { ar: string; en: string }): { success: boolean; value: number } => {
    const userData = getUserPoints(userId);
    
    if (userData.current < points) {
      return { success: false, value: 0 };
    }

    const transaction: LoyaltyTransaction = {
      id: `trans-${Date.now()}`,
      userId,
      type: 'redeem',
      points: -points,
      description,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setTransactions(prev => [transaction, ...prev]);
    setUserPoints(prev => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        current: prev[userId].current - points,
      },
    }));

    return { success: true, value: points * POINTS_VALUE_RATE };
  }, [getUserPoints]);

  const getPointsValue = useCallback((points: number): number => {
    return Math.round(points * POINTS_VALUE_RATE * 100) / 100;
  }, []);

  const getNextTier = useCallback((lifetimePoints?: number) => {
    const points = lifetimePoints || 0;
    const currentTierIndex = LOYALTY_TIERS.findIndex(t => points >= t.minPoints);
    return LOYALTY_TIERS[currentTierIndex + 1] || null;
  }, []);

  const getProgressToNextTier = useCallback((lifetimePoints?: number) => {
    const points = lifetimePoints || 0;
    const currentTier = getTier(points);
    const nextTier = getNextTier(points);
    
    if (!nextTier) {
      return { current: points, target: points, percentage: 100 };
    }

    const progress = points - currentTier.minPoints;
    const target = nextTier.minPoints - currentTier.minPoints;
    const percentage = Math.round((progress / target) * 100);

    return { current: progress, target, percentage };
  }, [getTier, getNextTier]);

  const getTransactions = useCallback((userId: string) => {
    return transactions.filter(t => t.userId === userId).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [transactions]);

  // Default values for demo (user-1)
  const demoUser = getUserPoints('user-1');
  const demoTier = getTier(demoUser.lifetime);

  return (
    <LoyaltyContext.Provider
      value={{
        points: demoUser.current,
        lifetimePoints: demoUser.lifetime,
        tier: demoTier,
        transactions,
        earnPoints,
        redeemPoints,
        getPointsValue,
        getNextTier: () => getNextTier(demoUser.lifetime),
        getProgressToNextTier: () => getProgressToNextTier(demoUser.lifetime),
        getTransactions,
      }}
    >
      {children}
    </LoyaltyContext.Provider>
  );
}

export function useLoyalty() {
  const context = useContext(LoyaltyContext);
  if (context === undefined) {
    throw new Error('useLoyalty must be used within a LoyaltyProvider');
  }
  return context;
}
