import "./index.css";
import { ThemeProvider, useTheme } from "../@theme/src";

function Demo() {
  const { theme, setTheme } = useTheme();
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <p>
        Current theme: <strong>{theme}</strong>
      </p>
      <div style={{ gap: "1rem", display: "flex", justifyContent: "center" }}>
        <button onClick={() => setTheme("light")}>☀️ Light</button>
        <button onClick={() => setTheme("dark")}>🌙 Dark</button>
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
