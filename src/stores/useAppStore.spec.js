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

  describe('quest CRUD', () => {
    it('finds a quest by id regardless of string/number form', () => {
      const store = useAppStore()
      expect(store.getQuestById(2).name).toBe("Mum's 60th")
      expect(store.getQuestById('2').name).toBe("Mum's 60th")
      expect(store.getQuestById(999)).toBeNull()
    })

    it('hands out an id past every existing quest', () => {
      const store = useAppStore()
      expect(store.nextQuestId()).toBe(store.quests.length + 1)
    })

    it('appends a new quest with card fields derived from its flow', () => {
      const store = useAppStore()
      const before = store.quests.length

      const record = store.upsertQuest({
        id: store.nextQuestId(),
        name: 'New one',
        status: 'Draft',
        flow: [{ id: 'a', kind: 'lock' }, { id: 'b', kind: 'trivia' }]
      })

      expect(store.quests).toHaveLength(before + 1)
      expect(record.steps).toBe(2)
      expect(record.stepKinds).toEqual(['lock', 'trivia'])
      expect(record.plays).toBe(0)
      expect(record.lastActivity).toBe('Edited just now')
    })

    it('updates in place and keeps fields the builder does not own', () => {
      const store = useAppStore()
      const before = store.quests.length
      const existing = store.getQuestById(3) // 126 plays, 71% completion

      store.upsertQuest({ ...existing, name: 'Onboarding — Q4', flow: [{ id: 'a', kind: 'lock' }] })

      expect(store.quests).toHaveLength(before)
      const saved = store.getQuestById(3)
      expect(saved.name).toBe('Onboarding — Q4')
      expect(saved.steps).toBe(1)
      expect(saved.stepKinds).toEqual(['lock'])
      expect(saved.plays).toBe(126)
      expect(saved.completion).toBe(71)
    })

    it('keeps derived KPIs consistent after an upsert', () => {
      const store = useAppStore()
      const before = store.totalGifts

      store.upsertQuest({ id: store.nextQuestId(), name: 'Draft', status: 'Draft', flow: [] })

      expect(store.totalGifts).toBe(before + 1)
      // A brand-new draft has no plays, so play-derived KPIs are unaffected.
      expect(store.totalPlays).toBe(217)
    })
  })
})
