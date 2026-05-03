import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { getTier, getAvgScore, getStreak, formatDate, getBadges } from '../utils/scoring';

const styles = {
  page: { padding: '0 0 100px' },
  empty: { textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)', fontSize: 14 },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 },
  statCard: {
    background: 'var(--bg-card)',
    border: '0.5px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '16px',
    textAlign: 'center',
  },
  statVal: { fontSize: 28, fontWeight: 500, fontFamily: 'var(--mono)' },
  statLabel: { fontSize: 11, color: 'var(--text-muted)', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.06em' },
  chartCard: {
    background: 'var(--bg-card)',
    border: '0.5px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '20px',
    marginBottom: 16,
  },
  chartLabel: { fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: 16 },
  badgesCard: {
    background: 'var(--bg-card)',
    border: '0.5px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '20px',
    marginBottom: 16,
  },
  badgesGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 },
  badgeItem: {
    background: 'var(--bg-input)',
    border: '0.5px solid var(--accent-border)',
    borderRadius: 'var(--radius-sm)',
    padding: '14px 10px',
    textAlign: 'center',
  },
  badgeEmoji: { fontSize: 26, display: 'block', marginBottom: 6 },
  badgeLabel: { fontSize: 12, fontWeight: 500, color: 'var(--accent)', marginBottom: 2 },
  badgeDesc: { fontSize: 11, color: 'var(--text-dim)', lineHeight: 1.4 },
  logList: {
    background: 'var(--bg-card)',
    border: '0.5px solid var(--border)',
    borderRadius: 'var(--radius)',
    overflow: 'hidden',
    marginBottom: 16,
  },
  logListHeader: { fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-dim)', padding: '14px 20px', borderBottom: '0.5px solid var(--border)' },
  logRow: {
    display: 'flex',
    alignItems: 'center',
    padding: '14px 20px',
    borderBottom: '0.5px solid var(--border)',
    gap: 12,
  },
  logDate: { fontSize: 13, color: 'var(--text-muted)', minWidth: 60 },
  logSport: { fontSize: 12, color: 'var(--text-dim)', flex: 1 },
  logBarWrap: { flex: 2, height: 4, background: 'var(--border)', borderRadius: 99, overflow: 'hidden' },
  logScore: { fontSize: 14, fontWeight: 500, fontFamily: 'var(--mono)', minWidth: 28, textAlign: 'right' },
  clearBtn: {
    width: '100%',
    padding: '12px',
    fontSize: 13,
    borderRadius: 'var(--radius)',
    background: 'transparent',
    border: '0.5px solid var(--border)',
    color: 'var(--text-dim)',
    cursor: 'pointer',
    marginTop: 8,
  }
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#1a1a1a', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 14px', fontSize: 13 }}>
        <div style={{ color: '#888', marginBottom: 2 }}>{label}</div>
        <div style={{ color: '#00e5a0', fontWeight: 500, fontFamily: 'DM Mono, monospace' }}>{payload[0].value}</div>
      </div>
    );
  }
  return null;
};

export default function HistoryPage({ history, onClear }) {
  if (!history.length) {
    return (
      <div style={styles.empty}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>📈</div>
        <div>No history yet. Start logging your sleep to track your performance over time.</div>
      </div>
    );
  }

  const sorted = [...history].sort((a, b) => new Date(a.date) - new Date(b.date));
  const chartData = sorted.slice(-14).map(e => ({ date: formatDate(e.date), score: e.score }));
  const avg = getAvgScore(history);
  const streak = getStreak(history);
  const best = Math.max(...history.map(e => e.score));
  const badges = getBadges(history);

  return (
    <div style={styles.page}>
      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <div style={{ ...styles.statVal, color: '#00e5a0' }}>{streak}</div>
          <div style={styles.statLabel}>Day streak</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statVal}>{avg}</div>
          <div style={styles.statLabel}>Avg score</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statVal, color: '#00e5a0' }}>{best}</div>
          <div style={styles.statLabel}>Best score</div>
        </div>
      </div>

      <div style={styles.chartCard}>
        <div style={styles.chartLabel}>Score trend (last 14 days)</div>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#555' }} tickLine={false} axisLine={false} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#555' }} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={70} stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#00e5a0"
              strokeWidth={2}
              dot={{ r: 3, fill: '#00e5a0', strokeWidth: 0 }}
              activeDot={{ r: 5, fill: '#00e5a0' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {badges.length > 0 && (
        <div style={styles.badgesCard}>
          <div style={styles.chartLabel}>Achievements</div>
          <div style={styles.badgesGrid}>
            {badges.map((b, i) => (
              <div key={i} style={styles.badgeItem}>
                <span style={styles.badgeEmoji}>{b.emoji}</span>
                <div style={styles.badgeLabel}>{b.label}</div>
                <div style={styles.badgeDesc}>{b.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={styles.logList}>
        <div style={styles.logListHeader}>All logs</div>
        {[...history].sort((a, b) => new Date(b.date) - new Date(a.date)).map((entry, i) => {
          const tier = getTier(entry.score);
          return (
            <div key={i} style={{ ...styles.logRow, borderBottom: i === history.length - 1 ? 'none' : '0.5px solid var(--border)' }}>
              <span style={styles.logDate}>{formatDate(entry.date)}</span>
              <span style={styles.logSport}>{entry.sport} · {entry.hours}h</span>
              <div style={styles.logBarWrap}>
                <div style={{ height: '100%', width: `${entry.score}%`, background: tier.color, borderRadius: 99 }} />
              </div>
              <span style={{ ...styles.logScore, color: tier.color }}>{entry.score}</span>
            </div>
          );
        })}
      </div>

      <button style={styles.clearBtn} onClick={() => {
        if (window.confirm('Clear all history? This cannot be undone.')) onClear();
      }}>
        Clear all history
      </button>
    </div>
  );
}
