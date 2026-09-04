import { execSync } from 'child_process';

function run(command: string) {
  console.log(`\n▶ ${command}\n`);
  execSync(command, { stdio: 'inherit', shell: true });
}

function tryRun(command: string) {
  console.log(`\n▶ ${command}\n`);
  try {
    execSync(command, { stdio: 'inherit', shell: true });
    return true;
  } catch {
    return false;
  }
}

function main() {
  console.log('========================================');
  console.log('  SYNC FROM GITHUB (code + database)');
  console.log('========================================');

  // Day-to-day sync targets develop (integration). main is for releases only.
  // Fall back to main if develop is not on the remote yet.
  const developOk =
    tryRun('git fetch origin develop') && tryRun('git pull origin develop');

  if (!developOk) {
    console.warn('\n⚠️  develop not available on remote yet. Pulling main instead.\n');
    run('git fetch origin main');
    run('git pull origin main');
  }

  run('npm run db:restore');

  console.log('\n✅ Done! Your code and products are up to date.');
  console.log('   Start the site: npm run dev\n');
}

main();
