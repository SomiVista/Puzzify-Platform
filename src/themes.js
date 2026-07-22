/**
 * Puzzify theme presets — the single source of truth for token VALUES.
 * Components only ever read semantic names (--pz-*); a theme is just this preset.
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
      '--pz-bg': '#FFF8F0', '--pz-surface': '#FFFFFF', '--pz-surface-2': '#F2EDFD', '--pz-surface-3': '#FFF1E2',
      '--pz-text': '#2D2438', '--pz-muted': '#756A80', '--pz-border': '#ECE3EE', '--pz-hairline': '#F3EDF3',
      '--pz-primary': '#6C3BF0', '--pz-on-primary': '#FFFFFF', '--pz-secondary': '#0B7568', '--pz-accent': '#FFAE1F',
      '--pz-success': '#0D8049', '--pz-error': '#D42F55', '--pz-focus': '#6C3BF0',
      '--pz-ring': 'rgba(108,59,240,.24)', '--pz-glow': 'rgba(255,174,31,.5)',
      '--pz-e-1': '0 1px 2px rgba(24,16,40,.05), 0 2px 6px rgba(24,16,40,.05)',
      '--pz-e-2': '0 8px 22px rgba(24,16,40,.11)'
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
      '--pz-bg': '#0D1017', '--pz-surface': '#151B27', '--pz-surface-2': '#1D2536', '--pz-surface-3': '#182031',
      '--pz-text': '#EDF1F8', '--pz-muted': '#98A4BA', '--pz-border': '#2B3549', '--pz-hairline': '#212B3D',
      '--pz-primary': '#E8B94D', '--pz-on-primary': '#181004', '--pz-secondary': '#74B8C4', '--pz-accent': '#D97852',
      '--pz-success': '#5CC08D', '--pz-error': '#EA7086', '--pz-focus': '#E8B94D',
      '--pz-ring': 'rgba(232,185,77,.32)', '--pz-glow': 'rgba(116,184,196,.45)',
      '--pz-e-1': '0 1px 2px rgba(0,0,0,.4), 0 2px 8px rgba(0,0,0,.35)',
      '--pz-e-2': '0 10px 26px rgba(0,0,0,.5)'
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
      '--pz-bg': '#120D1B', '--pz-surface': '#1C1429', '--pz-surface-2': '#271D3A', '--pz-surface-3': '#1F1930',
      '--pz-text': '#F1EBF8', '--pz-muted': '#A697BD', '--pz-border': '#372A50', '--pz-hairline': '#2B2142',
      '--pz-primary': '#FF7A33', '--pz-on-primary': '#241003', '--pz-secondary': '#A3E257', '--pz-accent': '#9D7BFF',
      '--pz-success': '#6FCB8B', '--pz-error': '#F27080', '--pz-focus': '#FF7A33',
      '--pz-ring': 'rgba(255,122,51,.30)', '--pz-glow': 'rgba(163,226,87,.4)',
      '--pz-e-1': '0 1px 2px rgba(0,0,0,.42), 0 2px 8px rgba(0,0,0,.36)',
      '--pz-e-2': '0 10px 26px rgba(0,0,0,.52)'
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
      '--pz-bg': '#F5F8FA', '--pz-surface': '#FFFFFF', '--pz-surface-2': '#EAF0F9', '--pz-surface-3': '#E9F4EF',
      '--pz-text': '#16212F', '--pz-muted': '#5B6979', '--pz-border': '#DBE3EC', '--pz-hairline': '#E8EEF4',
      '--pz-primary': '#2257E0', '--pz-on-primary': '#FFFFFF', '--pz-secondary': '#0B7D6E', '--pz-accent': '#E8A413',
      '--pz-success': '#0D8049', '--pz-error': '#CE3D50', '--pz-focus': '#2257E0',
      '--pz-ring': 'rgba(34,87,224,.22)', '--pz-glow': 'rgba(232,164,19,.45)',
      '--pz-e-1': '0 1px 2px rgba(15,26,42,.05), 0 2px 6px rgba(15,26,42,.05)',
      '--pz-e-2': '0 8px 22px rgba(15,26,42,.10)'
    }
  }
};

/**
 * Apply a theme preset to a stage element:
 * sets every --pz-* var, flips particle motion, swaps the box asset.
 */
export function applyTheme(el, id) {
  const t = THEMES[id] || THEMES.birthday;
  for (const [k, v] of Object.entries(t.vars)) el.style.setProperty(k, v);
  el.setAttribute('data-pz-theme', t.id);
  el.querySelectorAll('[data-pz-particle]').forEach((p) => {
    p.style.animationName = t.particles.motion === 'rise' ? 'pzRise' : 'pzFall';
  });
  el.querySelectorAll('[data-pz-box]').forEach((b) => {
    b.style.display = b.getAttribute('data-pz-box') === t.box ? '' : 'none';
  });
}
