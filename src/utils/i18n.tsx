import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { bitable } from '@lark-base-open/js-sdk';
import translations from './translations';

type Language = 'en-US' | 'zh-CN' | 'ja-JP';

interface I18nContextProps {
  t: (key: string) => string;
  changeLanguage: (language: Language) => void;
  language: Language;
}

const I18nContext = createContext<I18nContextProps>({
  t: (key: string) => key,
  changeLanguage: () => { },
  language: 'en-US',
});

const getTranslations = (language: Language) => {
  switch (language) {
    case 'en-US':
      return translations.en;
    case 'zh-CN':
      return translations.zh;
    case 'ja-JP':
      return translations.jp;
    default:
      return translations.en;
  }
};

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<string>('');
  const [language, setLanguage] = useState<Language>('en-US');
  const [currentTranslations, setCurrentTranslations] = useState(getTranslations(language));

  const getSystemLanguage = async () => {
    const systemLocale = await bitable.bridge.getLocale();
    setLocale(systemLocale);
    const detectedLanguage: Language = systemLocale.includes('zh')
      ? 'zh-CN'
      : systemLocale.includes('ja')
        ? 'ja-JP'
        : 'en-US';
    setLanguage(detectedLanguage);
  };

  useEffect(() => {
    getSystemLanguage();
  }, []);

  useEffect(() => {
    setCurrentTranslations(getTranslations(language));
  }, [language]);

  const t = (key: string) => {
    return currentTranslations[key] || key;
  };

  const changeLanguage = (language: Language) => {
    setLanguage(language);
  };

  return (
    <I18nContext.Provider value={{ t, changeLanguage, language }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);
