import pg from 'pg';

const { Pool } = pg;

const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("No database connection string provided. Please set POSTGRES_URL or DATABASE_URL.");
}

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false, // Disable strict host verification (less secure but works for testing)
  },
});

export async function query(text, params) {
  return pool.query(text, params);
}

export default pool;