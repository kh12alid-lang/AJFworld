import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Star, Package, Tag, X, Percent } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/context/LanguageContext';
import { products as initialProducts, categories as initialCategories, currency, currencyEn } from '@/data/products';
import type { Product } from '@/data/products';

interface LocalCategory {
  id: string;
  name: string;
  nameEn: string;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('ajfworld_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });
  const [cats, setCats] = useState<LocalCategory[]>(() => {
    const saved = localStorage.getItem('ajfworld_categories');
    return saved ? JSON.parse(saved) : initialCategories;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { language, isRTL } = useLanguage();
  
  // Modal states
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Form states
  const [prodName, setProdName] = useState('');
  const [prodNameEn, setProdNameEn] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodOldPrice, setProdOldPrice] = useState('');
  const [prodDiscount, setProdDiscount] = useState('');
  const [prodCategory, setProdCategory] = useState('');
  const [prodImage, setProdImage] = useState('');
  const [prodImages, setProdImages] = useState('');
  const [prodRating, setProdRating] = useState('4.5');
  const [prodFeatured, setProdFeatured] = useState(false);
  const [prodNew, setProdNew] = useState(false);
  const [prodBestseller, setProdBestseller] = useState(false);
  const [prodQuantity, setProdQuantity] = useState('0');
  const [prodSold, setProdSold] = useState('0');
  
  const [catName, setCatName] = useState('');
  const [catNameEn, setCatNameEn] = useState('');

  const curr = language === 'ar' ? currency : currencyEn;

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('ajfworld_products', JSON.stringify(products));
  }, [products]);
  
  useEffect(() => {
    localStorage.setItem('ajfworld_categories', JSON.stringify(cats));
  }, [cats]);

  const filteredProducts = products.filter(product => {
    const matchesSearch = language === 'ar' 
      ? product.name.toLowerCase().includes(searchQuery.toLowerCase())
      : product.nameEn.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = (id: number) => {
    if (confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا المنتج؟' : 'Are you sure?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleAddProduct = () => {
    if (!prodName || !prodPrice || !prodCategory) {
      alert(language === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields');
      return;
    }
    
    const selectedCat = cats.find(c => c.name === prodCategory);
    const price = Number(prodPrice);
    const discount = Number(prodDiscount);
    const oldPrice = prodOldPrice ? Number(prodOldPrice) : (discount > 0 ? Math.round(price / (1 - discount / 100)) : undefined);
    
    const newProduct: Product = {
      id: editingProduct ? editingProduct.id : Date.now(),
      name: prodName,
      nameEn: prodNameEn || prodName,
      price,
      oldPrice,
      discount,
      image: prodImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
      images: prodImages ? prodImages.split(',').map(s => s.trim()) : [prodImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'],
      category: prodCategory,
      categoryEn: selectedCat?.nameEn || prodCategory,
      rating: Number(prodRating),
      reviews: 0,
      badge: prodFeatured ? (language === 'ar' ? 'مميز' : 'Featured') : undefined,
      badgeEn: prodFeatured ? 'Featured' : undefined,
      isNew: prodNew,
      isBestSeller: prodBestseller,
      quantity: Number(prodQuantity) || 0,
      sold: Number(prodSold) || 0,
      description: prodName,
      descriptionEn: prodNameEn || prodName,
      added: Number(prodQuantity) || 0,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    
    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? { ...newProduct, id: editingProduct.id } : p));
      setEditingProduct(null);
    } else {
      setProducts([...products, newProduct]);
    }
    
    resetProductForm();
    setShowProductForm(false);
  };
  
  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setProdName(product.name);
    setProdNameEn(product.nameEn);
    setProdPrice(String(product.price));
    setProdOldPrice(product.oldPrice ? String(product.oldPrice) : '');
    setProdDiscount(String((product as any).discount || ''));
    setProdCategory(product.category);
    setProdImage(product.image);
    setProdImages((product as any).images?.join(', ') || '');
    setProdRating(String(product.rating));
    setProdFeatured(!!product.badge);
    setProdNew(product.isNew || false);
    setProdBestseller(product.isBestSeller || false);
    setProdQuantity(String((product as any).quantity || 0));
    setProdSold(String((product as any).sold || 0));
    setShowProductForm(true);
  };

  const resetProductForm = () => {
    setProdName('');
    setProdNameEn('');
    setProdPrice('');
    setProdOldPrice('');
    setProdDiscount('');
    setProdCategory('');
    setProdImage('');
    setProdImages('');
    setProdRating('4.5');
    setProdFeatured(false);
    setProdNew(false);
    setProdBestseller(false);
    setProdQuantity('0');
    setProdSold('0');
    setEditingProduct(null);
  };

  const handleAddCategory = () => {
    if (!catName) {
      alert(language === 'ar' ? 'يرجى إدخال اسم الفئة' : 'Please enter category name');
      return;
    }
    const newCat: LocalCategory = {
      id: Date.now().toString(),
      name: catName,
      nameEn: catNameEn || catName,
    };
    setCats([...cats, newCat]);
    setCatName('');
    setCatNameEn('');
    setShowCategoryForm(false);
  };

  const handleDeleteCategory = (id: string) => {
    if (confirm(language === 'ar' ? 'هل أنت متأكد؟ سيتم حذف الفئة!' : 'Delete this category?')) {
      setCats(cats.filter(c => c.id !== id));
    }
  };

  const t = {
    ar: {
      title: 'إدارة المنتجات',
      addProduct: 'إضافة منتج',
      addCategory: 'إضافة فئة',
      search: 'البحث في المنتجات...',
      allCategories: 'جميع الفئات',
      name: 'اسم المنتج',
      nameEn: 'الاسم بالإنجليزي',
      price: 'السعر',
      oldPrice: 'السعر القديم',
      discount: 'نسبة الخصم (%)',
      category: 'الفئة',
      image: 'رابط الصورة الرئيسية',
      images: 'روابط الصور الإضافية (مفصولة بفواصل)',
      rating: 'التقييم',
      featured: 'مميز',
      isNew: 'جديد',
      bestseller: 'الأكثر مبيعاً',
      save: 'حفظ',
      cancel: 'إلغاء',
      edit: 'تعديل',
      delete: 'حذف',
      catName: 'اسم الفئة',
      catNameEn: 'الاسم بالإنجليزي',
      categories: 'الفئات',
      productsCount: 'عدد المنتجات',
      actions: 'الإجراءات',
      quantity: 'الكمية',
      sold: 'المباع',
    },
    en: {
      title: 'Products Management',
      addProduct: 'Add Product',
      addCategory: 'Add Category',
      search: 'Search products...',
      allCategories: 'All Categories',
      name: 'Product Name',
      nameEn: 'English Name',
      price: 'Price',
      oldPrice: 'Old Price',
      discount: 'Discount (%)',
      category: 'Category',
      image: 'Main Image URL',
      images: 'Additional Image URLs (comma separated)',
      rating: 'Rating',
      featured: 'Featured',
      isNew: 'New',
      bestseller: 'Bestseller',
      save: 'Save',
      cancel: 'Cancel',
      edit: 'Edit',
      delete: 'Delete',
      catName: 'Category Name',
      catNameEn: 'English Name',
      categories: 'Categories',
      productsCount: 'Products Count',
      actions: 'Actions',
      quantity: 'Quantity',
      sold: 'Sold',
    }
  }[language];

  return (
    <div className="p-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={() => setShowCategoryForm(true)}
          >
            <Tag className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {t.addCategory}
          </Button>
          <Button 
            className="bg-[#2d5d2a] hover:bg-[#1e401c]"
            onClick={() => { resetProductForm(); setShowProductForm(true); }}
          >
            <Plus className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {t.addProduct}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#2d5d2a]/10 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-[#2d5d2a]" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{language === 'ar' ? 'المنتجات' : 'Products'}</p>
              <p className="text-2xl font-bold">{products.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Tag className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{language === 'ar' ? 'الفئات' : 'Categories'}</p>
              <p className="text-2xl font-bold">{cats.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{language === 'ar' ? 'المميزة' : 'Featured'}</p>
              <p className="text-2xl font-bold">{products.filter(p => p.badge).length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Categories list */}
      <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
        <h3 className="font-bold mb-3">{t.categories}</h3>
        <div className="flex flex-wrap gap-2">
          {cats.map(cat => (
            <Badge key={cat.id} variant="secondary" className="text-sm py-1 px-3">
              {language === 'ar' ? cat.name : cat.nameEn}
              <button 
                onClick={() => handleDeleteCategory(cat.id)}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400`} />
          <Input
            placeholder={t.search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`${isRTL ? 'pr-10' : 'pl-10'}`}
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border rounded-lg px-4 py-2 bg-white"
        >
          <option value="all">{t.allCategories}</option>
          {cats.map(cat => (
            <option key={cat.id} value={cat.name}>{language === 'ar' ? cat.name : cat.nameEn}</option>
          ))}
        </select>
      </div>

      {/* Products table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-4 font-medium text-gray-700">{language === 'ar' ? 'المنتج' : 'Product'}</th>
                <th className="text-left p-4 font-medium text-gray-700">{language === 'ar' ? 'الفئة' : 'Category'}</th>
                <th className="text-left p-4 font-medium text-gray-700">{language === 'ar' ? 'السعر' : 'Price'}</th>
                <th className="text-left p-4 font-medium text-gray-700">{language === 'ar' ? 'الخصم' : 'Discount'}</th>
                <th className="text-left p-4 font-medium text-gray-700">{t.quantity}</th>
                <th className="text-left p-4 font-medium text-gray-700">{language === 'ar' ? 'التقييم' : 'Rating'}</th>
                <th className="text-left p-4 font-medium text-gray-700">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredProducts.map(product => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                      <div>
                        <p className="font-medium">{language === 'ar' ? product.name : product.nameEn}</p>
                        <div className="flex gap-1 mt-1">
                          {product.badge && <Badge className="bg-yellow-100 text-yellow-700 text-xs">{language === 'ar' ? product.badge : product.badgeEn}</Badge>}
                          {product.isNew && <Badge className="bg-green-100 text-green-700 text-xs">{language === 'ar' ? 'جديد' : 'New'}</Badge>}
                          {(product as any).discount > 0 && <Badge className="bg-red-100 text-red-700 text-xs"><Percent className="w-3 h-3 mr-1" />{(product as any).discount}%</Badge>}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge variant="outline">{product.category}</Badge>
                  </td>
                  <td className="p-4">
                    <div>
                      <span className="font-bold text-[#2d5d2a]">{product.price} {curr}</span>
                      {product.oldPrice && (
                        <span className="text-sm text-gray-400 line-through ml-2">{product.oldPrice} {curr}</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    {(product as any).discount > 0 ? (
                      <span className="font-bold text-red-600">{(product as any).discount}%</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className={`font-medium ${(product as any).quantity < 10 ? 'text-red-600' : 'text-gray-900'}`}>
                      {(product as any).quantity || 0}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span>{product.rating}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(product)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600" onClick={() => handleDelete(product.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      {showProductForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">
                {editingProduct ? (language === 'ar' ? 'تعديل منتج' : 'Edit Product') : t.addProduct}
              </h2>
              <button onClick={() => setShowProductForm(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t.name} *</label>
                <Input value={prodName} onChange={e => setProdName(e.target.value)} placeholder={t.name} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t.nameEn}</label>
                <Input value={prodNameEn} onChange={e => setProdNameEn(e.target.value)} placeholder={t.nameEn} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">{t.price} *</label>
                  <Input type="number" value={prodPrice} onChange={e => setProdPrice(e.target.value)} placeholder="0" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t.oldPrice}</label>
                  <Input type="number" value={prodOldPrice} onChange={e => setProdOldPrice(e.target.value)} placeholder="0" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">{t.discount}</label>
                  <Input type="number" value={prodDiscount} onChange={e => setProdDiscount(e.target.value)} placeholder="0" min="0" max="100" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t.quantity} *</label>
                  <Input type="number" value={prodQuantity} onChange={e => setProdQuantity(e.target.value)} placeholder="0" min="0" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t.category} *</label>
                <select 
                  value={prodCategory} 
                  onChange={e => setProdCategory(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="">{language === 'ar' ? 'اختر الفئة' : 'Select category'}</option>
                  {cats.map(cat => (
                    <option key={cat.id} value={cat.name}>{language === 'ar' ? cat.name : cat.nameEn}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t.image}</label>
                <Input value={prodImage} onChange={e => setProdImage(e.target.value)} placeholder="https://..." />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t.images}</label>
                <Input value={prodImages} onChange={e => setProdImages(e.target.value)} placeholder="https://..., https://..., https://..." />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t.rating}</label>
                <Input type="number" min="0" max="5" step="0.1" value={prodRating} onChange={e => setProdRating(e.target.value)} />
              </div>
              <div className="flex gap-4 flex-wrap">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={prodFeatured} onChange={e => setProdFeatured(e.target.checked)} />
                  <span className="text-sm">{t.featured}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={prodNew} onChange={e => setProdNew(e.target.checked)} />
                  <span className="text-sm">{t.isNew}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={prodBestseller} onChange={e => setProdBestseller(e.target.checked)} />
                  <span className="text-sm">{t.bestseller}</span>
                </label>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button className="flex-1 bg-[#2d5d2a] hover:bg-[#1e401c]" onClick={handleAddProduct}>
                {t.save}
              </Button>
              <Button className="flex-1" variant="outline" onClick={() => setShowProductForm(false)}>
                {t.cancel}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {showCategoryForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">{t.addCategory}</h2>
              <button onClick={() => setShowCategoryForm(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t.catName} *</label>
                <Input value={catName} onChange={e => setCatName(e.target.value)} placeholder={t.catName} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t.catNameEn}</label>
                <Input value={catNameEn} onChange={e => setCatNameEn(e.target.value)} placeholder={t.catNameEn} />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button className="flex-1 bg-[#2d5d2a] hover:bg-[#1e401c]" onClick={handleAddCategory}>
                {t.save}
              </Button>
              <Button className="flex-1" variant="outline" onClick={() => setShowCategoryForm(false)}>
                {t.cancel}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
