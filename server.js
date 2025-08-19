import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { productsRouter } from './routes/products.js';
import { createProductTableIfNotExists } from './models/product.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS: allow your frontend origins (add more as needed)
const allowed = [
  'http://localhost:3000',
  'https://gubros.vercel.app',
  'https://your-frontend-domain.com'
];
app.use(cors({
  origin(origin, cb) {
    if (!origin) return cb(null, true);
    if (allowed.includes(origin)) return cb(null, true);
    return cb(null, true); // set to false to restrict
  }
}));

app.use(bodyParser.json());

// Simple admin API key guard for write routes
app.use((req, res, next) => {
  const isWrite = (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE');
  if (!isWrite) return next();

  const key = req.header('x-admin-key');
  if (!key || key !== process.env.ADMIN_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized: invalid admin key' });
  }
  next();
});

// Routes
app.use('/api/products', productsRouter);

// Health check
app.get('/', (req, res) => res.json({ ok: true, service: 'gubros-backend' }));

// Boot
createProductTableIfNotExists()
  .then(() => {
    app.listen(PORT, () => console.log(`🚀 Server running on :${PORT}`));
  })
  .catch(err => {
    console.error('DB init error:', err);
    process.exit(1);
  });
