export type Theme = "light" | "dark";
export type ThemeContextType = {
  theme: Theme | undefined;
  setTheme: (theme: Theme) => void;
};
export type ThemeProviderProps = {
  theme?: Theme;
  children: React.ReactNode;
};
export type ReadonlyRequestCookies = {
  get: (name: string) => { value: string; name: string } | undefined;
};
