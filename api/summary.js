export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { sport, hours, quality, consistency, stress, mood, foods, waterOz, recommendedOz, score, profile } = req.body;

  const aiName = profile?.aiName || 'Coach';
  const age = profile?.age || 'unknown age';
  const gender = profile?.gender || 'athlete';
  const name = profile?.name ? `named ${profile.name}` : '';
  const foodList = foods && foods.length > 0 ? foods.join(', ') : 'nothing logged';
  const hydrationPct = recommendedOz ? Math.round((waterOz / recommendedOz) * 100) : 0;

  const messages = [
    {
      role: 'system',
      content: `You are ${aiName}, a sharp and direct sports performance AI coach. You give concise, data-driven feedback. No greetings, no sign-offs, no fluff.`,
    },
    {
      role: 'user',
      content: `A ${age}-year-old ${gender} ${name} who plays ${sport} has logged today's data:
- Performance score: ${score}/99
- Sleep last night: ${hours}h, quality ${quality}/10, consistency ${consistency}/10
- Stress: ${stress}/10, Mood/Energy: ${mood}/10
- Water so far today: ${waterOz}oz of a ${recommendedOz}oz daily goal (${hydrationPct}%)
- Food logged today: ${foodList}

Give a forward-looking coaching response with exactly 3 short bullet points:
• What to eat for the rest of today to perform better (be specific — actual foods)
• Exactly how much more water to drink today and when
• How many hours to sleep tonight and what time to go to bed to improve tomorrow's score

Be specific, direct, and motivating. Do not comment on the score being bad. Focus only on what they should do next.`,
    },
  ];

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 180,
        messages,
      }),
    });

    const data = await response.json();
    const summary = data.choices?.[0]?.message?.content || '';
    res.json({ summary });
  } catch (err) {
    console.error('Groq error:', err.message);
    res.status(500).json({ error: 'Failed to generate summary' });
  }
}
