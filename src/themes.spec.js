import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { THEMES, DEFAULT_THEME, themeOf, themeVars } from './themes'

// Vitest runs from the repo root; `import.meta.url` is not a file URL under jsdom.
const css = readFileSync(resolve('src/assets/tokens/colors.css'), 'utf8')

/** Pull `--pz-*` declarations out of the first rule whose selector matches. */
function declarationsFor(selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const rule = new RegExp(`${escaped}\\s*\\{([^}]*)\\}`).exec(css)
  if (!rule) return null
  const declarations = {}
  for (const line of rule[1].split(';')) {
    const match = /(--pz-[\w-]+)\s*:\s*([^;/]+)/.exec(line)
    if (match) declarations[match[1]] = match[2].trim()
  }
  return declarations
}

/* Shadows are elevation tokens, not colors: the light themes inherit them from
   elevation.css and only the dark presets restate them. */
const isShadow = (token) => token.startsWith('--pz-e-')

describe('theme presets', () => {
  it('falls back to the default preset for an unknown id', () => {
    expect(themeOf('does-not-exist')).toBe(THEMES[DEFAULT_THEME])
    expect(themeOf(undefined)).toBe(THEMES[DEFAULT_THEME])
    expect(themeVars('does-not-exist')).toBe(THEMES[DEFAULT_THEME].vars)
  })

  it('resolves every known preset to its own vars', () => {
    for (const [id, preset] of Object.entries(THEMES)) {
      expect(themeVars(id)).toBe(preset.vars)
    }
  })

  it('gives every preset the same token names', () => {
    const baseline = Object.keys(THEMES[DEFAULT_THEME].vars).sort()
    for (const preset of Object.values(THEMES)) {
      expect(Object.keys(preset.vars).sort()).toEqual(baseline)
    }
  })

  /* colors.css mirrors themes.js so unstyled/pre-mount surfaces still render.
     Nothing regenerates it, so these two tests ARE the sync mechanism: drift
     between the two sources fails the build. */
  describe('colors.css stays in sync with themes.js', () => {
    it(':root matches the default preset', () => {
      const root = declarationsFor(':root')
      const vars = THEMES[DEFAULT_THEME].vars
      for (const [token, value] of Object.entries(vars)) {
        if (isShadow(token)) continue
        expect(root[token], `:root is missing ${token}`).toBeDefined()
        expect(root[token], `:root ${token}`).toBe(value)
      }
    })

    it.each(Object.keys(THEMES).filter((id) => id !== DEFAULT_THEME))(
      '[data-pz-theme="%s"] matches its preset',
      (id) => {
        const block = declarationsFor(`[data-pz-theme="${id}"]`)
        expect(block, `colors.css has no block for ${id}`).not.toBeNull()

        // Every value the CSS declares must be the preset's value…
        for (const [token, value] of Object.entries(block)) {
          expect(THEMES[id].vars[token], `${id} declares unknown ${token}`).toBe(value)
        }
        // …and no color token may be missing from the CSS.
        for (const token of Object.keys(THEMES[id].vars)) {
          if (isShadow(token)) continue
          expect(block[token], `${id} block is missing ${token}`).toBeDefined()
        }
      }
    )
  })
})
