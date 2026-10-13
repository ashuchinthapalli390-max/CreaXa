import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';

const d1Dir = '.wrangler/state/v3/d1/miniflare-D1DatabaseObject';
if (!fs.existsSync(d1Dir)) {
  console.error('D1 directory not found:', d1Dir);
  process.exit(1);
}

const sqliteFiles = fs.readdirSync(d1Dir).filter(f => f.endsWith('.sqlite') && f !== 'metadata.sqlite');
if (sqliteFiles.length === 0) {
  console.error('No D1 SQLite database found in', d1Dir);
  process.exit(1);
}

const dbPath = path.join(d1Dir, sqliteFiles[0]);
console.log('Applying migrations to local D1 database:', dbPath);

const db = new DatabaseSync(dbPath);
db.exec('PRAGMA foreign_keys=ON;');

const migrationFiles = fs.readdirSync('drizzle').filter(f => f.endsWith('.sql')).sort();
console.log('Found migration files:', migrationFiles);

for (const f of migrationFiles) {
  console.log(`Applying ${f}...`);
  const content = fs.readFileSync(path.join('drizzle', f), 'utf8');
  // Drizzle migration files use --> statement-breakpoint
  const statements = content.split('--> statement-breakpoint').map(s => s.trim()).filter(Boolean);
  for (const stmt of statements) {
    try {
      db.exec(stmt);
    } catch (e) {
      if (String(e.message).includes('already exists')) {
        // Table or index already exists
      } else {
        console.error(`Error applying statement in ${f}:`, e.message);
        throw e;
      }
    }
  }
}

const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name").all();
console.log('Migration complete. Current tables in local D1:');
for (const t of tables) {
  console.log('  -', t.name);
}
db.close();
