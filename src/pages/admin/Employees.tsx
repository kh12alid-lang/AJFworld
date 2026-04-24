import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, UserCheck, UserX, Shield, Eye, EyeOff, TrendingUp, ShoppingBag, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useEmployees, type Employee, type EmployeePermission, defaultPermissions } from '@/context/EmployeeContext';
import { useLanguage } from '@/context/LanguageContext';

interface EmployeeFormData {
  name: string;
  email: string;
  phone: string;
  role: 'manager' | 'employee';
  permissions: EmployeePermission;
}

const initialFormData: EmployeeFormData = {
  name: '',
  email: '',
  phone: '',
  role: 'employee',
  permissions: defaultPermissions.employee,
};

interface EmployeeSales {
  employeeId: number;
  orders: number;
  revenue: number;
}

export default function Employees() {
  const { employees, addEmployee, updateEmployee, deleteEmployee, toggleEmployeeStatus } = useEmployees();
  const { language, isRTL } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState<EmployeeFormData>(initialFormData);
  const [showPermissions, setShowPermissions] = useState<number | null>(null);
  const [employeeSales, setEmployeeSales] = useState<Record<number, EmployeeSales>>({});

  // Load employee sales data from orders
  useEffect(() => {
    const savedOrders = localStorage.getItem('ajfworld_orders');
    if (savedOrders) {
      const orders = JSON.parse(savedOrders);
      const sales: Record<number, EmployeeSales> = {};
      orders.forEach((order: any) => {
        const empId = order.employeeId || order.processedBy;
        if (empId) {
          if (!sales[empId]) {
            sales[empId] = { employeeId: empId, orders: 0, revenue: 0 };
          }
          sales[empId].orders += 1;
          sales[empId].revenue += order.total || 0;
        }
      });
      setEmployeeSales(sales);
    }
  }, []);

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.phone.includes(searchQuery)
  );

  const handleOpenDialog = (employee?: Employee) => {
    if (employee) {
      setEditingEmployee(employee);
      setFormData({
        name: employee.name,
        email: employee.email,
        phone: employee.phone,
        role: employee.role,
        permissions: { ...employee.permissions },
      });
    } else {
      setEditingEmployee(null);
      setFormData(initialFormData);
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEmployee) {
      updateEmployee(editingEmployee.id, formData);
    } else {
      addEmployee({
        ...formData,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=${formData.role === 'manager' ? '4caf50' : '81c784'}&color=fff`,
        isActive: true,
      });
    }
    setIsDialogOpen(false);
    setFormData(initialFormData);
  };

  const handleDelete = (id: number, name: string) => {
    if (confirm(language === 'ar'
      ? `هل أنت متأكد من حذف الموظف "${name}"؟`
      : `Are you sure you want to delete employee "${name}"?`
    )) {
      deleteEmployee(id);
    }
  };

  const togglePermission = (permission: keyof EmployeePermission) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: !prev.permissions[permission],
      },
    }));
  };

  const permissionLabels: Record<keyof EmployeePermission, { ar: string; en: string }> = {
    viewProducts: { ar: 'عرض المنتجات', en: 'View Products' },
    editProducts: { ar: 'تعديل المنتجات', en: 'Edit Products' },
    deleteProducts: { ar: 'حذف المنتجات', en: 'Delete Products' },
    viewOrders: { ar: 'عرض الطلبات', en: 'View Orders' },
    editOrders: { ar: 'تعديل الطلبات', en: 'Edit Orders' },
    viewCustomers: { ar: 'عرض العملاء', en: 'View Customers' },
    viewAnalytics: { ar: 'عرض التحليلات', en: 'View Analytics' },
    manageSettings: { ar: 'إدارة الإعدادات', en: 'Manage Settings' },
  };

  const t = {
    ar: {
      title: 'إدارة الموظفين',
      addEmployee: 'إضافة موظف',
      search: 'البحث بالاسم أو البريد...',
      totalEmployees: 'إجمالي الموظفين',
      activeEmployees: 'النشطين',
      inactiveEmployees: 'غير النشطين',
      sales: 'المبيعات',
      orders: 'الطلبات',
      revenue: 'الإيرادات',
      performance: 'الأداء',
      topPerformer: 'الأفضل أداء',
      permissions: 'الصلاحيات',
      viewPermissions: 'عرض الصلاحيات',
      edit: 'تعديل',
      delete: 'حذف',
      activate: 'تفعيل',
      deactivate: 'تعطيل',
      name: 'الاسم',
      email: 'البريد',
      phone: 'الهاتف',
      role: 'الدور',
      status: 'الحالة',
      createdAt: 'تاريخ الإضافة',
    },
    en: {
      title: 'Employee Management',
      addEmployee: 'Add Employee',
      search: 'Search by name or email...',
      totalEmployees: 'Total Employees',
      activeEmployees: 'Active',
      inactiveEmployees: 'Inactive',
      sales: 'Sales',
      orders: 'Orders',
      revenue: 'Revenue',
      performance: 'Performance',
      topPerformer: 'Top Performer',
      permissions: 'Permissions',
      viewPermissions: 'View Permissions',
      edit: 'Edit',
      delete: 'Delete',
      activate: 'Activate',
      deactivate: 'Deactivate',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      role: 'Role',
      status: 'Status',
      createdAt: 'Added Date',
    }
  }[language];

  const curr = language === 'ar' ? 'د.إ' : 'AED';

  // Find top performer
  const topPerformerId = Object.entries(employeeSales).sort((a, b) => b[1].revenue - a[1].revenue)[0]?.[0];

  return (
    <div className="p-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
        <Button
          className="bg-[#2d5d2a] hover:bg-[#1e401c]"
          onClick={() => handleOpenDialog()}
        >
          <Plus className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          {t.addEmployee}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-gray-100">
          <p className="text-sm text-gray-500">{t.totalEmployees}</p>
          <p className="text-2xl font-bold text-gray-900">{employees.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100">
          <p className="text-sm text-gray-500">{t.activeEmployees}</p>
          <p className="text-2xl font-bold text-green-600">{employees.filter(e => e.isActive).length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100">
          <p className="text-sm text-gray-500">{t.inactiveEmployees}</p>
          <p className="text-2xl font-bold text-gray-400">{employees.filter(e => !e.isActive).length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100">
          <p className="text-sm text-gray-500">{t.sales}</p>
          <p className="text-2xl font-bold text-[#2d5d2a]">{Object.values(employeeSales).reduce((s, v) => s + v.revenue, 0)} {curr}</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400`} />
        <Input
          type="text"
          placeholder={t.search}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} h-11`}
        />
      </div>

      {/* Employees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.map((employee) => {
          const sales = employeeSales[employee.id] || { orders: 0, revenue: 0 };
          const isTop = String(employee.id) === topPerformerId;
          return (
            <div key={employee.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={employee.avatar}
                    alt={employee.name}
                    className="w-14 h-14 rounded-full"
                  />
                  <div>
                    <h3 className="font-bold text-gray-900">{employee.name}</h3>
                    <Badge className={employee.role === 'manager' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}>
                      {language === 'ar'
                        ? (employee.role === 'manager' ? 'مدير' : 'موظف')
                        : employee.role
                      }
                    </Badge>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge className={employee.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                    {employee.isActive
                      ? (language === 'ar' ? 'نشط' : 'Active')
                      : (language === 'ar' ? 'معطل' : 'Inactive')
                    }
                  </Badge>
                  {isTop && (
                    <Badge className="bg-yellow-100 text-yellow-700">
                      <Award className="w-3 h-3 mr-1" />
                      {t.topPerformer}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-600">{employee.email}</p>
                <p className="text-sm text-gray-600">{employee.phone}</p>
                <p className="text-xs text-gray-400">
                  {t.createdAt}: {employee.createdAt}
                </p>
              </div>

              {/* Sales Stats */}
              <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <ShoppingBag className="w-4 h-4" />
                    {t.orders}
                  </div>
                  <p className="font-bold text-lg">{sales.orders}</p>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <TrendingUp className="w-4 h-4" />
                    {t.revenue}
                  </div>
                  <p className="font-bold text-lg">{sales.revenue} {curr}</p>
                </div>
              </div>

              {/* Permissions Preview */}
              <div className="mb-4">
                <button
                  onClick={() => setShowPermissions(showPermissions === employee.id ? null : employee.id)}
                  className="flex items-center gap-2 text-sm text-[#2d5d2a] hover:underline"
                >
                  <Shield className="w-4 h-4" />
                  {t.viewPermissions}
                  {showPermissions === employee.id ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>

                {showPermissions === employee.id && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg space-y-2">
                    {Object.entries(employee.permissions).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">
                          {language === 'ar'
                            ? permissionLabels[key as keyof EmployeePermission].ar
                            : permissionLabels[key as keyof EmployeePermission].en
                          }
                        </span>
                        <span className={value ? 'text-green-600' : 'text-red-400'}>
                          {value ? '✓' : '✗'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                <button
                  onClick={() => toggleEmployeeStatus(employee.id)}
                  className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-lg transition-colors ${
                    employee.isActive
                      ? 'text-red-600 hover:bg-red-50'
                      : 'text-green-600 hover:bg-green-50'
                  }`}
                >
                  {employee.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                  <span className="text-sm">
                    {employee.isActive ? t.deactivate : t.activate}
                  </span>
                </button>
                <button
                  onClick={() => handleOpenDialog(employee)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(employee.id, employee.name)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto" dir={isRTL ? 'rtl' : 'ltr'}>
          <DialogHeader>
            <DialogTitle className={isRTL ? 'text-right' : 'text-left'}>
              {editingEmployee
                ? (language === 'ar' ? 'تعديل موظف' : 'Edit Employee')
                : (language === 'ar' ? 'إضافة موظف جديد' : 'Add New Employee')
              }
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{language === 'ar' ? 'الاسم الكامل' : 'Full Name'}</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={language === 'ar' ? 'مثال: أحمد محمد' : 'e.g. Ahmed Mohammed'}
                className="h-11"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{language === 'ar' ? 'البريد الإلكتروني' : 'Email'}</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="employee@ajfworld.ae"
                className="h-11"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}</label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+971 50 000 0000"
                className="h-11"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{language === 'ar' ? 'الدور الوظيفي' : 'Role'}</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({
                  ...formData,
                  role: e.target.value as 'manager' | 'employee',
                  permissions: defaultPermissions[e.target.value as 'manager' | 'employee']
                })}
                className="w-full h-11 px-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2d5d2a] focus:border-transparent"
              >
                <option value="employee">{language === 'ar' ? 'موظف' : 'Employee'}</option>
                <option value="manager">{language === 'ar' ? 'مدير' : 'Manager'}</option>
              </select>
            </div>

            {/* Permissions Section */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-medium text-gray-900 mb-3">{t.permissions}</h3>
              <div className="space-y-2">
                {Object.entries(permissionLabels).map(([key, labels]) => (
                  <label
                    key={key}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-sm text-gray-700">
                      {language === 'ar' ? labels.ar : labels.en}
                    </span>
                    <input
                      type="checkbox"
                      checked={formData.permissions[key as keyof EmployeePermission]}
                      onChange={() => togglePermission(key as keyof EmployeePermission)}
                      className="w-5 h-5 text-[#2d5d2a] rounded focus:ring-[#2d5d2a]"
                    />
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setIsDialogOpen(false)}
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-[#2d5d2a] hover:bg-[#1e401c]"
              >
                {editingEmployee
                  ? (language === 'ar' ? 'حفظ التغييرات' : 'Save Changes')
                  : (language === 'ar' ? 'إضافة' : 'Add')
                }
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
