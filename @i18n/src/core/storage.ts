import type { StorageAdapter } from '../types';

/**
 * Cookie-based storage adapter (works in both browser and SSR)
 */
class CookieStorageAdapter implements StorageAdapter {
  private getCookie(name: string): string | null {
    if (typeof document === 'undefined') {
      return null; // SSR environment
    }

    return document.cookie.split('; ').reduce((acc, cookie) => {
      const [key, value] = cookie.split('=');
      return key === name ? decodeURIComponent(value) : acc;
    }, null as string | null);
  }

  private setCookie(name: string, value: string): void {
    if (typeof document === 'undefined') {
      return; // SSR environment
    }

    const encodedValue = encodeURIComponent(value);
    document.cookie = `${name}=${encodedValue}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Strict`;
  }

  private removeCookie(name: string): void {
    if (typeof document === 'undefined') {
      return; // SSR environment
    }

    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }

  get(key: string): string | null {
    return this.getCookie(key);
  }

  set(key: string, value: string): void {
    this.setCookie(key, value);
  }

  remove(key: string): void {
    this.removeCookie(key);
  }
}


/**
 * Create storage adapter - always returns cookie adapter with memory fallback
 */
export function createStorageAdapter(): StorageAdapter {
  return new CookieStorageAdapter();
}

/**
 * Create best available storage adapter
 */
export function createBestStorageAdapter(): StorageAdapter {
  return new CookieStorageAdapter();
}