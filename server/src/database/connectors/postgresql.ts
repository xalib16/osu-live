import "dotenv/config";
import { Pool } from "pg";

export const client = new Pool({
    connectionString: process.env.POSTGRES_URL,
    idleTimeoutMillis: 60000, // Keep idle connections for 1 minute
    connectionTimeoutMillis: 5000, // 5 seconds to attempt a new connection
});

export default {
    client
};