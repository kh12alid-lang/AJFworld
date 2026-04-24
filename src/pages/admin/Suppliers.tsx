import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Truck, Phone, Mail, Package, Hash, FileText, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/context/LanguageContext';

interface Supplier {
  id: number;
  name: string;
  nameEn: string;
  phone: string;
  email: string;
  address: string;
  taxNumber: string;
  tradeLicense: string;
  extraField1: string;
  extraField2: string;
  extraField3: string;
  productsCount: number;
  status: 'active' | 'inactive';
}

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    const saved = localStorage.getItem('ajfworld_suppliers');
    return saved ? JSON.parse(saved) : [];
  });
  const [searchQuery, setSearchQuery] = useState('');
  const { language, isRTL } = useLanguage();
  
  // Modal states
  const [showForm, setShowForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  
  // Form states
  const [name, setName] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [taxNumber, setTaxNumber] = useState('');
  const [tradeLicense, setTradeLicense] = useState('');
  const [extraField1, setExtraField1] = useState('');
  const [extraField2, setExtraField2] = useState('');
  const [extraField3, setExtraField3] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('ajfworld_suppliers', JSON.stringify(suppliers));
  }, [suppliers]);

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    supplier.phone.includes(searchQuery) ||
    supplier.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    supplier.taxNumber.includes(searchQuery) ||
    supplier.tradeLicense.includes(searchQuery)
  );

  const handleDelete = (id: number) => {
    if (confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا المورد؟' : 'Are you sure you want to delete this supplier?')) {
      setSuppliers(suppliers.filter(s => s.id !== id));
    }
  };

  const handleSave = () => {
    if (!name || !phone) {
      alert(language === 'ar' ? 'يرجى ملء الاسم ورقم الهاتف' : 'Please fill name and phone');
      return;
    }
    
    const supplierData: Supplier = {
      id: editingSupplier ? editingSupplier.id : Date.now(),
      name,
      nameEn: nameEn || name,
      phone,
      email: email || '',
      address: address || '',
      taxNumber: taxNumber || '',
      tradeLicense: tradeLicense || '',
      extraField1: extraField1 || '',
      extraField2: extraField2 || '',
      extraField3: extraField3 || '',
      productsCount: editingSupplier ? editingSupplier.productsCount : 0,
      status,
    };
    
    if (editingSupplier) {
      setSuppliers(suppliers.map(s => s.id === editingSupplier.id ? supplierData : s));
      setEditingSupplier(null);
    } else {
      setSuppliers([...suppliers, supplierData]);
    }
    
    resetForm();
    setShowForm(false);
  };

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setName(supplier.name);
    setNameEn(supplier.nameEn);
    setPhone(supplier.phone);
    setEmail(supplier.email);
    setAddress(supplier.address);
    setTaxNumber(supplier.taxNumber);
    setTradeLicense(supplier.tradeLicense);
    setExtraField1(supplier.extraField1);
    setExtraField2(supplier.extraField2);
    setExtraField3(supplier.extraField3);
    setStatus(supplier.status);
    setShowForm(true);
  };

  const resetForm = () => {
    setName('');
    setNameEn('');
    setPhone('');
    setEmail('');
    setAddress('');
    setTaxNumber('');
    setTradeLicense('');
    setExtraField1('');
    setExtraField2('');
    setExtraField3('');
    setStatus('active');
    setEditingSupplier(null);
  };

  const t = {
    ar: {
      title: 'إدارة الموردين',
      addSupplier: 'إضافة مورد',
      search: 'البحث في الموردين...',
      name: 'اسم المورد',
      nameEn: 'الاسم بالإنجليزي',
      phone: 'رقم الهاتف',
      email: 'البريد الإلكتروني',
      address: 'العنوان',
      taxNumber: 'الرقم الضريبي (TRN)',
      tradeLicense: 'رقم الرخصة التجارية',
      extraField1: 'بيانات إضافية 1',
      extraField2: 'بيانات إضافية 2',
      extraField3: 'بيانات إضافية 3',
      status: 'الحالة',
      active: 'نشط',
      inactive: 'غير نشط',
      productsCount: 'عدد المنتجات',
      actions: 'الإجراءات',
      save: 'حفظ',
      cancel: 'إلغاء',
      edit: 'تعديل',
      delete: 'حذف',
      noSuppliers: 'لا يوجد موردين مسجلين',
      totalSuppliers: 'إجمالي الموردين',
      activeSuppliers: 'الموردين النشطين',
    },
    en: {
      title: 'Suppliers Management',
      addSupplier: 'Add Supplier',
      search: 'Search suppliers...',
      name: 'Supplier Name',
      nameEn: 'English Name',
      phone: 'Phone Number',
      email: 'Email',
      address: 'Address',
      taxNumber: 'Tax Number (TRN)',
      tradeLicense: 'Trade License Number',
      extraField1: 'Extra Data 1',
      extraField2: 'Extra Data 2',
      extraField3: 'Extra Data 3',
      status: 'Status',
      active: 'Active',
      inactive: 'Inactive',
      productsCount: 'Products Count',
      actions: 'Actions',
      save: 'Save',
      cancel: 'Cancel',
      edit: 'Edit',
      delete: 'Delete',
      noSuppliers: 'No suppliers registered',
      totalSuppliers: 'Total Suppliers',
      activeSuppliers: 'Active Suppliers',
    }
  }[language];

  return (
    <div className="p-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
        <Button 
          className="bg-[#2d5d2a] hover:bg-[#1e401c]"
          onClick={() => { resetForm(); setShowForm(true); }}
        >
          <Plus className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          {t.addSupplier}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#2d5d2a]/10 rounded-lg flex items-center justify-center">
              <Truck className="w-5 h-5 text-[#2d5d2a]" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{t.totalSuppliers}</p>
              <p className="text-2xl font-bold">{suppliers.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{t.activeSuppliers}</p>
              <p className="text-2xl font-bold">{suppliers.filter(s => s.status === 'active').length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400`} />
        <Input
          placeholder={t.search}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`${isRTL ? 'pr-10' : 'pl-10'}`}
        />
      </div>

      {/* Suppliers Grid */}
      {filteredSuppliers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSuppliers.map((supplier) => (
            <div key={supplier.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#2d5d2a] rounded-full flex items-center justify-center text-white font-bold text-lg">
                    <Truck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{language === 'ar' ? supplier.name : supplier.nameEn}</h3>
                    <Badge className={supplier.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                      {supplier.status === 'active' ? t.active : t.inactive}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{supplier.phone}</span>
                </div>
                {supplier.email && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{supplier.email}</span>
                  </div>
                )}
                {supplier.address && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Package className="w-4 h-4" />
                    <span>{supplier.address}</span>
                  </div>
                )}
                {supplier.taxNumber && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Hash className="w-4 h-4 text-orange-500" />
                    <span className="font-medium">{t.taxNumber}:</span>
                    <span>{supplier.taxNumber}</span>
                  </div>
                )}
                {supplier.tradeLicense && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FileText className="w-4 h-4 text-blue-500" />
                    <span className="font-medium">{t.tradeLicense}:</span>
                    <span>{supplier.tradeLicense}</span>
                  </div>
                )}
                {(supplier.extraField1 || supplier.extraField2 || supplier.extraField3) && (
                  <div className="mt-2 pt-2 border-t border-gray-100 space-y-1">
                    {supplier.extraField1 && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <MoreHorizontal className="w-4 h-4" />
                        <span>{supplier.extraField1}</span>
                      </div>
                    )}
                    {supplier.extraField2 && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <MoreHorizontal className="w-4 h-4" />
                        <span>{supplier.extraField2}</span>
                      </div>
                    )}
                    {supplier.extraField3 && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <MoreHorizontal className="w-4 h-4" />
                        <span>{supplier.extraField3}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-sm text-gray-500">{t.productsCount}: <strong>{supplier.productsCount}</strong></span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(supplier)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-600" onClick={() => handleDelete(supplier.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
          <Truck className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">{t.noSuppliers}</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">
                {editingSupplier ? (language === 'ar' ? 'تعديل مورد' : 'Edit Supplier') : t.addSupplier}
              </h2>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Basic Info */}
              <div>
                <label className="block text-sm font-medium mb-1">{t.name} *</label>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder={t.name} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t.nameEn}</label>
                <Input value={nameEn} onChange={e => setNameEn(e.target.value)} placeholder={t.nameEn} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t.phone} *</label>
                <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+971 50 000 0000" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t.email}</label>
                <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="supplier@email.com" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">{t.address}</label>
                <Input value={address} onChange={e => setAddress(e.target.value)} placeholder={t.address} />
              </div>

              {/* Tax & License */}
              <div>
                <label className="block text-sm font-medium mb-1">{t.taxNumber}</label>
                <Input value={taxNumber} onChange={e => setTaxNumber(e.target.value)} placeholder="TRN123456789" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t.tradeLicense}</label>
                <Input value={tradeLicense} onChange={e => setTradeLicense(e.target.value)} placeholder="TL-2024-001" />
              </div>

              {/* Extra Fields */}
              <div>
                <label className="block text-sm font-medium mb-1">{t.extraField1}</label>
                <Input value={extraField1} onChange={e => setExtraField1(e.target.value)} placeholder={t.extraField1} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t.extraField2}</label>
                <Input value={extraField2} onChange={e => setExtraField2(e.target.value)} placeholder={t.extraField2} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">{t.extraField3}</label>
                <Input value={extraField3} onChange={e => setExtraField3(e.target.value)} placeholder={t.extraField3} />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">{t.status}</label>
                <select 
                  value={status} 
                  onChange={e => setStatus(e.target.value as 'active' | 'inactive')}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="active">{t.active}</option>
                  <option value="inactive">{t.inactive}</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button className="flex-1 bg-[#2d5d2a] hover:bg-[#1e401c]" onClick={handleSave}>
                {t.save}
              </Button>
              <Button className="flex-1" variant="outline" onClick={() => setShowForm(false)}>
                {t.cancel}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
