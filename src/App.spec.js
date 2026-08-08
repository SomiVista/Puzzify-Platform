import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import i18n from './i18n'
import router from './router'
import App from './App.vue'
import { THEMES } from './themes'
import { APP_NAME } from './config/app'
import { useAppStore } from './stores/useAppStore'

describe('App.vue', () => {
  let wrapper
  let pinia

  beforeEach(async () => {
    pinia = createPinia()
    setActivePinia(pinia)
    
    // Ensure router is ready
    router.push('/')
    await router.isReady()
    
    wrapper = mount(App, {
      global: {
        plugins: [pinia, i18n, router]
      }
    })
  })

  it('renders correctly with default english and birthday theme', () => {
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toContain(APP_NAME)
    expect(wrapper.text()).toContain('Turn any gift into a mini-escape room.')
    expect(wrapper.classes()).not.toContain('theme-mystery')
    expect(wrapper.classes()).not.toContain('lang-fa')
    expect(wrapper.classes()).not.toContain('lang-rtl')
    expect(wrapper.attributes('dir')).toBe('ltr')
  })

  it('toggles theme to mystery', async () => {
    // Find the mystery theme button
    const buttons = wrapper.findAll('button')
    const mysteryBtn = buttons.find(b => b.text() === 'Mystery')
    expect(mysteryBtn.exists()).toBe(true)

    await mysteryBtn.trigger('click')

    expect(wrapper.classes()).toContain('theme-mystery')
  })

  /**
   * `tm()` returns RAW messages, so a component reading a branded string that
   * way renders the literal "@:appName" instead of the product name. Scanning
   * the whole landing page catches every present and future case in one go.
   */
  it('leaves no unresolved i18n link on the page', () => {
    expect(wrapper.text()).not.toContain('@:')
  })

  it('renders the product name from the config constant', () => {
    expect(wrapper.text()).toContain(APP_NAME)
    // …including strings that reach the DOM through a linked message.
    expect(wrapper.text()).toContain(`${APP_NAME} × WelloWork`)
  })

  it('stamps the active preset so [data-theme] rules apply', async () => {
    expect(wrapper.attributes('data-theme')).toBe('birthday')
    // The preset's own token values ride along as inline custom properties.
    expect(wrapper.attributes('style')).toContain(THEMES.birthday.vars['--color-primary'])

    const mysteryBtn = wrapper.findAll('button').find(b => b.text() === 'Mystery')
    await mysteryBtn.trigger('click')

    expect(wrapper.attributes('data-theme')).toBe('mystery')
    expect(wrapper.attributes('style')).toContain(THEMES.mystery.vars['--color-primary'])
  })

  it('toggles language to persian', async () => {
    // Find the language dropdown button and open it
    const buttons = wrapper.findAll('button')
    const dropdownBtn = buttons.find(b => b.text().includes('English'))
    expect(dropdownBtn.exists()).toBe(true)
    
    await dropdownBtn.trigger('click')
    
    // Find the persian option in the dropdown and click it
    const dropdownOptions = wrapper.findAll('button')
    const persianOption = dropdownOptions.find(b => b.text().includes('فارسی'))
    expect(persianOption.exists()).toBe(true)

    await persianOption.trigger('click')
    
    expect(wrapper.classes()).toContain('lang-fa')
    expect(wrapper.classes()).toContain('lang-rtl')
    expect(wrapper.attributes('dir')).toBe('rtl')
    expect(wrapper.text()).toContain('هر هدیه را به یک اتاق فرار کوچک تبدیل کن.')
  })

  it('mirrors the stage for Arabic, not only Persian', async () => {
    const store = useAppStore()

    const dropdownBtn = wrapper.findAll('button').find(b => b.text().includes('English'))
    await dropdownBtn.trigger('click')
    const arabicOption = wrapper.findAll('button').find(b => b.text().includes('العربية'))
    await arabicOption.trigger('click')

    expect(store.lang).toBe('ar')
    expect(wrapper.attributes('dir')).toBe('rtl')
    // Carries the RTL font swap, without claiming to be Persian.
    expect(wrapper.classes()).toContain('lang-rtl')
    expect(wrapper.classes()).toContain('lang-ar')
    expect(wrapper.classes()).not.toContain('lang-fa')
  })
})
