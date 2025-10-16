import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import * as schema from "@shared/schema";
import { readFileSync } from "fs";

// Get database URL - check /tmp/replitdb for deployed apps, fallback to env var
let databaseUrl = process.env.DATABASE_URL;

try {
  // For deployed apps, database URL is in /tmp/replitdb
  const replitDbUrl = readFileSync("/tmp/replitdb", "utf8").trim();
  if (replitDbUrl) {
    databaseUrl = replitDbUrl;
    console.log("Using database URL from /tmp/replitdb (production)");
  }
} catch (error) {
  // File doesn't exist, use environment variable (development)
  console.log("Using DATABASE_URL from environment (development)");
}

if (!databaseUrl) {
  throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
}

// Configure Neon to use ws for WebSocket in Node.js
neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: databaseUrl });
export const db = drizzle(pool, { schema });
