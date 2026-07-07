import { execFileSync, spawnSync } from 'child_process';
import { existsSync, readdirSync } from 'fs';
import { join } from 'path';
import { loadEnvValue, parseDatabaseUrl } from './load-env';

function findPsql(): string | null {
  const candidates = [
    'psql',
    'C:\\Program Files\\PostgreSQL\\18\\bin\\psql.exe',
    'C:\\Program Files\\PostgreSQL\\17\\bin\\psql.exe',
    'C:\\Program Files\\PostgreSQL\\16\\bin\\psql.exe',
    'C:\\Program Files\\PostgreSQL\\15\\bin\\psql.exe',
  ];

  for (const candidate of candidates) {
    if (candidate === 'psql') {
      const result = spawnSync('where', ['psql'], { shell: true, encoding: 'utf-8' });
      if (result.status === 0 && result.stdout.trim()) {
        return result.stdout.trim().split(/\r?\n/)[0];
      }
      continue;
    }

    if (existsSync(candidate)) {
      return candidate;
    }
  }

  return null;
}

function findLatestSqlBackup(backupsDir: string): string | null {
  if (!existsSync(backupsDir)) {
    return null;
  }

  const sqlFiles = readdirSync(backupsDir)
    .filter((file) => file.startsWith('db-backup-') && file.endsWith('.sql'))
    .sort()
    .reverse();

  if (sqlFiles.length === 0) {
    return null;
  }

  return join(backupsDir, sqlFiles[0]);
}

function main() {
  const databaseUrl = loadEnvValue('DATABASE_URL');
  const db = parseDatabaseUrl(databaseUrl);
  const psql = findPsql();

  if (!psql) {
    console.error('❌ psql not found. Install PostgreSQL first.');
    process.exit(1);
  }

  const backupsDir = join(process.cwd(), 'backups');
  const sqlPath = findLatestSqlBackup(backupsDir);

  if (!sqlPath) {
    console.error('❌ No SQL backup found in backups/ folder.');
    console.error('   Run sync from the other PC first, or use: npm run db:setup');
    process.exit(1);
  }

  console.log(`📥 Restoring database from: ${sqlPath}`);

  const env = {
    ...process.env,
    PGPASSWORD: db.password,
  };

  execFileSync(
    psql,
    ['-h', db.host, '-p', db.port, '-U', db.user, '-d', db.database, '-f', sqlPath],
    { env, stdio: 'inherit' }
  );

  console.log('✅ Database restored. Restart npm run dev if it is running.');
}

main();
