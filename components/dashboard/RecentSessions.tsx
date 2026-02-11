'use client';

import { PracticeSession } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDuration, formatDate, formatTime } from '@/utils/time';
import Link from 'next/link';

interface RecentSessionsProps {
  sessions: PracticeSession[];
  songs: { id: string; title: string; artist: string }[];
}

const MAX_SESSIONS = 5;

export function RecentSessions({ sessions, songs }: RecentSessionsProps) {
  const recentSessions = sessions.slice(0, MAX_SESSIONS);

  if (recentSessions.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Recent Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No sessions yet. Start practicing!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Recent Sessions</CardTitle>
          {sessions.length > MAX_SESSIONS && (
            <Link
              href="/history"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              View all
            </Link>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {recentSessions.map((session) => {
            const song = session.songId ? songs.find(s => s.id === session.songId) : null;
            return (
              <div
                key={session.id}
                className="flex items-center justify-between gap-3 rounded-md px-3 py-2 hover:bg-muted/50 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">
                    {song ? song.title : 'Free Practice'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(new Date(session.startTime))}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {song && (
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                      {song.artist}
                    </Badge>
                  )}
                  <span className="text-xs font-medium tabular-nums text-muted-foreground">
                    {formatDuration(session.duration)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
