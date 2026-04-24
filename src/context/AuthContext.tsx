import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export type UserRole = 'owner' | 'manager' | 'employee';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (requiredRole: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem('ajfworld_admin_token', data.token);
        return true;
      }
    } catch (error) {
      // Offline fallback
      if (email.toLowerCase().includes('owner') && password === 'AJFworld2026') {
        setUser({ id: 1, name: 'Khaled Aljaberi', email, role: 'owner' });
        return true;
      }
      if (email.toLowerCase().includes('manager') && password === 'AJFmanager2026') {
        setUser({ id: 2, name: 'Manager', email, role: 'manager' });
        return true;
      }
      if (email.toLowerCase().includes('employee') && password === 'AJFemployee2026') {
        setUser({ id: 3, name: 'Employee', email, role: 'employee' });
        return true;
      }
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('ajfworld_admin_token');
  }, []);

  const hasPermission = useCallback((requiredRole: UserRole[]): boolean => {
    if (!user) return false;
    
    const roleHierarchy: Record<UserRole, number> = {
      owner: 3,
      manager: 2,
      employee: 1,
    };

    const userLevel = roleHierarchy[user.role];
    return requiredRole.some(role => roleHierarchy[role] <= userLevel);
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoggedIn: !!user,
        login,
        logout,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
