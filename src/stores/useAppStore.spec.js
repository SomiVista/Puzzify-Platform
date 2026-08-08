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

  describe('text direction', () => {
    // Every locale offered in the header must resolve to a direction; Arabic
    // used to fall through to ltr because only Persian was checked.
    it.each([
      ['en', 'ltr', false],
      ['sv', 'ltr', false],
      ['fr', 'ltr', false],
      ['fa', 'rtl', true],
      ['ar', 'rtl', true]
    ])('renders %s as %s', (code, dir, rtl) => {
      const store = useAppStore()
      store.setLang(code)
      expect(store.dir).toBe(dir)
      expect(store.isRtl).toBe(rtl)
    })

    it('keeps isFa specific to Persian even though Arabic is also RTL', () => {
      const store = useAppStore()
      store.setLang('ar')
      expect(store.isRtl).toBe(true)
      expect(store.isFa).toBe(false)
    })
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

  describe('filteredQuests', () => {
    it('never reorders the source array', () => {
      const store = useAppStore()
      const before = store.quests.map((q) => q.id)

      // With no filter and no search the computed used to sort `quests` itself.
      expect(store.filteredQuests).toHaveLength(before.length)
      expect(store.quests.map((q) => q.id)).toEqual(before)

      store.toggleQuestSort()
      expect(store.filteredQuests.map((q) => q.name)).toEqual(
        [...store.quests].map((q) => q.name).sort((a, b) => a.localeCompare(b))
      )
      expect(store.quests.map((q) => q.id)).toEqual(before)
    })

    it('returns a fresh array rather than the state array', () => {
      const store = useAppStore()
      expect(store.filteredQuests).not.toBe(store.quests)
    })

    it('sorts by recent activity by default', () => {
      const store = useAppStore()
      const stamps = store.filteredQuests.map((q) => q.timestamp)
      expect(stamps).toEqual([...stamps].sort((a, b) => b - a))
    })

    // The control says "Drafts" while a quest's status says "Draft", which used
    // to mean the Drafts tab matched nothing at all.
    it('matches the plural filter labels against singular statuses', () => {
      const store = useAppStore()

      store.questFilter = 'drafts'
      expect(store.filteredQuests.length).toBeGreaterThan(0)
      expect(store.filteredQuests.every((q) => q.status === 'Draft')).toBe(true)

      store.questFilter = 'published'
      expect(store.filteredQuests.length).toBeGreaterThan(0)
      expect(store.filteredQuests.every((q) => q.status === 'Published')).toBe(true)

      store.questFilter = 'all'
      expect(store.filteredQuests).toHaveLength(store.quests.length)
    })

    it('toggles between recent and name ordering', () => {
      const store = useAppStore()
      expect(store.questSort).toBe('recent')
      store.toggleQuestSort()
      expect(store.questSort).toBe('name')
      store.toggleQuestSort()
      expect(store.questSort).toBe('recent')
    })

    it('still filters and searches', () => {
      const store = useAppStore()
      store.questFilter = 'published'
      expect(store.filteredQuests.every((q) => q.status === 'Published')).toBe(true)

      store.questFilter = 'all'
      store.searchQuery = 'mum'
      expect(store.filteredQuests.map((q) => q.name)).toEqual(["Mum's 60th"])
    })
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

    it('derives the card reward type from the draft reward', () => {
      const store = useAppStore()
      const record = store.upsertQuest({
        id: store.nextQuestId(),
        name: 'Voucher run',
        status: 'Draft',
        flow: [{ id: 'a', kind: 'lock' }],
        reward: { type: 'voucher', code: 'ABC' }
      })
      expect(record.rewardType).toBe('voucher')
    })

    it('falls back to a letter reward when the draft has none', () => {
      const store = useAppStore()
      const record = store.upsertQuest({
        id: store.nextQuestId(),
        name: 'No reward yet',
        status: 'Draft',
        flow: []
      })
      expect(record.rewardType).toBe('letter')
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
