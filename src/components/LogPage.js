import React from 'react';

const SPORTS = [
  'Baseball', 'Basketball', 'Football', 'Soccer',
  'Swimming', 'Track', 'Tennis', 'Volleyball',
  'Lacrosse', 'Wrestling', 'Golf', 'Rugby',
];

const styles = {
  page: { padding: '0 0 100px' },
  heading: { fontSize: 13, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: 12 },
  card: { background: 'var(--bg-card)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius)', padding: '20px', marginBottom: 16 },
  sportGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 },
  sportBtn: (active) => ({
    padding: '10px 4px',
    fontSize: 13,
    fontWeight: active ? 500 : 400,
    borderRadius: 'var(--radius-sm)',
    border: active ? '1px solid var(--accent-border)' : '0.5px solid var(--border)',
    background: active ? 'var(--accent-dim)' : 'transparent',
    color: active ? 'var(--accent)' : 'var(--text-muted)',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'all 0.15s',
  }),
  sliderRow: { marginBottom: 20 },
  sliderTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 },
  sliderLabel: { fontSize: 14, color: 'var(--text-muted)' },
  sliderVal: { fontSize: 15, fontWeight: 500, color: 'var(--text)', fontFamily: 'var(--mono)' },
  sliderTicks: { display: 'flex', justifyContent: 'space-between', marginTop: 4 },
  sliderTick: { fontSize: 10, color: 'var(--text-dim)' },
  textarea: {
    width: '100%',
    background: 'var(--bg-input)',
    border: '0.5px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text-muted)',
    fontFamily: 'var(--font)',
    fontSize: 14,
    padding: '12px',
    resize: 'vertical',
    minHeight: 80,
    outline: 'none',
    lineHeight: 1.6,
    transition: 'border-color 0.15s',
  },
  submitBtn: {
    width: '100%',
    padding: '14px',
    fontSize: 15,
    fontWeight: 500,
    borderRadius: 'var(--radius)',
    background: 'var(--accent)',
    color: '#0a0a0a',
    border: 'none',
    cursor: 'pointer',
    marginTop: 8,
    transition: 'opacity 0.15s',
    letterSpacing: '-0.01em',
  },
  alreadyLogged: {
    textAlign: 'center',
    padding: '16px',
    fontSize: 13,
    color: 'var(--text-muted)',
    background: 'var(--accent-dim)',
    border: '0.5px solid var(--accent-border)',
    borderRadius: 'var(--radius)',
    marginBottom: 16,
  }
};

function SliderRow({ label, min, max, step, value, onChange, formatVal, minLabel, maxLabel }) {
  return (
    <div style={styles.sliderRow}>
      <div style={styles.sliderTop}>
        <span style={styles.sliderLabel}>{label}</span>
        <span style={styles.sliderVal}>{formatVal ? formatVal(value) : value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(step < 1 ? parseFloat(e.target.value) : parseInt(e.target.value))}
      />
      {(minLabel || maxLabel) && (
        <div style={styles.sliderTicks}>
          <span style={styles.sliderTick}>{minLabel}</span>
          <span style={styles.sliderTick}>{maxLabel}</span>
        </div>
      )}
    </div>
  );
}

export default function LogPage({ form, setForm, onSubmit, todayLogged }) {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div style={styles.page}>
      <p style={{ fontSize: 13, color: 'var(--text-dim)', marginBottom: 24 }}>{today}</p>

      {todayLogged && (
        <div style={styles.alreadyLogged}>
          ✓ Already logged today — you can re-log to update your score
        </div>
      )}

      <div style={styles.card}>
        <div style={styles.heading}>Your sport</div>
        <div style={styles.sportGrid}>
          {SPORTS.map(s => (
            <button
              key={s}
              style={styles.sportBtn(form.sport === s)}
              onClick={() => setForm(f => ({ ...f, sport: s }))}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.heading}>Last night's sleep</div>
        <SliderRow
          label="Hours slept"
          min={2} max={12} step={0.5}
          value={form.hours}
          onChange={v => setForm(f => ({ ...f, hours: v }))}
          formatVal={v => `${v}h`}
          minLabel="2h" maxLabel="12h"
        />
        <SliderRow
          label="Sleep quality"
          min={1} max={10} step={1}
          value={form.quality}
          onChange={v => setForm(f => ({ ...f, quality: v }))}
          formatVal={v => `${v}/10`}
          minLabel="Poor" maxLabel="Perfect"
        />
        <SliderRow
          label="Bedtime consistency"
          min={1} max={10} step={1}
          value={form.consistency}
          onChange={v => setForm(f => ({ ...f, consistency: v }))}
          formatVal={v => `${v}/10`}
          minLabel="Irregular" maxLabel="Consistent"
        />
        <SliderRow
          label="Stress level"
          min={1} max={10} step={1}
          value={form.stress}
          onChange={v => setForm(f => ({ ...f, stress: v }))}
          formatVal={v => `${v}/10`}
          minLabel="Calm" maxLabel="High stress"
        />
      </div>

      <div style={styles.card}>
        <div style={styles.heading}>How you feel today</div>
        <SliderRow
          label="Mood / Energy"
          min={1} max={10} step={1}
          value={form.mood}
          onChange={v => setForm(f => ({ ...f, mood: v }))}
          formatVal={v => `${v}/10`}
          minLabel="Drained" maxLabel="Energized"
        />
      </div>

      <div style={styles.card}>
        <div style={styles.heading}>Nutrition & Hydration</div>
        <SliderRow
          label="Meal quality"
          min={1} max={10} step={1}
          value={form.nutrition}
          onChange={v => setForm(f => ({ ...f, nutrition: v }))}
          formatVal={v => `${v}/10`}
          minLabel="Poor diet" maxLabel="Clean eating"
        />
        <SliderRow
          label="Hydration"
          min={1} max={10} step={1}
          value={form.hydration}
          onChange={v => setForm(f => ({ ...f, hydration: v }))}
          formatVal={v => `${v}/10`}
          minLabel="Dehydrated" maxLabel="Well hydrated"
        />
        <div style={{ marginTop: 4 }}>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>Notes (optional)</div>
          <textarea
            style={styles.textarea}
            placeholder="How are you feeling? Any injuries, big games, or things on your mind..."
            value={form.notes}
            onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            onFocus={e => (e.target.style.borderColor = 'var(--accent-border)')}
            onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
          />
        </div>
      </div>

      <button style={styles.submitBtn} onClick={onSubmit}>
        Calculate my performance score →
      </button>
    </div>
  );
}
