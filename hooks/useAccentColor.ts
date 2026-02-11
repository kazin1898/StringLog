'use client';

import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { DEFAULT_ACCENT, applyAccent } from '@/lib/accent-colors';

export function useAccentColor() {
  const [accentId, setAccentId] = useLocalStorage<string>('stringlog_preferences', DEFAULT_ACCENT);

  useEffect(() => {
    applyAccent(accentId);
  }, [accentId]);

  return { accentId, setAccentId };
}
