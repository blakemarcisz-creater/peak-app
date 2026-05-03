require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
app.use(cors());
app.use(express.json());

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

app.post('/api/summary', async (req, res) => {
  const { sport, hours, quality, consistency, stress, mood, foods, waterOz, recommendedOz, score, profile } = req.body;

  const age = profile?.age || 'unknown age';
  const gender = profile?.gender || 'athlete';
  const name = profile?.name ? `named ${profile.name}` : '';
  const foodList = foods && foods.length > 0 ? foods.join(', ') : 'nothing logged';
  const hydrationPct = recommendedOz ? Math.round((waterOz / recommendedOz) * 100) : 0;

  const prompt = `You are a concise sports performance coach. A ${age}-year-old ${gender} ${name} who plays ${sport} has logged their data for today:

- Performance score: ${score}/99
- Sleep: ${hours}h, quality ${quality}/10, consistency ${consistency}/10
- Stress: ${stress}/10, Mood/Energy: ${mood}/10
- Hydration: ${waterOz}oz out of a ${recommendedOz}oz daily goal (${hydrationPct}%)
- Food today: ${foodList}

Write exactly 2-3 sentences. Be specific to their numbers and sport. Lead with what their score means for today's ${sport} session, then give one concrete actionable tip based on their weakest metric. Be direct and motivating. No greetings or sign-offs.`;

  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 180,
      messages: [{ role: 'user', content: prompt }],
    });
    res.json({ summary: message.content[0].text });
  } catch (err) {
    console.error('Anthropic error:', err.message);
    res.status(500).json({ error: 'Failed to generate summary' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Peak API server running on port ${PORT}`));
