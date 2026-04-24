import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react';
import { products as staticProducts, type Product } from '@/data/products';

export interface SearchFilters {
  query: string;
  categories: string[];
  priceRange: { min: number; max: number };
  rating: number;
  inStock: boolean;
  onSale: boolean;
  sortBy: 'relevance' | 'price-low' | 'price-high' | 'rating' | 'newest';
}

interface SearchContextType {
  filters: SearchFilters;
  setQuery: (query: string) => void;
  setCategories: (categories: string[]) => void;
  setPriceRange: (range: { min: number; max: number }) => void;
  setRating: (rating: number) => void;
  setInStock: (inStock: boolean) => void;
  setOnSale: (onSale: boolean) => void;
  setSortBy: (sortBy: SearchFilters['sortBy']) => void;
  resetFilters: () => void;
  searchResults: Product[];
  suggestions: string[];
  getSuggestions: (query: string) => string[];
  recentSearches: string[];
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  viewedProducts: number[];
  addViewedProduct: (productId: number) => void;
  getViewedProducts: () => Product[];
  compareList: number[];
  addToCompare: (productId: number) => void;
  removeFromCompare: (productId: number) => void;
  clearCompare: () => void;
  isInCompare: (productId: number) => boolean;
  getCompareProducts: () => Product[];
}

const defaultFilters: SearchFilters = {
  query: '',
  categories: [],
  priceRange: { min: 0, max: 10000 },
  rating: 0,
  inStock: false,
  onSale: false,
  sortBy: 'relevance',
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [viewedProducts, setViewedProducts] = useState<number[]>([]);
  const [compareList, setCompareList] = useState<number[]>([]);

  const setQuery = useCallback((query: string) => {
    setFilters(prev => ({ ...prev, query }));
  }, []);

  const setCategories = useCallback((categories: string[]) => {
    setFilters(prev => ({ ...prev, categories }));
  }, []);

  const setPriceRange = useCallback((range: { min: number; max: number }) => {
    setFilters(prev => ({ ...prev, priceRange: range }));
  }, []);

  const setRating = useCallback((rating: number) => {
    setFilters(prev => ({ ...prev, rating }));
  }, []);

  const setInStock = useCallback((inStock: boolean) => {
    setFilters(prev => ({ ...prev, inStock }));
  }, []);

  const setOnSale = useCallback((onSale: boolean) => {
    setFilters(prev => ({ ...prev, onSale }));
  }, []);

  const setSortBy = useCallback((sortBy: SearchFilters['sortBy']) => {
    setFilters(prev => ({ ...prev, sortBy }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const getSuggestions = useCallback((query: string): string[] => {
    if (!query.trim()) return [];
    
    const lowerQuery = query.toLowerCase();
    const suggestions = new Set<string>();
    
    staticProducts.forEach(product => {
      if (product.name.toLowerCase().includes(lowerQuery)) {
        suggestions.add(product.name);
      }
      if (product.nameEn.toLowerCase().includes(lowerQuery)) {
        suggestions.add(product.nameEn);
      }
      if (product.category.toLowerCase().includes(lowerQuery)) {
        suggestions.add(product.category);
      }
    });
    
    return Array.from(suggestions).slice(0, 8);
  }, []);

  const suggestions = useMemo(() => getSuggestions(filters.query), [filters.query, getSuggestions]);

  const searchResults = useMemo(() => {
    let results = [...staticProducts];

    // Filter by query
    if (filters.query.trim()) {
      const lowerQuery = filters.query.toLowerCase();
      results = results.filter(p => 
        p.name.toLowerCase().includes(lowerQuery) ||
        p.nameEn.toLowerCase().includes(lowerQuery) ||
        p.category.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery)
      );
    }

    // Filter by categories
    if (filters.categories.length > 0) {
      results = results.filter(p => filters.categories.includes(p.category));
    }

    // Filter by price range
    results = results.filter(p => {
      const price = p.oldPrice || p.price;
      return price >= filters.priceRange.min && price <= filters.priceRange.max;
    });

    // Filter by rating
    if (filters.rating > 0) {
      results = results.filter(p => p.rating >= filters.rating);
    }

    // Filter by sale
    if (filters.onSale) {
      results = results.filter(p => p.oldPrice !== undefined);
    }

    // Sort
    switch (filters.sortBy) {
      case 'price-low':
        results.sort((a, b) => (a.oldPrice || a.price) - (b.oldPrice || b.price));
        break;
      case 'price-high':
        results.sort((a, b) => (b.oldPrice || b.price) - (a.oldPrice || a.price));
        break;
      case 'rating':
        results.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        results.sort((a, b) => b.id - a.id);
        break;
      default:
        // relevance - keep original order
        break;
    }

    return results;
  }, [filters]);

  const addRecentSearch = useCallback((query: string) => {
    if (!query.trim()) return;
    setRecentSearches(prev => {
      const filtered = prev.filter(s => s !== query);
      return [query, ...filtered].slice(0, 10);
    });
  }, []);

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
  }, []);

  const addViewedProduct = useCallback((productId: number) => {
    setViewedProducts(prev => {
      const filtered = prev.filter(id => id !== productId);
      return [productId, ...filtered].slice(0, 20);
    });
  }, []);

  const getViewedProducts = useCallback(() => {
    return viewedProducts
      .map(id => staticProducts.find(p => p.id === id))
      .filter((p): p is Product => p !== undefined);
  }, [viewedProducts]);

  const addToCompare = useCallback((productId: number) => {
    setCompareList(prev => {
      if (prev.includes(productId)) return prev;
      if (prev.length >= 3) return prev; // Max 3 products
      return [...prev, productId];
    });
  }, []);

  const removeFromCompare = useCallback((productId: number) => {
    setCompareList(prev => prev.filter(id => id !== productId));
  }, []);

  const clearCompare = useCallback(() => {
    setCompareList([]);
  }, []);

  const isInCompare = useCallback((productId: number) => {
    return compareList.includes(productId);
  }, [compareList]);

  const getCompareProducts = useCallback(() => {
    return compareList
      .map(id => staticProducts.find(p => p.id === id))
      .filter((p): p is Product => p !== undefined);
  }, [compareList]);

  return (
    <SearchContext.Provider
      value={{
        filters,
        setQuery,
        setCategories,
        setPriceRange,
        setRating,
        setInStock,
        setOnSale,
        setSortBy,
        resetFilters,
        searchResults,
        suggestions,
        getSuggestions,
        recentSearches,
        addRecentSearch,
        clearRecentSearches,
        viewedProducts,
        addViewedProduct,
        getViewedProducts,
        compareList,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
        getCompareProducts,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}
