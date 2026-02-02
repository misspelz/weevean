import "server-only";

import * as schema from "@/lib/db/schema";

export type Database = typeof db;

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import { config } from "dotenv";
config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({
  client: sql,
  schema,
});
