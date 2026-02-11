'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Metronome() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [currentBeat, setCurrentBeat] = useState(-1);
  const [volume, setVolume] = useState(75);
  const [beatsPerMeasure] = useState(4);

  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const intervalRef = useRef<number | null>(null);
  const nextNoteTimeRef = useRef<number>(0);
  const beatRef = useRef(0);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioContextRef.current = new AudioContextClass();
      masterGainRef.current = audioContextRef.current.createGain();
      masterGainRef.current.gain.value = volume / 100;
      masterGainRef.current.connect(audioContextRef.current.destination);
    }
    return audioContextRef.current;
  }, [volume]);

  // Sync volume changes to the master gain
  useEffect(() => {
    if (masterGainRef.current) {
      masterGainRef.current.gain.value = volume / 100;
    }
  }, [volume]);

  const playClick = useCallback(
    (time: number, accent: boolean = false) => {
      const ctx = getAudioContext();
      if (!masterGainRef.current) return;

      const osc = ctx.createOscillator();
      const envGain = ctx.createGain();

      osc.connect(envGain);
      envGain.connect(masterGainRef.current);

      // Accent: higher pitch, sharper attack
      osc.frequency.value = accent ? 1200 : 880;
      osc.type = 'sine';

      const peakGain = accent ? 0.8 : 0.5;
      const duration = 0.06;

      envGain.gain.setValueAtTime(peakGain, time);
      envGain.gain.exponentialRampToValueAtTime(0.001, time + duration);

      osc.start(time);
      osc.stop(time + duration);
    },
    [getAudioContext]
  );

  const startMetronome = useCallback(() => {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') ctx.resume();
    nextNoteTimeRef.current = ctx.currentTime;
    beatRef.current = 0;
    setCurrentBeat(0);
    setIsPlaying(true);
  }, [getAudioContext]);

  const stopMetronome = useCallback(() => {
    setIsPlaying(false);
    beatRef.current = 0;
    setCurrentBeat(-1);
  }, []);

  useEffect(() => {
    if (!isPlaying) {
      if (intervalRef.current) cancelAnimationFrame(intervalRef.current);
      return;
    }

    const schedule = () => {
      const ctx = getAudioContext();
      const secondsPerBeat = 60.0 / bpm;

      while (nextNoteTimeRef.current < ctx.currentTime + 0.1) {
        const beat = beatRef.current % beatsPerMeasure;
        playClick(nextNoteTimeRef.current, beat === 0);

        // Schedule visual update close to actual sound time
        const delay = (nextNoteTimeRef.current - ctx.currentTime) * 1000;
        const capturedBeat = beat;
        setTimeout(() => setCurrentBeat(capturedBeat), Math.max(0, delay));

        nextNoteTimeRef.current += secondsPerBeat;
        beatRef.current += 1;
      }

      intervalRef.current = requestAnimationFrame(schedule);
    };

    schedule();

    return () => {
      if (intervalRef.current) cancelAnimationFrame(intervalRef.current);
    };
  }, [isPlaying, bpm, beatsPerMeasure, playClick, getAudioContext]);

  const handleBpmChange = (newBpm: number) => {
    setBpm(Math.max(40, Math.min(240, newBpm)));
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Beat indicators */}
      <div className="flex items-center gap-3">
        {Array.from({ length: beatsPerMeasure }).map((_, i) => {
          const isActive = isPlaying && currentBeat === i;
          const isAccent = i === 0;
          return (
            <div
              key={i}
              className={`
                rounded-full transition-all duration-75
                ${isAccent ? 'w-5 h-5' : 'w-4 h-4'}
                ${
                  isActive
                    ? isAccent
                      ? 'bg-sl-accent scale-125 shadow-[0_0_12px_hsl(var(--sl-accent))]'
                      : 'bg-sl-accent/70 scale-110'
                    : 'bg-muted-foreground/20'
                }
              `}
            />
          );
        })}
      </div>

      {/* BPM control */}
      <div className="flex items-center justify-center gap-6">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleBpmChange(bpm - 10)}
            disabled={bpm <= 40}
            className="h-9 w-9"
          >
            <ChevronsLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleBpmChange(bpm - 1)}
            disabled={bpm <= 40}
            className="h-9 w-9"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </div>

        <div className="relative w-40 h-40 rounded-full bg-sl-accent/10 flex items-center justify-center select-none">
          <div
            className={`text-6xl font-bold font-mono transition-transform duration-75 ${
              isPlaying && currentBeat === 0 ? 'scale-110' : ''
            }`}
          >
            {bpm}
          </div>
          <div className="absolute bottom-3 text-xs text-muted-foreground tracking-wider uppercase">
            bpm
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleBpmChange(bpm + 1)}
            disabled={bpm >= 240}
            className="h-9 w-9"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleBpmChange(bpm + 10)}
            disabled={bpm >= 240}
            className="h-9 w-9"
          >
            <ChevronsRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Play/Pause */}
      {isPlaying ? (
        <Button
          onClick={stopMetronome}
          size="icon"
          variant="outline"
          className="rounded-full w-14 h-14 border-sl-accent/30 text-sl-accent hover:bg-sl-accent/10"
        >
          <Pause className="h-6 w-6" />
        </Button>
      ) : (
        <Button onClick={startMetronome} size="icon" className="rounded-full w-14 h-14 bg-sl-accent hover:bg-sl-accent/90 text-white">
          <Play className="h-6 w-6 ml-0.5" />
        </Button>
      )}

      {/* Volume */}
      <div className="flex items-center gap-3 w-48">
        <button
          onClick={() => setVolume(volume === 0 ? 75 : 0)}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          {volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
        <input
          type="range"
          min={0}
          max={100}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-sl-accent [&::-webkit-slider-thumb]:cursor-pointer
            [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-sl-accent [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
        />
      </div>
    </div>
  );
}
