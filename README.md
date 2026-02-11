# StringLog 🎸

**Smart practice tracking and study routine planner for string musicians**

A modern web application designed to help guitarists, bassists, violinists, cellists, and other string instrument players optimize their practice sessions through intelligent tracking, analytics, and personalized study routines.

---

## 🎯 Features

### Practice Tracking
- **Precision Timer**: Track practice sessions with millisecond accuracy
- **Session Metadata**: Add notes, link songs, specify instrument type
- **Auto-save**: Never lose your practice data

### Smart Analytics
- **Weekly Insights**: Visual graphs showing practice trends
- **Streak Tracking**: Maintain your practice momentum
- **Performance Metrics**: Total hours, weekly goals, session history

### Repertoire Management
- **Song Catalog**: Organize your musical repertoire
- **Spotify Integration**: Search and import song metadata with album art
- **Progress Tracking**: Mark songs as learning, mastered, or wishlist
- **Practice Time Per Song**: See exactly how much time you've invested

### Study Routine Planner *(Coming Soon)*
- **Personalized Practice Plans**: AI-generated routines based on your goals
- **Skill Assessment**: Identify strengths and areas for improvement
- **Practice Templates**: Warm-ups, technique drills, repertoire focus
- **Goal Setting**: Set and track musical objectives
- **Smart Scheduling**: Optimal practice time recommendations

---

## 🚀 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Animations**: Framer Motion
- **Data**: localStorage (client-side)
- **Theme**: Dark mode default with next-themes
- **Charts**: Recharts for data visualization
- **Music API**: Spotify Web API

---

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/kazin1898/StringLog.git
cd StringLog

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Create a `.env.local` file:

```bash
# Spotify API (optional, for song search)
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_client_id
NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET=your_client_secret
```

Get Spotify credentials at [developer.spotify.com](https://developer.spotify.com/dashboard)

---

## 📱 Pages

- **Dashboard** (`/`) - Practice stats, graphs, recent sessions
- **Practice** (`/practice`) - Timer with session metadata
- **Repertoire** (`/repertoire`) - Song catalog with Spotify search
- **History** (`/history`) - Complete session log with filters
- **Goals** (`/goals`) - Set and track practice objectives *(in development)*
- **Settings** (`/settings`) - App preferences and data management

---

## 🎨 Design Philosophy

- **Minimalist & Modern**: Clean interface focused on functionality
- **Dark Mode First**: Easy on the eyes during long practice sessions
- **Smooth Animations**: Delightful micro-interactions without distraction
- **Mobile Responsive**: Practice tracking on any device

---

## 🗺️ Roadmap

### Phase 2 (In Progress)
- [ ] AI-powered practice routine generator
- [ ] Skill assessment algorithm
- [ ] Practice templates library
- [ ] Goal tracking with reminders
- [ ] Export/import data (JSON, CSV)

### Phase 3 (Future)
- [ ] Cloud sync (Supabase/PostgreSQL)
- [ ] Multiple user profiles
- [ ] Metronome integration
- [ ] Video uploads for technique notes
- [ ] Social features (share progress)
- [ ] Mobile app (React Native)

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

---

## 📄 License

MIT License - see LICENSE file for details

---

## 👨‍💻 Author

**Caique V**
[GitHub](https://github.com/kazin1898) • [StringLog](https://github.com/kazin1898/StringLog)

---

**Built with ❤️ for musicians who take their craft seriously**
