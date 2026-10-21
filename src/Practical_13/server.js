require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5005;

app.use(cors());
app.use(express.json());

// In-memory rate limiting map: ip -> lastRequestTimestamp
const rateLimitMap = new Map();

const rateLimiter = (req, res, next) => {
  const clientIp = req.ip || req.connection.remoteAddress || 'localhost';
  const now = Date.now();
  const lastRequest = rateLimitMap.get(clientIp);

  // Rate limit: max 1 request every 5 seconds per client
  if (lastRequest && now - lastRequest < 5000) {
    const waitSeconds = Math.ceil((5000 - (now - lastRequest)) / 1000);
    return res.status(429).json({
      error: `Rate limit exceeded. Please wait ${waitSeconds}s before requesting AI generation again.`,
      fallback: true
    });
  }

  rateLimitMap.set(clientIp, now);
  next();
};

// Root endpoint: API Discovery
app.get('/', (req, res) => {
  res.json({
    practical: 'Practical 13: AI API Integration with Graceful Degradation',
    openAiConfigured: !!process.env.OPENAI_API_KEY,
    geminiConfigured: !!process.env.GEMINI_API_KEY,
    endpoints: {
      generateDescription: 'POST /api/ai/generate-description',
      suggestPriority: 'POST /api/ai/suggest-priority'
    },
    disclaimer: 'AI-generated content is advisory and must be reviewed by the end user.'
  });
});

/**
 * Heuristic generator for Graceful Degradation fallback
 */
const generateHeuristicDescription = (title) => {
  const lower = title.toLowerCase();
  if (lower.includes('auth') || lower.includes('login') || lower.includes('jwt')) {
    return `Implement secure authentication workflows for "${title}". Ensure passwords are encrypted with bcrypt, JWT tokens include expiration claims, and route guards enforce authorization middleware.`;
  }
  if (lower.includes('docker') || lower.includes('container')) {
    return `Containerize the application components for "${title}". Configure Dockerfile multi-stage builds, define network bridge communication, and verify volume persistence.`;
  }
  if (lower.includes('test') || lower.includes('ci') || lower.includes('pipeline')) {
    return `Automate verification suite for "${title}". Add unit tests using Jest/Supertest, configure GitHub Actions workflow triggers, and prevent merge regressions on pull requests.`;
  }
  return `Comprehensive implementation for "${title}". Plan requirements, build modular components, handle edge cases, and add automated test coverage before production release.`;
};

/**
 * POST /api/ai/generate-description
 * Step 3 from Lab Manual
 */
app.post('/api/ai/generate-description', rateLimiter, async (req, res) => {
  const { title } = req.body;
  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Title is required for AI generation' });
  }

  console.log(`\n🤖 [AI Service] Received generation request for: "${title}"`);

  // 1. Check if OpenAI API key is configured
  if (process.env.OPENAI_API_KEY) {
    try {
      const OpenAI = require('openai');
      const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      const completion = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an agile software engineering assistant. Write a concise, actionable 2-3 sentence task description based on the title.'
          },
          { role: 'user', content: `Write a short task description for: ${title}` }
        ],
        max_tokens: 150
      });

      const description = completion.choices[0].message.content.trim();
      console.log('✅ [AI Service] Generated via OpenAI API successfully.');

      return res.status(200).json({
        title,
        description,
        provider: 'OpenAI (gpt-4o-mini)',
        fallback: false,
        disclaimer: 'AI-generated suggestion. Please review and modify before saving.'
      });
    } catch (err) {
      console.warn('⚠️ [AI Service] OpenAI call failed:', err.message);
      // Fall through to graceful degradation below
    }
  }

  // 2. Check if Gemini API key is configured
  if (process.env.GEMINI_API_KEY) {
    try {
      const prompt = `Write a concise, actionable 2-3 sentence task description for: ${title}`;
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

      const geminiRes = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      if (geminiRes.ok) {
        const data = await geminiRes.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (text) {
          console.log('✅ [AI Service] Generated via Google Gemini API successfully.');
          return res.status(200).json({
            title,
            description: text,
            provider: 'Google Gemini 1.5 Flash',
            fallback: false,
            disclaimer: 'AI-generated suggestion. Please review and modify before saving.'
          });
        }
      }
    } catch (err) {
      console.warn('⚠️ [AI Service] Gemini call failed:', err.message);
      // Fall through to graceful degradation below
    }
  }

  // 3. Graceful Degradation Fallback (Core Requirement)
  console.log('🛡️ [AI Service] Serving Graceful Degradation fallback response (App never crashes)');
  const fallbackDesc = generateHeuristicDescription(title);

  return res.status(200).json({
    title,
    description: fallbackDesc,
    provider: 'Built-in Intelligent Heuristic (Graceful Degradation Fallback)',
    fallback: true,
    reason: 'External AI API key is unconfigured or service timed out. Core app continues working seamlessly!',
    disclaimer: 'Suggested content generated via local heuristic engine. Please review before saving.'
  });
});

/**
 * Supplementary Feature: POST /api/ai/suggest-priority
 */
app.post('/api/ai/suggest-priority', (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: 'Title required' });

  const lower = title.toLowerCase();
  let priority = 'Medium';
  let deadlineDays = 5;

  if (lower.includes('urgent') || lower.includes('bug') || lower.includes('fix') || lower.includes('crash')) {
    priority = 'High';
    deadlineDays = 1;
  } else if (lower.includes('docs') || lower.includes('readme') || lower.includes('comment')) {
    priority = 'Low';
    deadlineDays = 14;
  }

  const deadline = new Date(Date.now() + deadlineDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  res.status(200).json({
    title,
    suggestedPriority: priority,
    suggestedDeadline: deadline,
    disclaimer: 'AI-assisted estimation. Adjust based on project velocity.'
  });
});

app.listen(PORT, () => {
  console.log(`============================================================`);
  console.log(` Practical 13: AI API Integration Service`);
  console.log(` Running at   : http://localhost:${PORT}`);
  console.log(` Security     : API Keys stored strictly in backend (.env)`);
  console.log(` Reliability  : Graceful degradation active on network errors`);
  console.log(`============================================================`);
});

module.exports = app;
