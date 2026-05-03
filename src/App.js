import React, { useLayoutEffect } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { calcScore, getRecommendedWaterOz } from './utils/scoring';
import Onboarding from './components/Onboarding';
import LogPage from './components/LogPage';
import ScorePage from './components/ScorePage';
import HistoryPage from './components/HistoryPage';
import ProfilePage from './components/ProfilePage';

const NAV = [
  { id: 'log', label: 'Log' },
  { id: 'score', label: 'Score' },
  { id: 'history', label: 'History' },
  { id: 'profile', label: 'Profile' },
];

const DEFAULT_FORM = {
  sport: 'Baseball',
  hours: 7,
  quality: 7,
  consistency: 6,
  stress: 4,
  mood: 6,
  foods: [],
  waterOz: 0,
  notes: '',
};

const DEFAULT_PROFILE = {
  name: '',
  gender: 'Male',
  age: 20,
  weight: 160,
  weightUnit: 'lbs',
};

export default function App() {
  const [tab, setTab] = React.useState('log');
  const [form, setForm] = React.useState(DEFAULT_FORM);
  const [history, setHistory] = useLocalStorage('peak_history', []);
  const [latest, setLatest] = useLocalStorage('peak_latest', null);
  const [profile, setProfile] = useLocalStorage('peak_profile', DEFAULT_PROFILE);
  const [onboarded, setOnboarded] = useLocalStorage('peak_onboarded', false);
  const [theme, setTheme] = useLocalStorage('peak_theme', 'dark');

  // Apply theme before paint to avoid flash
  useLayoutEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const todayStr = new Date().toDateString();
  const todayLogged = history.some(e => new Date(e.date).toDateString() === todayStr);
  const recommendedOz = getRecommendedWaterOz(profile);

  function handleSubmit() {
    const score = calcScore({ ...form, recommendedOz });
    const entry = { ...form, score, date: new Date().toISOString() };
    setLatest(entry);
    setHistory(prev => {
      const filtered = prev.filter(e => new Date(e.date).toDateString() !== todayStr);
      return [...filtered, entry];
    });
    setTab('score');
  }

  function handleOnboardingComplete(profileData) {
    setProfile(profileData);
    setOnboarded(true);
  }

  if (!onboarded) {
    return (
      <Onboarding
        theme={theme}
        setTheme={setTheme}
        onComplete={handleOnboardingComplete}
      />
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <header style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: theme === 'light' ? 'rgba(242,242,242,0.88)' : 'rgba(10,10,10,0.85)',
        backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '0.5px solid var(--border)', padding: '0 20px',
      }}>
        <div style={{ maxWidth: 480, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
          <span style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.03em', color: 'var(--accent)' }}>Peak</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {profile.name && (
              <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>{profile.name}</span>
            )}
            {latest && new Date(latest.date).toDateString() === todayStr && (
              <span style={{
                fontSize: 12, fontFamily: 'var(--mono)', fontWeight: 500,
                color: 'var(--text-dim)', background: 'var(--bg-input)',
                padding: '4px 10px', borderRadius: 99, border: '0.5px solid var(--border)',
              }}>
                {latest.score} today
              </span>
            )}
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 480, margin: '0 auto', padding: '24px 20px 0' }}>
        {tab === 'log' && (
          <LogPage
            form={form}
            setForm={setForm}
            onSubmit={handleSubmit}
            todayLogged={todayLogged}
            recommendedOz={recommendedOz}
          />
        )}
        {tab === 'score' && (
          <ScorePage
            latest={latest && new Date(latest.date).toDateString() === todayStr ? latest : null}
            onGoLog={() => setTab('log')}
            recommendedOz={recommendedOz}
            profile={profile}
          />
        )}
        {tab === 'history' && (
          <HistoryPage
            history={history}
            onClear={() => { setHistory([]); setLatest(null); }}
          />
        )}
        {tab === 'profile' && (
          <ProfilePage
            profile={profile}
            setProfile={setProfile}
            theme={theme}
            setTheme={setTheme}
          />
        )}
      </main>

      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: theme === 'light' ? 'rgba(242,242,242,0.95)' : 'rgba(10,10,10,0.92)',
        backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        borderTop: '0.5px solid var(--border)',
        display: 'flex', justifyContent: 'center',
      }}>
        <div style={{ display: 'flex', maxWidth: 480, width: '100%' }}>
          {NAV.map(({ id, label }) => {
            const active = tab === id;
            return (
              <button
                key={id}
                onClick={() => setTab(id)}
                style={{
                  flex: 1, padding: '14px 0', fontSize: 13,
                  fontWeight: active ? 500 : 400,
                  color: active ? 'var(--accent)' : 'var(--text-dim)',
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  borderTop: active ? '1.5px solid var(--accent)' : '1.5px solid transparent',
                  transition: 'color 0.15s', letterSpacing: '-0.01em',
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
