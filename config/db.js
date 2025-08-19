import dotenv from 'dotenv';
import pkg from 'pg';
dotenv.config();

const { Pool } = pkg;

export const pool = new Pool({
  host: process.env.DB_HOST,
  port: +(process.env.DB_PORT || 5432),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
});

// Optional: log a quick connection check
pool.connect()
  .then(c => { c.release(); console.log('✅ PostgreSQL connected'); })
  .catch(err => console.error('❌ PostgreSQL connection error:', err.message));
