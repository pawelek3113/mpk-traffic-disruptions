import Database from "better-sqlite3";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import z from "zod";
dotenv.config();

const DATABASE_FILE = z.string().nonempty().parse(process.env.DATABASE_FILE);

const dataDir = path.dirname(DATABASE_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(DATABASE_FILE);

db.pragma("journal_mode = WAL");
db.pragma("busy_timeout = 5000");
db.pragma("synchronous = NORMAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS issues (
    id TEXT PRIMARY KEY,
    first_seen TEXT NOT NULL,
    last_seen TEXT NOT NULL,
    payload TEXT NOT NULL
  )
  `);

export default db;
