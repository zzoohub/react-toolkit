"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { Theme, ThemeContextType, ThemeProviderProps } from "./type";

const getCookie = (name: string) => {
  return document.cookie.split("; ").reduce((acc, cookie) => {
    const [key, value] = cookie.split("=");
    return key === name ? value : acc;
  }, "");
};

const setCookie = (name: string, value: string) => {
  document.cookie = `${name}=${value}; path=/; max-age=${
    365 * 24 * 60 * 60
  }; SameSite=Strict`;
};

const applyTheme = (theme: Theme) => {
  const html = document.documentElement;
  html.setAttribute("data-theme", theme);
};

const ThemeContext = createContext<ThemeContextType>({
  theme: undefined,
  setTheme: () => {},
});

export function ThemeProvider({
  theme: initialTheme,
  children,
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme | undefined>(initialTheme);

  // Apply initial theme on client
  useEffect(() => {
    if (theme) {
      applyTheme(theme);
    } else {
      const cookieTheme = getCookie("theme");
      if (cookieTheme) {
        const themeValue = cookieTheme as Theme;
        setTheme(themeValue);
        applyTheme(themeValue);
      }
    }
  }, [theme]);

  const updateTheme = (newTheme: Theme | ((prevTheme: Theme) => Theme)) => {
    if (typeof newTheme === "function") {
      const computed = newTheme(theme as Theme);
      setTheme(computed);
      setCookie("theme", computed);
      applyTheme(computed);
    } else {
      setTheme(newTheme);
      setCookie("theme", newTheme);
      applyTheme(newTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
