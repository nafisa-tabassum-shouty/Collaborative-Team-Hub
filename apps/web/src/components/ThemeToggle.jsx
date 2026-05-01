"use client";
import { useTheme } from "@/providers/ThemeProvider";
import { Sun, Moon, Monitor } from "lucide-react";

const THEME_OPTIONS = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark",  label: "Dark",  icon: Moon },
  { value: "system",label: "System",icon: Monitor },
];


export default function ThemeToggle({ compact = false }) {
  const { theme, setTheme } = useTheme();

  if (compact) {
    const isDark = theme === "dark" || (theme === "system" && typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    return (
  return (
    <div className="flex p-1 bg-bg-secondary/50 backdrop-blur-sm border border-border-color rounded-xl w-full">
      {THEME_OPTIONS.map((option) => {
        const Icon = option.icon;
        const isActive = theme === option.value;
        return (
          <button
            key={option.value}
            onClick={() => setTheme(option.value)}
            className={`
              flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-300
              ${isActive 
                ? "bg-white dark:bg-gray-800 text-accent shadow-sm ring-1 ring-black/5 dark:ring-white/10" 
                : "text-text-muted hover:text-text-primary hover:bg-white/40 dark:hover:bg-gray-800/40"
              }
            `}
            title={option.label}
          >
            <Icon className={`w-3.5 h-3.5 ${isActive ? "text-accent" : "text-text-muted"}`} />
            {!compact && <span>{option.label}</span>}
          </button>
        );
      })}
    </div>
  );
}
