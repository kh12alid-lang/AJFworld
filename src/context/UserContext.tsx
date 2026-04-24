import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { apiAuth, apiOrders, apiAddresses, apiWishlist } from '@/api/api-client';

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  emirate: string;
  building: string;
  apartment: string;
  isDefault: boolean;
}

export interface OrderItem {
  productId: number;
  name: string;
  nameEn: string;
  price: number;
  quantity: number;
  image: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  shipping: number;
  status: OrderStatus;
  address: Address;
  paymentMethod: string;
  createdAt: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  addresses: Address[];
  orders: Order[];
  wishlist: number[];
  createdAt: string;
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

interface UserContextType {
  user: UserAccount | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<UserAccount>) => void;
  addAddress: (address: Omit<Address, 'id'>) => void;
  updateAddress: (id: string, address: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  addOrder: (order: Omit<Order, 'id' | 'createdAt'>) => void;
  addToWishlist: (productId: number) => void;
  removeFromWishlist: (productId: number) => void;
  isAuthenticated: boolean;
  isLoggedIn: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem('ajfworld_user');
    return saved ? JSON.parse(saved) : null;
  });

  const isAuthenticated = !!user;

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('ajfworld_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('ajfworld_user');
      localStorage.removeItem('ajfworld_token');
    }
  }, [user]);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await apiAuth.login({ email, password });
      if (response.success && response.token) {
        localStorage.setItem('ajfworld_token', response.token);
        const userData: UserAccount = {
          id: String(response.user.id),
          name: response.user.name,
          email: response.user.email,
          phone: response.user.phone || '',
          avatar: response.user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(response.user.name)}&background=2d5d2a&color=fff`,
          addresses: [],
          orders: [],
          wishlist: [],
          createdAt: new Date().toISOString().split('T')[0],
        };
        setUser(userData);

        // Fetch user's orders and addresses
        try {
          const ordersRes = await apiOrders.getAll();
          if (ordersRes.success) {
            userData.orders = ordersRes.orders.map((o: any) => ({
              id: String(o.id),
              items: o.items || [],
              total: o.total,
              shipping: o.shipping || 0,
              status: o.status || 'pending',
              address: o.address || {} as Address,
              paymentMethod: o.payment_method || 'cod',
              createdAt: o.created_at || new Date().toISOString(),
            }));
          }

          const addrRes = await apiAddresses.getAll();
          if (addrRes.success) {
            userData.addresses = addrRes.addresses.map((a: any) => ({
              id: String(a.id),
              fullName: a.full_name,
              phone: a.phone || '',
              street: a.street,
              city: a.city,
              emirate: a.emirate,
              building: a.building || '',
              apartment: a.apartment || '',
              isDefault: !!a.is_default,
            }));
          }

          const wishRes = await apiWishlist.get();
          if (wishRes.success) {
            userData.wishlist = wishRes.items.map((w: any) => w.product_id);
          }

          setUser({ ...userData });
        } catch (e) {
          // Silently handle - user is still logged in
        }

        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }, []);

  const register = useCallback(async (data: RegisterData): Promise<boolean> => {
    try {
      const response = await apiAuth.register(data);
      if (response.success && response.token) {
        localStorage.setItem('ajfworld_token', response.token);
        setUser({
          id: String(response.user.id),
          name: response.user.name,
          email: response.user.email,
          phone: response.user.phone || '',
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(response.user.name)}&background=2d5d2a&color=fff`,
          addresses: [],
          orders: [],
          wishlist: [],
          createdAt: new Date().toISOString().split('T')[0],
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Register error:', error);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('ajfworld_token');
    localStorage.removeItem('ajfworld_user');
  }, []);

  const updateProfile = useCallback((data: Partial<UserAccount>) => {
    setUser(prev => prev ? { ...prev, ...data } : null);
  }, []);

  const addOrder = useCallback(async (order: Omit<Order, 'id' | 'createdAt'>) => {
    try {
      const orderData = {
        items: order.items.map(i => ({
          product_id: i.productId,
          name: i.name,
          name_en: i.nameEn,
          price: i.price,
          quantity: i.quantity,
          image: i.image,
        })),
        total: order.total,
        shipping: order.shipping,
        payment_method: order.paymentMethod,
        address_id: null,
      };

      const response = await apiOrders.create(orderData);
      if (response.success) {
        const newOrder: Order = {
          ...order,
          id: String(response.order.id),
          createdAt: new Date().toISOString(),
        };

        setUser(prev => {
          if (!prev) return null;
          return {
            ...prev,
            orders: [newOrder, ...prev.orders],
          };
        });
      }
    } catch (error) {
      console.error('Add order error:', error);
      // Still add locally for offline support
      const newOrder: Order = {
        ...order,
        id: `AJ-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      setUser(prev => {
        if (!prev) return null;
        return {
          ...prev,
          orders: [newOrder, ...prev.orders],
        };
      });
    }
  }, []);

  const addAddress = useCallback(async (address: Omit<Address, 'id'>) => {
    try {
      const addrData = {
        full_name: address.fullName,
        phone: address.phone,
        street: address.street,
        city: address.city,
        emirate: address.emirate,
        building: address.building,
        apartment: address.apartment,
        is_default: address.isDefault,
      };

      const response = await apiAddresses.add(addrData);
      if (response.success) {
        const newAddress: Address = {
          ...address,
          id: String(response.address.id),
        };
        setUser(prev => {
          if (!prev) return null;
          return {
            ...prev,
            addresses: [...prev.addresses, newAddress],
          };
        });
      }
    } catch (error) {
      console.error('Add address error:', error);
      // Fallback to local
      const newAddress: Address = {
        ...address,
        id: `addr-${Date.now()}`,
      };
      setUser(prev => {
        if (!prev) return null;
        return {
          ...prev,
          addresses: [...prev.addresses, newAddress],
        };
      });
    }
  }, []);

  const updateAddress = useCallback((id: string, address: Partial<Address>) => {
    setUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        addresses: prev.addresses.map(a => a.id === id ? { ...a, ...address } : a),
      };
    });
  }, []);

  const deleteAddress = useCallback((id: string) => {
    setUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        addresses: prev.addresses.filter(a => a.id !== id),
      };
    });
  }, []);

  const addToWishlist = useCallback(async (productId: number) => {
    try {
      await apiWishlist.add(productId);
    } catch (e) {
      // Silently fail
    }
    setUser(prev => {
      if (!prev) return null;
      if (prev.wishlist.includes(productId)) return prev;
      return { ...prev, wishlist: [...prev.wishlist, productId] };
    });
  }, []);

  const removeFromWishlist = useCallback(async (productId: number) => {
    try {
      await apiWishlist.remove(productId);
    } catch (e) {
      // Silently fail
    }
    setUser(prev => {
      if (!prev) return null;
      return { ...prev, wishlist: prev.wishlist.filter(id => id !== productId) };
    });
  }, []);

  return (
    <UserContext.Provider value={{
      user,
      login,
      register,
      logout,
      updateProfile,
      addAddress,
      updateAddress,
      deleteAddress,
      addOrder,
      addToWishlist,
      removeFromWishlist,
      isAuthenticated,
      isLoggedIn: isAuthenticated,
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
