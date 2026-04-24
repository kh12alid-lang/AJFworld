import { useState, useEffect } from 'react';
import { Eye, TrendingUp, Users, Globe, Calendar, Monitor, Smartphone, Tablet, MousePointer, Clock, ShoppingCart, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/context/LanguageContext';

interface VisitRecord {
  date: string;
  count: number;
  uniqueVisitors: number;
  deviceTypes: { desktop: number; mobile: number; tablet: number };
  topPages: { page: string; views: number }[];
  sources: { source: string; count: number }[];
  avgDuration: number;
  conversions: number;
}

export default function VisitorAnalytics() {
  const { language, isRTL } = useLanguage();
  const [visitData, setVisitData] = useState<VisitRecord[]>([]);
  const [todayVisits, setTodayVisits] = useState(0);
  const [totalVisits, setTotalVisits] = useState(0);
  const [uniqueVisitors, setUniqueVisitors] = useState(0);
  const [period, setPeriod] = useState<'7days' | '30days' | 'all'>('7days');

  useEffect(() => {
    const savedVisits = localStorage.getItem('ajfworld_visitor_stats');
    if (savedVisits) {
      try {
        const data = JSON.parse(savedVisits);
        setVisitData(data.dailyRecords || []);
        setTodayVisits(data.today || 0);
        setTotalVisits(data.total || 0);
        setUniqueVisitors(data.unique || 0);
      } catch (e) {
        console.error('Failed to parse visitor stats', e);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const today = new Date().toISOString().split('T')[0];
    const stats = JSON.parse(localStorage.getItem('ajfworld_visitor_stats') || '{"dailyRecords":[],"today":0,"total":0,"unique":0}');
    const lastVisit = sessionStorage.getItem('ajfworld_session');
    if (!lastVisit) {
      sessionStorage.setItem('ajfworld_session', Date.now().toString());
      stats.today = (stats.today || 0) + 1;
      stats.total = (stats.total || 0) + 1;
      const todayRecord = stats.dailyRecords?.find((r: any) => r.date === today);
      if (todayRecord) {
        todayRecord.count += 1;
        todayRecord.uniqueVisitors += 1;
      } else {
        stats.dailyRecords = stats.dailyRecords || [];
        stats.dailyRecords.push({
          date: today,
          count: 1,
          uniqueVisitors: 1,
          deviceTypes: { desktop: 1, mobile: 0, tablet: 0 },
          topPages: [],
          sources: [{ source: 'direct', count: 1 }],
          avgDuration: 0,
          conversions: 0,
        });
      }
      localStorage.setItem('ajfworld_visitor_stats', JSON.stringify(stats));
      setTodayVisits(stats.today);
      setTotalVisits(stats.total);
      setVisitData(stats.dailyRecords || []);
    }
  }, []);

  const filteredData = visitData.filter(record => {
    const recordDate = new Date(record.date);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - recordDate.getTime()) / (1000 * 60 * 60 * 24));
    if (period === '7days') return diffDays <= 7;
    if (period === '30days') return diffDays <= 30;
    return true;
  });

  const t = {
    ar: {
      title: 'تحليلات الزوار',
      today: 'زوار اليوم',
      total: 'إجمالي الزيارات',
      unique: 'زوار فريدين',
      avgDaily: 'متوسط يومي',
      avgDuration: 'متوسط المدة',
      conversionRate: 'معدل التحويل',
      period7: '7 أيام',
      period30: '30 يوم',
      allTime: 'كل الأوقات',
      date: 'التاريخ',
      visits: 'الزيارات',
      uniqueVisitors: 'زوار فريدين',
      deviceTypes: 'أنواع الأجهزة',
      desktop: 'كمبيوتر',
      mobile: 'موبايل',
      tablet: 'تابلت',
      topPages: 'الصفحات الأكثر زيارة',
      trafficSources: 'مصادر الزيارات',
      page: 'الصفحة',
      views: 'المشاهدات',
      source: 'المصدر',
      noData: 'لا توجد بيانات زوار بعد',
      realTime: 'زيارات مباشرة',
      minutes: 'دقيقة',
    },
    en: {
      title: 'Visitor Analytics',
      today: 'Today Visits',
      total: 'Total Visits',
      unique: 'Unique Visitors',
      avgDaily: 'Daily Average',
      avgDuration: 'Avg Duration',
      conversionRate: 'Conversion Rate',
      period7: '7 Days',
      period30: '30 Days',
      allTime: 'All Time',
      date: 'Date',
      visits: 'Visits',
      uniqueVisitors: 'Unique Visitors',
      deviceTypes: 'Device Types',
      desktop: 'Desktop',
      mobile: 'Mobile',
      tablet: 'Tablet',
      topPages: 'Top Pages',
      trafficSources: 'Traffic Sources',
      page: 'Page',
      views: 'Views',
      source: 'Source',
      noData: 'No visitor data yet',
      realTime: 'Real-time Visits',
      minutes: 'min',
    }
  }[language];

  const avgDaily = filteredData.length > 0
    ? Math.round(filteredData.reduce((sum, r) => sum + r.count, 0) / filteredData.length)
    : 0;

  const avgDuration = filteredData.length > 0
    ? Math.round(filteredData.reduce((sum, r) => sum + (r.avgDuration || 0), 0) / filteredData.length)
    : 0;

  const totalConversions = filteredData.reduce((sum, r) => sum + (r.conversions || 0), 0);
  const conversionRate = totalVisits > 0 ? ((totalConversions / totalVisits) * 100).toFixed(1) : '0';

  // Aggregate device data
  const deviceTotals = filteredData.reduce((acc, r) => {
    const d = r.deviceTypes || { desktop: 0, mobile: 0, tablet: 0 };
    return { desktop: acc.desktop + d.desktop, mobile: acc.mobile + d.mobile, tablet: acc.tablet + d.tablet };
  }, { desktop: 0, mobile: 0, tablet: 0 });

  // Aggregate top pages
  const allPages: Record<string, number> = {};
  filteredData.forEach(r => {
    (r.topPages || []).forEach((p: any) => {
      allPages[p.page] = (allPages[p.page] || 0) + p.views;
    });
  });
  const sortedPages = Object.entries(allPages).sort((a, b) => b[1] - a[1]).slice(0, 5);

  // Aggregate sources
  const allSources: Record<string, number> = {};
  filteredData.forEach(r => {
    (r.sources || []).forEach((s: any) => {
      allSources[s.source] = (allSources[s.source] || 0) + s.count;
    });
  });
  const sortedSources = Object.entries(allSources).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <div className="p-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
        <Badge variant="secondary" className="bg-green-100 text-green-700">
          <Eye className="w-3 h-3 mr-1" />
          {t.realTime}
        </Badge>
      </div>

      {/* Stats Cards - 6 cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#2d5d2a]/10 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-[#2d5d2a]" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{t.today}</p>
              <p className="text-2xl font-bold">{todayVisits}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{t.total}</p>
              <p className="text-2xl font-bold">{totalVisits}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{t.unique}</p>
              <p className="text-2xl font-bold">{uniqueVisitors}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{t.avgDaily}</p>
              <p className="text-2xl font-bold">{avgDaily}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-50 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-cyan-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{t.avgDuration}</p>
              <p className="text-2xl font-bold">{avgDuration} {t.minutes}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-pink-50 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-pink-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{t.conversionRate}</p>
              <p className="text-2xl font-bold">{conversionRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Period Selector */}
      <div className="flex gap-2 mb-6">
        {([
          { key: '7days' as const, label: t.period7 },
          { key: '30days' as const, label: t.period30 },
          { key: 'all' as const, label: t.allTime },
        ]).map((p) => (
          <button
            key={p.key}
            onClick={() => setPeriod(p.key)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              period === p.key
                ? 'bg-[#2d5d2a] text-white'
                : 'bg-white text-gray-600 border hover:bg-gray-50'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Device Types */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border p-4 text-center">
          <Monitor className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <p className="text-sm text-gray-500">{t.desktop}</p>
          <p className="text-xl font-bold">{deviceTotals.desktop}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4 text-center">
          <Smartphone className="w-8 h-8 text-purple-500 mx-auto mb-2" />
          <p className="text-sm text-gray-500">{t.mobile}</p>
          <p className="text-xl font-bold">{deviceTotals.mobile}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4 text-center">
          <Tablet className="w-8 h-8 text-orange-500 mx-auto mb-2" />
          <p className="text-sm text-gray-500">{t.tablet}</p>
          <p className="text-xl font-bold">{deviceTotals.tablet}</p>
        </div>
      </div>

      {/* Top Pages & Sources Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Top Pages */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <MousePointer className="w-5 h-5 text-[#2d5d2a]" />
              <h2 className="font-bold text-gray-900">{t.topPages}</h2>
            </div>
          </div>
          {sortedPages.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-3 text-xs font-medium text-gray-500">{t.page}</th>
                    <th className="text-left p-3 text-xs font-medium text-gray-500">{t.views}</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {sortedPages.map(([page, views]) => (
                    <tr key={page} className="hover:bg-gray-50">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <ExternalLink className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{page}</span>
                        </div>
                      </td>
                      <td className="p-3 font-bold">{views}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8 text-sm">{t.noData}</p>
          )}
        </div>

        {/* Traffic Sources */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#2d5d2a]" />
              <h2 className="font-bold text-gray-900">{t.trafficSources}</h2>
            </div>
          </div>
          {sortedSources.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-3 text-xs font-medium text-gray-500">{t.source}</th>
                    <th className="text-left p-3 text-xs font-medium text-gray-500">{t.visits}</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {sortedSources.map(([source, count]) => (
                    <tr key={source} className="hover:bg-gray-50">
                      <td className="p-3">
                        <span className="text-sm capitalize">{source}</span>
                      </td>
                      <td className="p-3 font-bold">{count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8 text-sm">{t.noData}</p>
          )}
        </div>
      </div>

      {/* Daily Records Table */}
      {filteredData.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-700">{t.date}</th>
                  <th className="text-left p-4 font-medium text-gray-700">{t.visits}</th>
                  <th className="text-left p-4 font-medium text-gray-700">{t.uniqueVisitors}</th>
                  <th className="text-left p-4 font-medium text-gray-700">{t.conversionRate}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredData.slice().reverse().map((record) => (
                  <tr key={record.date} className="hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{record.date}</span>
                      </div>
                    </td>
                    <td className="p-4 font-bold">{record.count}</td>
                    <td className="p-4 text-gray-600">{record.uniqueVisitors}</td>
                    <td className="p-4 text-gray-600">
                      {record.count > 0 ? ((record.conversions || 0) / record.count * 100).toFixed(1) : '0'}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
          <Eye className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">{t.noData}</p>
        </div>
      )}
    </div>
  );
}
