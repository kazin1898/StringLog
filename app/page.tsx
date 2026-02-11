'use client';

import { useStats } from '@/hooks/useStats';
import { useSessions } from '@/hooks/useSessions';
import { useSongs } from '@/hooks/useSongs';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { RecentSessions } from '@/components/dashboard/RecentSessions';
import { PracticeGraph } from '@/components/dashboard/PracticeGraph';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { AnimatedCard } from '@/components/AnimatedCard';
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton';

export default function DashboardPage() {
  const { stats, weeklyData, lastWeekHours, isLoaded: statsLoaded } = useStats();
  const { sessions, isLoaded: sessionsLoaded } = useSessions();
  const { songs, isLoaded: songsLoaded } = useSongs();

  const allLoaded = statsLoaded && sessionsLoaded && songsLoaded;

  if (!allLoaded) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="container mx-auto max-w-[1200px] px-4 py-8">
      <div className="space-y-6">
        <AnimatedCard>
          <div className="flex items-end justify-between gap-4">
            <div>
              <h1 className="text-[60px] font-extrabold tracking-tight leading-none">Dashboard</h1>
              <p className="text-muted-foreground mt-2">Track your musical journey</p>
            </div>
            <QuickActions />
          </div>
        </AnimatedCard>

        <AnimatedCard delay={0.1}>
          <StatsCards
            totalLifetimeHours={stats.totalLifetimeHours}
            currentWeekHours={stats.currentWeekHours}
            lastWeekHours={lastWeekHours}
            streakDays={stats.streakDays}
          />
        </AnimatedCard>

        <div className="grid gap-6 md:grid-cols-[1fr_340px]">
          <AnimatedCard delay={0.2}>
            <PracticeGraph weeklyData={weeklyData} />
          </AnimatedCard>

          <AnimatedCard delay={0.3}>
            <RecentSessions sessions={sessions} songs={songs} />
          </AnimatedCard>
        </div>
      </div>
    </div>
  );
}
