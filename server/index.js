const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { connect, getDb } = require('./mongo');

const app = express();
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || process.env.JWT || 'dev_secret';
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.1-70b-versatile';
const isProduction = process.env.NODE_ENV === 'production' || !!process.env.VERCEL;

function getCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProduction,
    path: '/',
  };
}

// Configure CORS with a safe allowlist. You can set `ALLOWED_ORIGINS` as a
// comma-separated env var (e.g. "https://app.example.com,http://localhost:5173").
const defaultOrigins = [
  'http://localhost:5173',
  'https://upyog-multi-tenant-platform.vercel.app',
  'https://upyog-multi-tenant-platform-txhd.vercel.app',
];
if (process.env.VERCEL_URL) {
  defaultOrigins.push(`https://${process.env.VERCEL_URL}`);
}
const allowedOrigins = (process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : defaultOrigins).map(s => s.trim()).filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (e.g. mobile apps, curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) return callback(null, true);
    return callback(new Error('CORS policy: origin not allowed'));
  },
  credentials: true,
}));

// Ensure the Mongo connection exists for both local dev and Vercel serverless runs.
app.use(async (req, res, next) => {
  try {
    await connect();
    next();
  } catch (err) {
    next(err);
  }
});

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body || {};
  // default env credentials
  const AUTH_USER = process.env.AUTH_USER || process.env.VITE_USER || 'admin';
  const AUTH_PASS = process.env.AUTH_PASS || process.env.VITE_PASS || 'secret123';

  if (username === AUTH_USER && password === AUTH_PASS) {
    const token = signToken({ username });
    res.cookie('token', token, getCookieOptions());
    return res.json({ ok: true, user: { username } });
  }
  res.status(401).json({ ok: false, message: 'Invalid credentials' });
});

app.post('/api/logout', (req, res) => {
  res.clearCookie('token', getCookieOptions());
  res.json({ ok: true });
});

app.get('/api/me', (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  const token = req.cookies && req.cookies.token;
  const payload = verifyToken(token);
  if (!payload) return res.json({ ok: false, user: null });
  res.json({ ok: true, user: payload });
});

app.get('/api/properties', async (req, res) => {
  try {
    const db = getDb();
    const props = await db.collection('properties').find({}).toArray();
    res.json({ ok: true, properties: props });
  } catch (err) {
    console.error('properties error', err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.get('/', (req, res) => {
  res.send('UPYOG Property Tax Analytics API');
})

// Simple AI endpoint: tries external GROQ if configured, otherwise answers from DB with rule-based handlers
app.post('/api/ai', async (req, res) => {
  const { question, summary, messages = [] } = req.body || {};
  if (!question) return res.status(400).json({ ok: false, error: 'Missing question' });

  if (GROQ_API_KEY) {
    try {
      const systemPrompt = `You are an AI assistant for the UPYOG Property Tax Analytics platform.
You have access to property records data for 10 Indian cities. Answer questions concisely and factually.

DATASET SUMMARY:
${summary || 'No summary provided.'}

Rules:
- Answer only based on the data above.
- Format currency as Indian Rupees (₹) with Lakh/Crore abbreviations when large.
- Be concise - 2-4 sentences max unless a detailed comparison is asked.
- If asked about something not in the data, say so politely.`;

      const chatMessages = [
        { role: 'system', content: systemPrompt },
        ...messages
          .filter(m => m && (m.role === 'user' || m.role === 'assistant'))
          .map(m => ({ role: m.role, content: String(m.content || '') })),
      ];

      const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: chatMessages,
          temperature: 0.2,
        }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        const message = data?.error?.message || data?.message || 'Groq request failed';
        throw new Error(message);
      }
      const answer = data?.choices?.[0]?.message?.content?.trim();
      if (!answer) throw new Error('Groq returned an empty response');
      return res.json({ ok: true, answer });
    } catch (err) {
      console.error('GROQ request failed', err);
      // fall through to local handler
    }
  }

  // Local DB-backed handlers: answer common property questions using Mongo aggregations
  try {
    const db = getDb();
    const q = (question || '').toLowerCase();

    // Only respond when the user asks something related to the UPYOG dataset.
    // Otherwise prompt the user to ask dataset-specific questions.
    function isDatasetRelated(text) {
      const ks = [
        'collection', 'collections', 'approved', 'rejected', 'pending', 'recovery', 'recovery rate',
        'compare', 'percentage', 'percent', 'city', 'cities', 'properties', 'registrations', 'registration',
        'total', 'collection_inr', 'how many', 'what is', 'what\'s', 'rate'
      ];
      return ks.some(k => text.includes(k));
    }

    if (!isDatasetRelated(q)) {
      return res.json({ ok: true, answer: "I only answer questions related to the UPYOG property dataset — ask about collections, approvals, pending counts, recovery rates, or comparisons between cities." });
    }

    // get list of cities/tenants
    const cities = await db.collection('properties').distinct('tenant');
    // also include city field values
    const more = await db.collection('properties').distinct('city');
    more.forEach(c => { if (c && !cities.includes(c)) cities.push(c); });

    function matchCityInText(text) {
      for (const c of cities) {
        if (!c) continue;
        const lc = c.toLowerCase();
        if (text.includes(lc)) return c;
      }
      return null;
    }

    // Highest total collection
    if (q.includes('highest') && q.includes('collection')) {
      const agg = await db.collection('properties').aggregate([
        { $group: { _id: { $ifNull: ['$tenant', '$city'] }, total: { $sum: { $toDouble: { $ifNull: ['$collection_inr', 0] } } } } },
        { $sort: { total: -1 } },
        { $limit: 1 }
      ]).toArray();
      const top = agg[0];
      if (top) return res.json({ ok: true, answer: `${top._id} has the highest total collection: ₹${Math.round(top.total).toLocaleString('en-IN')}.` });
    }

    // Rejected count for a city
    if (q.includes('rejected')) {
      const city = matchCityInText(q);
      if (city) {
        const count = await db.collection('properties').countDocuments({ $or: [{ tenant: city }, { city }], status: 'Rejected' });
        return res.json({ ok: true, answer: `There are ${count} rejected properties in ${city}.` });
      }
    }

    // Percentage approved for a city
    if (q.includes('percentage') && q.includes('approved')) {
      const city = matchCityInText(q);
      if (city) {
        const total = await db.collection('properties').countDocuments({ $or: [{ tenant: city }, { city }] });
        const approved = await db.collection('properties').countDocuments({ $or: [{ tenant: city }, { city }] , status: 'Approved' });
        const pct = total ? Math.round((approved / total) * 10000) / 100 : 0;
        return res.json({ ok: true, answer: `${pct}% of properties in ${city} are approved (${approved} of ${total}).` });
      }
    }

    // Overall or city-specific recovery rate
    if (q.includes('recovery rate') || q.includes('overall recovery') || q === 'recovery rate' || q === 'recovery') {
      const city = matchCityInText(q);
      const filter = city ? { $or: [{ tenant: city }, { city }] } : {};
      const approved = await db.collection('properties').countDocuments({ ...filter, status: 'Approved' });
      const rejected = await db.collection('properties').countDocuments({ ...filter, status: 'Rejected' });
      const processed = approved + rejected;
      const pct = processed ? Math.round((approved / processed) * 10000) / 100 : 0;

      if (city) {
        return res.json({ ok: true, answer: `${pct}% recovery rate in ${city} (${approved} approved out of ${processed} processed properties).` });
      }

      return res.json({ ok: true, answer: `${pct}% overall recovery rate (${approved} approved out of ${processed} processed properties across all cities).` });
    }

    // Total approved properties (overall or city-specific)
    if (q.includes('total') && q.includes('approved') || q.includes('total approved') || q.includes('approved properties') || q.includes('how many approved') || q === 'total approved') {
      const city = matchCityInText(q);
      const filter = city ? { $or: [{ tenant: city }, { city }] } : {};
      const approvedCount = await db.collection('properties').countDocuments({ ...filter, status: 'Approved' });
      if (city) return res.json({ ok: true, answer: `${approvedCount} properties approved in ${city}.` });
      return res.json({ ok: true, answer: `${approvedCount} properties approved across all cities.` });
    }

    // Most pending properties
    if (q.includes('pending')) {
      const agg = await db.collection('properties').aggregate([
        { $match: { status: 'Pending' } },
        { $group: { _id: { $ifNull: ['$tenant', '$city'] }, count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 }
      ]).toArray();
      const top = agg[0];
      if (top) return res.json({ ok: true, answer: `${top._id} has the most pending properties (${top.count}).` });
    }

    // Compare registrations between two cities (look for two known city names)
    if (q.includes('compare') || q.includes('between')) {
      // try to find two cities mentioned
      const found = [];
      for (const c of cities) {
        if (!c) continue;
        const lc = c.toLowerCase();
        if (q.includes(lc)) found.push(c);
      }
      if (found.length >= 2) {
        const [c1, c2] = found;
        const t1 = await db.collection('properties').countDocuments({ $or: [{ tenant: c1 }, { city: c1 }] });
        const t2 = await db.collection('properties').countDocuments({ $or: [{ tenant: c2 }, { city: c2 }] });
        return res.json({ ok: true, answer: `${c1} has ${t1} registrations; ${c2} has ${t2} registrations.` });
      }
    }

    // Fallback: return the provided summary and say we couldn't parse the question
    return res.json({ ok: true, answer: `I couldn't match a specific query pattern. Here's the dataset summary to help: \n\n${summary}` });
  } catch (err) {
    console.error('AI handler error', err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

async function start() {
  try {
    await connect();
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('DB error', err);
  }

  app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
  });
}

if (require.main === module) {
  start();
}

module.exports = app;
