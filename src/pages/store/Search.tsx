import { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  X, 
  Filter, 
  ChevronDown, 
  Star,
  Clock,
  TrendingUp,
  History,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { useSearch } from '@/context/SearchContext';
import { useLanguage } from '@/context/LanguageContext';
import { useFlashSales } from '@/context/FlashSaleContext';
import { currency, currencyEn, categories } from '@/data/products';
import ProductCard from '@/components/store/ProductCard';
import Header from '@/components/store/Header';
import Footer from '@/components/store/Footer';

const sortOptions = [
  { id: 'relevance', labelAr: 'الأكثر صلة', labelEn: 'Most Relevant' },
  { id: 'price-low', labelAr: 'السعر: من الأقل', labelEn: 'Price: Low to High' },
  { id: 'price-high', labelAr: 'السعر: من الأعلى', labelEn: 'Price: High to Low' },
  { id: 'rating', labelAr: 'الأعلى تقييماً', labelEn: 'Highest Rated' },
  { id: 'newest', labelAr: 'الأحدث', labelEn: 'Newest' },
];

export default function SearchPage() {
  const { language, isRTL } = useLanguage();
  const { getActiveFlashSales, getActiveDailyDeals } = useFlashSales();
  
  const {
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
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
    getViewedProducts,
  } = useSearch();

  const [showFilters, setShowFilters] = useState(false);
  const [localQuery, setLocalQuery] = useState(filters.query);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const curr = language === 'ar' ? currency : currencyEn;

  // Close suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = () => {
    if (localQuery.trim()) {
      setQuery(localQuery);
      addRecentSearch(localQuery);
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setLocalQuery(suggestion);
    setQuery(suggestion);
    addRecentSearch(suggestion);
    setShowSuggestions(false);
  };

  const handleCategoryToggle = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    setCategories(newCategories);
  };

  const activeFiltersCount = 
    filters.categories.length + 
    (filters.rating > 0 ? 1 : 0) + 
    (filters.inStock ? 1 : 0) + 
    (filters.onSale ? 1 : 0) +
    (filters.priceRange.min > 0 || filters.priceRange.max < 10000 ? 1 : 0);

  const viewedProducts = getViewedProducts().slice(0, 6);
  const flashSales = getActiveFlashSales();
  const dailyDeals = getActiveDailyDeals();

  return (
    <div className="min-h-screen bg-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <Header />
      
      <main className="pt-20 pb-12">
        <div className="container-custom">
          {/* Search Header */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <div ref={searchRef} className="relative">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400`} />
                  <Input
                    value={localQuery}
                    onChange={(e) => {
                      setLocalQuery(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setShowSuggestions(true)}
                    placeholder={language === 'ar' ? 'ابحث عن منتجات، ماركات، فئات...' : 'Search products, brands, categories...'}
                    className={`${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} h-14 text-lg`}
                  />
                  {localQuery && (
                    <button
                      onClick={() => {
                        setLocalQuery('');
                        setQuery('');
                      }}
                      className={`absolute ${isRTL ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600`}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
                <Button 
                  onClick={handleSearch}
                  className="h-14 px-8 bg-[#2d5d2a] hover:bg-[#1e401c]"
                >
                  {language === 'ar' ? 'بحث' : 'Search'}
                </Button>
              </div>

              {/* Suggestions Dropdown */}
              {showSuggestions && (suggestions.length > 0 || recentSearches.length > 0) && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 z-50">
                  {suggestions.length > 0 && (
                    <div className="p-4">
                      <p className="text-sm text-gray-500 mb-2">
                        {language === 'ar' ? 'اقتراحات' : 'Suggestions'}
                      </p>
                      {suggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg text-left"
                        >
                          <Search className="w-4 h-4 text-gray-400" />
                          <span>{suggestion}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {recentSearches.length > 0 && (
                    <div className="p-4 border-t border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-500">
                          {language === 'ar' ? 'عمليات البحث الأخيرة' : 'Recent Searches'}
                        </p>
                        <button
                          onClick={clearRecentSearches}
                          className="text-sm text-red-500 hover:underline flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          {language === 'ar' ? 'مسح' : 'Clear'}
                        </button>
                      </div>
                      {recentSearches.map((search, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSuggestionClick(search)}
                          className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg text-left"
                        >
                          <History className="w-4 h-4 text-gray-400" />
                          <span>{search}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <TrendingUp className="w-4 h-4 text-[#2d5d2a]" />
                <span>{searchResults.length} {language === 'ar' ? 'نتيجة' : 'results'}</span>
              </div>
              {flashSales.length > 0 && (
                <Badge className="bg-red-500 text-white">
                  <Clock className="w-3 h-3 mr-1" />
                  {flashSales.length} {language === 'ar' ? 'عروض فلاش' : 'Flash Sales'}
                </Badge>
              )}
              {dailyDeals.length > 0 && (
                <Badge className="bg-orange-500 text-white">
                  {dailyDeals.length} {language === 'ar' ? 'صفقات اليوم' : 'Daily Deals'}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Filters Sidebar */}
            <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg">
                    {language === 'ar' ? 'الفلاتر' : 'Filters'}
                  </h3>
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={resetFilters}
                      className="text-sm text-red-500 hover:underline"
                    >
                      {language === 'ar' ? 'مسح الكل' : 'Clear All'}
                    </button>
                  )}
                </div>

                {/* Categories */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">
                    {language === 'ar' ? 'الفئات' : 'Categories'}
                  </h4>
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={filters.categories.includes(cat.name)}
                          onCheckedChange={() => handleCategoryToggle(cat.name)}
                        />
                        <span className="text-sm">{language === 'ar' ? cat.name : cat.nameEn}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">
                    {language === 'ar' ? 'نطاق السعر' : 'Price Range'}
                  </h4>
                  <Slider
                    value={[filters.priceRange.max]}
                    onValueChange={([max]) => setPriceRange({ ...filters.priceRange, max })}
                    max={10000}
                    step={100}
                    className="mb-4"
                  />
                  <div className="flex items-center justify-between text-sm">
                    <span>0 {curr}</span>
                    <span>{filters.priceRange.max} {curr}</span>
                  </div>
                </div>

                {/* Rating */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">
                    {language === 'ar' ? 'التقييم' : 'Rating'}
                  </h4>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((stars) => (
                      <button
                        key={stars}
                        onClick={() => setRating(filters.rating === stars ? 0 : stars)}
                        className={`w-full flex items-center gap-2 p-2 rounded-lg transition-colors ${
                          filters.rating === stars ? 'bg-[#2d5d2a]/10' : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                        <span className="text-sm">{language === 'ar' ? 'وأعلى' : '& up'}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Other Filters */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={filters.inStock}
                      onCheckedChange={(checked) => setInStock(checked as boolean)}
                    />
                    <span className="text-sm">{language === 'ar' ? 'متوفر فقط' : 'In Stock Only'}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={filters.onSale}
                      onCheckedChange={(checked) => setOnSale(checked as boolean)}
                    />
                    <span className="text-sm">{language === 'ar' ? 'عروض خاصة' : 'On Sale'}</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="flex-1">
              {/* Sort & Filter Toggle */}
              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  {language === 'ar' ? 'الفلاتر' : 'Filters'}
                  {activeFiltersCount > 0 && (
                    <Badge className="ml-2 bg-[#2d5d2a]">{activeFiltersCount}</Badge>
                  )}
                </Button>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 hidden sm:inline">
                    {language === 'ar' ? 'ترتيب حسب:' : 'Sort by:'}
                  </span>
                  <div className="relative">
                    <select
                      value={filters.sortBy}
                      onChange={(e) => setSortBy(e.target.value as typeof filters.sortBy)}
                      className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5d2a]"
                    >
                      {sortOptions.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {language === 'ar' ? opt.labelAr : opt.labelEn}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              {searchResults.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  {searchResults.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-xl">
                  <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {language === 'ar' ? 'لا توجد نتائج' : 'No Results Found'}
                  </h3>
                  <p className="text-gray-500">
                    {language === 'ar' 
                      ? 'جرب كلمات بحث مختلفة أو اضبط الفلاتر'
                      : 'Try different search terms or adjust filters'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Recently Viewed */}
          {viewedProducts.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl font-bold mb-4">
                {language === 'ar' ? 'شاهدت مؤخراً' : 'Recently Viewed'}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {viewedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
