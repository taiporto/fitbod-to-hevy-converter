import { Database } from "bun:sqlite";

const db = new Database("file::memory:?cache=private");

export const keys_table_query = db.prepare(`CREATE TABLE IF NOT EXISTS keys (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key_name TEXT NOT NULL,
  key_value TEXT NOT NULL
)`);
export const set_unique_key_name = db.prepare(
  `CREATE UNIQUE INDEX IF NOT EXISTS unique_key_name ON keys (key_name)`
);

export const exercise_equivalence_table_query =
  db.prepare(`CREATE TABLE IF NOT EXISTS exercise_equivalence (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  original_name TEXT NOT NULL,
  hevy_name TEXT NOT NULL,
  is_custom BOOLEAN DEFAULT FALSE
);
`);

export const drop_tables = (): void => {
  db.query(`DROP TABLE IF EXISTS keys`).run();
  db.query(`DROP TABLE IF EXISTS exercise_equivalence`).run();
};

export function save_equivalence(
  original_name: string,
  hevy_name: string,
  is_custom: boolean
): void {
  const query = db.query(
    `INSERT INTO exercise_equivalence (original_name, hevy_name, is_custom) VALUES (?, ?, ?)`
  );
  query.run(original_name, hevy_name, is_custom);
}

export function delete_custom_equivalences(): void {
  db.query(`DELETE FROM exercise_equivalence WHERE is_custom == TRUE`).run();
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
    `INSERT INTO keys (key_name, key_value)
      VALUES ("API_KEY", ?)
      ON CONFLICT (key_name) DO
      UPDATE SET key_value = excluded.key_value`
  );
  query.run(APIKey);
}

export function use_api_key(): string {
  const { key_value } = db
    .query(`SELECT key_value FROM keys WHERE key_name == "API_KEY"`)
    .get() as { key_value: string };
  return key_value;
}
