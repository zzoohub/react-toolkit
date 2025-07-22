import type { Theme } from "../types";

export const getCookie = (name: string) => {
  return document.cookie.split("; ").reduce((acc, cookie) => {
    const [key, value] = cookie.split("=");
    return key === name ? value : acc;
  }, "");
};

export const setCookie = (name: string, value: string) => {
  document.cookie = `${name}=${value}; path=/; max-age=${
    365 * 24 * 60 * 60
  }; SameSite=Strict`;
};

export const applyTheme = (theme: Theme) => {
  const html = document.documentElement;
  html.setAttribute("data-theme", theme);
};