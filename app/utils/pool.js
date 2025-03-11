import pg from 'pg';

const { Pool } = pg;

// Prioritize POSTGRES_URL (Supabase) over DATABASE_URL
const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error("No database connection string provided. Please set POSTGRES_URL or DATABASE_URL.");
}

const pool = new Pool({
    connectionString,
});

export async function query(text, params) {
    console.log("Executing query:", text, "with params:", params);
    return pool.query(text, params);
}

export default pool;