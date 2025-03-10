import { drizzle as libsql } from "drizzle-orm/libsql";
import { drizzle as postgresql } from "drizzle-orm/node-postgres";
import { default as libsqlConnector } from "./connectors/libsql";
import { default as postgresqlConnector } from "./connectors/postgresql";
import * as schema from "./schema";

const isFileDatabase = process.env.DATABASE_TYPE == "file";

const db = isFileDatabase
  ? libsql(libsqlConnector.client, {schema})
  : postgresql({
    client: postgresqlConnector.client,
    schema
  });

export default db;