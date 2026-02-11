'use client';

import { useState, useMemo } from 'react';
import { useSessions } from '@/hooks/useSessions';
import { useSongs } from '@/hooks/useSongs';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { formatDuration, formatDate } from '@/utils/time';
import { Download } from 'lucide-react';

export default function HistoryPage() {
  const { sessions } = useSessions();
  const { songs } = useSongs();

  const [search, setSearch] = useState('');
  const [instrumentFilter, setInstrumentFilter] = useState<string>('all');
  const [songFilter, setSongFilter] = useState<string>('all');

  const filteredSessions = useMemo(() => {
    return sessions.filter(session => {
      const song = session.songId ? songs.find(s => s.id === session.songId) : null;

      if (search && !song) return false;
      if (search && song && !song.title.toLowerCase().includes(search.toLowerCase()) && !song.artist.toLowerCase().includes(search.toLowerCase())) return false;

      if (instrumentFilter !== 'all' && session.instrumentType !== instrumentFilter) return false;
      if (songFilter !== 'all' && session.songId !== songFilter) return false;

      return true;
    });
  }, [sessions, songs, search, instrumentFilter, songFilter]);

  const handleExport = () => {
    const exportData = {
      exportDate: new Date().toISOString(),
      sessions,
      songs,
      stats: {
        totalSessions: sessions.length,
        totalHours: sessions.reduce((acc, s) => acc + s.duration, 0) / 3600
      }
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stringlog-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto max-w-[1200px] px-4 py-8">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[60px] font-extrabold tracking-tight">History</h1>
            <p className="text-muted-foreground mt-2">View all your practice sessions</p>
          </div>
          <Button onClick={handleExport} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Search by song..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <select
                value={instrumentFilter}
                onChange={(e) => setInstrumentFilter(e.target.value)}
                className="flex h-10 md:w-48 rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="all">All Instruments</option>
                <option value="guitar">Guitar</option>
                <option value="bass">Bass</option>
                <option value="violin">Violin</option>
                <option value="cello">Cello</option>
                <option value="ukulele">Ukulele</option>
                <option value="other">Other</option>
              </select>

              <select
                value={songFilter}
                onChange={(e) => setSongFilter(e.target.value)}
                className="flex h-10 md:w-48 rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="all">All Songs</option>
                {songs.map(song => (
                  <option key={song.id} value={song.id}>{song.title}</option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-4 text-left font-medium">Date</th>
                    <th className="p-4 text-left font-medium">Duration</th>
                    <th className="p-4 text-left font-medium">Song</th>
                    <th className="p-4 text-left font-medium">Instrument</th>
                    <th className="p-4 text-left font-medium">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSessions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-muted-foreground">
                        {sessions.length === 0
                          ? 'No practice sessions yet. Start practicing to see your history!'
                          : 'No sessions match your filters.'}
                      </td>
                    </tr>
                  ) : (
                    filteredSessions.map((session) => {
                      const song = session.songId ? songs.find(s => s.id === session.songId) : null;
                      return (
                        <tr key={session.id} className="border-b hover:bg-muted/50">
                          <td className="p-4">
                            {formatDate(new Date(session.startTime))}
                          </td>
                          <td className="p-4">
                            {formatDuration(session.duration)}
                          </td>
                          <td className="p-4">
                            {song ? (
                              <div>
                                <div className="font-medium">{song.title}</div>
                                <div className="text-sm text-muted-foreground">{song.artist}</div>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">Free Practice</span>
                            )}
                          </td>
                          <td className="p-4 capitalize">
                            {session.instrumentType || '-'}
                          </td>
                          <td className="p-4 max-w-xs truncate">
                            {session.notes || '-'}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
