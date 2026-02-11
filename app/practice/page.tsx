'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTimer } from '@/hooks/useTimer';
import { useSessions } from '@/hooks/useSessions';
import { useSongs } from '@/hooks/useSongs';
import { TimerDisplay } from '@/components/practice/TimerDisplay';
import { TimerControls } from '@/components/practice/TimerControls';
import { SessionForm } from '@/components/practice/SessionForm';
import { Metronome } from '@/components/practice/Metronome';
import { AnimatedCard } from '@/components/AnimatedCard';
import { Card, CardContent } from '@/components/ui/card';

export default function PracticePage() {
  const router = useRouter();
  const { seconds, isRunning, isPaused, startTime, start, pause, resume, stop, reset } = useTimer();
  const { addSession } = useSessions();
  const { songs, updateSongPracticeTime } = useSongs();

  const [selectedSongId, setSelectedSongId] = useState<string>();
  const [notes, setNotes] = useState('');
  const [selectedInstrument, setSelectedInstrument] = useState('guitar');

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isRunning) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isRunning]);

  const handleStop = () => {
    if (!startTime) return;

    const endTime = new Date();
    addSession({
      startTime,
      endTime,
      duration: seconds,
      notes: notes || undefined,
      songId: selectedSongId,
      instrumentType: selectedInstrument as 'guitar' | 'bass' | 'violin' | 'cello' | 'ukulele' | 'other'
    });

    if (selectedSongId) {
      updateSongPracticeTime(selectedSongId, seconds);
    }

    stop();
    reset();
    setSelectedSongId(undefined);
    setNotes('');

    router.push('/');
  };

  return (
    <div className="container mx-auto max-w-[1200px] px-4 py-8">
      <div className="space-y-8">
        <AnimatedCard>
          <div>
            <h1 className="text-[60px] font-extrabold tracking-tight leading-none">Practice Timer</h1>
            <p className="text-muted-foreground mt-2">Track your practice sessions</p>
          </div>
        </AnimatedCard>

        <AnimatedCard delay={0.1}>
          <TimerDisplay seconds={seconds} />
        </AnimatedCard>

        <AnimatedCard delay={0.15}>
          <TimerControls
            isRunning={isRunning}
            isPaused={isPaused}
            onStart={start}
            onPause={pause}
            onResume={resume}
            onStop={handleStop}
            onReset={reset}
          />
        </AnimatedCard>

        <AnimatedCard delay={0.2}>
          <Card>
            <CardContent className="p-6">
              <SessionForm
                songs={songs}
                onSongChange={setSelectedSongId}
                onNotesChange={setNotes}
                onInstrumentChange={setSelectedInstrument}
                selectedSongId={selectedSongId}
                notes={notes}
                selectedInstrument={selectedInstrument}
              />
            </CardContent>
          </Card>
        </AnimatedCard>

        <AnimatedCard delay={0.3}>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Metronome</h3>
              <Metronome />
            </CardContent>
          </Card>
        </AnimatedCard>
      </div>
    </div>
  );
}
