import { PracticeSession, WeeklyData } from '@/types';

export function calculateStreak(sessions: PracticeSession[]): number {
  if (sessions.length === 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const datesWithPractice = new Set<string>();
  sessions.forEach(session => {
    const date = new Date(session.startTime);
    date.setHours(0, 0, 0, 0);
    datesWithPractice.add(date.toISOString());
  });

  let streak = 0;
  const currentDate = new Date(today);

  while (true) {
    const dateStr = currentDate.toISOString();
    if (datesWithPractice.has(dateStr)) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      if (streak === 0) {
        currentDate.setDate(currentDate.getDate() - 1);
        if (currentDate.getTime() === today.getTime() - 86400000) continue;
      }
      break;
    }
  }

  return streak;
}

export function getWeeklyData(sessions: PracticeSession[], weeks: number = 8): WeeklyData[] {
  const weeklyData: WeeklyData[] = [];
  const today = new Date();
  
  for (let i = weeks - 1; i >= 0; i--) {
    const weekStartDate = new Date(today);
    weekStartDate.setDate(weekStartDate.getDate() - (i * 7));
    weekStartDate.setDate(weekStartDate.getDate() - weekStartDate.getDay());
    weekStartDate.setHours(0, 0, 0, 0);

    const weekEndDate = new Date(weekStartDate);
    weekEndDate.setDate(weekEndDate.getDate() + 6);
    weekEndDate.setHours(23, 59, 59, 999);

    const weekSessions = sessions.filter(session => {
      const sessionDate = new Date(session.startTime);
      return sessionDate >= weekStartDate && sessionDate <= weekEndDate;
    });

    const totalHours = weekSessions.reduce((acc, session) => acc + session.duration, 0) / 3600;

    weeklyData.push({
      weekStartDate,
      totalHours: Math.round(totalHours * 100) / 100
    });
  }

  return weeklyData;
}

export function isThisWeek(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const weekStart = new Date(today);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  return date >= weekStart && date <= weekEnd;
}

export function isLastWeek(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastWeekStart = new Date(today);
  lastWeekStart.setDate(lastWeekStart.getDate() - lastWeekStart.getDay() - 7);

  const lastWeekEnd = new Date(lastWeekStart);
  lastWeekEnd.setDate(lastWeekEnd.getDate() + 6);
  lastWeekEnd.setHours(23, 59, 59, 999);

  return date >= lastWeekStart && date <= lastWeekEnd;
}
