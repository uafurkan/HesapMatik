"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl border border-transparent"></div>;

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl glass-card flex items-center justify-center overflow-hidden hover:scale-105 active:scale-95 transition-transform duration-300 hover:border-amber-500/50 shadow-sm z-50 group"
      aria-label="Tema Değiştir"
    >
      <Sun
        size={20}
        strokeWidth={2}
        className={`absolute text-amber-500 drop-shadow-[0_0_6px_rgba(255,179,71,0.5)] transition-all duration-500 ease-out ${
          isDark ? "opacity-0 -rotate-90 scale-50" : "opacity-100 rotate-0 scale-100"
        }`}
      />
      <Moon
        size={20}
        strokeWidth={2}
        className={`absolute text-blue-400 drop-shadow-[0_0_6px_rgba(77,139,255,0.5)] transition-all duration-500 ease-out ${
          isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-90 scale-50"
        }`}
      />
    </button>
  );
}
