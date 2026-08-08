/**
 * Product identity — the ONE place the name lives.
 *
 * Nothing else in the codebase hardcodes it. Locale files reference it through
 * the vue-i18n linked message `@:appName` (wired up in `src/i18n.js`), and the
 * document title is set from here on boot, so renaming the product is a
 * one-line change in this file.
 *
 * `APP_NAME` is a PLACEHOLDER — replace the string below with the real product
 * name. Note that infrastructure identifiers (the Firebase project id, the
 * hosting domain, the GitHub repository) are deliberately NOT derived from it:
 * those are external resources that have to be renamed in their own consoles.
 */
export const APP_NAME = 'Quest Platform'

/** Short form for tight spots (browser tab, compact headers). */
export const APP_SHORT_NAME = APP_NAME
