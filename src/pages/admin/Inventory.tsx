import { useState, useEffect } from 'react';
import { ClipboardList, ArrowDown, Package, TrendingDown, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/context/LanguageContext';

type Period = 'daily' | 'monthly' | 'yearly';

interface InventoryItem {
  id: number;
  name: string;
  nameEn: string;
  category: string;
  quantity: number;
  sold: number;
  added: number;
  date: string;
}

export default function Inventory() {
  const [period, setPeriod] = useState<Period>('daily');
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([]);
  const { language, isRTL } = useLanguage();

  // Load inventory data from products
  useEffect(() => {
    const savedProducts = localStorage.getItem('ajfworld_products');
    
    if (savedProducts) {
      const products = JSON.parse(savedProducts);
      // Find low stock products (less than 10 quantity)
      const lowStock = products.filter((p: any) => (p.quantity || 0) < 10);
      setLowStockProducts(lowStock);
      
      // Build inventory items
      const items: InventoryItem[] = products.map((p: any) => ({
        id: p.id,
        name: p.name,
        nameEn: p.nameEn,
        category: p.category,
        quantity: p.quantity || 0,
        sold: p.sold || 0,
        added: p.added || 0,
        date: p.updatedAt || new Date().toISOString().split('T')[0],
      }));
      setInventory(items);
    }
  }, []);

  const periodLabels = {
    ar: {
      daily: 'جرد يومي',
      monthly: 'جرد شهري',
      yearly: 'جرد سنوي',
      title: 'إدارة المخزون والجرد',
      totalProducts: 'إجمالي المنتجات',
      lowStock: 'منتجات منخفضة المخزون',
      totalSold: 'إجمالي المباع',
      totalInStock: 'إجمالي المتوفر',
      product: 'المنتج',
      category: 'الفئة',
      quantity: 'الكمية المتوفرة',
      sold: 'المباع',
      added: 'الإضافات',
      date: 'تاريخ التحديث',
      status: 'الحالة',
      inStock: 'متوفر',
      low: 'منخفض',
      outOfStock: 'نفذ المخزون',
      export: 'تصدير التقرير',
      noData: 'لا توجد بيانات مخزون',
    },
    en: {
      daily: 'Daily Inventory',
      monthly: 'Monthly Inventory',
      yearly: 'Yearly Inventory',
      title: 'Inventory & Stock Management',
      totalProducts: 'Total Products',
      lowStock: 'Low Stock Products',
      totalSold: 'Total Sold',
      totalInStock: 'Total In Stock',
      product: 'Product',
      category: 'Category',
      quantity: 'Available Quantity',
      sold: 'Sold',
      added: 'Added',
      date: 'Last Updated',
      status: 'Status',
      inStock: 'In Stock',
      low: 'Low Stock',
      outOfStock: 'Out of Stock',
      export: 'Export Report',
      noData: 'No inventory data available',
    }
  }[language];

  const getStatusBadge = (quantity: number) => {
    if (quantity === 0) return { text: periodLabels.outOfStock, class: 'bg-red-100 text-red-700' };
    if (quantity < 10) return { text: periodLabels.low, class: 'bg-yellow-100 text-yellow-700' };
    return { text: periodLabels.inStock, class: 'bg-green-100 text-green-700' };
  };

  const totalSold = inventory.reduce((sum, item) => sum + item.sold, 0);
  const totalInStock = inventory.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="p-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{periodLabels.title}</h1>
        <Button variant="outline">
          <ClipboardList className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          {periodLabels.export}
        </Button>
      </div>

      {/* Period Selector */}
      <div className="flex gap-2 mb-6">
        {(['daily', 'monthly', 'yearly'] as Period[]).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              period === p 
                ? 'bg-[#2d5d2a] text-white' 
                : 'bg-white text-gray-600 border hover:bg-gray-50'
            }`}
          >
            {periodLabels[p]}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#2d5d2a]/10 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-[#2d5d2a]" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{periodLabels.totalProducts}</p>
              <p className="text-2xl font-bold">{inventory.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <ArrowDown className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{periodLabels.totalInStock}</p>
              <p className="text-2xl font-bold">{totalInStock}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{periodLabels.totalSold}</p>
              <p className="text-2xl font-bold">{totalSold}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{periodLabels.lowStock}</p>
              <p className="text-2xl font-bold">{lowStockProducts.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <h3 className="font-bold text-yellow-800">
              {language === 'ar' ? 'تنبيه: منتجات منخفضة المخزون' : 'Alert: Low Stock Products'}
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {lowStockProducts.map((p) => (
              <Badge key={p.id} variant="secondary" className="bg-yellow-100 text-yellow-800">
                {language === 'ar' ? p.name : p.nameEn} ({p.quantity || 0})
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Inventory Table */}
      {inventory.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-700">{periodLabels.product}</th>
                  <th className="text-left p-4 font-medium text-gray-700">{periodLabels.category}</th>
                  <th className="text-left p-4 font-medium text-gray-700">{periodLabels.quantity}</th>
                  <th className="text-left p-4 font-medium text-gray-700">{periodLabels.sold}</th>
                  <th className="text-left p-4 font-medium text-gray-700">{periodLabels.added}</th>
                  <th className="text-left p-4 font-medium text-gray-700">{periodLabels.date}</th>
                  <th className="text-left p-4 font-medium text-gray-700">{periodLabels.status}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {inventory.map((item) => {
                  const status = getStatusBadge(item.quantity);
                  return (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="p-4 font-medium text-gray-900">{language === 'ar' ? item.name : item.nameEn}</td>
                      <td className="p-4"><Badge variant="outline">{item.category}</Badge></td>
                      <td className="p-4 font-bold">{item.quantity}</td>
                      <td className="p-4 text-gray-600">{item.sold}</td>
                      <td className="p-4 text-gray-600">{item.added}</td>
                      <td className="p-4 text-gray-600">{item.date}</td>
                      <td className="p-4">
                        <Badge className={status.class}>{status.text}</Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">{periodLabels.noData}</p>
        </div>
      )}
    </div>
  );
}
