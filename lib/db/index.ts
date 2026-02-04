<<<<<<< HEAD
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Create Neon HTTP client
const sql = neon(process.env.DATABASE_URL);

// Create Drizzle instance with schema
export const db = drizzle(sql, { schema });

// Export types for use throughout the app
export type DB = typeof db;
=======
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
>>>>>>> 1b011ae0ce86e3590e2ca96bd0b2ad418971d42d
