import { config } from "dotenv";
import { defineConfig, type Config } from "drizzle-kit";

config({ path: ".env.local" });

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in .env.local file");
}

export default defineConfig({
  schema: ["./lib/db/schema.ts"],
  out: "./lib/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
}) satisfies Config;
