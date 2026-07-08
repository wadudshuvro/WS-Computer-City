import { execSync } from 'child_process';

function run(command: string, allowFail = false) {
  console.log(`\n▶ ${command}\n`);
  try {
    execSync(command, { stdio: 'inherit', shell: true });
    return true;
  } catch (error) {
    if (allowFail) {
      console.warn(`\n⚠️  Command failed (continuing): ${command}\n`);
      return false;
    }
    throw error;
  }
}

function main() {
  const date = new Date().toISOString().slice(0, 16).replace('T', ' ');

  console.log('========================================');
  console.log('  SYNC TO GITHUB (code + database)');
  console.log('========================================');

  // SQL backup is preferred for restore; JSON is a readable fallback.
  const sqlOk = run('npm run db:backup', true);
  const jsonOk = run('npm run db:export', true);

  if (!sqlOk && !jsonOk) {
    console.error('\n❌ Both database backups failed. Nothing to push for products.');
    console.error('   Fix PostgreSQL / DATABASE_URL, then try again.\n');
    process.exit(1);
  }

  if (!sqlOk) {
    console.warn('\n⚠️  SQL backup failed. JSON export was saved.');
    console.warn('   Other PCs can still restore with: npm run db:import\n');
  }

  run('git add -A');

  try {
    run(`git commit -m "Sync: code and database backup ${date}"`);
  } catch {
    console.log('\nℹ️  Nothing new to commit (database may already be saved today).');
  }

  run('git push -u origin HEAD');

  console.log('\n✅ Done! Office/home can now pull your latest products.');
  console.log('   On the other PC run: npm run sync:pull\n');
}

main();
