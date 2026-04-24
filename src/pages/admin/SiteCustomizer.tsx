import { useState, useEffect } from 'react';
import { Palette, Image, Type, Save, RotateCcw, LayoutGrid, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/context/LanguageContext';
import { useSiteSettings } from '@/context/SiteSettingsContext';

interface CustomSection {
  id: string;
  title: string;
  titleEn: string;
  content: string;
  contentEn: string;
  enabled: boolean;
}

interface SiteSettings {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logoEnabled: boolean;
  logoUrl: string;
  faviconUrl: string;
  storeName: string;
  storeNameEn: string;
  fontFamily: string;
  bannerText: string;
  bannerTextEn: string;
  bannerEnabled: boolean;
  footerText: string;
  footerTextEn: string;
  customSections: CustomSection[];
}

const defaultSettings: SiteSettings = {
  primaryColor: '#2d5d2a',
  secondaryColor: '#1e401c',
  accentColor: '#c8a45c',
  logoEnabled: true,
  logoUrl: '/images/logo-64.png',
  faviconUrl: '/images/logo-64.png',
  storeName: 'AJFworld',
  storeNameEn: 'AJFworld',
  fontFamily: 'system-ui',
  bannerText: 'توصيل سريع لجميع أنحاء الإمارات',
  bannerTextEn: 'Fast delivery across UAE',
  bannerEnabled: false,
  footerText: 'وجهتك المثالية للتسوق الإلكتروني في الإمارات',
  footerTextEn: 'Your ultimate destination for online shopping in UAE',
  customSections: [],
};

const fontOptions = [
  { value: 'system-ui', labelAr: 'النظام الافتراضي', labelEn: 'System Default' },
  { value: 'Arial, sans-serif', labelAr: 'Arial', labelEn: 'Arial' },
  { value: '"Segoe UI", sans-serif', labelAr: 'Segoe UI', labelEn: 'Segoe UI' },
  { value: '"Dubai", "Noto Sans Arabic", sans-serif', labelAr: 'دبي (عربي)', labelEn: 'Dubai (Arabic)' },
  { value: '"Tahoma", sans-serif', labelAr: 'Tahoma', labelEn: 'Tahoma' },
  { value: '"Roboto", sans-serif', labelAr: 'Roboto', labelEn: 'Roboto' },
  { value: '"Poppins", sans-serif', labelAr: 'Poppins', labelEn: 'Poppins' },
];

export default function SiteCustomizer() {
  const { language, isRTL } = useLanguage();
  const { settings: ctxSettings, saveSettings } = useSiteSettings();
  const [settings, setSettings] = useState<SiteSettings>(ctxSettings || defaultSettings);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'appearance' | 'sections'>('appearance');

  useEffect(() => {
    setSettings(ctxSettings || defaultSettings);
  }, [ctxSettings]);

  const handleSave = () => {
    saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    if (confirm(language === 'ar' ? 'هل أنت متأكد من إعادة الضبط؟' : 'Are you sure you want to reset?')) {
      saveSettings(defaultSettings);
      setSettings(defaultSettings);
    }
  };

  const updateSetting = (key: keyof SiteSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const addCustomSection = () => {
    const newSection: CustomSection = {
      id: Date.now().toString(),
      title: language === 'ar' ? 'قسم جديد' : 'New Section',
      titleEn: 'New Section',
      content: '',
      contentEn: '',
      enabled: true,
    };
    setSettings(prev => ({ ...prev, customSections: [...prev.customSections, newSection] }));
  };

  const updateCustomSection = (id: string, updates: Partial<CustomSection>) => {
    setSettings(prev => ({
      ...prev,
      customSections: prev.customSections.map(s => s.id === id ? { ...s, ...updates } : s),
    }));
  };

  const deleteCustomSection = (id: string) => {
    setSettings(prev => ({
      ...prev,
      customSections: prev.customSections.filter(s => s.id !== id),
    }));
  };

  const t = {
    ar: {
      title: 'تخصيص الموقع',
      appearance: 'المظهر',
      customSections: 'أقسام مخصصة',
      colors: 'الألوان',
      primaryColor: 'اللون الرئيسي',
      secondaryColor: 'اللون الثانوي',
      accentColor: 'لون التمييز',
      logo: 'الشعار',
      logoEnabled: 'إظهار الشعار',
      logoUrl: 'رابط الشعار',
      faviconUrl: 'رابط الأيقونة',
      storeName: 'اسم المتجر',
      storeNameEn: 'اسم المتجر بالإنجليزي',
      fonts: 'الخطوط',
      fontFamily: 'خط الموقع',
      banner: 'الشريط الإعلاني العلوي',
      bannerText: 'نص الشريط',
      bannerTextEn: 'نص الشريط بالإنجليزي',
      bannerEnabled: 'إظهار الشريط',
      footer: 'تذييل الموقع',
      footerText: 'نص التذييل',
      footerTextEn: 'نص التذييل بالإنجليزي',
      save: 'حفظ التغييرات',
      saved: 'تم الحفظ!',
      reset: 'إعادة الضبط',
      sectionTitle: 'عنوان القسم',
      sectionTitleEn: 'العنوان بالإنجليزي',
      sectionContent: 'المحتوى',
      sectionContentEn: 'المحتوى بالإنجليزي',
      sectionEnabled: 'تفعيل القسم',
      addSection: 'إضافة قسم',
      noSections: 'لا توجد أقسام مخصصة',
    },
    en: {
      title: 'Site Customizer',
      appearance: 'Appearance',
      customSections: 'Custom Sections',
      colors: 'Colors',
      primaryColor: 'Primary Color',
      secondaryColor: 'Secondary Color',
      accentColor: 'Accent Color',
      logo: 'Logo',
      logoEnabled: 'Show Logo',
      logoUrl: 'Logo URL',
      faviconUrl: 'Favicon URL',
      storeName: 'Store Name',
      storeNameEn: 'Store Name English',
      fonts: 'Fonts',
      fontFamily: 'Site Font',
      banner: 'Top Banner',
      bannerText: 'Banner Text',
      bannerTextEn: 'Banner Text English',
      bannerEnabled: 'Show Banner',
      footer: 'Footer',
      footerText: 'Footer Text',
      footerTextEn: 'Footer Text English',
      save: 'Save Changes',
      saved: 'Saved!',
      reset: 'Reset',
      sectionTitle: 'Section Title',
      sectionTitleEn: 'Title English',
      sectionContent: 'Content',
      sectionContentEn: 'Content English',
      sectionEnabled: 'Enable Section',
      addSection: 'Add Section',
      noSections: 'No custom sections',
    }
  }[language];

  const tabs = [
    { id: 'appearance' as const, icon: Palette, label: t.appearance },
    { id: 'sections' as const, icon: LayoutGrid, label: t.customSections },
  ];

  return (
    <div className="p-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {t.reset}
          </Button>
          <Button
            className={saved ? 'bg-green-600' : 'bg-[#2d5d2a] hover:bg-[#1e401c]'}
            onClick={handleSave}
          >
            <Save className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {saved ? t.saved : t.save}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#2d5d2a] text-white'
                  : 'bg-white text-gray-600 border hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'appearance' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Colors Section */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center gap-2 mb-4">
              <Palette className="w-5 h-5 text-[#2d5d2a]" />
              <h2 className="text-lg font-bold">{t.colors}</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t.primaryColor}</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={settings.primaryColor}
                    onChange={e => updateSetting('primaryColor', e.target.value)}
                    className="w-12 h-12 rounded-lg cursor-pointer"
                  />
                  <Input value={settings.primaryColor} onChange={e => updateSetting('primaryColor', e.target.value)} className="flex-1" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t.secondaryColor}</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={settings.secondaryColor}
                    onChange={e => updateSetting('secondaryColor', e.target.value)}
                    className="w-12 h-12 rounded-lg cursor-pointer"
                  />
                  <Input value={settings.secondaryColor} onChange={e => updateSetting('secondaryColor', e.target.value)} className="flex-1" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t.accentColor}</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={settings.accentColor}
                    onChange={e => updateSetting('accentColor', e.target.value)}
                    className="w-12 h-12 rounded-lg cursor-pointer"
                  />
                  <Input value={settings.accentColor} onChange={e => updateSetting('accentColor', e.target.value)} className="flex-1" />
                </div>
              </div>
            </div>
          </div>

          {/* Logo Section */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center gap-2 mb-4">
              <Image className="w-5 h-5 text-[#2d5d2a]" />
              <h2 className="text-lg font-bold">{t.logo}</h2>
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.logoEnabled}
                  onChange={e => updateSetting('logoEnabled', e.target.checked)}
                  className="w-5 h-5"
                />
                <span className="text-sm font-medium">{t.logoEnabled}</span>
              </label>

              {settings.logoEnabled && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.logoUrl}</label>
                    <Input value={settings.logoUrl} onChange={e => updateSetting('logoUrl', e.target.value)} placeholder="https://..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.faviconUrl}</label>
                    <Input value={settings.faviconUrl} onChange={e => updateSetting('faviconUrl', e.target.value)} placeholder="https://..." />
                  </div>
                  <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg">
                    <img src={settings.logoUrl} alt="Logo Preview" className="h-16 object-contain" onError={e => { (e.target as HTMLImageElement).src = '/images/logo-64.png'; }} />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Store Name */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center gap-2 mb-4">
              <Type className="w-5 h-5 text-[#2d5d2a]" />
              <h2 className="text-lg font-bold">{t.storeName}</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t.storeName}</label>
                <Input value={settings.storeName} onChange={e => updateSetting('storeName', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t.storeNameEn}</label>
                <Input value={settings.storeNameEn} onChange={e => updateSetting('storeNameEn', e.target.value)} />
              </div>
            </div>
          </div>

          {/* Fonts */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center gap-2 mb-4">
              <Type className="w-5 h-5 text-[#2d5d2a]" />
              <h2 className="text-lg font-bold">{t.fonts}</h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.fontFamily}</label>
              <select
                value={settings.fontFamily}
                onChange={e => updateSetting('fontFamily', e.target.value)}
                className="w-full h-11 px-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2d5d2a]"
              >
                {fontOptions.map(font => (
                  <option key={font.value} value={font.value}>{language === 'ar' ? font.labelAr : font.labelEn}</option>
                ))}
              </select>
            </div>

            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-center" style={{ fontFamily: settings.fontFamily }}>
                {language === 'ar' ? 'هذا نص تجريبي لمعاينة الخط' : 'This is sample text for font preview'}
              </p>
            </div>
          </div>

          {/* Banner */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center gap-2 mb-4">
              <Type className="w-5 h-5 text-[#2d5d2a]" />
              <h2 className="text-lg font-bold">{t.banner}</h2>
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={settings.bannerEnabled} onChange={e => updateSetting('bannerEnabled', e.target.checked)} className="w-5 h-5" />
                <span className="text-sm font-medium">{t.bannerEnabled}</span>
              </label>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t.bannerText}</label>
                <Input value={settings.bannerText} onChange={e => updateSetting('bannerText', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t.bannerTextEn}</label>
                <Input value={settings.bannerTextEn} onChange={e => updateSetting('bannerTextEn', e.target.value)} />
              </div>

              {settings.bannerEnabled && (
                <div className="p-3 text-center text-white text-sm rounded-lg" style={{ backgroundColor: settings.primaryColor }}>
                  {language === 'ar' ? settings.bannerText : settings.bannerTextEn}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-white rounded-xl shadow-sm border p-6 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Type className="w-5 h-5 text-[#2d5d2a]" />
              <h2 className="text-lg font-bold">{t.footer}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t.footerText}</label>
                <textarea value={settings.footerText} onChange={e => updateSetting('footerText', e.target.value)} className="w-full h-24 px-4 py-3 border border-gray-200 rounded-lg resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t.footerTextEn}</label>
                <textarea value={settings.footerTextEn} onChange={e => updateSetting('footerTextEn', e.target.value)} className="w-full h-24 px-4 py-3 border border-gray-200 rounded-lg resize-none" />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'sections' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold">{t.customSections}</h2>
            <Button className="bg-[#2d5d2a] hover:bg-[#1e401c]" onClick={addCustomSection}>
              <Plus className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {t.addSection}
            </Button>
          </div>

          {settings.customSections.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
              <LayoutGrid className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">{t.noSections}</p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6">
            {settings.customSections.map((section) => (
              <div key={section.id} className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={section.enabled}
                      onChange={e => updateCustomSection(section.id, { enabled: e.target.checked })}
                      className="w-5 h-5"
                    />
                    <span className="font-medium">{t.sectionEnabled}</span>
                  </label>
                  <button
                    onClick={() => deleteCustomSection(section.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.sectionTitle}</label>
                    <Input
                      value={section.title}
                      onChange={e => updateCustomSection(section.id, { title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.sectionTitleEn}</label>
                    <Input
                      value={section.titleEn}
                      onChange={e => updateCustomSection(section.id, { titleEn: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.sectionContent}</label>
                    <textarea
                      value={section.content}
                      onChange={e => updateCustomSection(section.id, { content: e.target.value })}
                      className="w-full h-24 px-4 py-3 border border-gray-200 rounded-lg resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.sectionContentEn}</label>
                    <textarea
                      value={section.contentEn}
                      onChange={e => updateCustomSection(section.id, { contentEn: e.target.value })}
                      className="w-full h-24 px-4 py-3 border border-gray-200 rounded-lg resize-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
