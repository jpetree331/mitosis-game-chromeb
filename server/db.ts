import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import * as schema from "@shared/schema";

// Get database URL from environment
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
}

console.log("Database connection configured");

// Configure Neon to use ws for WebSocket in Node.js
neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: databaseUrl });
export const db = drizzle(pool, { schema });
