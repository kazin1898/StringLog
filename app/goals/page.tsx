'use client';

import { useEffect } from 'react';
import { useGoals } from '@/hooks/useGoals';
import { useSessions } from '@/hooks/useSessions';
import { AddGoalDialog } from '@/components/goals/AddGoalDialog';
import { GoalCard } from '@/components/goals/GoalCard';
import { Card, CardContent } from '@/components/ui/card';
import { Target, Zap, Trophy } from 'lucide-react';

export default function GoalsPage() {
  const { goals, addGoal, deleteGoal, completeGoal, updateGoal } = useGoals();
  const { sessions } = useSessions();

  useEffect(() => {
    goals.forEach(goal => {
      const currentProgress = calculateGoalProgress(goal, sessions);
      if (currentProgress !== goal.progress) {
        updateGoal(goal.id, { progress: currentProgress });
      }
    });
  }, [sessions, goals, updateGoal]);

  const handleAddGoal = (goalData: { title: string; targetHours: number; period: 'daily' | 'weekly' | 'monthly' }) => {
    addGoal(goalData);
  };

  const activeGoals = goals.filter(g => !g.completedAt);
  const completedGoals = goals.filter(g => g.completedAt);

  return (
    <div className="container mx-auto max-w-[1200px] px-4 py-8">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[60px] font-extrabold tracking-tight">Goals & Insights</h1>
            <p className="text-muted-foreground mt-2">Track your practice goals and insights</p>
          </div>
          <AddGoalDialog onAdd={handleAddGoal} />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-md bg-sl-accent/15 p-2">
                  <Target className="h-5 w-5 text-sl-accent" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Goals</p>
                  <p className="text-2xl font-bold">{goals.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-md bg-sl-accent/15 p-2">
                  <Zap className="h-5 w-5 text-sl-accent" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Active Goals</p>
                  <p className="text-2xl font-bold">{activeGoals.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-md bg-sl-accent/15 p-2">
                  <Trophy className="h-5 w-5 text-sl-accent" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Completed Goals</p>
                  <p className="text-2xl font-bold">{completedGoals.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {activeGoals.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Active Goals</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {activeGoals.map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onDelete={deleteGoal}
                  onComplete={completeGoal}
                />
              ))}
            </div>
          </div>
        )}

        {completedGoals.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Completed Goals</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 opacity-70">
              {completedGoals.map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onDelete={deleteGoal}
                  onComplete={completeGoal}
                />
              ))}
            </div>
          </div>
        )}

        {goals.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No goals yet. Create your first practice goal!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function calculateGoalProgress(goal: { period: string; targetHours: number }, sessions: unknown[]): number {
  const now = new Date();
  let periodStart: Date;
  let periodEnd: Date;

  if (goal.period === 'daily') {
    periodStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    periodEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  } else if (goal.period === 'weekly') {
    const dayOfWeek = now.getDay();
    periodStart = new Date(now);
    periodStart.setDate(now.getDate() - dayOfWeek);
    periodStart.setHours(0, 0, 0, 0);
    periodEnd = new Date(periodStart);
    periodEnd.setDate(periodStart.getDate() + 7);
  } else {
    periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
    periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  }

  const periodSessions = sessions.filter((session) => {
    const sessionDate = new Date((session as { startTime: Date }).startTime);
    return sessionDate >= periodStart && sessionDate < periodEnd;
  });

  const actualHours = periodSessions.reduce((acc: number, session: unknown) => acc + (session as { duration: number }).duration, 0) / 3600;
  return Math.min((actualHours / goal.targetHours) * 100, 100);
}
