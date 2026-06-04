"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="w-9 h-9 rounded-xl border border-transparent"></div>;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="w-9 h-9 rounded-xl glass-card flex items-center justify-center hover:scale-105 transition-transform duration-300 text-lg hover:border-amber-500/50 shadow-sm z-50 text-gray-800 dark:text-white"
      aria-label="Tema Değiştir"
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
