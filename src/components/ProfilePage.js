import React, { useState } from 'react';
import { getRecommendedWaterOz } from '../utils/scoring';

const GENDERS = ['Male', 'Female', 'Other'];

const s = {
  page: { padding: '0 0 100px' },
  card: { background: 'var(--bg-card)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius)', padding: '20px', marginBottom: 16 },
  heading: { fontSize: 13, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: 16 },
  fieldLabel: { fontSize: 13, color: 'var(--text-muted)', marginBottom: 8, display: 'block' },
  input: {
    width: '100%', background: 'var(--bg-input)', border: '0.5px solid var(--border)',
    borderRadius: 'var(--radius-sm)', color: 'var(--text)', fontFamily: 'var(--font)',
    fontSize: 14, padding: '10px 12px', outline: 'none',
  },
  row: { marginBottom: 20 },
  sliderTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 },
  mono: { fontSize: 15, fontWeight: 500, color: 'var(--text)', fontFamily: 'var(--mono)' },
  ticks: { display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 10, color: 'var(--text-dim)' },
  genderGrid: { display: 'flex', gap: 8 },
  genderBtn: (active) => ({
    flex: 1, padding: '10px 0', fontSize: 13, fontWeight: active ? 500 : 400,
    borderRadius: 'var(--radius-sm)',
    border: active ? '1px solid var(--accent-border)' : '0.5px solid var(--border)',
    background: active ? 'var(--accent-dim)' : 'transparent',
    color: active ? 'var(--accent)' : 'var(--text-muted)',
    cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s',
  }),
  unitToggle: { display: 'flex', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '0.5px solid var(--border)' },
  unitBtn: (active) => ({
    padding: '4px 12px', fontSize: 12, fontWeight: active ? 500 : 400,
    background: active ? 'var(--accent-dim)' : 'transparent',
    color: active ? 'var(--accent)' : 'var(--text-dim)',
    border: 'none', cursor: 'pointer',
  }),
  targetsCard: {
    background: 'rgba(0,229,160,0.06)', border: '0.5px solid var(--accent-border)',
    borderRadius: 'var(--radius)', padding: '20px', marginBottom: 16,
  },
  targetsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 12 },
  targetVal: { fontSize: 24, fontWeight: 500, fontFamily: 'var(--mono)', color: 'var(--accent)' },
  targetLabel: { fontSize: 11, color: 'var(--text-dim)', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.06em' },
  saveBtn: {
    width: '100%', padding: '14px', fontSize: 15, fontWeight: 500,
    borderRadius: 'var(--radius)', background: 'var(--accent)', color: '#0a0a0a',
    border: 'none', cursor: 'pointer', letterSpacing: '-0.01em',
  },
};

export default function ProfilePage({ profile, setProfile, theme, setTheme }) {
  const [saved, setSaved] = useState(false);

  const recommendedOz = getRecommendedWaterOz(profile);
  const weightInLbs = profile.weightUnit === 'kg'
    ? Math.round(profile.weight * 2.20462)
    : profile.weight;

  function toggleUnit(unit) {
    const converted = unit === 'kg'
      ? Math.round(profile.weight * 0.453592)
      : Math.round(profile.weight * 2.20462);
    setProfile(p => ({ ...p, weight: converted, weightUnit: unit }));
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.heading}>Personal info</div>

        <div style={s.row}>
          <span style={s.fieldLabel}>Name (optional)</span>
          <input
            type="text"
            placeholder="Your name"
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

        <div style={{ marginBottom: 4 }}>
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

      <div style={s.targetsCard}>
        <div style={s.heading}>Your daily targets</div>
        <div style={s.targetsGrid}>
          <div>
            <div style={s.targetVal}>{recommendedOz} oz</div>
            <div style={s.targetLabel}>Water per day</div>
          </div>
          <div>
            <div style={s.targetVal}>8.5h</div>
            <div style={s.targetLabel}>Ideal sleep</div>
          </div>
          <div>
            <div style={s.targetVal}>{profile.age < 18 ? '9–10h' : '7–9h'}</div>
            <div style={s.targetLabel}>Sleep range</div>
          </div>
          <div>
            <div style={s.targetVal}>{weightInLbs} lbs</div>
            <div style={s.targetLabel}>Body weight</div>
          </div>
        </div>
      </div>

      <div style={s.card}>
        <div style={s.heading}>Appearance</div>
        <div style={{ display: 'flex', gap: 10 }}>
          {[
            { value: 'dark', label: '🌙 Dark' },
            { value: 'light', label: '☀️ Light' },
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setTheme(value)}
              style={{
                flex: 1, padding: '12px 0', fontSize: 14, fontWeight: theme === value ? 500 : 400,
                borderRadius: 'var(--radius-sm)',
                border: theme === value ? '1.5px solid var(--accent-border)' : '0.5px solid var(--border)',
                background: theme === value ? 'var(--accent-dim)' : 'transparent',
                color: theme === value ? 'var(--accent)' : 'var(--text-muted)',
                cursor: 'pointer', transition: 'all 0.15s',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <button style={s.saveBtn} onClick={handleSave}>
        {saved ? '✓ Profile saved' : 'Save profile'}
      </button>
    </div>
  );
}
