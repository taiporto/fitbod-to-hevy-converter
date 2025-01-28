import { Database } from "bun:sqlite";

const db = new Database("../db.sqlite");
db.exec("PRAGMA journal_mode = WAL;");

export const keys_table_query = db.prepare(`CREATE TABLE IF NOT EXISTS keys (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key_name TEXT NOT NULL,
  key_value TEXT NOT NULL
)`);

export function save_api_key(APIKey: string): void {
  const query = db.query(
    `INSERT INTO keys (key_name, key_value) VALUES ("API_KEY", ?)`
  );
  query.run(APIKey);
}

export function use_api_key(): string {
  const { key_value } = db
    .query(`SELECT key_value FROM keys WHERE key_name == "API_KEY"`)
    .get() as { key_value: string };
  return key_value;
}
