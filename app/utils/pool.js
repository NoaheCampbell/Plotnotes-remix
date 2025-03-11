import pg from 'pg';
// require('dotenv').config();

const { Pool } = pg;

let pool;

if (process.env.NODE_ENV == 'development') {
    pool = new Pool
    ({
        connectionString: process.env.DATABASE_URL,
    });
} else {
    pool = new Pool({
        connectionString: process.env.POSTGRES_URL,
        ssl: {
            rejectUnauthorized: false
        }
    })
}
console.log('pool', pool);
export async function query(text, params) {
    // use the existing pool for queries
    return pool.query(text, params);
}
