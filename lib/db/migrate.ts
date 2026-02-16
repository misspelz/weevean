import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { migrate } from 'drizzle-orm/neon-http/migrator';
import { config } from 'dotenv';
import * as schema from './schema';

// Load environment variables from .env.local
config({ path: '.env.local' });

/**
 * Run database migrations programmatically
 * Useful for production deployments
 */
export async function runMigrations() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  console.log('🔄 Running database migrations...');

  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle({
    client: sql,
    schema,
  });

  try {
    await migrate(db, { migrationsFolder: './lib/db/migrations' });
    console.log('✅ Migrations completed successfully');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

// Run migrations if this file is executed directly
if (require.main === module) {
  runMigrations()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
