'use client';

import { formatDuration } from '@/utils/time';

interface TimerDisplayProps {
  seconds: number;
}

export function TimerDisplay({ seconds }: TimerDisplayProps) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full border-4 border-sl-accent/20 flex items-center justify-center backdrop-blur-xl bg-sl-accent/5">
        <div className="text-center">
          <div className="text-[96px] font-mono font-bold text-foreground tabular-nums leading-none">
            {hours > 0 ? `${hours}:` : ''}
            {String(minutes).padStart(2, '0')}:{String(secs).padStart(2, '0')}
          </div>
          <div className="text-muted-foreground mt-2 text-sm">
            {formatDuration(seconds)}
          </div>
        </div>
      </div>
    </div>
  );
}
