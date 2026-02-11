'use client';

import { useState, useMemo } from 'react';
import { useSongs } from '@/hooks/useSongs';
import { Song } from '@/types';
import { AddSongDialog } from '@/components/repertoire/AddSongDialog';
import { EditSongDialog } from '@/components/repertoire/EditSongDialog';
import { SongCard } from '@/components/repertoire/SongCard';
import { AnimatedCard } from '@/components/AnimatedCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export default function RepertoirePage() {
  const { songs, addSong, updateSong, deleteSong } = useSongs();

  const [filter, setFilter] = useState<'all' | 'mastered' | 'learning' | 'wishlist'>('all');
  const [search, setSearch] = useState('');
  const [editingSong, setEditingSong] = useState<Song | null>(null);

  const filteredSongs = useMemo(() => {
    let filtered = songs;

    if (filter !== 'all') {
      filtered = filtered.filter(song => song.status === filter);
    }

    if (search) {
      const lowerSearch = search.toLowerCase();
      filtered = filtered.filter(song =>
        song.title.toLowerCase().includes(lowerSearch) ||
        song.artist.toLowerCase().includes(lowerSearch)
      );
    }

    return filtered;
  }, [songs, filter, search]);

  const handleAddSong = (songData: { title: string; artist: string; status: 'mastered' | 'learning' | 'wishlist'; difficulty?: 1 | 2 | 3 | 4 | 5; notes?: string }) => {
    addSong(songData);
  };

  const handleDeleteSong = (id: string) => {
    if (confirm('Are you sure you want to delete this song? This will not delete the practice sessions.')) {
      deleteSong(id);
    }
  };

  return (
    <div className="container mx-auto max-w-[1200px] px-4 py-8">
      <div className="space-y-8">
        <AnimatedCard>
          <div className="flex items-end justify-between gap-4">
            <div>
              <h1 className="text-[60px] font-extrabold tracking-tight leading-none">Repertoire</h1>
              <p className="text-muted-foreground mt-2">Manage your song catalog</p>
            </div>
            <AddSongDialog onAdd={handleAddSong} />
          </div>
        </AnimatedCard>

        <AnimatedCard delay={0.1}>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search songs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2">
              {['all', 'learning', 'mastered', 'wishlist'].map((status) => (
                <Button
                  key={status}
                  variant={filter === status ? 'default' : 'outline'}
                  onClick={() => setFilter(status as 'all' | 'mastered' | 'learning' | 'wishlist')}
                  className={filter === status ? 'bg-sl-accent hover:bg-sl-accent/90 text-white capitalize' : 'capitalize'}
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
        </AnimatedCard>

        {filteredSongs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              {songs.length === 0
                ? 'No songs yet. Add your first song to get started!'
                : 'No songs match your filters.'}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredSongs.map((song, index) => (
              <AnimatedCard key={song.id} delay={index * 0.1}>
                <SongCard
                  song={song}
                  onEdit={setEditingSong}
                  onDelete={handleDeleteSong}
                />
              </AnimatedCard>
            ))}
          </div>
        )}

        {editingSong && (
          <EditSongDialog
            open={!!editingSong}
            onOpenChange={(open) => !open && setEditingSong(null)}
            song={editingSong}
            onUpdate={updateSong}
          />
        )}
      </div>
    </div>
  );
}
