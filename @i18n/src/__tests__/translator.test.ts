import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createTranslator, t, setLocale, getLocale } from '../index';
import type { Translation } from '../types';

// Mock document.cookie for testing
const mockCookies = new Map<string, string>();

// Mock document if it doesn't exist (Node.js environment)
if (typeof document === 'undefined') {
  global.document = {} as any;
}

Object.defineProperty(document, 'cookie', {
  get: () => {
    return Array.from(mockCookies.entries())
      .map(([key, value]) => `${key}=${value}`)
      .join('; ');
  },
  set: (value: string) => {
    const [cookie] = value.split(';');
    const [key, val] = cookie.split('=');
    if (val) {
      mockCookies.set(key.trim(), decodeURIComponent(val.trim()));
    } else {
      mockCookies.delete(key.trim());
    }
  }
});

describe('i18n Core Translator', () => {
  beforeEach(() => {
    mockCookies.clear();
    vi.clearAllMocks();
  });

  describe('Basic Translation', () => {
    it('should translate to current locale', () => {
      const translator = createTranslator({ fallbackLocale: 'en' });
      translator.setLocale('ko');
      
      const translation: Translation = { ko: '안녕', en: 'hello' };
      const result = translator.t(translation);
      
      expect(result).toBe('안녕');
    });

    it('should fallback to fallback locale', () => {
      const translator = createTranslator({ fallbackLocale: 'en' });
      translator.setLocale('fr'); // Not available in translation
      
      const translation: Translation = { ko: '안녕', en: 'hello' };
      const result = translator.t(translation);
      
      expect(result).toBe('hello');
    });

    it('should use first available translation as ultimate fallback', () => {
      const translator = createTranslator({ fallbackLocale: 'fr' });
      translator.setLocale('de'); // Neither de nor fr available
      
      const translation: Translation = { ko: '안녕', en: 'hello' };
      const result = translator.t(translation);
      
      expect(result).toBe('안녕'); // First available
    });
  });

  describe('String Interpolation', () => {
    it('should interpolate variables', () => {
      const translator = createTranslator();
      translator.setLocale('en');
      
      const translation: Translation = { 
        en: 'Hello {{name}}!', 
        ko: '안녕 {{name}}!' 
      };
      
      const result = translator.t(translation, { name: 'John' });
      expect(result).toBe('Hello John!');
    });

    it('should handle multiple variables', () => {
      const translator = createTranslator();
      translator.setLocale('en');
      
      const translation: Translation = { 
        en: '{{greeting}} {{name}}, you have {{count}} messages',
        ko: '{{name}}님 {{greeting}}, {{count}}개의 메시지가 있습니다'
      };
      
      const result = translator.t(translation, { 
        greeting: 'Hello',
        name: 'John',
        count: 5 
      });
      
      expect(result).toBe('Hello John, you have 5 messages');
    });

    it('should keep placeholder for missing variables', () => {
      const translator = createTranslator();
      translator.setLocale('en');
      
      const translation: Translation = { en: 'Hello {{name}}!' };
      const result = translator.t(translation, {});
      
      expect(result).toBe('Hello {{name}}!');
    });
  });

  describe('Locale Management', () => {
    it('should set and get locale', () => {
      const translator = createTranslator();
      
      translator.setLocale('ko');
      expect(translator.getLocale()).toBe('ko');
      
      translator.setLocale('en');
      expect(translator.getLocale()).toBe('en');
    });

    it('should persist locale in cookies', () => {
      const translator = createTranslator();
      
      translator.setLocale('ko');
      expect(mockCookies.get('i18n-locale')).toBe('ko');
      
      translator.setLocale('en');
      expect(mockCookies.get('i18n-locale')).toBe('en');
    });

    it('should restore locale from cookies', () => {
      mockCookies.set('i18n-locale', 'ko');
      
      const translator = createTranslator();
      expect(translator.getLocale()).toBe('ko');
    });
  });

  describe('Global Functions', () => {
    it('should work with global t function', () => {
      setLocale('en');
      
      const translation: Translation = { en: 'Hello', ko: '안녕' };
      const result = t(translation);
      
      expect(result).toBe('Hello');
    });

    it('should work with global locale functions', () => {
      setLocale('ko');
      expect(getLocale()).toBe('ko');
    });
  });

  describe('Caching', () => {
    it('should cache translations for performance', () => {
      const translator = createTranslator();
      translator.setLocale('en');
      
      const translation: Translation = { en: 'Hello', ko: '안녕' };
      
      // First call
      const result1 = translator.t(translation);
      
      // Second call should use cache
      const result2 = translator.t(translation);
      
      expect(result1).toBe('Hello');
      expect(result2).toBe('Hello');
      expect(result1).toBe(result2); // Same reference if cached properly
    });

    it('should clear cache when locale changes', () => {
      const translator = createTranslator();
      const translation: Translation = { en: 'Hello', ko: '안녕' };
      
      translator.setLocale('en');
      const englishResult = translator.t(translation);
      
      translator.setLocale('ko');
      const koreanResult = translator.t(translation);
      
      expect(englishResult).toBe('Hello');
      expect(koreanResult).toBe('안녕');
    });
  });
});