import React, { useState } from 'react';
import { getTier, getMetrics, getInsight } from '../utils/scoring';

const styles = {
  page: { padding: '0 0 100px' },
  empty: { textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)', fontSize: 14 },
  emptyBtn: {
    marginTop: 16,
    padding: '10px 20px',
    fontSize: 14,
    borderRadius: 'var(--radius-sm)',
    background: 'transparent',
    border: '0.5px solid var(--border)',
    color: 'var(--text-muted)',
    cursor: 'pointer',
  },
  scoreCard: {
    background: 'var(--bg-card)',
    border: '0.5px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '32px 20px 20px',
    marginBottom: 16,
    textAlign: 'center',
  },
  scoreBig: { fontSize: 80, fontWeight: 600, lineHeight: 1, fontFamily: 'var(--mono)', letterSpacing: '-0.04em' },
  scoreLabel: { fontSize: 13, color: 'var(--text-muted)', marginTop: 8 },
  scoreTier: { fontSize: 16, fontWeight: 500, marginTop: 4 },
  shareBtn: {
    marginTop: 20,
    padding: '9px 18px',
    fontSize: 13,
    fontWeight: 500,
    borderRadius: 'var(--radius-sm)',
    background: 'transparent',
    border: '0.5px solid var(--border)',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    transition: 'all 0.15s',
    letterSpacing: '-0.01em',
  },
  metricsGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 16 },
  metricCard: {
    background: 'var(--bg-card)',
    border: '0.5px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '16px',
  },
  metricVal: { fontSize: 28, fontWeight: 500, fontFamily: 'var(--mono)' },
  metricLabel: { fontSize: 12, color: 'var(--text-muted)', marginTop: 2 },
  barWrap: { height: 4, background: 'var(--border)', borderRadius: 99, marginTop: 8, overflow: 'hidden' },
  insightCard: {
    background: 'var(--bg-card)',
    border: '0.5px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '20px',
    marginBottom: 16,
  },
  insightLabel: { fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: 10 },
  insightText: { fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7 },
  tipsList: { listStyle: 'none', padding: 0 },
  tipItem: { fontSize: 13, color: 'var(--text-muted)', padding: '8px 0', borderBottom: '0.5px solid var(--border)', display: 'flex', gap: 10, alignItems: 'flex-start' },
  tipDot: { width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', marginTop: 7, flexShrink: 0 },
  sportTag: {
    display: 'inline-block',
    padding: '3px 10px',
    fontSize: 11,
    fontWeight: 500,
    borderRadius: 99,
    background: 'var(--accent-dim)',
    color: 'var(--accent)',
    border: '0.5px solid var(--accent-border)',
    marginBottom: 8,
  },
  notesCard: {
    background: 'var(--bg-card)',
    border: '0.5px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '20px',
    marginBottom: 16,
  },
};

function getTips(score, sport) {
  const tips = [];
  if (score >= 85) {
    tips.push(`Push hard in today's ${sport} session — your body is primed.`);
    tips.push('Consider tackling a skill you\'ve been working to improve.');
    tips.push('Great day for competition or high-intensity scrimmage.');
  } else if (score >= 70) {
    tips.push(`Solid day for ${sport} — keep your normal routine.`);
    tips.push('Stay hydrated throughout the day.');
    tips.push('Aim for 8–9 hours tonight to keep your streak going.');
  } else if (score >= 55) {
    tips.push('Do a longer warm-up than usual before practice.');
    tips.push('Avoid max-effort lifts or sprints today.');
    tips.push('Prioritize sleep tonight: dark room, no screens 30 min before bed.');
  } else {
    tips.push('Consider a lighter training day or active recovery.');
    tips.push('Your reaction time and decision-making will be slower — be patient.');
    tips.push('Nap 20–30 min this afternoon if possible. No longer or it disrupts tonight.');
    tips.push('Go to bed 1–2 hours earlier tonight.');
  }
  return tips;
}

function MetricBar({ label, value, color }) {
  return (
    <div style={styles.metricCard}>
      <div style={{ ...styles.metricVal, color }}>{value}%</div>
      <div style={styles.metricLabel}>{label}</div>
      <div style={styles.barWrap}>
        <div style={{ height: '100%', width: `${value}%`, background: color, borderRadius: 99, transition: 'width 0.6s ease' }} />
      </div>
    </div>
  );
}

function buildShareText(latest, tier, metrics) {
  return [
    `⚡ Peak Performance Score`,
    `Sport: ${latest.sport}`,
    `Score: ${latest.score}/99 — ${tier.description}`,
    `Sleep: ${latest.hours}h | Quality: ${latest.quality}/10 | Mood: ${latest.mood ?? '—'}/10`,
    `Nutrition: ${latest.nutrition ?? '—'}/10 | Hydration: ${latest.hydration ?? '—'}/10`,
    ``,
    `Reaction: ${metrics.reaction}%  Endurance: ${metrics.endurance}%`,
    `Focus: ${metrics.focus}%  Power: ${metrics.power}%`,
  ].join('\n');
}

export default function ScorePage({ latest, onGoLog, recommendedOz = 64 }) {
  const [copied, setCopied] = useState(false);

  if (!latest) {
    return (
      <div style={styles.empty}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>😴</div>
        <div>No score yet — log last night's sleep to get your performance prediction.</div>
        <button style={styles.emptyBtn} onClick={onGoLog}>Log my sleep →</button>
      </div>
    );
  }

  const tier = getTier(latest.score);
  const metrics = getMetrics(latest.score);
  const insight = getInsight(latest.score, latest);
  const tips = getTips(latest.score, latest.sport);

  function handleShare() {
    navigator.clipboard.writeText(buildShareText(latest, tier, metrics)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div style={styles.page}>
      <div style={styles.scoreCard}>
        <div style={styles.sportTag}>{latest.sport}</div>
        <div style={{ ...styles.scoreBig, color: tier.color }}>{latest.score}</div>
        <div style={styles.scoreLabel}>performance score</div>
        <div style={{ ...styles.scoreTier, color: tier.color }}>{tier.description}</div>
        <button style={styles.shareBtn} onClick={handleShare}>
          {copied ? '✓ Copied!' : 'Copy summary'}
        </button>
      </div>

      <div style={styles.metricsGrid}>
        <MetricBar label="Reaction time" value={metrics.reaction} color={tier.color} />
        <MetricBar label="Endurance" value={metrics.endurance} color={tier.color} />
        <MetricBar label="Focus" value={metrics.focus} color={tier.color} />
        <MetricBar label="Power output" value={metrics.power} color={tier.color} />
      </div>

      <div style={styles.insightCard}>
        <div style={styles.insightLabel}>Today's insight</div>
        <p style={styles.insightText}>{insight}</p>
      </div>

      {(latest.foods && latest.foods.length > 0) && (
        <div style={styles.notesCard}>
          <div style={styles.insightLabel}>Food logged today</div>
          {latest.foods.map((food, i) => (
            <div key={i} style={{ fontSize: 13, color: 'var(--text-muted)', padding: '6px 0', borderBottom: i === latest.foods.length - 1 ? 'none' : '0.5px solid var(--border)', display: 'flex', gap: 8 }}>
              <span>🍽</span>{food}
            </div>
          ))}
        </div>
      )}

      {latest.waterOz > 0 && (
        <div style={styles.notesCard}>
          <div style={styles.insightLabel}>Hydration</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontSize: 28, fontWeight: 500, fontFamily: 'var(--mono)', color: latest.waterOz >= recommendedOz * 0.8 ? '#00e5a0' : '#f59e0b' }}>
              {latest.waterOz} oz
            </span>
            <span style={{ fontSize: 13, color: 'var(--text-dim)' }}>/ {recommendedOz} oz goal</span>
          </div>
          <div style={{ height: 4, background: 'var(--border)', borderRadius: 99, marginTop: 10, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${Math.min(100, Math.round((latest.waterOz / recommendedOz) * 100))}%`, background: latest.waterOz >= recommendedOz * 0.8 ? '#00e5a0' : '#f59e0b', borderRadius: 99 }} />
          </div>
        </div>
      )}

      {latest.notes && (
        <div style={styles.notesCard}>
          <div style={styles.insightLabel}>Your notes</div>
          <p style={styles.insightText}>{latest.notes}</p>
        </div>
      )}

      <div style={styles.insightCard}>
        <div style={styles.insightLabel}>Recommendations</div>
        <ul style={styles.tipsList}>
          {tips.map((tip, i) => (
            <li key={i} style={{ ...styles.tipItem, borderBottom: i === tips.length - 1 ? 'none' : '0.5px solid var(--border)' }}>
              <span style={styles.tipDot} />
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
