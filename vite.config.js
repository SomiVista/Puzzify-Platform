import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    // Unit tests live next to source; Playwright E2E specs live in /e2e.
    // `scripts/` holds release tooling that CI depends on, so it is tested too.
    include: ['src/**/*.{test,spec}.{js,ts}', 'scripts/**/*.{test,spec}.{js,ts}'],
    exclude: ['e2e/**', 'node_modules/**', 'dist/**', 'old-version/**'],
    coverage: {
      provider: 'v8',
      // Report on the shipping app only. `old-version/` is the legacy prototype
      // (reference only), and views/sections are exercised by Playwright.
      include: ['src/**/*.{js,vue}'],
      exclude: ['src/**/*.{test,spec}.{js,ts}', 'src/main.js', 'src/locales/**'],
    },
  }
})
