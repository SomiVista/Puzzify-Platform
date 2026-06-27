import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAppStore } from './useAppStore'

describe('useAppStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
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

  it('provides correct translations based on language', () => {
    const store = useAppStore()
    // default English
    expect(store.t.navHow).toBe('How it works')
    // Persian
    store.setLang('fa')
    expect(store.t.navHow).toBe('چطور کار می‌کند')
  })
})
