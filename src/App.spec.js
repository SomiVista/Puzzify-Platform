import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import App from './App.vue'

describe('App.vue', () => {
  let wrapper
  let pinia

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    wrapper = mount(App, {
      global: {
        plugins: [pinia]
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
    const buttons = wrapper.findAll('button')
    // The lang toggle button has text "EN → فارسی" by default
    const langBtn = buttons.find(b => b.text().includes('فارسی'))
    expect(langBtn.exists()).toBe(true)
    
    await langBtn.trigger('click')
    
    expect(wrapper.classes()).toContain('pz-lang-fa')
    expect(wrapper.text()).toContain('هر هدیه را به یک اتاق فرار کوچک تبدیل کن.')
  })
})
