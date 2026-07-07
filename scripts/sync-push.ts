import { execSync } from 'child_process';

function run(command: string) {
  console.log(`\n▶ ${command}\n`);
  execSync(command, { stdio: 'inherit', shell: true });
}

function main() {
  const date = new Date().toISOString().slice(0, 16).replace('T', ' ');

  console.log('========================================');
  console.log('  SYNC TO GITHUB (code + database)');
  console.log('========================================');

  run('npm run db:backup');
  run('npm run db:export');
  run('git add -A');

  try {
    run(`git commit -m "Sync: code and database backup ${date}"`);
  } catch {
    console.log('\nℹ️  Nothing new to commit (database may already be saved today).');
  }

  run('git push -u origin HEAD');

  console.log('\n✅ Done! Office/home can now pull your latest products.\n');
}

main();
