'use client';

import { Clock, TrendingUp, TrendingDown, Flame } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StatsCardsProps {
  totalLifetimeHours: number;
  currentWeekHours: number;
  lastWeekHours: number;
  streakDays: number;
}

export function StatsCards({
  totalLifetimeHours,
  currentWeekHours,
  lastWeekHours,
  streakDays
}: StatsCardsProps) {
  const weekDifference = currentWeekHours - lastWeekHours;
  const isUp = weekDifference >= 0;

  return (
    <div className="grid gap-3 grid-cols-3">
      <Card className="relative overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-sl-accent/15 p-2.5">
              <Clock className="size-5 text-sl-accent" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground truncate">Total Hours</p>
              <p className="text-2xl font-bold leading-tight">
                {totalLifetimeHours.toFixed(1)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg p-2.5 bg-sl-accent/15">
              {isUp
                ? <TrendingUp className="size-5 text-sl-accent" />
                : <TrendingDown className="size-5 text-sl-accent" />
              }
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground truncate">This Week</p>
              <p className="text-2xl font-bold leading-tight">
                {currentWeekHours.toFixed(1)}
              </p>
              <p className="text-xs leading-tight text-sl-accent">
                {isUp && weekDifference > 0 ? '+' : ''}
                {weekDifference.toFixed(1)}h
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className={`rounded-lg p-2.5 ${streakDays >= 7 ? 'bg-orange-500/15' : 'bg-sl-accent/15'}`}>
              <Flame className={`size-5 ${streakDays >= 7 ? 'text-orange-500' : 'text-sl-accent'}`} />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground truncate">Streak</p>
              <p className="text-2xl font-bold leading-tight">
                {streakDays}
              </p>
              <p className="text-xs text-muted-foreground leading-tight">days</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
