import { execSync } from 'child_process';

function run(command: string) {
  console.log(`\n▶ ${command}\n`);
  execSync(command, { stdio: 'inherit', shell: true });
}

function main() {
  console.log('========================================');
  console.log('  SYNC FROM GITHUB (code + database)');
  console.log('========================================');

  run('git fetch origin main');
  run('git pull origin main');
  run('npm run db:restore');

  console.log('\n✅ Done! Your code and products are up to date.');
  console.log('   Start the site: npm run dev\n');
}

main();
