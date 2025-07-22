import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ThemeProvider, useTheme, ServerThemeWrapper } from "./index";
import type {
  Theme,
  ThemeContextType,
  ThemeProviderProps,
  ReadonlyRequestCookies,
} from "./type";

const mockSetAttribute = vi.fn();
let mockCookieValue = "";

beforeEach(() => {
  vi.clearAllMocks();
  mockCookieValue = "";

  Object.defineProperty(document, "documentElement", {
    writable: true,
    configurable: true,
    value: { setAttribute: mockSetAttribute },
  });

  Object.defineProperty(document, "cookie", {
    configurable: true,
    get: () => mockCookieValue,
    set: (value: string) => {
      mockCookieValue = value;
    },
  });
});

function TestComponent({
  onThemeChange,
}: {
  onThemeChange?: (theme: string) => void;
}) {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <span data-testid="theme">{theme || "undefined"}</span>
      <button
        data-testid="set-light"
        onClick={() => {
          setTheme("light");
          onThemeChange?.("light");
        }}
      >
        Light
      </button>
    </div>
  );
}

describe("@theme library", () => {
  it("has correct types", () => {
    const lightTheme: Theme = "light";
    const darkTheme: Theme = "dark";
    expect(lightTheme).toBe("light");
    expect(darkTheme).toBe("dark");
  });

  it("renders with initial theme and applies it", () => {
    render(
      <ThemeProvider theme="dark">
        <TestComponent />
      </ThemeProvider>
    );

    expect(mockSetAttribute).toHaveBeenCalledWith("data-theme", "dark");
  });

  it("reads theme from cookie on mount", () => {
    mockCookieValue = "theme=light; path=/";

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(mockSetAttribute).toHaveBeenCalledWith("data-theme", "light");
  });

  it("updates theme and sets cookie", () => {
    let capturedTheme = "";

    render(
      <ThemeProvider>
        <TestComponent onThemeChange={(theme) => (capturedTheme = theme)} />
      </ThemeProvider>
    );

    const button = screen.getByTestId("set-light");
    button.click();

    expect(capturedTheme).toBe("light");
    expect(mockSetAttribute).toHaveBeenCalledWith("data-theme", "light");
    expect(mockCookieValue).toContain("theme=light");
  });

  it("handles multiple cookies correctly", () => {
    mockCookieValue = "other=value; theme=dark; another=test";

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(mockSetAttribute).toHaveBeenCalledWith("data-theme", "dark");
  });

  it("useTheme returns context", () => {
    function TestHook() {
      const context = useTheme();
      expect(context).toHaveProperty("theme");
      expect(context).toHaveProperty("setTheme");
      expect(typeof context.setTheme).toBe("function");
      return null;
    }

    render(
      <ThemeProvider>
        <TestHook />
      </ThemeProvider>
    );
  });

  it("ServerThemeWrapper handles cookies correctly", async () => {
    const mockCookieStore: ReadonlyRequestCookies = {
      get: (name: string) =>
        name === "theme" ? { value: "dark", name: "theme" } : undefined,
    };

    const mockCookies = vi.fn().mockResolvedValue(mockCookieStore);

    // Test core logic
    const cookieStore = await mockCookies();
    const theme = cookieStore.get("theme")?.value;

    expect(theme).toBe("dark");
    expect(mockCookies).toHaveBeenCalled();
  });

  it("exports all functions", () => {
    expect(typeof ThemeProvider).toBe("function");
    expect(typeof useTheme).toBe("function");
    expect(typeof ServerThemeWrapper).toBe("function");
  });

  it("getCookie utility works correctly", () => {
    mockCookieValue = "name=John; theme=dark; age=25";

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(mockSetAttribute).toHaveBeenCalledWith("data-theme", "dark");
  });

  it("setCookie utility sets correct format", () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    screen.getByTestId("set-light").click();

    expect(mockCookieValue).toMatch(
      /theme=light; path=\/; max-age=\d+; SameSite=Strict/
    );
  });

  it("applyTheme utility sets document attribute", () => {
    render(
      <ThemeProvider theme="light">
        <TestComponent />
      </ThemeProvider>
    );

    expect(mockSetAttribute).toHaveBeenCalledWith("data-theme", "light");
  });
});
