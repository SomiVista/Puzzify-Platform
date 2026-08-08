/**
 * Theme presets — the single source of truth for token VALUES.
 * Components only ever read semantic names (--color-*, --shadow-*); a theme is just this preset.
 * Every palette targets WCAG 2.1 AA on its own surfaces.
 */
export const THEMES = {
  birthday: {
    id: 'birthday',
    label: 'Birthday',
    tagline: 'Pastel bright · default',
    box: 'gift',
    particles: { label: 'Confetti', motion: 'fall' },
    audio: 'Lo-fi pop',
    vars: {
      '--color-bg': '#FFF8F0', '--color-surface': '#FFFFFF', '--color-surface-2': '#F2EDFD', '--color-surface-3': '#FFF1E2',
      '--color-text': '#2D2438', '--color-muted': '#756A80', '--color-border': '#ECE3EE', '--color-hairline': '#F3EDF3',
      '--color-primary': '#6C3BF0', '--color-on-primary': '#FFFFFF', '--color-secondary': '#0B7568', '--color-accent': '#FFAE1F',
      '--color-success': '#0D8049', '--color-error': '#D42F55', '--color-on-error': '#FFFFFF', '--color-focus': '#6C3BF0',
      '--color-ring': 'rgba(108,59,240,.24)', '--color-glow': 'rgba(255,174,31,.5)',
      '--shadow-1': '0 1px 2px rgba(24,16,40,.05), 0 2px 6px rgba(24,16,40,.05)',
      '--shadow-2': '0 8px 22px rgba(24,16,40,.11)'
    }
  },
  mystery: {
    id: 'mystery',
    label: 'Mystery',
    tagline: 'Dark detective',
    box: 'safe',
    particles: { label: 'Dust motes', motion: 'rise' },
    audio: 'Suspense hum',
    vars: {
      '--color-bg': '#0D1017', '--color-surface': '#151B27', '--color-surface-2': '#1D2536', '--color-surface-3': '#182031',
      '--color-text': '#EDF1F8', '--color-muted': '#98A4BA', '--color-border': '#2B3549', '--color-hairline': '#212B3D',
      '--color-primary': '#E8B94D', '--color-on-primary': '#181004', '--color-secondary': '#74B8C4', '--color-accent': '#D97852',
      '--color-success': '#5CC08D', '--color-error': '#EA7086', '--color-on-error': '#1A0A0E', '--color-focus': '#E8B94D',
      '--color-ring': 'rgba(232,185,77,.32)', '--color-glow': 'rgba(116,184,196,.45)',
      '--shadow-1': '0 1px 2px rgba(0,0,0,.4), 0 2px 8px rgba(0,0,0,.35)',
      '--shadow-2': '0 10px 26px rgba(0,0,0,.5)'
    }
  },
  spooky: {
    id: 'spooky',
    label: 'Spooky',
    tagline: 'Ember & phantom',
    box: 'cauldron',
    particles: { label: 'Embers', motion: 'rise' },
    audio: 'Eerie drone',
    vars: {
      '--color-bg': '#120D1B', '--color-surface': '#1C1429', '--color-surface-2': '#271D3A', '--color-surface-3': '#1F1930',
      '--color-text': '#F1EBF8', '--color-muted': '#A697BD', '--color-border': '#372A50', '--color-hairline': '#2B2142',
      '--color-primary': '#FF7A33', '--color-on-primary': '#241003', '--color-secondary': '#A3E257', '--color-accent': '#9D7BFF',
      '--color-success': '#6FCB8B', '--color-error': '#F27080', '--color-on-error': '#1E0A0E', '--color-focus': '#FF7A33',
      '--color-ring': 'rgba(255,122,51,.30)', '--color-glow': 'rgba(163,226,87,.4)',
      '--shadow-1': '0 1px 2px rgba(0,0,0,.42), 0 2px 8px rgba(0,0,0,.36)',
      '--shadow-2': '0 10px 26px rgba(0,0,0,.52)'
    }
  },
  corporate: {
    id: 'corporate',
    label: 'Corporate',
    tagline: 'Calm & credible',
    box: 'envelope',
    particles: { label: 'Soft dots', motion: 'fall' },
    audio: 'Calm focus',
    vars: {
      '--color-bg': '#F5F8FA', '--color-surface': '#FFFFFF', '--color-surface-2': '#EAF0F9', '--color-surface-3': '#E9F4EF',
      '--color-text': '#16212F', '--color-muted': '#5B6979', '--color-border': '#DBE3EC', '--color-hairline': '#E8EEF4',
      '--color-primary': '#2257E0', '--color-on-primary': '#FFFFFF', '--color-secondary': '#0B7D6E', '--color-accent': '#E8A413',
      '--color-success': '#0D8049', '--color-error': '#CE3D50', '--color-on-error': '#FFFFFF', '--color-focus': '#2257E0',
      '--color-ring': 'rgba(34,87,224,.22)', '--color-glow': 'rgba(232,164,19,.45)',
      '--shadow-1': '0 1px 2px rgba(15,26,42,.05), 0 2px 6px rgba(15,26,42,.05)',
      '--shadow-2': '0 8px 22px rgba(15,26,42,.10)'
    }
  }
};

/** The default preset every unknown id falls back to. */
export const DEFAULT_THEME = 'birthday';

/** Resolve a preset id to its object, falling back to the default. */
export function themeOf(id) {
  return THEMES[id] || THEMES[DEFAULT_THEME];
}

/**
 * The design-token map for a preset, ready to bind as an inline `style` on a themed
 * container. Every themed surface — the app shell, the builder's live preview,
 * the player — applies a theme this way, alongside `data-theme="<id>"` so
 * CSS can still key off the active preset.
 */
export function themeVars(id) {
  return themeOf(id).vars;
}
