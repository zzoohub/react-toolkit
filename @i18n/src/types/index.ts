/**
 * Supported locales - can be extended as needed
 */
export type Locale = string;

/**
 * Translation object with locale keys and string values
 */
export type Translation = Record<Locale, string>;

/**
 * Variables for string interpolation
 */
export type Variables = Record<string, string | number | boolean>;

/**
 * Translation configuration options
 */
export interface TranslationOptions {
  fallbackLocale?: Locale;
  debugMode?: boolean;
}

/**
 * Core translator interface
 */
export interface Translator {
  t: TranslateFunction;
  setLocale: (locale: Locale) => void;
  getLocale: () => Locale;
  detectLocale: () => Locale;
  addTranslations: (translations: Record<string, Translation>) => void;
}

/**
 * Main translation function type
 */
export type TranslateFunction = {
  (translation: Translation): string;
  (translation: Translation, variables?: Variables): string;
  <T extends Translation>(translation: T): string;
  <T extends Translation>(translation: T, variables?: Variables): string;
}

/**
 * Storage adapter interface
 */
export interface StorageAdapter {
  get: (key: string) => string | null;
  set: (key: string, value: string) => void;
  remove: (key: string) => void;
}

/**
 * Locale detector interface
 */
export interface LocaleDetector {
  detect: () => Locale;
}

/**
 * Translation cache for performance optimization
 */
export interface TranslationCache {
  get: (key: string) => string | undefined;
  set: (key: string, value: string) => void;
  clear: () => void;
}