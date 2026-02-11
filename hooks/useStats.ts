'use client';

import { useMemo } from 'react';
import { useSessions } from './useSessions';
import { UserStats } from '@/types';
import { calculateStreak, getWeeklyData, isThisWeek, isLastWeek } from '@/utils/stats';

export function useStats() {
  const { sessions, isLoaded } = useSessions();

  const stats = useMemo<UserStats>(() => {
    if (!isLoaded || sessions.length === 0) {
      return {
        totalLifetimeHours: 0,
        currentWeekHours: 0,
        streakDays: 0,
        lastPracticeDate: undefined,
        totalSessions: 0
      };
    }

    const totalLifetimeHours = sessions.reduce((acc, session) => acc + session.duration, 0) / 3600;

    const thisWeekSessions = sessions.filter(session => isThisWeek(session.startTime));
    const currentWeekHours = thisWeekSessions.reduce((acc, session) => acc + session.duration, 0) / 3600;

    const streakDays = calculateStreak(sessions);

    const sortedByDate = [...sessions].sort((a, b) => 
      new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    );
    const lastPracticeDate = new Date(sortedByDate[0].startTime);

    return {
      totalLifetimeHours: Math.round(totalLifetimeHours * 100) / 100,
      currentWeekHours: Math.round(currentWeekHours * 100) / 100,
      streakDays,
      lastPracticeDate,
      totalSessions: sessions.length
    };
  }, [sessions, isLoaded]);

  const weeklyData = useMemo(() => {
    return getWeeklyData(sessions, 8);
  }, [sessions]);

  const lastWeekHours = useMemo(() => {
    const lastWeekSessions = sessions.filter(session => isLastWeek(session.startTime));
    return Math.round((lastWeekSessions.reduce((acc, session) => acc + session.duration, 0) / 3600) * 100) / 100;
  }, [sessions]);

  return {
    stats,
    weeklyData,
    lastWeekHours,
    isLoaded
  };
}
