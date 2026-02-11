'use client'

import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { searchTracks, SpotifyTrack } from '@/lib/spotify'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'

export function SongSearchDialog({ open, onClose, onSelect }: { open: boolean, onClose: () => void, onSelect: (track: SpotifyTrack) => void }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SpotifyTrack[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  

  const debouncedQuery = useDebouncedValue(query, 500)


  useEffect(() => {
    let isMounted = true
    
    const fetchData = async () => {
      if (debouncedQuery.length < 2) {
        if (isMounted) {
          setResults([])
          setError(null)
        }
        return
      }

      if (isMounted) {
        setLoading(true)
        setError(null)
      }
      
      try {
        const data = await searchTracks(debouncedQuery)
        if (isMounted) {
          setResults(data)
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to search for songs')
          setResults([])
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }
    
    fetchData()
    
    return () => {
      isMounted = false
    }
  }, [debouncedQuery])

  const handleSelect = (track: SpotifyTrack) => {
    onSelect(track)
    setQuery('')
    setResults([])
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Search for a Song</DialogTitle>
        </DialogHeader>
        
        
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search song or artist..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
            autoFocus
          />
        </div>


        <div className="overflow-y-auto max-h-[500px] space-y-2">
          {loading && <p className="text-center py-8">Searching...</p>}
          
          {error && <p className="text-center py-8 text-destructive">{error}</p>}
          
          {!loading && !error && results.map((track) => (
            <button
              key={track.id}
              onClick={() => handleSelect(track)}
              className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-accent transition"
            >
              {track.albumArt ? (
                <img 
                  src={track.albumArtSmall} 
                  alt={track.album}
                  className="w-16 h-16 rounded object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded bg-muted flex items-center justify-center">
                  <Search className="w-6 h-6 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1 text-left">
                <p className="font-semibold">{track.name}</p>
                <p className="text-sm text-muted-foreground">
                  {track.artist} • {track.album}
                </p>
              </div>
            </button>
          ))}
          
          {!loading && !error && results.length === 0 && debouncedQuery.length >= 2 && (
            <p className="text-center py-8 text-muted-foreground">No results found</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
