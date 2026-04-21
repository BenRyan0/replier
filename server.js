import 'dotenv/config';
import express from 'express';
import { connectDb } from './src/db.js';
import { receiveReply } from './src/receiveReply.js';

const app  = express();
const PORT     = process.env.PORT     || 3000;
const ENDPOINT = process.env.RECEIVE_REPLY_ENDPOINT || '/receive-reply';
const SECRET   = process.env.WEBHOOK_SECRET || '';

app.use(express.json());

app.use((err, req, res, next) => {
  console.error('🔥 GLOBAL ERROR');
  console.error('Time:', new Date().toISOString());
  console.error('Path:', req.method, req.originalUrl);
  console.error('Headers:', req.headers);
  console.error('Body:', JSON.stringify(req.body, null, 2));
  console.error('Error message:', err.message);
  console.error('Stack:', err.stack);

  res.status(500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

// Optional webhook secret check
if (SECRET) {
 app.post(ENDPOINT, async (req, res, next) => {
  console.log('📩 Incoming webhook hit');
  console.log('Headers:', req.headers);
  console.log('Body:', JSON.stringify(req.body, null, 2));

  try {
    await receiveReply(req, res);
  } catch (err) {
    console.error('❌ Error inside receiveReply');
    console.error(err);
    next(err); // pass to global handler
  }
});
}

app.post(ENDPOINT, receiveReply);

// Health check
app.get('/health', (_req, res) => res.json({ ok: true }));

connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Replier listening on port ${PORT} → POST ${ENDPOINT}`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });
