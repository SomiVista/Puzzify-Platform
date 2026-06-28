import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'

export default [
  // Ignore build output and vendored reference code.
  {
    ignores: [
      'dist/**',
      '.vite/**', // Vite dependency pre-bundling cache (generated, not source)
      'node_modules/**',
      'old-version/**',
      'src/assets/**', // vendored/minified font + helper assets, not source
      'playwright-report/**',
      'test-results/**',
    ],
  },

  js.configs.recommended,
  // 'essential' = error-prevention rules without opinionated formatting noise.
  ...pluginVue.configs['flat/essential'],

  // Application + Vue source: browser environment.
  {
    files: ['src/**/*.{js,vue}', 'vite.config.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
      },
    },
  },

  // Unit tests (Vitest) — browser + Vitest globals.
  {
    files: ['**/*.spec.js', '**/*.test.js'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        vi: 'readonly',
      },
    },
  },

  // E2E tests (Playwright) and config files run in Node.
  {
    files: ['e2e/**/*.js', 'playwright.config.js'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
]
