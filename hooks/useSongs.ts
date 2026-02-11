'use client';

import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Song, STORAGE_KEYS } from '@/types';

export function useSongs() {
  const [songs, setSongs, , isLoaded] = useLocalStorage<Song[]>(
    STORAGE_KEYS.SONGS,
    []
  );

  const addSong = useCallback((song: Omit<Song, 'id' | 'createdAt' | 'totalPracticeTime'>) => {
    const newSong: Song = {
      ...song,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      totalPracticeTime: 0
    };
    setSongs(prev => [newSong, ...prev]);
    return newSong;
  }, [setSongs]);

  const updateSong = useCallback((id: string, updates: Partial<Song>) => {
    setSongs(prev => prev.map(song => 
      song.id === id ? { ...song, ...updates } : song
    ));
  }, [setSongs]);

  const deleteSong = useCallback((id: string) => {
    setSongs(prev => prev.filter(song => song.id !== id));
  }, [setSongs]);

  const getSongById = useCallback((id: string) => {
    return songs.find(song => song.id === id);
  }, [songs]);

  const updateSongPracticeTime = useCallback((id: string, additionalTime: number) => {
    setSongs(prev => prev.map(song => 
      song.id === id 
        ? { ...song, totalPracticeTime: song.totalPracticeTime + additionalTime, lastPracticedAt: new Date() }
        : song
    ));
  }, [setSongs]);

  const getSongStats = useCallback(() => {
    const mastered = songs.filter(s => s.status === 'mastered').length;
    const learning = songs.filter(s => s.status === 'learning').length;
    const wishlist = songs.filter(s => s.status === 'wishlist').length;
    return { mastered, learning, wishlist, total: songs.length };
  }, [songs]);

  return {
    songs,
    setSongs,
    addSong,
    updateSong,
    deleteSong,
    getSongById,
    updateSongPracticeTime,
    getSongStats,
    isLoaded
  };
}
