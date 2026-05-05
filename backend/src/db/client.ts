import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;
const hasSslModeInUrl = databaseUrl?.includes("sslmode=");
const useSsl =
  process.env.DATABASE_USE_SSL === "true" ||
  process.env.NODE_ENV === "production" ||
  Boolean(hasSslModeInUrl);
const rejectUnauthorized = process.env.DATABASE_SSL_REJECT_UNAUTHORIZED === "true";

function sanitizeConnectionString(value: string | undefined): string | undefined {
  if (!value) {
    return value;
  }

  try {
    const parsed = new URL(value);
    parsed.searchParams.delete("sslmode");
    parsed.searchParams.delete("sslcert");
    parsed.searchParams.delete("sslkey");
    parsed.searchParams.delete("sslrootcert");
    parsed.searchParams.delete("usessl");
    return parsed.toString();
  } catch {
    return value;
  }
}

export const pool = new Pool({
  connectionString: sanitizeConnectionString(databaseUrl),
  ssl: useSsl ? { rejectUnauthorized } : false,
});
