'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Song } from '@/types';

interface EditSongDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  song: Song;
  onUpdate: (id: string, updates: Partial<Song>) => void;
}

export function EditSongDialog({ open, onOpenChange, song, onUpdate }: EditSongDialogProps) {
  const [title, setTitle] = useState(song.title);
  const [artist, setArtist] = useState(song.artist);
  const [status, setStatus] = useState<'mastered' | 'learning' | 'wishlist'>(song.status);
  const [difficulty, setDifficulty] = useState<1 | 2 | 3 | 4 | 5 | undefined>(song.difficulty);
  const [notes, setNotes] = useState(song.notes || '');
  const [album, setAlbum] = useState(song.album || '');
  const [albumArt, setAlbumArt] = useState(song.albumArt || '');

  useEffect(() => {
    const updateState = () => {
      setTitle(song.title);
      setArtist(song.artist);
      setStatus(song.status);
      setDifficulty(song.difficulty);
      setNotes(song.notes || '');
      setAlbum(song.album || '');
      setAlbumArt(song.albumArt || '');
    };
    updateState();
  }, [song]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !artist.trim()) return;

    onUpdate(song.id, {
      title: title.trim(),
      artist: artist.trim(),
      status,
      difficulty,
      notes: notes.trim() || undefined,
      album: album.trim() || undefined,
      albumArt: albumArt.trim() || undefined
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Song</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {albumArt && (
            <div className="flex items-center gap-4">
              <img src={albumArt} alt="Album Art" className="w-20 h-20 rounded-lg object-cover" />
              <div className="text-sm text-muted-foreground">
                <p><span className="font-medium">Album:</span> {album || 'Not specified'}</p>
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
            <Label htmlFor="album">Album</Label>
            <Input
              id="album"
              value={album}
              onChange={(e) => setAlbum(e.target.value)}
              placeholder="Album name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="albumArt">Album Art URL</Label>
            <Input
              id="albumArt"
              value={albumArt}
              onChange={(e) => setAlbumArt(e.target.value)}
              placeholder="https://..."
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
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
