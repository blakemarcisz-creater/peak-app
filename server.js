require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Groq = require('groq-sdk');

const app = express();
app.use(cors());
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post('/api/summary', async (req, res) => {
  const { sport, hours, quality, consistency, stress, mood, foods, waterOz, recommendedOz, score, profile } = req.body;

  const aiName = profile?.aiName || 'Coach';
  const age = profile?.age || 'unknown age';
  const gender = profile?.gender || 'athlete';
  const name = profile?.name ? `named ${profile.name}` : '';
  const foodList = foods && foods.length > 0 ? foods.join(', ') : 'nothing logged';
  const hydrationPct = recommendedOz ? Math.round((waterOz / recommendedOz) * 100) : 0;

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 180,
      messages: [
        {
          role: 'system',
          content: `You are ${aiName}, a sharp and direct sports performance AI coach. You give concise, data-driven feedback. No greetings, no sign-offs, no fluff.`,
        },
        {
          role: 'user',
          content: `A ${age}-year-old ${gender} ${name} who plays ${sport} has logged today's data:
- Performance score: ${score}/99
- Sleep: ${hours}h, quality ${quality}/10, consistency ${consistency}/10
- Stress: ${stress}/10, Mood/Energy: ${mood}/10
- Hydration: ${waterOz}oz of a ${recommendedOz}oz daily goal (${hydrationPct}%)
- Food today: ${foodList}

Write exactly 2-3 sentences. Be specific to their numbers and sport. Lead with what their score means for today's ${sport} session, then give one concrete actionable tip targeting their weakest metric. Be direct and motivating.`,
        },
      ],
    });

    const summary = completion.choices[0]?.message?.content || '';
    res.json({ summary });
  } catch (err) {
    console.error('Groq error:', err.message);
    res.status(500).json({ error: 'Failed to generate summary' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Peak API server running on port ${PORT}`));
