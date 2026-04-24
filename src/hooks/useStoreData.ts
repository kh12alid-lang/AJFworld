import { useState, useEffect } from 'react';
import { products as staticProducts, categories as staticCategories } from '@/data/products';
import type { Product, Category } from '@/data/products';

export function useStoreProducts(): Product[] {
  const [products, setProducts] = useState<Product[]>(staticProducts);

  useEffect(() => {
    const saved = localStorage.getItem('ajfworld_products');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProducts(parsed);
        }
      } catch (e) {
        console.error('Failed to load products from localStorage', e);
      }
    }
  }, []);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'ajfworld_products') {
        const saved = localStorage.getItem('ajfworld_products');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) setProducts(parsed);
          } catch (e) {
            console.error('Failed to sync products', e);
          }
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return products;
}

export function useStoreCategories(): Category[] {
  const [categories, setCategories] = useState<Category[]>(staticCategories);

  useEffect(() => {
    const saved = localStorage.getItem('ajfworld_categories');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const mapped: Category[] = parsed.map((c: any, i: number) => ({
            id: typeof c.id === 'number' ? c.id : (staticCategories[i]?.id || i + 1),
            name: c.name,
            nameEn: c.nameEn || c.name,
            image: c.image || staticCategories[i % staticCategories.length]?.image || '/images/categories/all.jpg',
            productCount: c.productCount || staticCategories[i % staticCategories.length]?.productCount || 0,
          }));
          setCategories(mapped);
        }
      } catch (e) {
        console.error('Failed to load categories from localStorage', e);
      }
    }
  }, []);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'ajfworld_categories') {
        const saved = localStorage.getItem('ajfworld_categories');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) {
              const mapped: Category[] = parsed.map((c: any, i: number) => ({
                id: typeof c.id === 'number' ? c.id : (staticCategories[i]?.id || i + 1),
                name: c.name,
                nameEn: c.nameEn || c.name,
                image: c.image || staticCategories[i % staticCategories.length]?.image || '/images/categories/all.jpg',
                productCount: c.productCount || staticCategories[i % staticCategories.length]?.productCount || 0,
              }));
              setCategories(mapped);
            }
          } catch (e) {
            console.error('Failed to sync categories', e);
          }
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return categories;
}
