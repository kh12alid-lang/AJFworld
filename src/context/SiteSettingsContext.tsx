import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';

interface CustomSection {
  id: string;
  title: string;
  titleEn: string;
  content: string;
  contentEn: string;
  enabled: boolean;
}

export interface SiteSettings {
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

const STORAGE_KEY = 'ajfworld_site_settings';

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

function loadSettings(): SiteSettings {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...defaultSettings, ...parsed };
    }
  } catch {
    // ignore
  }
  return { ...defaultSettings };
}

interface SiteSettingsContextType {
  settings: SiteSettings;
  updateSettings: (partial: Partial<SiteSettings>) => void;
  saveSettings: (newSettings: SiteSettings) => void;
  resetSettings: () => void;
}

const SiteSettingsContext = createContext<SiteSettingsContextType>({
  settings: { ...defaultSettings },
  updateSettings: () => {},
  saveSettings: () => {},
  resetSettings: () => {},
});

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(loadSettings);

  // Listen for changes from other tabs/windows
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setSettings(loadSettings());
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Apply font family to document when it changes
  useEffect(() => {
    if (settings.fontFamily) {
      document.documentElement.style.fontFamily = settings.fontFamily;
    }
  }, [settings.fontFamily]);

  // Apply primary color CSS variable
  useEffect(() => {
    if (settings.primaryColor) {
      document.documentElement.style.setProperty('--ajf-primary', settings.primaryColor);
    }
    if (settings.secondaryColor) {
      document.documentElement.style.setProperty('--ajf-secondary', settings.secondaryColor);
    }
    if (settings.accentColor) {
      document.documentElement.style.setProperty('--ajf-accent', settings.accentColor);
    }
  }, [settings.primaryColor, settings.secondaryColor, settings.accentColor]);

  const updateSettings = useCallback((partial: Partial<SiteSettings>) => {
    setSettings(prev => {
      const next = { ...prev, ...partial };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const saveSettings = useCallback((newSettings: SiteSettings) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
    setSettings(newSettings);
  }, []);

  const resetSettings = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setSettings({ ...defaultSettings });
  }, []);

  return (
    <SiteSettingsContext.Provider value={{ settings, updateSettings, saveSettings, resetSettings }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}
