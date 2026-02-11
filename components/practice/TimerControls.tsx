'use client';

import { Play, Pause, Square, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TimerControlsProps {
  isRunning: boolean;
  isPaused: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onReset: () => void;
}

export function TimerControls({
  isRunning,
  isPaused,
  onStart,
  onPause,
  onResume,
  onStop,
  onReset
}: TimerControlsProps) {
  return (
    <div className="flex items-center justify-center space-x-4">
      {!isRunning && !isPaused ? (
        <Button
          onClick={onStart}
          size="lg"
          className="w-32 h-32 rounded-full text-xl font-semibold bg-sl-accent hover:bg-sl-accent/90 text-white"
        >
          <Play className="mr-2 h-8 w-8" />
          Start
        </Button>
      ) : isPaused ? (
        <>
          <Button
            onClick={onResume}
            size="lg"
            className="w-32 h-32 rounded-full text-xl font-semibold bg-sl-accent hover:bg-sl-accent/90 text-white"
          >
            <Play className="mr-2 h-8 w-8" />
            Resume
          </Button>
          <Button
            onClick={onReset}
            variant="outline"
            size="lg"
            className="w-24 h-24 rounded-full"
          >
            <RotateCcw className="h-6 w-6" />
          </Button>
        </>
      ) : (
        <>
          <Button
            onClick={onPause}
            variant="outline"
            size="lg"
            className="w-32 h-32 rounded-full text-xl font-semibold border-sl-accent/30 text-sl-accent hover:bg-sl-accent/10"
          >
            <Pause className="mr-2 h-8 w-8" />
            Pause
          </Button>
          <Button
            onClick={onStop}
            variant="destructive"
            size="lg"
            className="w-32 h-32 rounded-full text-xl font-semibold"
          >
            <Square className="mr-2 h-8 w-8" />
            Stop
          </Button>
        </>
      )}
    </div>
  );
}
