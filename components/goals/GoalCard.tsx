'use client';

import { PracticeGoal } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Check, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GoalCardProps {
  goal: PracticeGoal;
  onDelete: (id: string) => void;
  onComplete: (id: string) => void;
}

export function GoalCard({ goal, onDelete, onComplete }: GoalCardProps) {
  const isCompleted = goal.progress >= 100 || !!goal.completedAt;

  return (
    <Card className={isCompleted ? 'opacity-70' : ''}>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className={cn('text-base font-semibold', isCompleted && 'line-through')}>
              {goal.title}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {goal.targetHours}h / {goal.period}
            </p>
          </div>
          {isCompleted && (
            <div className="text-sl-accent">
              <Check className="h-5 w-5" />
            </div>
          )}
        </div>

        <Progress value={goal.progress} className="h-2" indicatorClassName="bg-sl-accent" />

        <div className="flex justify-between items-center">
          <span className={cn('text-sm', goal.progress > 0 ? 'text-sl-accent' : 'text-muted-foreground')}>
            {goal.progress.toFixed(0)}% complete
          </span>
          <div className="flex gap-2">
            {!isCompleted && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onComplete(goal.id)}
                className="text-sl-accent hover:text-sl-accent"
              >
                <Check className="h-4 w-4 mr-1" />
                Complete
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(goal.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
