import "dotenv/config";
import { createClient } from "@libsql/client";

export const client = createClient({
    url: `file:${process.env.DATABASE_FILE}`,
});

export default {
    client
};