import { execFileSync, spawnSync, execSync } from 'child_process';
import { existsSync, readdirSync } from 'fs';
import { join } from 'path';
import { loadEnvValue, parseDatabaseUrl } from './load-env';

function findBinary(name: string): string | null {
  const candidates = [
    name,
    `C:\\Program Files\\PostgreSQL\\18\\bin\\${name}.exe`,
    `C:\\Program Files\\PostgreSQL\\17\\bin\\${name}.exe`,
    `C:\\Program Files\\PostgreSQL\\16\\bin\\${name}.exe`,
    `C:\\Program Files\\PostgreSQL\\15\\bin\\${name}.exe`,
  ];

  for (const candidate of candidates) {
    if (candidate === name) {
      const result = spawnSync('where', [name], { shell: true, encoding: 'utf-8' });
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
  if (!existsSync(backupsDir)) return null;

  const sqlFiles = readdirSync(backupsDir)
    .filter((file) => file.startsWith('db-backup-') && file.endsWith('.sql'))
    .sort()
    .reverse();

  return sqlFiles.length > 0 ? join(backupsDir, sqlFiles[0]) : null;
}

function findLatestJsonExport(backupsDir: string): string | null {
  if (!existsSync(backupsDir)) return null;

  const jsonFiles = readdirSync(backupsDir)
    .filter((file) => file.startsWith('export-') && file.endsWith('.json'))
    .sort()
    .reverse();

  return jsonFiles.length > 0 ? join(backupsDir, jsonFiles[0]) : null;
}

function main() {
  const backupsDir = join(process.cwd(), 'backups');
  const sqlPath = findLatestSqlBackup(backupsDir);
  const jsonPath = findLatestJsonExport(backupsDir);

  // Prefer SQL restore (full dump)
  if (sqlPath) {
    const databaseUrl = loadEnvValue('DATABASE_URL');
    const db = parseDatabaseUrl(databaseUrl);
    const psql = findBinary('psql');

    if (!psql) {
      console.error('❌ psql not found. Install PostgreSQL first.');
      process.exit(1);
    }

    console.log(`📥 Restoring database from SQL: ${sqlPath}`);
    console.log(`   using: ${psql}`);

    const env = {
      ...process.env,
      PGPASSWORD: db.password,
    };

    execFileSync(
      psql,
      ['-h', db.host, '-p', db.port, '-U', db.user, '-d', db.database, '-f', sqlPath],
      { env, stdio: 'inherit' }
    );

    console.log('✅ Database restored from SQL. Restart npm run dev if it is running.');
    return;
  }

  // Fallback: JSON import
  if (jsonPath) {
    console.log(`📥 No SQL backup found. Falling back to JSON import: ${jsonPath}`);
    execSync('npm run db:import', { stdio: 'inherit', shell: true });
    return;
  }

  console.error('❌ No SQL or JSON backup found in backups/ folder.');
  console.error('   On the other PC run: npm run sync:push');
  console.error('   Or set up empty DB: npm run db:setup');
  process.exit(1);
}

main();
