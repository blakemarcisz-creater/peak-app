import React, { useState } from 'react';

const GENDERS = ['Male', 'Female', 'Other'];

const s = {
  wrap: {
    minHeight: '100vh',
    background: 'var(--bg)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '48px 20px 80px',
  },
  inner: { maxWidth: 480, width: '100%' },
  hero: { textAlign: 'center', marginBottom: 36 },
  logo: { fontSize: 36, fontWeight: 700, color: 'var(--accent)', letterSpacing: '-0.04em' },
  tagline: { fontSize: 15, color: 'var(--text-muted)', marginTop: 6 },
  step: { fontSize: 12, color: 'var(--text-dim)', marginTop: 4, letterSpacing: '0.06em', textTransform: 'uppercase' },
  card: {
    background: 'var(--bg-card)', border: '0.5px solid var(--border)',
    borderRadius: 'var(--radius)', padding: '20px', marginBottom: 16,
  },
  heading: { fontSize: 13, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: 16 },
  fieldLabel: { fontSize: 13, color: 'var(--text-muted)', marginBottom: 8, display: 'block' },
  input: {
    width: '100%', background: 'var(--bg-input)', border: '0.5px solid var(--border)',
    borderRadius: 'var(--radius-sm)', color: 'var(--text)', fontFamily: 'var(--font)',
    fontSize: 15, padding: '11px 14px', outline: 'none',
  },
  row: { marginBottom: 20 },
  sliderTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 },
  mono: { fontSize: 15, fontWeight: 500, color: 'var(--text)', fontFamily: 'var(--mono)' },
  ticks: { display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 10, color: 'var(--text-dim)' },
  genderGrid: { display: 'flex', gap: 8 },
  genderBtn: (active) => ({
    flex: 1, padding: '11px 0', fontSize: 14, fontWeight: active ? 500 : 400,
    borderRadius: 'var(--radius-sm)',
    border: active ? '1px solid var(--accent-border)' : '0.5px solid var(--border)',
    background: active ? 'var(--accent-dim)' : 'transparent',
    color: active ? 'var(--accent)' : 'var(--text-muted)',
    cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s',
  }),
  unitToggle: { display: 'flex', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '0.5px solid var(--border)' },
  unitBtn: (active) => ({
    padding: '4px 14px', fontSize: 12, fontWeight: active ? 500 : 400,
    background: active ? 'var(--accent-dim)' : 'transparent',
    color: active ? 'var(--accent)' : 'var(--text-dim)',
    border: 'none', cursor: 'pointer',
  }),
  themeGrid: { display: 'flex', gap: 10 },
  themeBtn: (active) => ({
    flex: 1, padding: '14px 0', fontSize: 14, fontWeight: active ? 500 : 400,
    borderRadius: 'var(--radius-sm)',
    border: active ? '1.5px solid var(--accent-border)' : '0.5px solid var(--border)',
    background: active ? 'var(--accent-dim)' : 'transparent',
    color: active ? 'var(--accent)' : 'var(--text-muted)',
    cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s',
    letterSpacing: '-0.01em',
  }),
  startBtn: {
    width: '100%', padding: '15px', fontSize: 16, fontWeight: 600,
    borderRadius: 'var(--radius)', background: 'var(--accent)', color: '#0a0a0a',
    border: 'none', cursor: 'pointer', letterSpacing: '-0.02em', marginTop: 8,
  },
  skip: { textAlign: 'center', marginTop: 14, fontSize: 13, color: 'var(--text-dim)', cursor: 'pointer' },
};

export default function Onboarding({ onComplete, theme, setTheme }) {
  const [profile, setProfile] = useState({
    name: '',
    gender: 'Male',
    age: 20,
    weight: 160,
    weightUnit: 'lbs',
  });

  function toggleUnit(unit) {
    const converted = unit === 'kg'
      ? Math.round(profile.weight * 0.453592)
      : Math.round(profile.weight * 2.20462);
    setProfile(p => ({ ...p, weight: converted, weightUnit: unit }));
  }

  return (
    <div style={s.wrap}>
      <div style={s.inner}>
        <div style={s.hero}>
          <div style={s.logo}>Peak</div>
          <div style={s.tagline}>Sleep smarter. Perform better.</div>
          <div style={s.step}>Create your profile</div>
        </div>

        <div style={s.card}>
          <div style={s.heading}>About you</div>

          <div style={s.row}>
            <span style={s.fieldLabel}>Your name (optional)</span>
            <input
              type="text"
              placeholder="First name"
              value={profile.name}
              onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
              style={s.input}
            />
          </div>

          <div style={s.row}>
            <span style={s.fieldLabel}>Gender</span>
            <div style={s.genderGrid}>
              {GENDERS.map(g => (
                <button key={g} style={s.genderBtn(profile.gender === g)} onClick={() => setProfile(p => ({ ...p, gender: g }))}>
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div style={s.row}>
            <div style={s.sliderTop}>
              <span style={s.fieldLabel}>Age</span>
              <span style={s.mono}>{profile.age} yrs</span>
            </div>
            <input
              type="range" min={13} max={60} step={1}
              value={profile.age}
              onChange={e => setProfile(p => ({ ...p, age: parseInt(e.target.value) }))}
            />
            <div style={s.ticks}><span>13</span><span>60</span></div>
          </div>

          <div>
            <div style={s.sliderTop}>
              <span style={s.fieldLabel}>Body weight</span>
              <div style={s.unitToggle}>
                {['lbs', 'kg'].map(unit => (
                  <button key={unit} style={s.unitBtn(profile.weightUnit === unit)} onClick={() => toggleUnit(unit)}>
                    {unit}
                  </button>
                ))}
              </div>
            </div>
            <input
              type="range"
              min={profile.weightUnit === 'lbs' ? 80 : 36}
              max={profile.weightUnit === 'lbs' ? 350 : 159}
              step={1}
              value={profile.weight}
              onChange={e => setProfile(p => ({ ...p, weight: parseInt(e.target.value) }))}
            />
            <div style={s.ticks}>
              <span>{profile.weightUnit === 'lbs' ? '80 lbs' : '36 kg'}</span>
              <span style={s.mono}>{profile.weight} {profile.weightUnit}</span>
              <span>{profile.weightUnit === 'lbs' ? '350 lbs' : '159 kg'}</span>
            </div>
          </div>
        </div>

        <div style={s.card}>
          <div style={s.heading}>Appearance</div>
          <div style={s.themeGrid}>
            <button style={s.themeBtn(theme === 'dark')} onClick={() => setTheme('dark')}>
              🌙 Dark
            </button>
            <button style={s.themeBtn(theme === 'light')} onClick={() => setTheme('light')}>
              ☀️ Light
            </button>
          </div>
        </div>

        <button style={s.startBtn} onClick={() => onComplete(profile)}>
          Get started →
        </button>
        <div style={s.skip} onClick={() => onComplete(profile)}>
          Skip for now
        </div>
      </div>
    </div>
  );
}
