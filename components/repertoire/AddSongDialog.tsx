'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import { SongSearchDialog } from './SongSearchDialog';
import { SpotifyTrack } from '@/lib/spotify';

interface AddSongDialogProps {
  onAdd: (song: { title: string; artist: string; album?: string; albumArt?: string; spotifyId?: string; spotifyUrl?: string; status: 'mastered' | 'learning' | 'wishlist'; difficulty?: 1 | 2 | 3 | 4 | 5; notes?: string }) => void;
}

export function AddSongDialog({ onAdd }: AddSongDialogProps) {
  const [open, setOpen] = useState(false);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [status, setStatus] = useState<'mastered' | 'learning' | 'wishlist'>('learning');
  const [difficulty, setDifficulty] = useState<1 | 2 | 3 | 4 | 5 | undefined>(undefined);
  const [notes, setNotes] = useState('');
  const [album, setAlbum] = useState('');
  const [albumArt, setAlbumArt] = useState('');
  const [spotifyId, setSpotifyId] = useState('');
  const [spotifyUrl, setSpotifyUrl] = useState('');

  const handleSelectTrack = (track: SpotifyTrack) => {
    setTitle(track.name);
    setArtist(track.artist);
    setAlbum(track.album);
    setAlbumArt(track.albumArt);
    setSpotifyId(track.id);
    setSpotifyUrl(track.spotifyUrl);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !artist.trim()) return;

    onAdd({
      title: title.trim(),
      artist: artist.trim(),
      album: album.trim() || undefined,
      albumArt: albumArt.trim() || undefined,
      spotifyId: spotifyId.trim() || undefined,
      spotifyUrl: spotifyUrl.trim() || undefined,
      status,
      difficulty,
      notes: notes.trim() || undefined
    });

    setTitle('');
    setArtist('');
    setAlbum('');
    setAlbumArt('');
    setSpotifyId('');
    setSpotifyUrl('');
    setStatus('learning');
    setDifficulty(undefined);
    setNotes('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Song
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Song</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setSearchDialogOpen(true)}
            className="w-full"
          >
            <Search className="mr-2 h-4 w-4" />
            Search on Spotify
          </Button>

          {albumArt && (
            <div className="flex items-center gap-4">
              <img src={albumArt} alt="Album Art" className="w-20 h-20 rounded-lg object-cover" />
              <div className="text-sm text-muted-foreground">
                <p><span className="font-medium">Album:</span> {album}</p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Song title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="artist">Artist *</Label>
            <Input
              id="artist"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              placeholder="Artist name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as 'mastered' | 'learning' | 'wishlist')}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              required
            >
              <option value="learning">Learning</option>
              <option value="mastered">Mastered</option>
              <option value="wishlist">Wishlist</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="difficulty">Difficulty (1-5 stars)</Label>
            <select
              id="difficulty"
              value={difficulty || ''}
              onChange={(e) => setDifficulty(e.target.value ? parseInt(e.target.value) as 1 | 2 | 3 | 4 | 5 : undefined)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Not rated</option>
              <option value="1">1 star</option>
              <option value="2">2 stars</option>
              <option value="3">3 stars</option>
              <option value="4">4 stars</option>
              <option value="5">5 stars</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any notes about this song..."
              className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Song</Button>
          </div>
        </form>

        <SongSearchDialog
          open={searchDialogOpen}
          onClose={() => setSearchDialogOpen(false)}
          onSelect={handleSelectTrack}
        />
      </DialogContent>
    </Dialog>
  );
}
