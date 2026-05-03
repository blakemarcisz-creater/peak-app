// Calculate the performance score from sleep, mood, and nutrition inputs
export function calcScore({ hours, quality, consistency, stress, mood = 5, nutrition = 5, hydration = 5 }) {
  const idealHours = 8.5;
  const hourScore = Math.max(0, 100 - Math.pow(hours - idealHours, 2) * 8);
  const qualityScore = quality * 10;
  const consistencyScore = consistency * 10;
  const stressScore = (10 - stress) * 10;
  const moodScore = mood * 10;
  const nutritionScore = nutrition * 10;
  const hydrationScore = hydration * 10;

  const raw =
    hourScore * 0.26 +
    qualityScore * 0.22 +
    consistencyScore * 0.18 +
    stressScore * 0.12 +
    moodScore * 0.10 +
    nutritionScore * 0.08 +
    hydrationScore * 0.04;

  return Math.min(99, Math.max(10, Math.round(raw)));
}

// Get tier info based on score
export function getTier(score) {
  if (score >= 85) return { label: 'Peak', description: 'Peak performance day', color: '#00e5a0' };
  if (score >= 70) return { label: 'Strong', description: 'Strong performance day', color: '#84cc16' };
  if (score >= 55) return { label: 'Average', description: 'Average performance day', color: '#f59e0b' };
  return { label: 'Recovery', description: 'Recovery day — take it easy', color: '#ef4444' };
}

// Get sub-metric estimates from score
export function getMetrics(score) {
  return {
    reaction: Math.min(99, Math.round(50 + score * 0.5)),
    endurance: Math.min(99, Math.round(40 + score * 0.6)),
    focus: Math.min(99, Math.round(45 + score * 0.55)),
    power: Math.min(99, Math.round(42 + score * 0.57)),
  };
}

// Sport-specific insight
export function getInsight(score, { hours, quality, stress, sport }) {
  if (hours < 6) return `With only ${hours}h of sleep, your reaction time and coordination will be noticeably slower. For ${sport}, focus on fundamentals and avoid high-intensity work.`;
  if (stress >= 8) return `High stress is suppressing your recovery hormones. Before your ${sport} session, try 5 minutes of deep breathing to lower cortisol and sharpen focus.`;
  if (quality <= 4) return `Poor sleep quality means less time in deep sleep — where muscle repair happens. Hydrate well before your ${sport} session and warm up longer than usual.`;
  if (score >= 85) return `You're well-rested and primed to push hard. Great day for high-intensity ${sport} drills or practicing new skills that need sharp focus.`;
  if (score >= 70) return `Solid recovery. You're in a good spot for ${sport} today — stick to your plan and compete with confidence.`;
  return `Below-average sleep. Be intentional about your warm-up for ${sport} and listen to your body. A lighter session today protects you for tomorrow.`;
}

// Format date for display
export function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Get streak count from history
export function getStreak(history) {
  if (!history.length) return 0;
  const sorted = [...history].sort((a, b) => new Date(b.date) - new Date(a.date));
  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1].date);
    const curr = new Date(sorted[i].date);
    const diffDays = Math.round((prev - curr) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) streak++;
    else break;
  }
  return streak;
}

// Average score from history
export function getAvgScore(history) {
  if (!history.length) return 0;
  return Math.round(history.reduce((sum, e) => sum + e.score, 0) / history.length);
}

// Get earned achievement badges from history
export function getBadges(history) {
  if (!history.length) return [];
  const badges = [];
  const streak = getStreak(history);
  const avg = getAvgScore(history);
  const peakDays = history.filter(e => e.score >= 85).length;
  const goodSleepDays = history.filter(e => e.hours >= 8).length;

  if (streak >= 30) badges.push({ emoji: '🏆', label: 'Month Strong', desc: '30-day logging streak' });
  else if (streak >= 7) badges.push({ emoji: '💪', label: 'Week Warrior', desc: '7-day logging streak' });
  else if (streak >= 3) badges.push({ emoji: '🔥', label: 'On Fire', desc: '3-day logging streak' });

  if (peakDays >= 10) badges.push({ emoji: '🌟', label: 'Peak Machine', desc: '10+ peak performance days' });
  else if (peakDays >= 3) badges.push({ emoji: '⭐', label: 'Peak Week', desc: '3+ peak performance days' });
  else if (peakDays >= 1) badges.push({ emoji: '✨', label: 'First Peak', desc: 'First peak performance day' });

  if (goodSleepDays >= 7) badges.push({ emoji: '😴', label: 'Sleep Master', desc: '7+ nights of 8h+ sleep' });

  if (history.length >= 30) badges.push({ emoji: '📅', label: 'Dedicated', desc: '30 total entries logged' });
  else if (history.length >= 10) badges.push({ emoji: '📊', label: 'Consistent', desc: '10 total entries logged' });

  if (avg >= 80) badges.push({ emoji: '🎯', label: 'High Performer', desc: 'Average score above 80' });

  return badges;
}
