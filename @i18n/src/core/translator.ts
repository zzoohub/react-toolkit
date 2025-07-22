import type { 
  Locale, 
  Translation, 
  Variables, 
  TranslationOptions, 
  Translator, 
  TranslateFunction,
  StorageAdapter,
  TranslationCache
} from '../types';
import { interpolate } from '../utils/interpolation';
import { detectLocale } from '../utils/locale-detector';
import { createStorageAdapter, createBestStorageAdapter } from './storage';

/**
 * Simple LRU cache implementation for translations
 */
class LRUCache implements TranslationCache {
  private cache = new Map<string, string>();
  private maxSize: number;

  constructor(maxSize = 1000) {
    this.maxSize = maxSize;
  }

  get(key: string): string | undefined {
    const value = this.cache.get(key);
    if (value !== undefined) {
      // Move to end (most recently used)
      this.cache.delete(key);
      this.cache.set(key, value);
    }
    return value;
  }

  set(key: string, value: string): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      // Remove oldest (first) item
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }
    this.cache.set(key, value);
  }

  clear(): void {
    this.cache.clear();
  }
}

/**
 * Core translator implementation with performance optimizations
 */
export class CoreTranslator implements Translator {
  private currentLocale: Locale;
  private fallbackLocale: Locale;
  private storage: StorageAdapter;
  private cache: TranslationCache;
  private debugMode: boolean;
  private readonly STORAGE_KEY = 'i18n-locale';

  constructor(options: TranslationOptions = {}) {
    this.fallbackLocale = options.fallbackLocale || 'en';
    this.debugMode = options.debugMode || false;
    this.cache = new LRUCache();
    this.storage = createStorageAdapter();

    // Initialize locale
    this.currentLocale = this.initializeLocale();
  }

  private initializeLocale(): Locale {
    // Priority order:
    // 1. Stored locale from storage
    // 2. Detected locale from environment
    // 3. Fallback locale

    const storedLocale = this.storage.get(this.STORAGE_KEY);
    if (storedLocale) {
      return storedLocale;
    }

    const detectedLocale = detectLocale();
    this.storage.set(this.STORAGE_KEY, detectedLocale);
    return detectedLocale;
  }

  /**
   * Main translation function with caching and performance optimization
   */
  t: TranslateFunction = ((translation: Translation, variables?: Variables): string => {
    // Fast path: check if translation is a string (should not happen, but safety check)
    if (typeof translation === 'string') {
      return this.debugMode ? `[INVALID_TRANSLATION]: ${translation}` : translation;
    }

    // Create cache key
    const cacheKey = this.createCacheKey(translation, this.currentLocale, variables);
    
    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached !== undefined) {
      return cached;
    }

    // Get translation for current locale
    let result = translation[this.currentLocale];

    // Fallback to fallback locale if translation not found
    if (result === undefined) {
      result = translation[this.fallbackLocale];
      
      if (this.debugMode && result === undefined) {
        console.warn(`Translation missing for locale "${this.currentLocale}" and fallback "${this.fallbackLocale}":`, translation);
      }
    }

    // Ultimate fallback: use first available translation
    if (result === undefined) {
      const firstKey = Object.keys(translation)[0];
      result = firstKey ? translation[firstKey] : '';
      
      if (this.debugMode) {
        console.warn(`Using first available translation (${firstKey}) for:`, translation);
      }
    }

    // Apply interpolation if variables provided
    if (variables && Object.keys(variables).length > 0) {
      result = interpolate(result, variables);
    }

    // Cache the result
    this.cache.set(cacheKey, result);

    return result;
  }) as TranslateFunction;

  private createCacheKey(translation: Translation, locale: Locale, variables?: Variables): string {
    const translationHash = JSON.stringify(translation);
    const variablesHash = variables ? JSON.stringify(variables) : '';
    return `${locale}:${translationHash}:${variablesHash}`;
  }

  setLocale(locale: Locale): void {
    if (locale !== this.currentLocale) {
      this.currentLocale = locale;
      this.storage.set(this.STORAGE_KEY, locale);
      // Clear cache when locale changes to ensure fresh translations
      this.cache.clear();
      
      if (this.debugMode) {
        console.log(`Locale changed to: ${locale}`);
      }
    }
  }

  getLocale(): Locale {
    return this.currentLocale;
  }

  detectLocale(): Locale {
    const detected = detectLocale(false); // Don't use cache for explicit detection
    
    if (this.debugMode) {
      console.log(`Detected locale: ${detected}`);
    }
    
    return detected;
  }

  // Currently not implemented - for future extensibility
  addTranslations(): void {
    throw new Error('addTranslations not implemented yet');
  }

  /**
   * Clear translation cache (useful for memory management)
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get current cache size (for monitoring)
   */
  getCacheSize(): number {
    return (this.cache as any).cache?.size || 0;
  }
}

/**
 * Create and configure a translator instance
 */
export function createTranslator(options?: TranslationOptions): Translator {
  return new CoreTranslator(options);
}