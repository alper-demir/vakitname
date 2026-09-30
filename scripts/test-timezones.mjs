import { spawnSync } from 'node:child_process';
// Separate processes ensure Intl, Luxon and Adhan start in the chosen host zone.
for (const TZ of ['Europe/Istanbul', 'UTC', 'America/New_York']) {
  console.log(`Host timezone: ${TZ}`);
  const result = spawnSync(process.execPath, ['node_modules/jest/bin/jest.js', '--runInBand', 'tests/prayer.test.ts', 'tests/calendar-theme.test.ts'], {
    stdio: 'inherit', env: { ...process.env, TZ },
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
