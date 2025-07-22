import type { Locale, LocaleDetector } from '../types';

/**
 * Browser-based locale detector
 */
class BrowserLocaleDetector implements LocaleDetector {
  detect(): Locale {
    if (typeof window === 'undefined') {
      return 'en'; // Fallback for non-browser environments
    }

    // Priority order:
    // 1. URL parameter (e.g., ?lang=ko)
    // 2. navigator.language
    // 3. navigator.languages[0]
    // 4. fallback to 'en'

    // Check URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang') || urlParams.get('locale');
    if (urlLang) {
      return normalizeLocale(urlLang);
    }

    // Check navigator.language
    if (navigator.language) {
      return normalizeLocale(navigator.language);
    }

    // Check navigator.languages
    if (navigator.languages && navigator.languages.length > 0) {
      return normalizeLocale(navigator.languages[0]);
    }

    return 'en';
  }
}

/**
 * Node.js-based locale detector
 */
class NodeLocaleDetector implements LocaleDetector {
  detect(): Locale {
    // In Node.js, use process.env.LANG or process.env.LANGUAGE
    const envLang = process.env.LANG || process.env.LANGUAGE || process.env.LC_ALL;
    
    if (envLang) {
      return normalizeLocale(envLang);
    }

    return 'en';
  }
}

/**
 * Normalize locale string
 * e.g., 'ko-KR' -> 'ko', 'en-US' -> 'en'
 */
function normalizeLocale(locale: string): Locale {
  if (!locale) return 'en';
  
  // Extract language part (before dash or underscore)
  const normalized = locale.split(/[-_]/)[0].toLowerCase();
  
  // Validate that it contains only letters
  if (!/^[a-z]{2,3}$/i.test(normalized)) {
    return 'en';
  }
  
  return normalized;
}

/**
 * Create appropriate locale detector based on environment
 */
export function createLocaleDetector(): LocaleDetector {
  if (typeof window !== 'undefined') {
    return new BrowserLocaleDetector();
  } else if (typeof process !== 'undefined') {
    return new NodeLocaleDetector();
  } else {
    // Fallback detector
    return {
      detect: () => 'en'
    };
  }
}

/**
 * Detect locale with caching
 */
let cachedLocale: Locale | null = null;

export function detectLocale(useCache = true): Locale {
  if (useCache && cachedLocale) {
    return cachedLocale;
  }

  const detector = createLocaleDetector();
  const locale = detector.detect();
  
  if (useCache) {
    cachedLocale = locale;
  }
  
  return locale;
}