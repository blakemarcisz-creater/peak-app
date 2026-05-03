# Peak 🏆

**Sleep smarter. Perform better.**

Peak is a web app that helps athletes track their sleep and predict next-day athletic performance. Log your sleep each night and get a personalized performance score with sport-specific insights and recommendations.

## Features

- 📊 **Performance score (0–99)** based on sleep hours, quality, consistency, and stress
- ⚡ **Sub-metrics** — reaction time, endurance, focus, and power output estimates
- 💡 **Sport-specific insights** and daily recommendations
- 📈 **History tracking** with a trend chart and streak counter
- 💾 **Local storage** — no account needed, data stays on your device

## Getting Started

### Prerequisites
- Node.js (v16 or higher) — [download here](https://nodejs.org/)
- npm (comes with Node.js)

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/peak-app.git
cd peak-app

# 2. Install dependencies
npm install

# 3. Start the dev server
npm start
```

The app will open at `http://localhost:3000`

### Build for production

```bash
npm run build
```

This creates a `build/` folder you can deploy to GitHub Pages, Vercel, Netlify, etc.

## Deploy to GitHub Pages (free)

1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add to `package.json`:
   ```json
   "homepage": "https://YOUR_USERNAME.github.io/peak-app",
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d build"
   }
   ```
3. Run `npm run deploy`

## Tech Stack

- [React 18](https://react.dev/) — UI framework
- [Recharts](https://recharts.org/) — chart library
- [Lucide React](https://lucide.dev/) — icons
- Local Storage API — data persistence

## Project Structure

```
src/
├── components/
│   ├── LogPage.js       # Sleep input form
│   ├── ScorePage.js     # Performance score display
│   └── HistoryPage.js   # History + trend chart
├── hooks/
│   └── useLocalStorage.js  # Persistent state hook
├── utils/
│   └── scoring.js       # Score calculation logic
├── App.js               # Root component + navigation
└── index.css            # Global styles
```

## How the Score is Calculated

| Factor | Weight |
|--------|--------|
| Hours slept (ideal: 8.5h) | 35% |
| Sleep quality (1–10) | 30% |
| Bedtime consistency (1–10) | 20% |
| Stress level (inverted) | 15% |

## Roadmap

- [ ] Wearable integration (Apple Health, Garmin)
- [ ] Team mode for coaches
- [ ] Push notifications for bedtime reminders
- [ ] Nutrition and training load inputs
- [ ] Mobile app (React Native)

## License

MIT
