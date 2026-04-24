import { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Percent, Tag, ToggleLeft, ToggleRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useCoupons } from '@/context/CouponContext';
import { useLanguage } from '@/context/LanguageContext';

export default function AdminCoupons() {
  const { language, isRTL } = useLanguage();
  const { coupons, updateCoupon, deleteCoupon } = useCoupons();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredCoupons = coupons.filter(c => 
    c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.ar.includes(searchQuery) ||
    c.description.en.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {language === 'ar' ? 'إدارة الكوبونات' : 'Coupon Management'}
          </h1>
          <p className="text-gray-500">
            {coupons.length} {language === 'ar' ? 'كوبون' : 'coupons'}
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#2d5d2a] hover:bg-[#1e401c]">
              <Plus className="w-4 h-4 mr-2" />
              {language === 'ar' ? 'إضافة كوبون' : 'Add Coupon'}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {language === 'ar' ? 'إضافة كوبون جديد' : 'Add New Coupon'}
              </DialogTitle>
            </DialogHeader>
            {/* Add coupon form would go here */}
            <p className="text-gray-500 text-center py-4">
              {language === 'ar' ? 'نموذج إضافة الكوبون' : 'Add coupon form'}
            </p>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400`} />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={language === 'ar' ? 'بحث في الكوبونات...' : 'Search coupons...'}
          className={`${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} h-12`}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">{language === 'ar' ? 'الكل' : 'Total'}</p>
          <p className="text-2xl font-bold">{coupons.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">{language === 'ar' ? 'نشط' : 'Active'}</p>
          <p className="text-2xl font-bold text-green-600">
            {coupons.filter(c => c.isActive).length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">{language === 'ar' ? 'منتهي' : 'Expired'}</p>
          <p className="text-2xl font-bold text-red-600">
            {coupons.filter(c => !c.isActive).length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">{language === 'ar' ? 'الاستخدام' : 'Usage'}</p>
          <p className="text-2xl font-bold text-blue-600">
            {coupons.reduce((acc, c) => acc + c.usageCount, 0)}
          </p>
        </div>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                  {language === 'ar' ? 'الكود' : 'Code'}
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                  {language === 'ar' ? 'النوع' : 'Type'}
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                  {language === 'ar' ? 'القيمة' : 'Value'}
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                  {language === 'ar' ? 'الاستخدام' : 'Usage'}
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                  {language === 'ar' ? 'الحالة' : 'Status'}
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                  {language === 'ar' ? 'الإجراءات' : 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCoupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium">{coupon.code}</p>
                      <p className="text-sm text-gray-500">
                        {language === 'ar' ? coupon.description.ar : coupon.description.en}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline">
                      {coupon.type === 'percentage' ? (
                        <><Percent className="w-3 h-3 mr-1" /> %</>
                      ) : (
                        <><Tag className="w-3 h-3 mr-1" /> AED</>
                      )}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium">
                      {coupon.type === 'percentage' ? `${coupon.value}%` : `${coupon.value} AED`}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm">
                      <span className="font-medium">{coupon.usageCount}</span>
                      <span className="text-gray-400"> / {coupon.usageLimit}</span>
                    </div>
                    <div className="w-24 h-1 bg-gray-200 rounded-full mt-1 overflow-hidden">
                      <div 
                        className="h-full bg-[#2d5d2a] rounded-full"
                        style={{ width: `${(coupon.usageCount / coupon.usageLimit) * 100}%` }}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => updateCoupon(coupon.id, { isActive: !coupon.isActive })}
                      className="flex items-center gap-2"
                    >
                      {coupon.isActive ? (
                        <ToggleRight className="w-6 h-6 text-green-500" />
                      ) : (
                        <ToggleLeft className="w-6 h-6 text-gray-400" />
                      )}
                      <span className={`text-sm ${coupon.isActive ? 'text-green-600' : 'text-gray-500'}`}>
                        {coupon.isActive 
                          ? (language === 'ar' ? 'نشط' : 'Active')
                          : (language === 'ar' ? 'معطل' : 'Inactive')
                        }
                      </span>
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button 
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => deleteCoupon(coupon.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCoupons.length === 0 && (
          <div className="text-center py-12">
            <Tag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">
              {language === 'ar' ? 'لا توجد كوبونات' : 'No coupons found'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
