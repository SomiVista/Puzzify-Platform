import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAppStore } from './useAppStore'
import i18n from '../i18n'

describe('useAppStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    i18n.global.locale.value = 'en'
  })

  it('initializes with default state', () => {
    const store = useAppStore()
    expect(store.lang).toBe('en')
    expect(store.theme).toBe('birthday')
    expect(store.particlesOn).toBe(true)
  })

  it('toggles language correctly', () => {
    const store = useAppStore()
    store.toggleLang()
    expect(store.lang).toBe('fa')
    expect(store.isFa).toBe(true)
    expect(store.dir).toBe('rtl')
    
    store.toggleLang()
    expect(store.lang).toBe('en')
    expect(store.isFa).toBe(false)
    expect(store.dir).toBe('ltr')
  })

  it('sets language directly', () => {
    const store = useAppStore()
    store.setLang('fa')
    expect(store.lang).toBe('fa')
  })

  it('sets theme correctly', () => {
    const store = useAppStore()
    store.setTheme('mystery')
    expect(store.theme).toBe('mystery')
    expect(store.isMystery).toBe(true)
  })

  it('toggles particles', () => {
    const store = useAppStore()
    store.toggleParticles()
    expect(store.particlesOn).toBe(false)
  })

  it('syncs language with i18n', () => {
    const store = useAppStore()
    // default English
    expect(i18n.global.locale.value).toBe('en')
    // Persian
    store.setLang('fa')
    expect(i18n.global.locale.value).toBe('fa')
  })
})
