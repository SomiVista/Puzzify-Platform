import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import sv from './locales/sv.json'
import es from './locales/es.json'
import fr from './locales/fr.json'
import de from './locales/de.json'
import pt from './locales/pt.json'
import it from './locales/it.json'
import fa from './locales/fa.json'
import ar from './locales/ar.json'
import { APP_NAME } from './config/app'

/**
 * Locales that render right-to-left — the single source of truth for direction.
 * Anything that mirrors layout (the app shell, the player) reads this list, so
 * adding an RTL locale is one entry here plus its JSON file, zero component edits.
 */
export const RTL_LOCALES = ['fa', 'ar']

export const isRtlLocale = (code) => RTL_LOCALES.includes(code)

/** `dir` attribute value for a locale. */
export const dirForLocale = (code) => (isRtlLocale(code) ? 'rtl' : 'ltr')

/**
 * Inject the product name as a message key so locale files can reference it as
 * the linked message `@:appName`. Doing it here rather than in each JSON keeps
 * the name in exactly one place (`src/config/app.js`) and means no call site
 * has to pass it as a parameter.
 */
const withAppName = (messages) => ({ ...messages, appName: APP_NAME })

const i18n = createI18n({
  legacy: false, // Use Composition API
  locale: 'en', // Default locale
  fallbackLocale: 'en', // Fallback to English
  messages: {
    en: withAppName(en),
    sv: withAppName(sv),
    es: withAppName(es),
    fr: withAppName(fr),
    de: withAppName(de),
    pt: withAppName(pt),
    it: withAppName(it),
    fa: withAppName(fa),
    ar: withAppName(ar)
  }
})

export default i18n
