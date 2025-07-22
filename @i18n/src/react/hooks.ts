import { useState, useCallback, useMemo } from 'react';
import type { Locale, Translation, Variables, TranslationOptions } from '../types';
import { createTranslator } from '../core/translator';

/**
 * React hook for translation with reactive locale changes
 */
export function useTranslation(options?: TranslationOptions) {
  // Create translator instance (memoized)
  const translator = useMemo(() => createTranslator(options), [options]);
  
  // Reactive locale state
  const [locale, setLocaleState] = useState<Locale>(translator.getLocale());

  // Wrapped setLocale that updates both translator and React state
  const setLocale = useCallback((newLocale: Locale) => {
    translator.setLocale(newLocale);
    setLocaleState(newLocale);
  }, [translator]);

  // Auto-detect locale
  const detectLocale = useCallback(() => {
    const detected = translator.detectLocale();
    setLocale(detected);
    return detected;
  }, [translator, setLocale]);

  // Translation function with reactive updates
  const t = useCallback((translation: Translation, variables?: Variables) => {
    return translator.t(translation, variables);
  }, [translator, locale]); // Re-create when locale changes

  return {
    t,
    locale,
    setLocale,
    detectLocale,
    translator
  };
}

/**
 * Lightweight hook for translation without locale reactivity
 * Better performance for components that don't need to re-render on locale change
 */
export function useTranslationStatic(options?: TranslationOptions) {
  const translator = useMemo(() => createTranslator(options), [options]);
  
  const t = useCallback((translation: Translation, variables?: Variables) => {
    return translator.t(translation, variables);
  }, [translator]);

  const setLocale = useCallback((newLocale: Locale) => {
    translator.setLocale(newLocale);
  }, [translator]);

  const detectLocale = useCallback(() => {
    return translator.detectLocale();
  }, [translator]);

  return {
    t,
    locale: translator.getLocale(),
    setLocale,
    detectLocale,
    translator
  };
}

/**
 * Hook for locale management only
 */
export function useLocale(options?: TranslationOptions) {
  const translator = useMemo(() => createTranslator(options), [options]);
  const [locale, setLocaleState] = useState<Locale>(translator.getLocale());

  const setLocale = useCallback((newLocale: Locale) => {
    translator.setLocale(newLocale);
    setLocaleState(newLocale);
  }, [translator]);

  const detectLocale = useCallback(() => {
    const detected = translator.detectLocale();
    setLocale(detected);
    return detected;
  }, [translator, setLocale]);

  return {
    locale,
    setLocale,
    detectLocale
  };
}