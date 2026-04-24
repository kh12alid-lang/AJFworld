import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Home, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize,
  Phone,
  Mail,
  Filter,
  Search,
  Tag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/context/LanguageContext';
import Header from '@/components/store/Header';
import Footer from '@/components/store/Footer';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Property {
  id: string;
  title: string;
  titleEn: string;
  type: 'apartment' | 'villa' | 'land' | 'commercial';
  price: number;
  location: string;
  locationEn: string;
  beds?: number;
  baths?: number;
  area: number;
  images: string[];
  featured: boolean;
  isNew: boolean;
  agent: {
    name: string;
    phone: string;
    email: string;
    image: string;
  };
}

const properties: Property[] = [
  {
    id: 'prop-001',
    title: 'فيلا فاخرة في دبي مارينا',
    titleEn: 'Luxury Villa in Dubai Marina',
    type: 'villa',
    price: 3500000,
    location: 'دبي مارينا، دبي',
    locationEn: 'Dubai Marina, Dubai',
    beds: 5,
    baths: 6,
    area: 650,
    images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800'],
    featured: true,
    isNew: true,
    agent: {
      name: 'أحمد محمد',
      phone: '+971 50 123 4567',
      email: 'ahmed@ajfworld.ae',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
    }
  },
  {
    id: 'prop-002',
    title: 'شقة مطلة على البحر في جميرا',
    titleEn: 'Sea View Apartment in Jumeirah',
    type: 'apartment',
    price: 1850000,
    location: 'جميرا بيتش ريزيدنس، دبي',
    locationEn: 'JBR, Dubai',
    beds: 3,
    baths: 4,
    area: 280,
    images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'],
    featured: true,
    isNew: false,
    agent: {
      name: 'سارة عبدالله',
      phone: '+971 55 987 6543',
      email: 'sara@ajfworld.ae',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
    }
  },
  {
    id: 'prop-003',
    title: 'أرض سكنية في مدينة محمد بن راشد',
    titleEn: 'Residential Land in MBR City',
    type: 'land',
    price: 1200000,
    location: 'مدينة محمد بن راشد، دبي',
    locationEn: 'MBR City, Dubai',
    area: 1500,
    images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800'],
    featured: false,
    isNew: true,
    agent: {
      name: 'خالد العنزي',
      phone: '+971 52 456 7890',
      email: 'khaled@ajfworld.ae',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
    }
  },
  {
    id: 'prop-004',
    title: 'محل تجاري في دبي مول',
    titleEn: 'Commercial Shop in Dubai Mall',
    type: 'commercial',
    price: 4500000,
    location: 'دبي مول، دبي',
    locationEn: 'Dubai Mall, Dubai',
    area: 180,
    images: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800'],
    featured: true,
    isNew: false,
    agent: {
      name: 'فاطمة الزهراء',
      phone: '+971 54 321 0987',
      email: 'fatima@ajfworld.ae',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150'
    }
  },
  {
    id: 'prop-005',
    title: 'بنتهاوس فاخر في وسط المدينة',
    titleEn: 'Luxury Penthouse in Downtown',
    type: 'apartment',
    price: 8200000,
    location: 'وسط المدينة، دبي',
    locationEn: 'Downtown Dubai',
    beds: 4,
    baths: 5,
    area: 520,
    images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'],
    featured: true,
    isNew: true,
    agent: {
      name: 'عمر الحسن',
      phone: '+971 56 789 0123',
      email: 'omar@ajfworld.ae',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
    }
  },
  {
    id: 'prop-006',
    title: 'فيلا عائلية في المرابع العربية',
    titleEn: 'Family Villa in Arabian Ranches',
    type: 'villa',
    price: 2800000,
    location: 'المرابع العربية، دبي',
    locationEn: 'Arabian Ranches, Dubai',
    beds: 4,
    baths: 5,
    area: 480,
    images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'],
    featured: false,
    isNew: false,
    agent: {
      name: 'ليلى محمود',
      phone: '+971 58 234 5678',
      email: 'laila@ajfworld.ae',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
    }
  }
];

const propertyTypes = [
  { ar: 'الكل', en: 'All', value: 'all' },
  { ar: 'شقق', en: 'Apartments', value: 'apartment' },
  { ar: 'فلل', en: 'Villas', value: 'villa' },
  { ar: 'أراضي', en: 'Lands', value: 'land' },
  { ar: 'تجاري', en: 'Commercial', value: 'commercial' },
];

const priceRanges = [
  { ar: 'الكل', en: 'All', value: 'all' },
  { ar: 'حتى 1 مليون', en: 'Up to 1M', value: '0-1000000' },
  { ar: '1 - 3 مليون', en: '1M - 3M', value: '1000000-3000000' },
  { ar: '3 - 5 مليون', en: '3M - 5M', value: '3000000-5000000' },
  { ar: '5+ مليون', en: '5M+', value: '5000000+' },
];

const locations = [
  { ar: 'الكل', en: 'All', value: 'all' },
  { ar: 'دبي مارينا', en: 'Dubai Marina', value: 'marina' },
  { ar: 'وسط المدينة', en: 'Downtown', value: 'downtown' },
  { ar: 'جميرا', en: 'Jumeirah', value: 'jumeirah' },
  { ar: 'المرابع العربية', en: 'Arabian Ranches', value: 'ranches' },
];

export default function RealEstate() {
  const navigate = useNavigate();
  const { language, isRTL } = useLanguage();
  const [selectedType, setSelectedType] = useState('all');
  const [selectedPrice, setSelectedPrice] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const curr = language === 'ar' ? 'د.إ' : 'AED';

  const filteredProperties = properties.filter(prop => {
    const matchesType = selectedType === 'all' || prop.type === selectedType;
    const matchesLocation = selectedLocation === 'all' || 
      prop.location.toLowerCase().includes(selectedLocation.toLowerCase());
    
    let matchesPrice = true;
    if (selectedPrice !== 'all') {
      const [min, max] = selectedPrice.split('-').map(Number);
      if (max) {
        matchesPrice = prop.price >= min && prop.price <= max;
      } else {
        matchesPrice = prop.price >= min;
      }
    }

    const matchesSearch = searchQuery === '' || 
      prop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prop.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prop.location.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesType && matchesLocation && matchesPrice && matchesSearch;
  });

  const featuredProperties = filteredProperties.filter(p => p.featured);
  const regularProperties = filteredProperties.filter(p => !p.featured);

  const getPropertyTypeLabel = (type: string) => {
    const labels: Record<string, { ar: string; en: string }> = {
      apartment: { ar: 'شقة', en: 'Apartment' },
      villa: { ar: 'فيلا', en: 'Villa' },
      land: { ar: 'أرض', en: 'Land' },
      commercial: { ar: 'تجاري', en: 'Commercial' },
    };
    return labels[type]?.[language] || type;
  };

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(1)}M`;
    }
    return price.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <Header />
      
      <main className="pt-20 pb-12">
        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-[#2d5d2a] to-[#1e401c] text-white py-16 mb-8">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Building2 className="w-8 h-8" />
                <Badge className="bg-white/20 text-white border-0 text-sm">
                  {language === 'ar' ? 'جديد' : 'New'}
                </Badge>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold mb-4">
                {language === 'ar' ? 'عقارات AJFworld' : 'AJFworld Real Estate'}
              </h1>
              <p className="text-white/80 text-lg mb-8">
                {language === 'ar' 
                  ? 'اكتشف أفضل العقارات في دبي والإمارات'
                  : 'Discover the best properties in Dubai & UAE'}
              </p>
              
              {/* Search Bar */}
              <div className="relative max-w-2xl mx-auto">
                <Search className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400`} />
                <Input
                  type="text"
                  placeholder={language === 'ar' ? 'ابحث عن عقار...' : 'Search properties...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-4 h-14 bg-white text-gray-900 border-0 rounded-full text-lg ${isRTL ? 'text-right' : 'text-left'}`}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="container-custom">
          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-[#2d5d2a]" />
              <span className="font-bold">{language === 'ar' ? 'تصفية النتائج' : 'Filter Results'}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder={language === 'ar' ? 'نوع العقار' : 'Property Type'} />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {language === 'ar' ? type.ar : type.en}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedPrice} onValueChange={setSelectedPrice}>
                <SelectTrigger>
                  <SelectValue placeholder={language === 'ar' ? 'نطاق السعر' : 'Price Range'} />
                </SelectTrigger>
                <SelectContent>
                  {priceRanges.map(range => (
                    <SelectItem key={range.value} value={range.value}>
                      {language === 'ar' ? range.ar : range.en}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger>
                  <SelectValue placeholder={language === 'ar' ? 'الموقع' : 'Location'} />
                </SelectTrigger>
                <SelectContent>
                  {locations.map(loc => (
                    <SelectItem key={loc.value} value={loc.value}>
                      {language === 'ar' ? loc.ar : loc.en}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Featured Properties */}
          {featuredProperties.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <Tag className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">
                    {language === 'ar' ? 'عقارات مميزة' : 'Featured Properties'}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {featuredProperties.length} {language === 'ar' ? 'عقار' : 'properties'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featuredProperties.map(prop => (
                  <div key={prop.id} className="bg-white rounded-2xl shadow-sm overflow-hidden group">
                    <div className="relative">
                      <img
                        src={prop.images[0]}
                        alt={language === 'ar' ? prop.title : prop.titleEn}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute top-3 left-3 flex gap-2">
                        {prop.isNew && (
                          <Badge className="bg-green-500 text-white">
                            {language === 'ar' ? 'جديد' : 'New'}
                          </Badge>
                        )}
                        <Badge className="bg-yellow-500 text-white">
                          {language === 'ar' ? 'مميز' : 'Featured'}
                        </Badge>
                      </div>
                      <div className="absolute bottom-3 right-3 bg-black/70 text-white px-3 py-1 rounded-lg text-sm">
                        {getPropertyTypeLabel(prop.type)}
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-bold text-lg line-clamp-1">
                          {language === 'ar' ? prop.title : prop.titleEn}
                        </h3>
                        <span className="text-2xl font-bold text-[#2d5d2a]">
                          {formatPrice(prop.price)} {curr}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-gray-500 mb-4">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{language === 'ar' ? prop.location : prop.locationEn}</span>
                      </div>

                      <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                        {prop.beds && (
                          <div className="flex items-center gap-1">
                            <Bed className="w-4 h-4" />
                            <span>{prop.beds}</span>
                          </div>
                        )}
                        {prop.baths && (
                          <div className="flex items-center gap-1">
                            <Bath className="w-4 h-4" />
                            <span>{prop.baths}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Maximize className="w-4 h-4" />
                          <span>{prop.area} {language === 'ar' ? 'م²' : 'sqm'}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-4 border-t">
                        <img
                          src={prop.agent.image}
                          alt={prop.agent.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{prop.agent.name}</p>
                          <p className="text-xs text-gray-500">{language === 'ar' ? 'وكيل عقاري' : 'Real Estate Agent'}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="icon" variant="outline" onClick={() => window.open(`tel:${prop.agent.phone}`)}>
                            <Phone className="w-4 h-4" />
                          </Button>
                          <Button size="icon" variant="outline" onClick={() => window.open(`mailto:${prop.agent.email}`)}>
                            <Mail className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* All Properties */}
          {regularProperties.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#2d5d2a]/10 rounded-xl flex items-center justify-center">
                  <Home className="w-5 h-5 text-[#2d5d2a]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">
                    {language === 'ar' ? 'جميع العقارات' : 'All Properties'}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {regularProperties.length} {language === 'ar' ? 'عقار' : 'properties'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regularProperties.map(prop => (
                  <div key={prop.id} className="bg-white rounded-2xl shadow-sm overflow-hidden group hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <img
                        src={prop.images[0]}
                        alt={language === 'ar' ? prop.title : prop.titleEn}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                      />
                      {prop.isNew && (
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-green-500 text-white">
                            {language === 'ar' ? 'جديد' : 'New'}
                          </Badge>
                        </div>
                      )}
                      <div className="absolute bottom-3 right-3 bg-black/70 text-white px-3 py-1 rounded-lg text-sm">
                        {getPropertyTypeLabel(prop.type)}
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-bold mb-2 line-clamp-1">
                        {language === 'ar' ? prop.title : prop.titleEn}
                      </h3>
                      
                      <div className="flex items-center gap-1 text-gray-500 mb-3">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm line-clamp-1">{language === 'ar' ? prop.location : prop.locationEn}</span>
                      </div>

                      <div className="flex items-center gap-3 mb-4 text-sm text-gray-600">
                        {prop.beds && (
                          <div className="flex items-center gap-1">
                            <Bed className="w-4 h-4" />
                            <span>{prop.beds}</span>
                          </div>
                        )}
                        {prop.baths && (
                          <div className="flex items-center gap-1">
                            <Bath className="w-4 h-4" />
                            <span>{prop.baths}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Maximize className="w-4 h-4" />
                          <span>{prop.area} {language === 'ar' ? 'م²' : 'sqm'}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t">
                        <span className="text-xl font-bold text-[#2d5d2a]">
                          {formatPrice(prop.price)} {curr}
                        </span>
                        <Button size="sm" variant="outline" onClick={() => window.open(`tel:${prop.agent.phone}`)}>
                          <Phone className="w-4 h-4 mr-1" />
                          {language === 'ar' ? 'اتصال' : 'Call'}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* No Results */}
          {filteredProperties.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl">
              <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {language === 'ar' ? 'لا توجد عقارات' : 'No Properties Found'}
              </h2>
              <p className="text-gray-500 mb-6">
                {language === 'ar' 
                  ? 'جرب تغيير معايير البحث'
                  : 'Try changing your search criteria'}
              </p>
              <Button 
                onClick={() => {
                  setSelectedType('all');
                  setSelectedPrice('all');
                  setSelectedLocation('all');
                  setSearchQuery('');
                }}
                className="bg-[#2d5d2a] hover:bg-[#1e401c]"
              >
                {language === 'ar' ? 'إعادة ضبط' : 'Reset Filters'}
              </Button>
            </div>
          )}

          {/* Contact CTA */}
          <div className="mt-12 bg-gradient-to-r from-[#2d5d2a] to-[#3d7d3a] rounded-2xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">
              {language === 'ar' ? 'هل تبحث عن عقار محدد؟' : 'Looking for a specific property?'}
            </h2>
            <p className="text-white/80 mb-6 max-w-xl mx-auto">
              {language === 'ar' 
                ? 'فريقنا جاهز لمساعدتك في العثور على العقار المثالي'
                : 'Our team is ready to help you find the perfect property'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => window.open('tel:+971501234567')}
              >
                <Phone className="w-5 h-5 mr-2" />
                {language === 'ar' ? 'اتصل بنا' : 'Call Us'}
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10"
                onClick={() => navigate('/contact')}
              >
                <Mail className="w-5 h-5 mr-2" />
                {language === 'ar' ? 'راسلنا' : 'Email Us'}
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
