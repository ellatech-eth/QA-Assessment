import { defineConfig } from '@playwright/test';

export default defineConfig({
testDir: '.',
testMatch: 'api.spec.ts',
use: {
baseURL: 'http://localhost:4000',
},
reporter: 'list',
});
