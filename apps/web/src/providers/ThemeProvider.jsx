"use client";
import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({
  theme: "system",
  resolvedTheme: "dark",
  setTheme: () => {},
});

export function ThemeProvider({ children }) {
  // 'light' | 'dark' | 'system'
  const [theme, setThemeState] = useState("system");
  // The actual applied theme after resolving 'system'
  const [resolvedTheme, setResolvedTheme] = useState("dark");

  // On mount: read from localStorage (SSR-safe — runs client only)
  useEffect(() => {
    const stored = localStorage.getItem("theme") || "system";
    setThemeState(stored);
  }, []);

  // Whenever theme changes, apply class to <html> and persist
  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = (resolved) => {
      if (resolved === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
      setResolvedTheme(resolved);
    };

    if (theme === "system") {
      // Follow OS preference
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      applyTheme(mq.matches ? "dark" : "light");

      // Listen for OS changes
      const handler = (e) => applyTheme(e.matches ? "dark" : "light");
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    } else {
      applyTheme(theme);
    }
  }, [theme]);

  const setTheme = (newTheme) => {
    localStorage.setItem("theme", newTheme);
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
