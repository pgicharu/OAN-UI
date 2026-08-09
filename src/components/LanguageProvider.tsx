import React, { createContext, useContext, useState, useCallback } from 'react';
import en from '../../translations/en.json';
import sw from '../../translations/sw.json';
import { DEFAULT_LANGUAGE } from './screens-component/chat-screen/config';

type LanguageCode = 'en' | 'sw';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string, params?: Record<string, string>) => string | string[];
}

interface TranslationObject {
  [key: string]: string | string[] | TranslationObject | Array<Record<string, unknown>>;
}

const translations: Record<LanguageCode, TranslationObject> = { en, sw };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem('app_language');
    // Ignore codes left over from a previous language set (e.g. the Indian
    // languages this app shipped with) so we never select a missing bundle.
    if (saved && saved in translations) return saved as LanguageCode;
    return DEFAULT_LANGUAGE;
  });

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem('app_language', lang);
  };

  const t = useCallback((key: string, params?: Record<string, string>): string | string[] => {
    const value = translations[language];
    
		// Helper to find key in object with support for dots in keys
		const findValue = (obj: TranslationObject, k: string): string | string[] | undefined => {
			if (!obj || typeof obj !== "object") return undefined;

			// 1. Try direct match first (handles keys like "qa.market.price.today" if they are at the current level)
			const direct = obj[k];
			if (direct && (typeof direct === "string" || Array.isArray(direct))) {
				return direct as string | string[];
			}

			// 2. Try nested resolution
			const parts = k.split(".");
			let current: any = obj;

			for (let i = 0; i < parts.length; i++) {
				const part = parts[i];
				if (part === undefined) continue;

				const remainder = parts.slice(i).join(".");

				if (current && typeof current === "object" && !Array.isArray(current)) {
					const curObj = current as Record<string, any>;
					if (curObj[remainder] !== undefined) {
						const val = curObj[remainder];
						if (typeof val === "string" || Array.isArray(val)) return val;
						if (typeof val === "object") return val;
					}

					if (curObj[part] !== undefined) {
						current = curObj[part];
					} else {
						return undefined;
					}
				} else {
					return undefined;
				}
			}

			return typeof current === "string" || Array.isArray(current) ? current : undefined;
		};

    let result = findValue(value, key);
    
    // Fallback to English
    if (result === undefined && language !== 'en') {
      result = findValue(translations['en'], key);
    }

    if (result === undefined) return key;

    if (typeof result === 'string' && params) {
      let interpolated = result;
      Object.entries(params).forEach(([k, v]) => {
        interpolated = interpolated.replace(`[${k}]`, v);
      });
      return interpolated;
    }

    return result;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
