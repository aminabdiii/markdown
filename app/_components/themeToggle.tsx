'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [toggling, setToggling] = useState(false); // برای انیمیشن دکمه

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const toggleTheme = (e: React.MouseEvent<HTMLButtonElement>) => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';

    setToggling(true);
    if (!document.startViewTransition) {
      setTheme(newTheme);
      setTimeout(() => setToggling(false), 300);
      return;
    }

    const x = e.clientX;
    const y = e.clientY;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = document.startViewTransition(() => {
      setTheme(newTheme);
    });

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ];

      document.documentElement.animate(
        {
          clipPath: clipPath,
        },
        {
          duration: 500,
          easing: 'ease-in-out',
          pseudoElement: '::view-transition-new(root)',
        }
      );
    });

    setTimeout(() => setToggling(false), 300);
  };

  if (!mounted) return null;

  return (
    <button
      onClick={toggleTheme}
      className={`
        w-10 h-10 flex items-center justify-center fixed top-4 right-4 cursor-pointer rounded-full dark:bg-gray-200
        bg-gray-900
        transition-colors
        ${toggling ? 'animate-toggle' : ''}
      `}>
      {theme === 'dark' ? '🌙' : '☀️'}
    </button>
  );
}
