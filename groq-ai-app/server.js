import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 3500;

/* ── Middleware ── */
app.use(cors());
app.use(express.json());
app.use(express.static(join(__dirname, 'public')));

/* ── Health Check ── */
app.get('/health', (req, res) => {
  res.json({ status: 'ok', groq_key_set: !!process.env.GROQ_API_KEY });
});

/* ─────────────────────────────────────────────
   POST /generate  ← Main AI endpoint
   Body: { prompt, model, temperature }
───────────────────────────────────────────── */
app.post('/generate', async (req, res) => {
  const { prompt, model = 'llama3-70b-8192', temperature = 0.7, systemPrompt } = req.body;

  // Input validation
  if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
    return res.status(400).json({ error: 'Prompt is required.' });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey === 'your_groq_api_key_here') {
    return res.status(500).json({
      error: 'GROQ_API_KEY is not set. Please add it to your .env file.\n\nGet a free key at: https://console.groq.com'
    });
  }

  const messages = [];

  // Optional system prompt
  if (systemPrompt && systemPrompt.trim()) {
    messages.push({ role: 'system', content: systemPrompt.trim() });
  }

  messages.push({ role: 'user', content: prompt.trim() });

  try {
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: parseFloat(temperature),
        max_tokens: 4096,
      }),
    });

    if (!groqRes.ok) {
      const errBody = await groqRes.json().catch(() => ({}));
      const msg = errBody?.error?.message || `Groq API error: ${groqRes.status} ${groqRes.statusText}`;
      return res.status(groqRes.status).json({ error: msg });
    }

    const data = await groqRes.json();
    const content = data?.choices?.[0]?.message?.content;

    if (!content) {
      return res.status(500).json({ error: 'Empty response from Groq API.' });
    }

    res.json({
      response: content,
      model: data.model,
      usage: data.usage,
      finish_reason: data.choices[0].finish_reason,
    });

  } catch (err) {
    console.error('[Groq Error]', err.message);
    res.status(500).json({ error: `Network error: ${err.message}` });
  }
});

/* ── Models list endpoint ── */
app.get('/models', async (req, res) => {
  res.json({
    models: [
      { id: 'llama3-70b-8192',      label: 'LLaMA 3 70B',        badge: 'Powerful' },
      { id: 'llama3-8b-8192',       label: 'LLaMA 3 8B',         badge: 'Fast'     },
      { id: 'mixtral-8x7b-32768',   label: 'Mixtral 8x7B',       badge: 'Long CTX' },
      { id: 'gemma2-9b-it',         label: 'Gemma 2 9B',         badge: 'Balanced' },
      { id: 'llama-3.1-8b-instant', label: 'LLaMA 3.1 8B Instant', badge: 'Instant' },
    ]
  });
});

/* ── Serve index.html for all other routes ── */
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'index.html'));
});

/* ── Start Server ── */
app.listen(PORT, () => {
  console.log(`\n  ⚡ Groq AI App running at http://localhost:${PORT}`);
  console.log(`  🔑 API Key: ${process.env.GROQ_API_KEY ? '✅ Set' : '❌ NOT SET — add it to .env!'}\n`);
});
