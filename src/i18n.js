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

const i18n = createI18n({
  legacy: false, // Use Composition API
  locale: 'en', // Default locale
  fallbackLocale: 'en', // Fallback to English
  messages: {
    en,
    sv,
    es,
    fr,
    de,
    pt,
    it,
    fa,
    ar
  }
})

export default i18n
