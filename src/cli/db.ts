import { Database } from "bun:sqlite";

const db = new Database("../db.sqlite", { create: true });
db.exec("PRAGMA journal_mode = WAL;");

export const keys_table_query = db.prepare(`CREATE TABLE IF NOT EXISTS keys (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key_name TEXT NOT NULL,
  key_value TEXT NOT NULL
)`);

export const exercise_equivalence_table_query =
  db.prepare(`CREATE TABLE IF NOT EXISTS exercise_equivalence (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  original_name TEXT NOT NULL,
  hevy_name TEXT NOT NULL
)`);

export function save_custom_equivalence(
  original_name: string,
  hevy_name: string
): void {
  const query = db.query(
    `INSERT INTO exercise_equivalence (original_name, hevy_name) VALUES (?, ?)`
  );
  query.run(original_name, hevy_name);
}

export function get_custom_equivalences(): Record<string, string> {
  const equivalences = db
    .query(`SELECT original_name, hevy_name FROM exercise_equivalence`)
    .all() as { original_name: string; hevy_name: string }[];
  return equivalences.reduce(
    (acc, { original_name, hevy_name }) => ({
      ...acc,
      [original_name]: hevy_name,
    }),
    {}
  );
}

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
