import "./index.css";
import { ThemeProvider, useTheme } from "@theme";
import { useTranslation } from "@i18n/react";

function Demo() {
  const { theme, setTheme } = useTheme();
  const { t, locale, setLocale } = useTranslation();

  const translations = {
    title: {
      ko: "React 툴킷 데모",
      en: "React Toolkit Demo",
      ja: "React ツールキットデモ",
      fr: "Démo de la boîte à outils React"
    },
    currentTheme: {
      ko: "현재 테마",
      en: "Current theme",
      ja: "現在のテーマ",
      fr: "Thème actuel"
    },
    currentLanguage: {
      ko: "현재 언어",
      en: "Current language", 
      ja: "現在の言語",
      fr: "Langue actuelle"
    },
    lightButton: {
      ko: "☀️ 라이트",
      en: "☀️ Light",
      ja: "☀️ ライト",
      fr: "☀️ Clair"
    },
    darkButton: {
      ko: "🌙 다크",
      en: "🌙 Dark", 
      ja: "🌙ダーク",
      fr: "🌙 Sombre"
    },
    greeting: {
      ko: "안녕하세요, {{name}}님!",
      en: "Hello, {{name}}!",
      ja: "こんにちは、{{name}}さん！",
      fr: "Bonjour, {{name}} !"
    },
    features: {
      ko: "이 데모는 {{themeCount}}개의 테마와 {{langCount}}개의 언어를 지원합니다.",
      en: "This demo supports {{themeCount}} themes and {{langCount}} languages.",
      ja: "このデモは{{themeCount}}つのテーマと{{langCount}}つの言語をサポートしています。",
      fr: "Cette démo prend en charge {{themeCount}} thèmes et {{langCount}} langues."
    }
  };

  return (
    <div style={{ padding: "2rem", textAlign: "center", maxWidth: "600px", margin: "0 auto" }}>
      <h1>{t(translations.title)}</h1>
      
      <div style={{ marginBottom: "2rem" }}>
        <p>{t(translations.greeting, { name: "Developer" })}</p>
        <p>{t(translations.features, { themeCount: 2, langCount: 4 })}</p>
      </div>

      <div style={{ marginBottom: "2rem", padding: "1rem", border: "1px solid #ddd", borderRadius: "8px" }}>
        <p>
          {t(translations.currentTheme)}: <strong>{theme}</strong>
        </p>
        <div style={{ gap: "1rem", display: "flex", justifyContent: "center", marginTop: "1rem" }}>
          <button onClick={() => setTheme("light")}>{t(translations.lightButton)}</button>
          <button onClick={() => setTheme("dark")}>{t(translations.darkButton)}</button>
        </div>
      </div>

      <div style={{ padding: "1rem", border: "1px solid #ddd", borderRadius: "8px" }}>
        <p>
          {t(translations.currentLanguage)}: <strong>{locale}</strong>
        </p>
        <div style={{ gap: "0.5rem", display: "flex", justifyContent: "center", flexWrap: "wrap", marginTop: "1rem" }}>
          <button onClick={() => setLocale("ko")}>🇰🇷 한국어</button>
          <button onClick={() => setLocale("en")}>🇺🇸 English</button>
          <button onClick={() => setLocale("ja")}>🇯🇵 日本語</button>
          <button onClick={() => setLocale("fr")}>🇫🇷 Français</button>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Demo />
    </ThemeProvider>
  );
}

export default App;
