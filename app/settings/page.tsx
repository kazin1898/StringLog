'use client';

import { useSessions } from '@/hooks/useSessions';
import { useSongs } from '@/hooks/useSongs';
import { useAccentColor } from '@/hooks/useAccentColor';
import { ACCENT_PRESETS } from '@/lib/accent-colors';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Check } from 'lucide-react';
import { exportSessionsToCSV, exportSongsToCSV } from '@/utils/export';

export default function SettingsPage() {
  const { sessions, setSessions: setSessionsData } = useSessions();
  const { songs, setSongs: setSongsData } = useSongs();
  const { accentId, setAccentId } = useAccentColor();

  const handleClearAllData = () => {
    if (confirm('Are you sure you want to clear ALL data? This action cannot be undone and will delete all your practice sessions and songs.')) {
      if (confirm('This is your last chance to cancel. Are you absolutely sure you want to delete everything?')) {
        localStorage.removeItem('stringlog_sessions');
        localStorage.removeItem('stringlog_songs');
        localStorage.removeItem('stringlog_preferences');
        setSessionsData([]);
        setSongsData([]);
        setAccentId('violet');
        alert('All data has been cleared.');
      }
    }
  };

  const handleExportData = () => {
    const sessions = JSON.parse(localStorage.getItem('stringlog_sessions') || '[]');
    const songs = JSON.parse(localStorage.getItem('stringlog_songs') || '[]');

    const exportData = {
      exportDate: new Date().toISOString(),
      sessions,
      songs,
      stats: {
        totalSessions: sessions.length,
        totalSongs: songs.length,
        totalHours: sessions.reduce((acc: number, s: { duration: number }) => acc + s.duration, 0) / 3600
      }
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stringlog-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);

        if (data.sessions && Array.isArray(data.sessions)) {
          localStorage.setItem('stringlog_sessions', JSON.stringify(data.sessions));
          setSessionsData(data.sessions);
        }

        if (data.songs && Array.isArray(data.songs)) {
          localStorage.setItem('stringlog_songs', JSON.stringify(data.songs));
          setSongsData(data.songs);
        }

        alert('Data imported successfully!');
        window.location.reload();
      } catch {
        alert('Error importing data. Please make sure the file is a valid StringLog export.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="container mx-auto max-w-[1200px] px-4 py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your preferences</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">Accent color</p>
            <div className="flex gap-3">
              {ACCENT_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => setAccentId(preset.id)}
                  className="relative size-8 rounded-full transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  style={{ backgroundColor: preset.dark }}
                  title={preset.label}
                >
                  {accentId === preset.id && (
                    <Check className="absolute inset-0 m-auto size-4 text-white" />
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={handleExportData} variant="outline">
                Download Backup (JSON)
              </Button>
              <div>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  className="hidden"
                  id="import-file"
                />
                <Button onClick={() => document.getElementById('import-file')?.click()} variant="outline">
                  Import Backup
                </Button>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 pt-2 border-t">
              <Button onClick={() => exportSessionsToCSV(sessions)} variant="outline">
                Export Sessions to CSV
              </Button>
              <Button onClick={() => exportSongsToCSV(songs)} variant="outline">
                Export Songs to CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Danger Zone</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                These actions are irreversible. Please make sure you have a backup before proceeding.
              </AlertDescription>
            </Alert>
            <Button onClick={handleClearAllData} variant="destructive">
              Clear All Data
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
