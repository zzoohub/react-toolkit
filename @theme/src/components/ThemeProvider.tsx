"use client";

import { useState, useEffect } from "react";
import type { Theme, ThemeProviderProps } from "../types";
import { getCookie, setCookie, applyTheme } from "../utils/cookies";
import { ThemeContext } from "../context/ThemeContext";

export function ThemeProvider({
  theme: initialTheme,
  children,
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme | undefined>(initialTheme);

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

