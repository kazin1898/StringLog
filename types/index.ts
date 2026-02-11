export interface PracticeSession {
  id: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  notes?: string;
  songId?: string;
  instrumentType?: 'guitar' | 'bass' | 'violin' | 'cello' | 'ukulele' | 'other';
  createdAt: Date;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  albumArt?: string;
  spotifyId?: string;
  spotifyUrl?: string;
  status: 'mastered' | 'learning' | 'wishlist';
  totalPracticeTime: number;
  difficulty?: 1 | 2 | 3 | 4 | 5;
  notes?: string;
  createdAt: Date;
  lastPracticedAt?: Date;
}

export interface UserStats {
  totalLifetimeHours: number;
  currentWeekHours: number;
  streakDays: number;
  lastPracticeDate?: Date;
  totalSessions: number;
}

export interface WeeklyData {
  weekStartDate: Date;
  totalHours: number;
}

export interface TimerState {
  isRunning: boolean;
  isPaused: boolean;
  elapsedSeconds: number;
  startTime: Date | null;
  currentSession: Partial<PracticeSession>;
}

export const STORAGE_KEYS = {
  SESSIONS: 'stringlog_sessions',
  SONGS: 'stringlog_songs',
  USER_PREFERENCES: 'stringlog_preferences',
  GOALS: 'stringlog_goals',
  REMINDERS: 'stringlog_reminders'
} as const;

export interface PracticeGoal {
  id: string;
  title: string;
  targetHours: number;
  period: 'daily' | 'weekly' | 'monthly';
  progress: number;
  createdAt: Date;
  completedAt?: Date;
}

export interface Reminder {
  id: string;
  title: string;
  time: string;
  days: number[];
  enabled: boolean;
  createdAt: Date;
}
