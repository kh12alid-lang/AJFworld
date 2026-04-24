import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';

export type EmployeeRole = 'manager' | 'employee';

export interface EmployeePermission {
  viewProducts: boolean;
  editProducts: boolean;
  deleteProducts: boolean;
  viewOrders: boolean;
  editOrders: boolean;
  viewCustomers: boolean;
  viewAnalytics: boolean;
  manageSettings: boolean;
}

export interface Employee {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: EmployeeRole;
  permissions: EmployeePermission;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
}

interface EmployeeContextType {
  employees: Employee[];
  addEmployee: (employee: Omit<Employee, 'id' | 'createdAt'>) => void;
  updateEmployee: (id: number, updates: Partial<Employee>) => void;
  deleteEmployee: (id: number) => void;
  toggleEmployeeStatus: (id: number) => void;
  getEmployeeById: (id: number) => Employee | undefined;
}

const defaultPermissions: Record<EmployeeRole, EmployeePermission> = {
  manager: {
    viewProducts: true,
    editProducts: true,
    deleteProducts: true,
    viewOrders: true,
    editOrders: true,
    viewCustomers: true,
    viewAnalytics: true,
    manageSettings: false,
  },
  employee: {
    viewProducts: true,
    editProducts: false,
    deleteProducts: false,
    viewOrders: true,
    editOrders: false,
    viewCustomers: false,
    viewAnalytics: false,
    manageSettings: false,
  },
};

// No initial mock employees - only manually added ones
const initialEmployees: Employee[] = [];

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

export function EmployeeProvider({ children }: { children: ReactNode }) {
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('ajfworld_employees');
    return saved ? JSON.parse(saved) : initialEmployees;
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('ajfworld_employees', JSON.stringify(employees));
  }, [employees]);

  const addEmployee = useCallback((employee: Omit<Employee, 'id' | 'createdAt'>) => {
    const newEmployee: Employee = {
      ...employee,
      id: Math.max(0, ...employees.map(e => e.id)) + 1,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setEmployees(prev => [...prev, newEmployee]);
  }, [employees]);

  const updateEmployee = useCallback((id: number, updates: Partial<Employee>) => {
    setEmployees(prev =>
      prev.map(emp =>
        emp.id === id ? { ...emp, ...updates } : emp
      )
    );
  }, []);

  const deleteEmployee = useCallback((id: number) => {
    setEmployees(prev => prev.filter(emp => emp.id !== id));
  }, []);

  const toggleEmployeeStatus = useCallback((id: number) => {
    setEmployees(prev =>
      prev.map(emp =>
        emp.id === id ? { ...emp, isActive: !emp.isActive } : emp
      )
    );
  }, []);

  const getEmployeeById = useCallback((id: number) => {
    return employees.find(emp => emp.id === id);
  }, [employees]);

  return (
    <EmployeeContext.Provider
      value={{
        employees,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        toggleEmployeeStatus,
        getEmployeeById,
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
}

export function useEmployees() {
  const context = useContext(EmployeeContext);
  if (context === undefined) {
    throw new Error('useEmployees must be used within an EmployeeProvider');
  }
  return context;
}

export { defaultPermissions };
