import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Gift, 
  TrendingUp, 
  History, 
  Crown, 
  Check,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useLoyalty, LOYALTY_TIERS } from '@/context/LoyaltyContext';
import { useUser } from '@/context/UserContext';
import { useLanguage } from '@/context/LanguageContext';
import Header from '@/components/store/Header';
import Footer from '@/components/store/Footer';



export default function Loyalty() {
  const navigate = useNavigate();
  const { language, isRTL } = useLanguage();
  const { isLoggedIn } = useUser();
  const { 
    points, 
    lifetimePoints, 
    tier, 
    getNextTier, 
    getProgressToNextTier, 
    getPointsValue 
  } = useLoyalty();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'tiers' | 'history'>('overview');

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
        <Header />
        <main className="pt-20 pb-12">
          <div className="container-custom max-w-md">
            <div className="text-center py-16 bg-white rounded-2xl">
              <Crown className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {language === 'ar' ? 'انضم لبرنامج الولاء' : 'Join Loyalty Program'}
              </h2>
              <p className="text-gray-500 mb-6">
                {language === 'ar' 
                  ? 'سجل دخولك الآن واكسب نقاط مع كل عملية شراء'
                  : 'Login now and earn points with every purchase'}
              </p>
              <Button 
                onClick={() => navigate('/auth')}
                className="bg-[#2d5d2a] hover:bg-[#1e401c]"
              >
                {language === 'ar' ? 'تسجيل الدخول' : 'Login'}
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const nextTier = getNextTier();
  const progress = getProgressToNextTier();
  const pointsValue = getPointsValue(points);

  const tabs = [
    { id: 'overview', icon: Gift, labelAr: 'نظرة عامة', labelEn: 'Overview' },
    { id: 'tiers', icon: Crown, labelAr: 'مستويات الولاء', labelEn: 'Tiers' },
    { id: 'history', icon: History, labelAr: 'السجل', labelEn: 'History' },
  ];

  return (
    <div className="min-h-screen bg-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <Header />
      
      <main className="pt-20 pb-12">
        <div className="container-custom max-w-4xl">
          {/* Hero Card */}
          <div 
            className="rounded-2xl p-8 mb-8 text-white relative overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${tier.color} 0%, ${tier.color}dd 100%)` }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <Crown className="w-8 h-8" />
                <Badge className="bg-white/20 text-white border-0">
                  {language === 'ar' ? tier.name.ar : tier.name.en}
                </Badge>
              </div>
              
              <h1 className="text-3xl font-bold mb-2">
                {points.toLocaleString()} {language === 'ar' ? 'نقطة' : 'Points'}
              </h1>
              <p className="text-white/80">
                {language === 'ar' 
                  ? `قيمتها ${pointsValue} ${language === 'ar' ? 'درهم' : 'AED'}`
                  : `Worth ${pointsValue} AED`}
              </p>

              {nextTier && (
                <div className="mt-6">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span>{language === 'ar' ? 'التقدم للمستوى التالي' : 'Progress to next tier'}</span>
                    <span>{progress.percentage}%</span>
                  </div>
                  <Progress value={progress.percentage} className="h-2 bg-white/20" />
                  <p className="text-sm text-white/70 mt-2">
                    {language === 'ar' 
                      ? `أحتاج ${nextTier.minPoints - lifetimePoints} نقطة أخرى للوصول إلى ${nextTier.name.ar}`
                      : `Need ${nextTier.minPoints - lifetimePoints} more points to reach ${nextTier.name.en}`}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-[#2d5d2a] text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {language === 'ar' ? tab.labelAr : tab.labelEn}
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold">
                  {language === 'ar' ? 'مميزات مستواك' : 'Your Tier Benefits'}
                </h2>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {tier.benefits.ar.map((benefit, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${tier.color}20` }}>
                        <Check className="w-5 h-5" style={{ color: tier.color }} />
                      </div>
                      <span>{language === 'ar' ? benefit : tier.benefits.en[idx]}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-gradient-to-r from-[#2d5d2a] to-[#1e401c] rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-lg mb-1">
                        {language === 'ar' ? 'استبدل نقاطك' : 'Redeem Your Points'}
                      </h3>
                      <p className="text-white/80">
                        {language === 'ar' 
                          ? `100 نقطة = 1 ${language === 'ar' ? 'درهم' : 'AED'}`
                          : '100 points = 1 AED'}
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      className="border-white/30 text-white hover:bg-white/10"
                      onClick={() => navigate('/search')}
                    >
                      {language === 'ar' ? 'تسوق الآن' : 'Shop Now'}
                      <ArrowRight className={`w-4 h-4 ${isRTL ? 'mr-2' : 'ml-2'}`} />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tiers' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold mb-4">
                  {language === 'ar' ? 'مستويات الولاء' : 'Loyalty Tiers'}
                </h2>
                
                {LOYALTY_TIERS.map((t) => (
                  <div
                    key={t.id}
                    className={`p-6 rounded-xl border-2 ${
                      t.id === tier.id 
                        ? 'border-[#2d5d2a] bg-[#2d5d2a]/5' 
                        : 'border-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: t.color }}
                        >
                          <Crown className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold">{language === 'ar' ? t.name.ar : t.name.en}</h3>
                          <p className="text-sm text-gray-500">
                            {t.minPoints.toLocaleString()}+ {language === 'ar' ? 'نقطة' : 'points'}
                          </p>
                        </div>
                      </div>
                      {t.id === tier.id && (
                        <Badge className="bg-[#2d5d2a]">
                          {language === 'ar' ? 'مستواك الحالي' : 'Current Tier'}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-2">
                      {(language === 'ar' ? t.benefits.ar : t.benefits.en).map((benefit: string, bidx: number) => (
                        <div key={bidx} className="flex items-center gap-2 text-sm">
                          <Check className="w-4 h-4 text-[#2d5d2a]" />
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'history' && (
              <div>
                <h2 className="text-xl font-bold mb-4">
                  {language === 'ar' ? 'سجل النقاط' : 'Points History'}
                </h2>
                
                <div className="space-y-3">
                  {/* Mock transactions */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">{language === 'ar' ? 'نقاط من طلب' : 'Points from order'}</p>
                        <p className="text-sm text-gray-500">#AJ-001234</p>
                      </div>
                    </div>
                    <span className="font-bold text-green-600">+299</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Gift className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium">{language === 'ar' ? 'مكافأة ترحيبية' : 'Welcome bonus'}</p>
                        <p className="text-sm text-gray-500">2024-12-01</p>
                      </div>
                    </div>
                    <span className="font-bold text-green-600">+100</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
