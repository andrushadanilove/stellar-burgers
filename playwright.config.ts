import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.pl.tsx',
  fullyParallel: false,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4000',
    trace: 'retain-on-failure'
  },
  webServer: {
    command: 'npm start -- --no-open',
    url: 'http://127.0.0.1:4000',
    reuseExistingServer: true,
    timeout: 120000
  }
});
