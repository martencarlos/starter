import { Pool, QueryResult, QueryResultRow } from 'pg';

// Create a single pool instance to be reused across the app
let pool: Pool | null = null;

export function getPool() {
    if (!pool) {
        pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false }, // Required for Neon Postgres
            max: 20, // Maximum number of clients in the pool
            idleTimeoutMillis: 30000 // Close idle clients after 30 seconds
        });

        // Log connection errors
        pool.on('error', (err: any) => {
            console.error('Unexpected error on idle client', err);
            process.exit(-1);
        });
    }

    return pool;
}

// Execute a query with parameters
export async function query<T extends QueryResultRow>(text: string, params?: any[]): Promise<T[]> {
    const pool = getPool();
    const start = Date.now();

    try {
        const res: QueryResult<T> = await pool.query(text, params);
        const duration = Date.now() - start;
        console.log('Executed query', { text, duration, rows: res.rowCount });

        return res.rows;
    } catch (error) {
        console.error('Error executing query', { text, error });
        throw error;
    }
}

// Execute a query and return a single row
export async function queryOne<T extends QueryResultRow>(text: string, params?: any[]): Promise<T | null> {
    const rows = await query<T>(text, params);

    return rows.length > 0 ? rows[0] : null;
}

// Create a transaction
export async function transaction<T>(callback: (client: any) => Promise<T>): Promise<T> {
    const pool = getPool();
    const client = await pool.connect();

    try {
        await client.query('BEGIN');
        const result = await callback(client);
        await client.query('COMMIT');

        return result;
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Transaction error', error);
        throw error;
    } finally {
        client.release();
    }
}
