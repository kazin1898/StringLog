'use client'

import { ThemeProvider } from 'next-themes'
import { useAccentColor } from '@/hooks/useAccentColor'

function AccentInit() {
  useAccentColor();
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <AccentInit />
      {children}
    </ThemeProvider>
  )
}
