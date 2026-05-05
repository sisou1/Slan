import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pool } from "./client.js";

async function main() {
  const schemaPath = resolve(process.cwd(), "src/db/schema.sql");
  const sql = await readFile(schemaPath, "utf8");
  await pool.query(sql);
  console.log("Schema initialized.");
}

main()
  .catch((error) => {
    console.error("Schema initialization failed.");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });

