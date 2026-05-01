"use client";
import { useTheme } from "@/providers/ThemeProvider";

const THEME_OPTIONS = [
  { value: "light", label: "Light", icon: "☀️" },
  { value: "dark",  label: "Dark",  icon: "🌙" },
  { value: "system",label: "System",icon: "💻" },
];

export default function ThemeToggle({ compact = false }) {
  const { theme, setTheme } = useTheme();

  if (compact) {
    // Simple icon-only toggle between dark/light
    const isDark = theme === "dark" || (theme === "system" && typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    return (
      <button
        onClick={() => setTheme(isDark ? "light" : "dark")}
        title="Toggle theme"
        className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="Toggle dark mode"
      >
        {isDark ? "☀️" : "🌙"}
      </button>
    );
  }

  // Full 3-way selector
  return (
    <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
      {THEME_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => setTheme(opt.value)}
          title={opt.label}
          aria-label={`Switch to ${opt.label} theme`}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
            theme === opt.value
              ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          }`}
        >
          <span>{opt.icon}</span>
          <span>{opt.label}</span>
        </button>
      ))}
    </div>
  );
}
