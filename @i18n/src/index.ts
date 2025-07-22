/**
 * Platform-agnostic i18n library
 * 
 * Main exports for core functionality that works in any JavaScript environment
 */

// Core translator
import { createTranslator, CoreTranslator } from './core/translator';
export { createTranslator, CoreTranslator };

// Utilities
export { interpolate, extractVariables, clearInterpolationCache } from './utils/interpolation';
export { detectLocale, createLocaleDetector } from './utils/locale-detector';
export { createStorageAdapter } from './core/storage';

// Import types for use in this file
import type {
  Locale,
  Translation,
  Variables,
  TranslationOptions,
  Translator,
  TranslateFunction,
  StorageAdapter,
  LocaleDetector,
  TranslationCache
} from './types';

// Re-export types
export type {
  Locale,
  Translation,
  Variables,
  TranslationOptions,
  Translator,
  TranslateFunction,
  StorageAdapter,
  LocaleDetector,
  TranslationCache
};

// Convenience function to create a global translator instance
let globalTranslator: Translator | null = null;

/**
 * Get or create global translator instance
 * Convenient for apps that want to use a single translator throughout
 */
export function getGlobalTranslator(options?: TranslationOptions): Translator {
  if (!globalTranslator) {
    globalTranslator = createTranslator(options);
  }
  return globalTranslator as Translator;
}

/**
 * Quick translation function using global translator
 * Usage: t({ko: "안녕", en: "hello"})
 */
export function t(translation: Translation, variables?: Variables): string {
  return getGlobalTranslator().t(translation, variables);
}

/**
 * Quick locale setter using global translator
 */
export function setLocale(locale: Locale): void {
  getGlobalTranslator().setLocale(locale);
}

/**
 * Quick locale getter using global translator
 */
export function getLocale(): Locale {
  return getGlobalTranslator().getLocale();
}

/**
 * Quick locale detector using global translator
 */
export function autoDetectLocale(): Locale {
  return getGlobalTranslator().detectLocale();
}