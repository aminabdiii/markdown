"use client";

import { ThemeProvider } from "next-themes";
import { useEffect, useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const mq = window.matchMedia("(prefers-color-scheme: dark)");

    const theme = localStorage.getItem("theme");
    if (!theme) {
      localStorage.setItem("theme", mq.matches ? "dark" : "light");
    }
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <ThemeProvider
      disableTransitionOnChange
      attribute="class"
      enableSystem
      defaultTheme="system">
      {children}
    </ThemeProvider>
  );
}
