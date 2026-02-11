\# StringLog - Dark Mode + Design Polish + Music Database Integration



\## PRIORITY TASKS



\### 1. IMPLEMENT DARK MODE



\*\*Requirements:\*\*

\- Add theme toggle in Navbar (Sun/Moon icon from Lucide)

\- Use next-themes package for theme management

\- Persist preference in localStorage

\- Smooth transition between themes (200ms)



\*\*Installation:\*\*

```bash

npm install next-themes

```



\*\*Theme Provider Setup:\*\*

```typescript

// app/providers.tsx

'use client'

import { ThemeProvider } from 'next-themes'



export function Providers({ children }: { children: React.ReactNode }) {

&nbsp; return (

&nbsp;   <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>

&nbsp;     {children}

&nbsp;   </ThemeProvider>

&nbsp; )

}

```



\*\*Color Tokens (Update tailwind.config.js):\*\*

```javascript

module.exports = {

&nbsp; darkMode: 'class',

&nbsp; theme: {

&nbsp;   extend: {

&nbsp;     colors: {

&nbsp;       primary: {

&nbsp;         DEFAULT: '#2D5F57',

&nbsp;         light: '#3a7a6f',

&nbsp;         dark: '#1f4340',

&nbsp;       },

&nbsp;       background: {

&nbsp;         light: '#FFFFFF',

&nbsp;         dark: '#0a0a0a',

&nbsp;       },

&nbsp;       surface: {

&nbsp;         light: '#F5F3ED',

&nbsp;         dark: '#1a1a1a',

&nbsp;       },

&nbsp;       card: {

&nbsp;         light: '#FFFFFF',

&nbsp;         dark: '#1f1f1f',

&nbsp;       },

&nbsp;       border: {

&nbsp;         light: '#e5e5e5',

&nbsp;         dark: '#2a2a2a',

&nbsp;       },

&nbsp;       text: {

&nbsp;         primary: {

&nbsp;           light: '#1a1a1a',

&nbsp;           dark: '#f5f5f5',

&nbsp;         },

&nbsp;         secondary: {

&nbsp;           light: '#666666',

&nbsp;           dark: '#a3a3a3',

&nbsp;         }

&nbsp;       }

&nbsp;     }

&nbsp;   }

&nbsp; }

}

```



\*\*Component Updates:\*\*

\- Replace all `bg-white` → `bg-background-light dark:bg-background-dark`

\- Replace all `text-\[color]` → `text-text-primary-light dark:text-text-primary-dark`

\- Update card components with dark variants

\- Add dark mode styles to all existing components



\*\*Theme Toggle Component:\*\*

```typescript

// components/ThemeToggle.tsx

'use client'

import { useTheme } from 'next-themes'

import { Moon, Sun } from 'lucide-react'

import { Button } from '@/components/ui/button'



export function ThemeToggle() {

&nbsp; const { theme, setTheme } = useTheme()

&nbsp; 

&nbsp; return (

&nbsp;   <Button

&nbsp;     variant="ghost"

&nbsp;     size="icon"

&nbsp;     onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}

&nbsp;   >

&nbsp;     <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />

&nbsp;     <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />

&nbsp;   </Button>

&nbsp; )

}

```



---



\### 2. DESIGN IMPROVEMENTS (Based on Reference Images)



\*\*Visual Enhancements Needed:\*\*



\*\*Typography:\*\*

\- Increase h1 to 60px (from 56px) for more impact

\- Add letter-spacing: -0.02em to all headings

\- Use font-weight 800 for hero title (bolder)



\*\*Cards:\*\*

\- Increase border-radius to 24px (from 16px)

\- Add subtle gradient overlays on hover

\- Implement glass-morphism effect on timer card:

```css

&nbsp; backdrop-blur-xl bg-white/10 dark:bg-black/20

&nbsp; border border-white/20 dark:border-white/10

```



\*\*Animations:\*\*

\- Add entrance animations using Framer Motion

\- Stagger child elements (cards, list items)

\- Page transitions with fade + slide

\- Micro-interactions on stats cards (pulse effect when updating)



\*\*Install Framer Motion:\*\*

```bash

npm install framer-motion

```



\*\*Example Animation Wrapper:\*\*

```typescript

// components/AnimatedCard.tsx

'use client'

import { motion } from 'framer-motion'



export function AnimatedCard({ children, delay = 0 }) {

&nbsp; return (

&nbsp;   <motion.div

&nbsp;     initial={{ opacity: 0, y: 20 }}

&nbsp;     animate={{ opacity: 1, y: 0 }}

&nbsp;     transition={{ duration: 0.4, delay }}

&nbsp;   >

&nbsp;     {children}

&nbsp;   </motion.div>

&nbsp; )

}

```



\*\*Timer Display Enhancement:\*\*

\- Make timer digits larger (96px font-size)

\- Add monospace font for digits: `font-mono`

\- Subtle glow effect when running:

```css

&nbsp; .timer-running {

&nbsp;   text-shadow: 0 0 20px rgba(45, 95, 87, 0.3);

&nbsp; }

```



\*\*Dashboard Graph:\*\*

\- Switch from bars to area chart (more elegant)

\- Add gradient fill under line

\- Smooth curve instead of straight lines

\- Example:

```typescript

&nbsp; <AreaChart ...>

&nbsp;   <defs>

&nbsp;     <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">

&nbsp;       <stop offset="5%" stopColor="#2D5F57" stopOpacity={0.3}/>

&nbsp;       <stop offset="95%" stopColor="#2D5F57" stopOpacity={0}/>

&nbsp;     </linearGradient>

&nbsp;   </defs>

&nbsp;   <Area type="monotone" dataKey="hours" stroke="#2D5F57" fill="url(#colorHours)" />

&nbsp; </AreaChart>

```



---



\### 3. MUSIC DATABASE INTEGRATION



\*\*Use Spotify Web API (Free tier, no auth needed for search):\*\*



\*\*Alternative: MusicBrainz API (completely free, open-source)\*\*



\*\*Recommended: Spotify API\*\*

\- Better album artwork quality

\- More complete metadata

\- Larger database



\*\*Setup:\*\*



1\. \*\*Get Spotify Credentials:\*\*

&nbsp;  - Go to: https://developer.spotify.com/dashboard

&nbsp;  - Create an app

&nbsp;  - Get Client ID and Client Secret

&nbsp;  - Add to `.env.local`:

```

&nbsp;    NEXT\_PUBLIC\_SPOTIFY\_CLIENT\_ID=your\_client\_id

&nbsp;    NEXT\_PUBLIC\_SPOTIFY\_CLIENT\_SECRET=your\_client\_secret

```



2\. \*\*Install HTTP Client:\*\*

```bash

npm install axios

```



3\. \*\*Create Spotify Service:\*\*

```typescript

// lib/spotify.ts



const SPOTIFY\_TOKEN\_URL = 'https://accounts.spotify.com/api/token'

const SPOTIFY\_SEARCH\_URL = 'https://api.spotify.com/v1/search'



let cachedToken: { token: string; expires: number } | null = null



async function getAccessToken(): Promise<string> {

&nbsp; // Check cache

&nbsp; if (cachedToken \&\& cachedToken.expires > Date.now()) {

&nbsp;   return cachedToken.token

&nbsp; }



&nbsp; const client\_id = process.env.NEXT\_PUBLIC\_SPOTIFY\_CLIENT\_ID!

&nbsp; const client\_secret = process.env.NEXT\_PUBLIC\_SPOTIFY\_CLIENT\_SECRET!

&nbsp; 

&nbsp; const response = await fetch(SPOTIFY\_TOKEN\_URL, {

&nbsp;   method: 'POST',

&nbsp;   headers: {

&nbsp;     'Content-Type': 'application/x-www-form-urlencoded',

&nbsp;     'Authorization': 'Basic ' + Buffer.from(client\_id + ':' + client\_secret).toString('base64')

&nbsp;   },

&nbsp;   body: 'grant\_type=client\_credentials'

&nbsp; })



&nbsp; const data = await response.json()

&nbsp; 

&nbsp; // Cache token (expires in 1 hour)

&nbsp; cachedToken = {

&nbsp;   token: data.access\_token,

&nbsp;   expires: Date.now() + (data.expires\_in \* 1000)

&nbsp; }

&nbsp; 

&nbsp; return data.access\_token

}



export interface SpotifyTrack {

&nbsp; id: string

&nbsp; name: string

&nbsp; artist: string

&nbsp; album: string

&nbsp; albumArt: string // 640x640 image

&nbsp; albumArtSmall: string // 64x64 image

&nbsp; previewUrl?: string // 30s preview MP3

&nbsp; spotifyUrl: string

}



export async function searchTracks(query: string): Promise<SpotifyTrack\[]> {

&nbsp; const token = await getAccessToken()

&nbsp; 

&nbsp; const response = await fetch(

&nbsp;   `${SPOTIFY\_SEARCH\_URL}?q=${encodeURIComponent(query)}\&type=track\&limit=20`,

&nbsp;   {

&nbsp;     headers: {

&nbsp;       'Authorization': `Bearer ${token}`

&nbsp;     }

&nbsp;   }

&nbsp; )



&nbsp; const data = await response.json()

&nbsp; 

&nbsp; return data.tracks.items.map((track: any) => ({

&nbsp;   id: track.id,

&nbsp;   name: track.name,

&nbsp;   artist: track.artists\[0].name,

&nbsp;   album: track.album.name,

&nbsp;   albumArt: track.album.images\[0]?.url || '',

&nbsp;   albumArtSmall: track.album.images\[2]?.url || track.album.images\[0]?.url || '',

&nbsp;   previewUrl: track.preview\_url,

&nbsp;   spotifyUrl: track.external\_urls.spotify

&nbsp; }))

}

```



4\. \*\*Update Song Interface:\*\*

```typescript

// types/index.ts

export interface Song {

&nbsp; id: string

&nbsp; title: string

&nbsp; artist: string

&nbsp; album?: string // NEW

&nbsp; albumArt?: string // NEW - URL to album cover

&nbsp; spotifyId?: string // NEW - for linking to Spotify

&nbsp; spotifyUrl?: string // NEW - direct link to song

&nbsp; status: 'mastered' | 'learning' | 'wishlist'

&nbsp; totalPracticeTime: number

&nbsp; difficulty?: 1 | 2 | 3 | 4 | 5

&nbsp; notes?: string

&nbsp; createdAt: Date

&nbsp; lastPracticedAt?: Date

}

```



5\. \*\*Create Song Search Component:\*\*

```typescript

// components/repertoire/SongSearchDialog.tsx

'use client'



import { useState, useEffect } from 'react'

import { Search } from 'lucide-react'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

import { Input } from '@/components/ui/input'

import { searchTracks, SpotifyTrack } from '@/lib/spotify'

import { useDebouncedValue } from '@/hooks/useDebouncedValue'



export function SongSearchDialog({ open, onClose, onSelect }) {

&nbsp; const \[query, setQuery] = useState('')

&nbsp; const \[results, setResults] = useState<SpotifyTrack\[]>(\[])

&nbsp; const \[loading, setLoading] = useState(false)

&nbsp; 

&nbsp; const debouncedQuery = useDebouncedValue(query, 500)



&nbsp; useEffect(() => {

&nbsp;   if (debouncedQuery.length < 2) {

&nbsp;     setResults(\[])

&nbsp;     return

&nbsp;   }



&nbsp;   setLoading(true)

&nbsp;   searchTracks(debouncedQuery)

&nbsp;     .then(setResults)

&nbsp;     .finally(() => setLoading(false))

&nbsp; }, \[debouncedQuery])



&nbsp; return (

&nbsp;   <Dialog open={open} onOpenChange={onClose}>

&nbsp;     <DialogContent className="max-w-2xl max-h-\[80vh]">

&nbsp;       <DialogHeader>

&nbsp;         <DialogTitle>Search for a Song</DialogTitle>

&nbsp;       </DialogHeader>

&nbsp;       

&nbsp;       <div className="relative">

&nbsp;         <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />

&nbsp;         <Input

&nbsp;           placeholder="Search song or artist..."

&nbsp;           value={query}

&nbsp;           onChange={(e) => setQuery(e.target.value)}

&nbsp;           className="pl-10"

&nbsp;           autoFocus

&nbsp;         />

&nbsp;       </div>



&nbsp;       <div className="overflow-y-auto max-h-\[500px] space-y-2">

&nbsp;         {loading \&\& <p className="text-center py-8">Searching...</p>}

&nbsp;         

&nbsp;         {results.map((track) => (

&nbsp;           <button

&nbsp;             key={track.id}

&nbsp;             onClick={() => onSelect(track)}

&nbsp;             className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-surface-light dark:hover:bg-surface-dark transition"

&nbsp;           >

&nbsp;             <img 

&nbsp;               src={track.albumArtSmall} 

&nbsp;               alt={track.album}

&nbsp;               className="w-16 h-16 rounded object-cover"

&nbsp;             />

&nbsp;             <div className="flex-1 text-left">

&nbsp;               <p className="font-semibold">{track.name}</p>

&nbsp;               <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">

&nbsp;                 {track.artist} • {track.album}

&nbsp;               </p>

&nbsp;             </div>

&nbsp;           </button>

&nbsp;         ))}

&nbsp;         

&nbsp;         {results.length === 0 \&\& debouncedQuery.length >= 2 \&\& !loading \&\& (

&nbsp;           <p className="text-center py-8 text-gray-500">No results found</p>

&nbsp;         )}

&nbsp;       </div>

&nbsp;     </DialogContent>

&nbsp;   </Dialog>

&nbsp; )

}

```



6\. \*\*Create Debounce Hook:\*\*

```typescript

// hooks/useDebouncedValue.ts

import { useState, useEffect } from 'react'



export function useDebouncedValue<T>(value: T, delay: number): T {

&nbsp; const \[debouncedValue, setDebouncedValue] = useState(value)



&nbsp; useEffect(() => {

&nbsp;   const handler = setTimeout(() => {

&nbsp;     setDebouncedValue(value)

&nbsp;   }, delay)



&nbsp;   return () => clearTimeout(handler)

&nbsp; }, \[value, delay])



&nbsp; return debouncedValue

}

```



7\. \*\*Update SongCard Component:\*\*

```typescript

// components/repertoire/SongCard.tsx



export function SongCard({ song }: { song: Song }) {

&nbsp; return (

&nbsp;   <div className="group relative bg-card-light dark:bg-card-dark rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all">

&nbsp;     <div className="flex gap-4">

&nbsp;       {/\* Album Art \*/}

&nbsp;       {song.albumArt ? (

&nbsp;         <img 

&nbsp;           src={song.albumArt} 

&nbsp;           alt={song.album}

&nbsp;           className="w-24 h-24 rounded-lg object-cover"

&nbsp;         />

&nbsp;       ) : (

&nbsp;         <div className="w-24 h-24 rounded-lg bg-surface-light dark:bg-surface-dark flex items-center justify-center">

&nbsp;           <Music className="w-8 h-8 text-gray-400" />

&nbsp;         </div>

&nbsp;       )}

&nbsp;       

&nbsp;       <div className="flex-1">

&nbsp;         <h3 className="font-semibold text-lg mb-1">{song.title}</h3>

&nbsp;         <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-2">

&nbsp;           {song.artist}

&nbsp;         </p>

&nbsp;         {song.album \&\& (

&nbsp;           <p className="text-xs text-gray-500 mb-3">{song.album}</p>

&nbsp;         )}

&nbsp;         

&nbsp;         <div className="flex items-center gap-3">

&nbsp;           <StatusBadge status={song.status} />

&nbsp;           <span className="text-sm text-gray-500">

&nbsp;             {formatDuration(song.totalPracticeTime)} practiced

&nbsp;           </span>

&nbsp;         </div>

&nbsp;       </div>

&nbsp;     </div>

&nbsp;     

&nbsp;     {/\* Spotify Link \*/}

&nbsp;     {song.spotifyUrl \&\& (

&nbsp;       

&nbsp;         href={song.spotifyUrl}

&nbsp;         target="\_blank"

&nbsp;         rel="noopener noreferrer"

&nbsp;         className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition"

&nbsp;       >

&nbsp;         <ExternalLink className="w-4 h-4 text-gray-400 hover:text-primary" />

&nbsp;       </a>

&nbsp;     )}

&nbsp;   </div>

&nbsp; )

}

```



---



\## IMPLEMENTATION ORDER



1\. \*\*Install dependencies\*\* (next-themes, framer-motion, axios)

2\. \*\*Setup theme provider\*\* and dark mode toggle

3\. \*\*Update all components\*\* with dark mode variants

4\. \*\*Implement Spotify integration\*\* (API service + search dialog)

5\. \*\*Update Song model\*\* with album metadata

6\. \*\*Create SongSearchDialog\*\* component

7\. \*\*Update SongCard\*\* to display album art

8\. \*\*Add animations\*\* with Framer Motion

9\. \*\*Polish design\*\* (spacing, typography, micro-interactions)

10\. \*\*Test everything\*\* in both themes



---



\## TESTING CHECKLIST



\- \[ ] Dark mode toggle works and persists

\- \[ ] All components readable in both themes

\- \[ ] Spotify search returns results

\- \[ ] Album art displays correctly

\- \[ ] Manual song entry still works (without Spotify)

\- \[ ] Existing songs don't break (backward compatible)

\- \[ ] Animations smooth (60fps)

\- \[ ] Mobile responsive in both themes



---



\## NOTES



\- Spotify API free tier: 100 requests per 30 seconds

\- Cache token to avoid rate limits

\- Album art URLs are CDN links (fast, reliable)

\- Fallback to generic music icon if no album art

\- Allow manual entry if user doesn't want Spotify integration

