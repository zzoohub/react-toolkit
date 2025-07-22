/**
 * React-specific exports for i18n library
 * 
 * Import from 'zzoo-i18n/react' to get React-specific hooks
 */

export { useTranslation, useTranslationStatic, useLocale } from './hooks';

// Re-export core types for convenience
export type { 
  Locale, 
  Translation, 
  Variables, 
  TranslationOptions,
  Translator,
  TranslateFunction
} from '../types';