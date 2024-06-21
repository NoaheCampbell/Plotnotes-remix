import pg from 'pg';
// require('dotenv').config();

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})

export async function query(text, params) {
    // use the existing pool for queries
    return pool.query(text, params);
}
