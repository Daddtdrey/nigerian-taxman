import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { cn } from '../lib/utils';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    // Check local storage or system preference on init
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved as 'light' | 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggle = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  return (
    <button
      onClick={toggle}
      className={cn(
        "relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-nigeria-green focus:ring-offset-2",
        theme === 'dark' ? "bg-neutral-700" : "bg-neutral-200"
      )}
      aria-label="Toggle Dark Mode"
    >
      <span
        className={cn(
          "inline-block h-6 w-6 transform rounded-full bg-white transition-transform flex items-center justify-center shadow-sm",
          theme === 'dark' ? "translate-x-7" : "translate-x-1"
        )}
      >
        {theme === 'dark' ? (
          <Moon className="h-3 w-3 text-neutral-700" />
        ) : (
          <Sun className="h-3 w-3 text-amber-500" />
        )}
      </span>
    </button>
  );
}
