import React, { useState } from 'react';

const SPORTS = [
  'Baseball', 'Basketball', 'Football', 'Soccer',
  'Swimming', 'Track', 'Tennis', 'Volleyball',
  'Lacrosse', 'Wrestling', 'Golf', 'Rugby',
];

const s = {
  page: { padding: '0 0 100px' },
  heading: { fontSize: 13, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: 12 },
  card: { background: 'var(--bg-card)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius)', padding: '20px', marginBottom: 16 },
  sportGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 },
  sportBtn: (active) => ({
    padding: '10px 4px', fontSize: 13, fontWeight: active ? 500 : 400,
    borderRadius: 'var(--radius-sm)',
    border: active ? '1px solid var(--accent-border)' : '0.5px solid var(--border)',
    background: active ? 'var(--accent-dim)' : 'transparent',
    color: active ? 'var(--accent)' : 'var(--text-muted)',
    cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s',
  }),
  sliderRow: { marginBottom: 20 },
  sliderTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 },
  sliderLabel: { fontSize: 14, color: 'var(--text-muted)' },
  sliderVal: { fontSize: 15, fontWeight: 500, color: 'var(--text)', fontFamily: 'var(--mono)' },
  sliderTicks: { display: 'flex', justifyContent: 'space-between', marginTop: 4 },
  sliderTick: { fontSize: 10, color: 'var(--text-dim)' },
  foodInputRow: { display: 'flex', gap: 8, marginBottom: 12 },
  foodInput: {
    flex: 1, background: 'var(--bg-input)', border: '0.5px solid var(--border)',
    borderRadius: 'var(--radius-sm)', color: 'var(--text)', fontFamily: 'var(--font)',
    fontSize: 14, padding: '9px 12px', outline: 'none',
  },
  addBtn: {
    padding: '9px 16px', fontSize: 13, fontWeight: 500,
    borderRadius: 'var(--radius-sm)', background: 'var(--accent-dim)',
    border: '0.5px solid var(--accent-border)', color: 'var(--accent)', cursor: 'pointer',
  },
  foodTag: {
    display: 'flex', alignItems: 'center', gap: 8,
    background: 'var(--bg-input)', border: '0.5px solid var(--border)',
    borderRadius: 'var(--radius-sm)', padding: '7px 12px',
    fontSize: 13, color: 'var(--text-muted)', marginBottom: 6,
  },
  removeBtn: {
    marginLeft: 'auto', background: 'none', border: 'none',
    color: 'var(--text-dim)', cursor: 'pointer', fontSize: 16, lineHeight: 1, padding: 0,
  },
  waterRow: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 },
  waterInput: {
    width: 90, background: 'var(--bg-input)', border: '0.5px solid var(--border)',
    borderRadius: 'var(--radius-sm)', color: 'var(--text)', fontFamily: 'var(--mono)',
    fontSize: 18, fontWeight: 500, padding: '10px 12px', outline: 'none', textAlign: 'center',
  },
  waterMeta: { fontSize: 13, color: 'var(--text-muted)' },
  progressWrap: { height: 6, background: 'var(--border)', borderRadius: 99, overflow: 'hidden', marginTop: 8 },
  textarea: {
    width: '100%', background: 'var(--bg-input)', border: '0.5px solid var(--border)',
    borderRadius: 'var(--radius-sm)', color: 'var(--text-muted)', fontFamily: 'var(--font)',
    fontSize: 14, padding: '12px', resize: 'vertical', minHeight: 80, outline: 'none', lineHeight: 1.6,
  },
  submitBtn: {
    width: '100%', padding: '14px', fontSize: 15, fontWeight: 500,
    borderRadius: 'var(--radius)', background: 'var(--accent)', color: '#0a0a0a',
    border: 'none', cursor: 'pointer', marginTop: 8, letterSpacing: '-0.01em',
  },
  alreadyLogged: {
    textAlign: 'center', padding: '16px', fontSize: 13, color: 'var(--text-muted)',
    background: 'var(--accent-dim)', border: '0.5px solid var(--accent-border)',
    borderRadius: 'var(--radius)', marginBottom: 16,
  },
};

function SliderRow({ label, min, max, step, value, onChange, formatVal, minLabel, maxLabel }) {
  return (
    <div style={s.sliderRow}>
      <div style={s.sliderTop}>
        <span style={s.sliderLabel}>{label}</span>
        <span style={s.sliderVal}>{formatVal ? formatVal(value) : value}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(step < 1 ? parseFloat(e.target.value) : parseInt(e.target.value))}
      />
      {(minLabel || maxLabel) && (
        <div style={s.sliderTicks}>
          <span style={s.sliderTick}>{minLabel}</span>
          <span style={s.sliderTick}>{maxLabel}</span>
        </div>
      )}
    </div>
  );
}

export default function LogPage({ form, setForm, onSubmit, todayLogged, recommendedOz }) {
  const [foodInput, setFoodInput] = useState('');
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  function addFood() {
    const trimmed = foodInput.trim();
    if (!trimmed) return;
    setForm(f => ({ ...f, foods: [...(f.foods || []), trimmed] }));
    setFoodInput('');
  }

  function removeFood(index) {
    setForm(f => ({ ...f, foods: f.foods.filter((_, i) => i !== index) }));
  }

  const waterPct = Math.min(100, Math.round(((form.waterOz || 0) / recommendedOz) * 100));
  const waterColor = waterPct >= 80 ? '#00e5a0' : waterPct >= 50 ? '#f59e0b' : '#ef4444';

  return (
    <div style={s.page}>
      <p style={{ fontSize: 13, color: 'var(--text-dim)', marginBottom: 24 }}>{today}</p>

      {todayLogged && (
        <div style={s.alreadyLogged}>
          ✓ Already logged today — you can re-log to update your score
        </div>
      )}

      <div style={s.card}>
        <div style={s.heading}>Your sport</div>
        <div style={s.sportGrid}>
          {SPORTS.map(sport => (
            <button key={sport} style={s.sportBtn(form.sport === sport)} onClick={() => setForm(f => ({ ...f, sport }))}>
              {sport}
            </button>
          ))}
        </div>
      </div>

      <div style={s.card}>
        <div style={s.heading}>Last night's sleep</div>
        <SliderRow label="Hours slept" min={2} max={12} step={0.5} value={form.hours}
          onChange={v => setForm(f => ({ ...f, hours: v }))} formatVal={v => `${v}h`} minLabel="2h" maxLabel="12h" />
        <SliderRow label="Sleep quality" min={1} max={10} step={1} value={form.quality}
          onChange={v => setForm(f => ({ ...f, quality: v }))} formatVal={v => `${v}/10`} minLabel="Poor" maxLabel="Perfect" />
        <SliderRow label="Bedtime consistency" min={1} max={10} step={1} value={form.consistency}
          onChange={v => setForm(f => ({ ...f, consistency: v }))} formatVal={v => `${v}/10`} minLabel="Irregular" maxLabel="Consistent" />
        <SliderRow label="Stress level" min={1} max={10} step={1} value={form.stress}
          onChange={v => setForm(f => ({ ...f, stress: v }))} formatVal={v => `${v}/10`} minLabel="Calm" maxLabel="High stress" />
      </div>

      <div style={s.card}>
        <div style={s.heading}>How you feel today</div>
        <SliderRow label="Mood / Energy" min={1} max={10} step={1} value={form.mood}
          onChange={v => setForm(f => ({ ...f, mood: v }))} formatVal={v => `${v}/10`} minLabel="Drained" maxLabel="Energized" />
      </div>

      <div style={s.card}>
        <div style={s.heading}>Today's food</div>
        <div style={s.foodInputRow}>
          <input
            type="text"
            placeholder="e.g. Chicken and rice, banana..."
            value={foodInput}
            style={s.foodInput}
            onChange={e => setFoodInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addFood()}
          />
          <button style={s.addBtn} onClick={addFood}>Add</button>
        </div>
        {(form.foods || []).length === 0 && (
          <div style={{ fontSize: 13, color: 'var(--text-dim)', textAlign: 'center', padding: '8px 0' }}>
            No food logged yet
          </div>
        )}
        {(form.foods || []).map((food, i) => (
          <div key={i} style={s.foodTag}>
            <span>🍽 {food}</span>
            <button style={s.removeBtn} onClick={() => removeFood(i)}>×</button>
          </div>
        ))}
      </div>

      <div style={s.card}>
        <div style={s.heading}>Water intake</div>
        <div style={s.waterRow}>
          <input
            type="number"
            min={0}
            max={300}
            value={form.waterOz || ''}
            placeholder="0"
            style={s.waterInput}
            onChange={e => setForm(f => ({ ...f, waterOz: parseInt(e.target.value) || 0 }))}
          />
          <div>
            <div style={s.waterMeta}>oz today</div>
            <div style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 2 }}>
              Goal: {recommendedOz} oz/day
            </div>
          </div>
          <div style={{ marginLeft: 'auto', fontSize: 15, fontWeight: 500, fontFamily: 'var(--mono)', color: waterColor }}>
            {waterPct}%
          </div>
        </div>
        <div style={s.progressWrap}>
          <div style={{ height: '100%', width: `${waterPct}%`, background: waterColor, borderRadius: 99, transition: 'width 0.4s ease' }} />
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 8 }}>
          {waterPct < 50 ? 'Drink more water before your session' : waterPct < 80 ? 'Almost there — keep sipping' : 'Great hydration today!'}
        </div>
      </div>

      <div style={s.card}>
        <div style={s.heading}>Notes (optional)</div>
        <textarea
          style={s.textarea}
          placeholder="How are you feeling? Any injuries, big games, or things on your mind..."
          value={form.notes}
          onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
        />
      </div>

      <button style={s.submitBtn} onClick={onSubmit}>
        Calculate my performance score →
      </button>
    </div>
  );
}
