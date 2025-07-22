import "./index.css";
import { ThemeProvider, useTheme } from "../@theme/src";

function Demo() {
  const { theme, setTheme } = useTheme();
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>🌍 Universal Theme Provider</h1>
      <p>
        Current theme: <strong>{theme}</strong>
      </p>
      <p style={{ fontSize: "0.9rem", opacity: 0.7 }}>
        Works in Next.js, Vite, and any React environment!
      </p>
      <div style={{ gap: "1rem", display: "flex", justifyContent: "center" }}>
        <button onClick={() => setTheme("light")}>☀️ Light</button>
        <button onClick={() => setTheme("dark")}>🌙 Dark</button>
      </div>
      <div
        style={{
          marginTop: "2rem",
          padding: "1rem",
          border: "1px solid",
          borderRadius: "8px",
        }}
      >
        <h2>Sample Content</h2>
        <p>This content adapts to the selected theme.</p>
        <p style={{ fontSize: "0.8rem", fontFamily: "monospace" }}>
          Runtime: {typeof window === "undefined" ? "Next.js Server" : "Client"}
        </p>
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
