'use client';

import { Song } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Clock, Music, ExternalLink } from 'lucide-react';
import { formatDurationHoursMinutes, formatDate } from '@/utils/time';
import { cn } from '@/lib/utils';

interface SongCardProps {
  song: Song;
  onEdit: (song: Song) => void;
  onDelete: (id: string) => void;
}

const STATUS_STYLES: Record<Song['status'], string> = {
  learning: 'bg-sl-accent/15 text-sl-accent',
  mastered: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  wishlist: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
};

export function SongCard({ song, onEdit, onDelete }: SongCardProps) {
  return (
    <Card className="rounded-2xl hover:shadow-md transition-shadow relative group">
      <CardContent className="p-4">
        <div className="flex gap-3 items-start">
          {song.albumArt ? (
            <img
              src={song.albumArt}
              alt={song.album || song.title}
              className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-20 h-20 rounded-lg bg-sl-accent/10 flex items-center justify-center flex-shrink-0">
              <Music className="w-7 h-7 text-sl-accent" />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-base font-semibold truncate">{song.title}</p>
                <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
                {song.album && (
                  <p className="text-xs text-muted-foreground truncate">{song.album}</p>
                )}
              </div>
              <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full capitalize flex-shrink-0', STATUS_STYLES[song.status])}>
                {song.status}
              </span>
            </div>

            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>{formatDurationHoursMinutes(song.totalPracticeTime)}</span>
              {song.difficulty && (
                <>
                  <span>·</span>
                  <span className="text-amber-500">{'★'.repeat(song.difficulty)}{'☆'.repeat(5 - song.difficulty)}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {(song.lastPracticedAt || song.notes) && (
          <div className="mt-3 pt-3 border-t border-border/50 space-y-1">
            {song.lastPracticedAt && (
              <p className="text-xs text-muted-foreground">
                Last practiced: {formatDate(new Date(song.lastPracticedAt))}
              </p>
            )}
            {song.notes && (
              <p className="text-xs text-muted-foreground line-clamp-2">{song.notes}</p>
            )}
          </div>
        )}

        <div className="flex gap-1 mt-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(song)}
            className="h-8 text-xs"
          >
            <Pencil className="h-3.5 w-3.5 mr-1" />
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(song.id)}
            className="h-8 text-xs text-destructive hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5 mr-1" />
            Delete
          </Button>
        </div>
      </CardContent>

      {song.spotifyUrl && (
        <a
          href={song.spotifyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ExternalLink className="w-4 h-4 text-muted-foreground hover:text-sl-accent" />
        </a>
      )}
    </Card>
  );
}
