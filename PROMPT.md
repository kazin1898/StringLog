# StringLog - Complete Project Specification

## OVERVIEW
Web app for string instrument players to track practice hours and catalog their musical repertoire. Inspired by Letterboxd, but focused on practice tracking for guitarists, bassists, violinists, cellists, etc.

---

## TECH STACK

### Core
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Icons**: Lucide React
- **Storage**: localStorage (v1), future migration to Supabase/PostgreSQL
- **Font**: Inter (Google Fonts)

### Dependencies
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^3.4.0",
    "lucide-react": "^0.300.0",
    "date-fns": "^3.0.0",
    "recharts": "^2.10.0",
    "zustand": "^4.4.0"
  }
}
```

### Setup Commands
```bash
npx create-next-app@latest stringlog --typescript --tailwind --app
cd stringlog
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card input label dialog select badge separator
npm install lucide-react date-fns recharts zustand
```

### Research Links (if needed)
- Next.js App Router: https://nextjs.org/docs/app
- shadcn/ui components: https://ui.shadcn.com/docs/components
- Tailwind CSS: https://tailwindcss.com/docs
- Lucide Icons: https://lucide.dev/icons
- localStorage API: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
- Recharts (for graphs): https://recharts.org/en-US/api

---

## DESIGN SYSTEM

@frontend-design - Follow rigorously for all UI components

### design.json Reference
```json
{
  "colors": {
    "primary": "#2D5F57",
    "background": "#FFFFFF",
    "accent": "#F5F3ED",
    "dark_bg": "#1a1a1a",
    "text_primary": "#1a1a1a",
    "text_secondary": "#666666",
    "text_on_dark": "#FFFFFF"
  },
  "typography": {
    "font_family": "Inter",
    "h1": "48-56px, font-weight 700, line-height 1.1",
    "h2": "36-40px, font-weight 700, line-height 1.2",
    "h3": "20-24px, font-weight 600, line-height 1.3",
    "body": "16-18px, font-weight 400, line-height 1.6"
  },
  "spacing": {
    "section_padding": "80-120px vertical",
    "container_max_width": "1200px",
    "grid_gap": "40-60px",
    "card_padding": "32-40px"
  },
  "components": {
    "buttons": "rounded-full, px-32 py-16, font-weight 600",
    "cards": "rounded-2xl, shadow-sm, hover:shadow-md",
    "icons": "32-40px size, stroke-width 1.5-2"
  }
}
```

### Tailwind Config
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#2D5F57',
        accent: '#F5F3ED',
        darkBg: '#1a1a1a',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
}
```

---

## DATA MODELS

### TypeScript Interfaces
```typescript
// types/index.ts

export interface PracticeSession {
  id: string // UUID
  startTime: Date
  endTime: Date
  duration: number // in seconds
  notes?: string
  songId?: string
  instrumentType?: 'guitar' | 'bass' | 'violin' | 'cello' | 'ukulele' | 'other'
  createdAt: Date
}

export interface Song {
  id: string // UUID
  title: string
  artist: string
  status: 'mastered' | 'learning' | 'wishlist'
  totalPracticeTime: number // in seconds
  difficulty?: 1 | 2 | 3 | 4 | 5 // optional rating
  notes?: string
  createdAt: Date
  lastPracticedAt?: Date
}

export interface UserStats {
  totalLifetimeHours: number
  currentWeekHours: number
  streakDays: number
  lastPracticeDate?: Date
  totalSessions: number
}

export interface WeeklyData {
  weekStartDate: Date
  totalHours: number
}
```

### localStorage Schema
```typescript
// Keys used in localStorage
const STORAGE_KEYS = {
  SESSIONS: 'stringlog_sessions',
  SONGS: 'stringlog_songs',
  USER_PREFERENCES: 'stringlog_preferences'
}

// Example stored data
localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions))
```

---

## FEATURES & FUNCTIONALITY

### 1. Practice Timer Page (`/practice`)

**UI Components:**
- Large circular timer display showing HH:MM:SS
- Play/Pause/Stop buttons (large, prominent)
- Optional fields:
  - Link to song (dropdown from repertoire)
  - Add notes (textarea)
  - Select instrument type
- Auto-save session on stop
- Warning dialog if user tries to leave page during active session

**Logic:**
- Start timer → save startTime to state
- Pause → calculate elapsed, keep in memory
- Resume → continue from paused time
- Stop → save complete session to localStorage
- Timer updates every second using setInterval

**State Management:**
```typescript
interface TimerState {
  isRunning: boolean
  isPaused: boolean
  elapsedSeconds: number
  startTime: Date | null
  currentSession: Partial<PracticeSession>
}
```

### 2. Dashboard Page (`/`)

**UI Sections:**

**Stats Cards (3-column grid):**
- Total Lifetime Hours (big number + "hours practiced")
- This Week Hours (with comparison to last week ↑↓)
- Current Streak (days + fire emoji if >7 days)

**Recent Sessions:**
- List of last 10 sessions
- Each row: date, duration, song name (if linked), notes snippet
- Click to view full details in dialog

**Practice Graph:**
- Bar chart showing hours per week (last 8 weeks)
- Uses recharts library
- X-axis: week dates, Y-axis: hours

**Quick Actions:**
- Large "Start Practice" button → redirects to /practice
- "Add Song" button → opens dialog

**Calculations:**
```typescript
// Pseudo-code for stats
const totalLifetimeHours = sessions.reduce((acc, s) => acc + s.duration, 0) / 3600
const thisWeekSessions = sessions.filter(s => isThisWeek(s.startTime))
const streakDays = calculateStreak(sessions) // consecutive days with practice
```

### 3. Repertoire Page (`/repertoire`)

**UI Components:**
- Filter tabs: All | Mastered | Learning | Wishlist
- Search bar (filters by song title or artist)
- Grid/List view toggle
- Add Song button (opens dialog)

**Song Card:**
- Title (h3)
- Artist (text-secondary)
- Status badge (colored by status)
- Total practice time on this song
- Last practiced date
- Actions: Edit, Delete
- Click card → opens detail view with all sessions for this song

**Add/Edit Song Dialog:**
- Input: Title (required)
- Input: Artist (required)
- Select: Status (required)
- Select: Difficulty (1-5 stars, optional)
- Textarea: Notes (optional)

**Sorting Options:**
- Most practiced (totalPracticeTime DESC)
- Recently practiced (lastPracticedAt DESC)
- Alphabetical (title ASC)

### 4. History Page (`/history`)

**UI Components:**
- Full table of all sessions
- Columns: Date, Duration, Song, Instrument, Notes
- Sortable by any column
- Filters:
  - Date range picker (from/to)
  - Song dropdown
  - Instrument type
- Pagination (20 sessions per page)
- Export All Data button → downloads JSON

**Export Format:**
```json
{
  "exportDate": "2024-02-09T10:30:00Z",
  "sessions": [...],
  "songs": [...],
  "stats": {...}
}
```

### 5. Settings Page (`/settings`) - Optional Phase 2

- Clear all data (with confirmation)
- Import data from JSON
- Theme toggle (light/dark) - Phase 2
- Default instrument selection
- Week start day preference

---

## ROUTING STRUCTURE
```
/                   → Dashboard (default page)
/practice           → Practice Timer
/repertoire         → Song Catalog
/history            → Full Session History
/settings           → User Preferences (Phase 2)
```

### Navigation Component
- Fixed top navbar on all pages
- Logo (left): "StringLog"
- Nav links (center): Dashboard, Practice, Repertoire, History
- User menu (right): Settings, Export Data (Phase 2)
- Mobile: Hamburger menu

---

## CUSTOM HOOKS

### useLocalStorage
```typescript
// hooks/useLocalStorage.ts
function useLocalStorage<T>(key: string, initialValue: T) {
  // Read from localStorage on mount
  // Return [value, setValue, removeValue]
  // Auto-sync updates to localStorage
}
```

### useTimer
```typescript
// hooks/useTimer.ts
function useTimer() {
  // Manages timer state: running, paused, elapsed
  // Returns: { seconds, isRunning, isPaused, start, pause, resume, stop, reset }
  // Uses setInterval for ticking
}
```

### useSessions
```typescript
// hooks/useSessions.ts
function useSessions() {
  // CRUD operations for practice sessions
  // Returns: { sessions, addSession, updateSession, deleteSession, getStat }
}
```

### useSongs
```typescript
// hooks/useSongs.ts
function useSongs() {
  // CRUD operations for songs
  // Returns: { songs, addSong, updateSong, deleteSong, getSongStats }
}
```

### useStats
```typescript
// hooks/useStats.ts
function useStats() {
  // Calculates all statistics from sessions
  // Returns: { totalHours, weekHours, streak, weeklyData, etc. }
}
```

---

## UTILITY FUNCTIONS

### Time Formatting
```typescript
// utils/time.ts
export function formatDuration(seconds: number): string
  // Converts 3661 → "1h 1m 1s" or "01:01:01"

export function formatTime(date: Date): string
  // Formats as "2:30 PM"

export function formatDate(date: Date): string
  // Formats as "Feb 9, 2024"
```

### Statistics Calculations
```typescript
// utils/stats.ts
export function calculateStreak(sessions: PracticeSession[]): number
  // Counts consecutive days with at least one session

export function getWeeklyData(sessions: PracticeSession[], weeks: number): WeeklyData[]
  // Groups sessions by week, returns hours per week

export function isThisWeek(date: Date): boolean
  // Checks if date falls in current week
```

### Data Validation
```typescript
// utils/validation.ts
export function validateSession(session: Partial<PracticeSession>): boolean
export function validateSong(song: Partial<Song>): boolean
```

---

## COMPONENT STRUCTURE
```
components/
├── layout/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   └── Container.tsx
├── dashboard/
│   ├── StatsCards.tsx
│   ├── RecentSessions.tsx
│   ├── PracticeGraph.tsx
│   └── QuickActions.tsx
├── practice/
│   ├── Timer.tsx
│   ├── TimerControls.tsx
│   └── SessionForm.tsx
├── repertoire/
│   ├── SongCard.tsx
│   ├── SongGrid.tsx
│   ├── SongFilters.tsx
│   └── AddSongDialog.tsx
├── history/
│   ├── SessionTable.tsx
│   ├── SessionFilters.tsx
│   └── Pagination.tsx
└── ui/ (shadcn components)
    ├── button.tsx
    ├── card.tsx
    ├── dialog.tsx
    ├── input.tsx
    └── ...
```

---

## DEVELOPMENT GUIDELINES

@frontend-design - Follow for all UI implementation

### Code Standards
- **TypeScript**: Strict mode enabled, no `any` types
- **Components**: Keep under 150 lines, split if larger
- **Naming**: 
  - Components: PascalCase
  - Functions: camelCase
  - Constants: UPPER_SNAKE_CASE
  - Files: match component name
- **Comments**: Only where logic is non-obvious
- **Imports**: Group by external → internal → relative

### File Organization
```typescript
// Component file structure
import { external } from 'library'
import { internal } from '@/lib/utils'
import { relative } from './component'

interface Props { }

export function Component({ }: Props) {
  // hooks
  // state
  // effects
  // handlers
  // render
}
```

### Performance Best Practices
- Use `React.memo()` for lists (sessions, songs)
- `useMemo()` for expensive calculations (stats)
- `useCallback()` for event handlers passed to children
- Debounce search inputs (300ms)
- Lazy load pages with `next/dynamic`
- Optimize images with `next/image`

### Responsive Design
```css
/* Mobile-first approach */
/* Base: mobile (<768px) */
/* Tablet: md: (768px+) */
/* Desktop: lg: (1024px+) */
/* Wide: xl: (1280px+) */
```

### Accessibility
- All interactive elements keyboard accessible
- Semantic HTML (button, nav, main, etc.)
- ARIA labels where needed
- Color contrast ratio 4.5:1 minimum
- Focus visible on all interactive elements

---

## TESTING CHECKLIST

### Before Each Commit
- [ ] Timer starts/pauses/stops correctly
- [ ] Sessions save to localStorage
- [ ] Stats calculate accurately
- [ ] All CRUD operations work (add/edit/delete)
- [ ] Responsive on mobile (test at 375px width)
- [ ] No console errors or warnings
- [ ] TypeScript compiles without errors
- [ ] Animations smooth (60fps)

### Feature Testing
**Timer:**
- [ ] Timer counts up correctly
- [ ] Pause preserves time
- [ ] Stop saves session
- [ ] Warning on page leave during active session

**Dashboard:**
- [ ] Stats match actual data
- [ ] Graph renders with correct data
- [ ] Recent sessions show latest first

**Repertoire:**
- [ ] Add song works
- [ ] Edit song updates correctly
- [ ] Delete song removes + updates stats
- [ ] Filters work
- [ ] Search filters in real-time

**History:**
- [ ] All sessions display
- [ ] Sorting works on all columns
- [ ] Filters apply correctly
- [ ] Pagination works
- [ ] Export downloads valid JSON

---

## PHASE 1 PRIORITIES (MVP)

**Week 1:**
1. Project setup + Tailwind config + shadcn/ui
2. Basic layout (Navbar, Container)
3. Timer page (full functionality)
4. localStorage hooks

**Week 2:**
5. Dashboard with stats cards
6. Recent sessions list
7. Add song functionality
8. Repertoire page (list view)

**Week 3:**
9. History page with table
10. Filters and search
11. Practice graph (recharts)
12. Export data feature

**Week 4:**
13. Polish UI/animations
14. Mobile responsive fixes
15. Testing & bug fixes
16. Deploy to Vercel

---

## PHASE 2 FEATURES (Future)

- Dark mode toggle
- Multiple user profiles
- Cloud sync (Supabase)
- Practice goals & reminders
- Audio metronome integration
- Video upload (technique notes)
- Social features (share progress)
- Analytics dashboard (insights)
- Export to PDF/CSV

---

## RESEARCH RESOURCES

### If you need to look up:

**Next.js App Router:**
- https://nextjs.org/docs/app/building-your-application/routing
- https://nextjs.org/docs/app/building-your-application/data-fetching

**shadcn/ui Components:**
- Installation: https://ui.shadcn.com/docs/installation/next
- Components list: https://ui.shadcn.com/docs/components/accordion
- Theming: https://ui.shadcn.com/docs/theming

**Tailwind CSS:**
- Utility classes: https://tailwindcss.com/docs/utility-first
- Responsive: https://tailwindcss.com/docs/responsive-design
- Customization: https://tailwindcss.com/docs/configuration

**React Hooks:**
- useState: https://react.dev/reference/react/useState
- useEffect: https://react.dev/reference/react/useEffect
- useMemo: https://react.dev/reference/react/useMemo
- useCallback: https://react.dev/reference/react/useCallback

**localStorage:**
- MDN guide: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
- Best practices: https://web.dev/storage-for-the-web/

**TypeScript:**
- Handbook: https://www.typescriptlang.org/docs/handbook/intro.html
- React TypeScript: https://react-typescript-cheatsheet.netlify.app/

**Date Handling (date-fns):**
- Documentation: https://date-fns.org/docs/Getting-Started
- Format guide: https://date-fns.org/docs/format

**Charts (Recharts):**
- Bar chart: https://recharts.org/en-US/api/BarChart
- Examples: https://recharts.org/en-US/examples

---

## DEBUGGING TIPS

### Common Issues:

**localStorage not persisting:**
- Check if data is JSON.stringify() before saving
- Verify key names match constants
- Test in incognito (some browsers block localStorage)

**Timer not ticking:**
- Ensure setInterval is cleared on unmount
- Check if component re-renders interrupt interval

**Stats incorrect:**
- Console.log raw session data
- Verify date comparisons (timezone issues)
- Check duration is in seconds consistently

**Hydration errors (Next.js):**
- Don't render localStorage data on server
- Use useEffect to load client-side data
- Add null check before rendering

### Development Commands
```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run lint         # Run ESLint
npm run type-check   # TypeScript check only
```

---

## NOTES FOR AI ASSISTANT

When implementing:
1. **Always start** by checking project structure
2. **Reference** this spec for data models and types
3. **Follow** design.json for all styling
4. **Use** shadcn/ui components, customize with Tailwind
5. **Test** each feature manually before moving to next
6. **Ask** if requirements unclear (don't assume)
7. **Keep** components small and focused
8. **Prioritize** functionality over polish initially

---

## CHANGELOG

### 2026-02-09 - Initial Specification
- Created complete project spec
- Defined data models and tech stack
- Outlined all core features
- Established design system

---

END OF SPECIFICATION