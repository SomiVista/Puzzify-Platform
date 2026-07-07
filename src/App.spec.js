import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import i18n from './i18n'
import router from './router'
import App from './App.vue'

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
    expect(wrapper.text()).toContain('Puzzify')
    expect(wrapper.text()).toContain('Turn any gift into a mini-escape room.')
    expect(wrapper.classes()).not.toContain('pz-theme-mystery')
    expect(wrapper.classes()).not.toContain('pz-lang-fa')
  })

  it('toggles theme to mystery', async () => {
    // Find the mystery theme button
    const buttons = wrapper.findAll('button')
    const mysteryBtn = buttons.find(b => b.text() === 'Mystery')
    expect(mysteryBtn.exists()).toBe(true)
    
    await mysteryBtn.trigger('click')
    
    expect(wrapper.classes()).toContain('pz-theme-mystery')
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
    
    expect(wrapper.classes()).toContain('pz-lang-fa')
    expect(wrapper.text()).toContain('هر هدیه را به یک اتاق فرار کوچک تبدیل کن.')
  })
})
