import { describe, it, expect } from 'vitest'
import en from './en.json'
import sv from './sv.json'
import es from './es.json'
import fr from './fr.json'
import de from './de.json'
import pt from './pt.json'
import it_ from './it.json'
import fa from './fa.json'
import ar from './ar.json'

const locales = { sv, es, fr, de, pt, it: it_, fa, ar }

// Flatten a messages object into a list of key paths, so every locale can be
// compared structurally against en.json (including nested objects and the
// shape of arrays). A missing key here means vue-i18n silently falls back to
// English at runtime.
function flattenKeys(obj, prefix = '') {
  return Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key
    if (Array.isArray(value)) {
      return [
        `${path}[length=${value.length}]`,
        ...value.flatMap((item, i) =>
          item && typeof item === 'object' ? flattenKeys(item, `${path}[${i}]`) : []
        )
      ]
    }
    if (value && typeof value === 'object') {
      return flattenKeys(value, path)
    }
    return [path]
  })
}

describe('locale files', () => {
  const enKeys = flattenKeys(en).sort()

  Object.entries(locales).forEach(([code, messages]) => {
    it(`${code}.json has the same keys as en.json`, () => {
      expect(flattenKeys(messages).sort()).toEqual(enKeys)
    })
  })
})
