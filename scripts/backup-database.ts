import { execFileSync, spawnSync } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
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

function timestamp() {
  return new Date().toISOString().slice(0, 10);
}

function main() {
  const databaseUrl = loadEnvValue('DATABASE_URL');
  const db = parseDatabaseUrl(databaseUrl);
  const pgDump = findBinary('pg_dump');

  if (!pgDump) {
    console.error('❌ pg_dump not found.');
    console.error('Install PostgreSQL for Windows: https://www.postgresql.org/download/windows/');
    console.error('Or use JSON export instead: npm run db:export');
    process.exit(1);
  }

  const backupsDir = join(process.cwd(), 'backups');
  if (!existsSync(backupsDir)) {
    mkdirSync(backupsDir, { recursive: true });
  }

  const sqlPath = join(backupsDir, `db-backup-${timestamp()}.sql`);
  const customPath = join(backupsDir, `db-backup-${timestamp()}.backup`);

  const env = {
    ...process.env,
    PGPASSWORD: db.password,
  };

  console.log(`📦 Creating SQL backup: ${sqlPath}`);
  console.log(`   using: ${pgDump}`);
  execFileSync(
    pgDump,
    [
      '-h',
      db.host,
      '-p',
      db.port,
      '-U',
      db.user,
      '-d',
      db.database,
      '--clean',
      '--if-exists',
      '-F',
      'p',
      '-f',
      sqlPath,
    ],
    { env, stdio: 'inherit' }
  );

  console.log(`📦 Creating custom backup: ${customPath}`);
  execFileSync(
    pgDump,
    [
      '-h',
      db.host,
      '-p',
      db.port,
      '-U',
      db.user,
      '-d',
      db.database,
      '-F',
      'c',
      '-f',
      customPath,
    ],
    { env, stdio: 'inherit' }
  );

  console.log('✅ Database backup complete.');
  console.log('   SQL file is tracked in git (sync:push). Custom .backup is gitignored.');
}

main();
