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

function currentBranch(): string {
  return execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
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

  const branch = currentBranch();
  run('git push -u origin HEAD');

  // GitHub default UI is often `main`. Keep main identical to develop so
  // backups/ always appear when browsing the repo without switching branches.
  if (branch === 'develop') {
    console.log('\n📌 Updating main to match develop (so GitHub default shows latest backups)...\n');
    const mainOk = run('git push origin develop:main', true);
    if (!mainOk) {
      console.warn('\n⚠️  Could not update origin/main from develop.');
      console.warn('   Run manually: git push origin develop:main\n');
    } else {
      console.log('✅ origin/main now matches develop (includes latest backups/).');
    }
  } else if (branch !== 'main') {
    console.warn(
      `\n⚠️  You are on "${branch}". Day-to-day sync should use develop so main can be updated.\n`
    );
  }

  console.log('\n✅ Done! Office/home can now pull your latest products.');
  console.log('   On the other PC run: npm run sync:pull');
  console.log('   Confirm backups on GitHub: backups/db-backup-*.sql on develop AND main\n');
}

main();
