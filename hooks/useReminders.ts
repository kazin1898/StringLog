'use client';

import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Reminder, STORAGE_KEYS } from '@/types';

export function useReminders() {
  const [reminders, setReminders, , isLoaded] = useLocalStorage<Reminder[]>(
    STORAGE_KEYS.REMINDERS,
    []
  );

  const addReminder = useCallback((reminder: Omit<Reminder, 'id' | 'createdAt'>) => {
    const newReminder: Reminder = {
      ...reminder,
      id: crypto.randomUUID(),
      createdAt: new Date()
    };
    setReminders(prev => [...prev, newReminder]);
    return newReminder;
  }, [setReminders]);

  const updateReminder = useCallback((id: string, updates: Partial<Reminder>) => {
    setReminders(prev => prev.map(reminder => 
      reminder.id === id ? { ...reminder, ...updates } : reminder
    ));
  }, [setReminders]);

  const deleteReminder = useCallback((id: string) => {
    setReminders(prev => prev.filter(reminder => reminder.id !== id));
  }, [setReminders]);

  const toggleReminder = useCallback((id: string) => {
    setReminders(prev => prev.map(reminder => 
      reminder.id === id ? { ...reminder, enabled: !reminder.enabled } : reminder
    ));
  }, [setReminders]);

  return {
    reminders,
    setReminders,
    addReminder,
    updateReminder,
    deleteReminder,
    toggleReminder,
    isLoaded
  };
}
