'use client';

import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { PracticeSession, STORAGE_KEYS } from '@/types';

export function useSessions() {
  const [sessions, setSessions, , isLoaded] = useLocalStorage<PracticeSession[]>(
    STORAGE_KEYS.SESSIONS,
    []
  );

  const addSession = useCallback((session: Omit<PracticeSession, 'id' | 'createdAt'>) => {
    const newSession: PracticeSession = {
      ...session,
      id: crypto.randomUUID(),
      createdAt: new Date()
    };
    setSessions(prev => [newSession, ...prev]);
    return newSession;
  }, [setSessions]);

  const updateSession = useCallback((id: string, updates: Partial<PracticeSession>) => {
    setSessions(prev => prev.map(session => 
      session.id === id ? { ...session, ...updates } : session
    ));
  }, [setSessions]);

  const deleteSession = useCallback((id: string) => {
    setSessions(prev => prev.filter(session => session.id !== id));
  }, [setSessions]);

  const getSessionById = useCallback((id: string) => {
    return sessions.find(session => session.id === id);
  }, [sessions]);

  const getSessionsBySongId = useCallback((songId: string) => {
    return sessions.filter(session => session.songId === songId);
  }, [sessions]);

  return {
    sessions,
    setSessions,
    addSession,
    updateSession,
    deleteSession,
    getSessionById,
    getSessionsBySongId,
    isLoaded
  };
}
