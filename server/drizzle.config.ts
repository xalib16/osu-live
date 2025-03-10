import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export const dialect = process.env.DATABASE_TYPE == "file"
? "sqlite"
: "postgresql";

export const out = `./src/database/migrations/${dialect}`;

export default defineConfig({
  out,
  dialect,
  schema: `./src/database/schema/index.ts`,
  dbCredentials: {
    url: dialect == "postgresql"
      ? process.env.POSTGRES_URL
      : `file:${process.env.DATABASE_FILE}`
  }
});