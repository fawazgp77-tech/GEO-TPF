import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

export function openDatabase(path) {
  if (path !== ':memory:') mkdirSync(dirname(path), { recursive: true });
  const db = new DatabaseSync(path);
  db.exec(`PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL; PRAGMA busy_timeout = 5000;
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, name TEXT NOT NULL,
      password_hash TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS sessions (
      token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS businesses (
      id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), name TEXT NOT NULL,
      website TEXT NOT NULL, category TEXT NOT NULL, country TEXT NOT NULL, city TEXT NOT NULL,
      branch TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS businesses_owner ON businesses(user_id);
    CREATE TABLE IF NOT EXISTS business_truth (
      id TEXT PRIMARY KEY, business_id TEXT NOT NULL REFERENCES businesses(id), version INTEGER NOT NULL,
      data_json TEXT NOT NULL, verified_by TEXT NOT NULL REFERENCES users(id), verified_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(business_id, version)
    );
    PRAGMA user_version = 1;
  `);
  return db;
}
