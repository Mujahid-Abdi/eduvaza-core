import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { Language, I18nContextType, Translations } from '@/types';
import en from '@/i18n/en.json';
import fr from '@/i18n/fr.json';
import ar from '@/i18n/ar.json';
import sw from '@/i18n/sw.json';

const translations: Record<Language, Translations> = { en, fr, ar, sw };

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const getNestedValue = (obj: Translations, path: string): string => {
  const keys = path.split('.');
  let value: string | Translations = obj;
  
  for (const key of keys) {
    if (typeof value === 'object' && value !== null && key in value) {
      value = value[key];
    } else {
      return path;
    }
  }
  
  return typeof value === 'string' ? value : path;
};

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<Language>('en');

  const t = useCallback((key: string, params?: Record<string, string>): string => {
    let text = getNestedValue(translations[locale], key);
    
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        text = text.replace(`{${paramKey}}`, paramValue);
      });
    }
    
    return text;
  }, [locale]);

  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, dir }}>
      <div dir={dir}>
        {children}
      </div>
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
