'use client';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Guitar, Music2, Music, Waves } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const INSTRUMENTS: { value: string; label: string; icon: LucideIcon }[] = [
  { value: 'guitar', label: 'Guitar', icon: Guitar },
  { value: 'bass', label: 'Bass', icon: Guitar },
  { value: 'ukulele', label: 'Ukulele', icon: Guitar },
  { value: 'violin', label: 'Violin', icon: Music2 },
  { value: 'cello', label: 'Cello', icon: Music },
  { value: 'other', label: 'Other', icon: Waves },
];

interface SessionFormProps {
  songs: { id: string; title: string; artist: string }[];
  onSongChange: (songId: string | undefined) => void;
  onNotesChange: (notes: string) => void;
  onInstrumentChange: (instrument: string) => void;
  selectedSongId?: string;
  notes?: string;
  selectedInstrument?: string;
}

export function SessionForm({
  songs,
  onSongChange,
  onNotesChange,
  onInstrumentChange,
  selectedSongId,
  notes,
  selectedInstrument,
}: SessionFormProps) {
  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <h3 className="text-lg font-semibold">Session Details</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Song (Optional)</Label>
          <Select
            value={selectedSongId || 'none'}
            onValueChange={(v) => onSongChange(v === 'none' ? undefined : v)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a song..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Select a song...</SelectItem>
              {songs.map((song) => (
                <SelectItem key={song.id} value={song.id}>
                  {song.title} - {song.artist}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Instrument</Label>
          <Select
            value={selectedInstrument || 'guitar'}
            onValueChange={onInstrumentChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {INSTRUMENTS.map(({ value, label, icon: Icon }) => (
                <SelectItem key={value} value={value}>
                  <Icon className="size-4" />
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes (Optional)</Label>
        <textarea
          id="notes"
          value={notes || ''}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="What did you practice? Any challenges or breakthroughs?"
          className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
    </div>
  );
}
