'use client';

import { ThemeProvider } from 'next-themes';
import path from 'path';
import { useEffect, useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <>{children}</>;
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

console.log(process.cwd());
