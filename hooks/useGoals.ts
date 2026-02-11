'use client';

import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { PracticeGoal, STORAGE_KEYS } from '@/types';

export function useGoals() {
  const [goals, setGoals, , isLoaded] = useLocalStorage<PracticeGoal[]>(
    STORAGE_KEYS.GOALS,
    []
  );

  const addGoal = useCallback((goal: Omit<PracticeGoal, 'id' | 'createdAt' | 'progress'>) => {
    const newGoal: PracticeGoal = {
      ...goal,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      progress: 0
    };
    setGoals(prev => [...prev, newGoal]);
    return newGoal;
  }, [setGoals]);

  const updateGoal = useCallback((id: string, updates: Partial<PracticeGoal>) => {
    setGoals(prev => prev.map(goal => 
      goal.id === id ? { ...goal, ...updates } : goal
    ));
  }, [setGoals]);

  const deleteGoal = useCallback((id: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== id));
  }, [setGoals]);

  const completeGoal = useCallback((id: string) => {
    updateGoal(id, {
      progress: 100,
      completedAt: new Date()
    });
  }, [updateGoal]);

  return {
    goals,
    setGoals,
    addGoal,
    updateGoal,
    deleteGoal,
    completeGoal,
    isLoaded
  };
}
