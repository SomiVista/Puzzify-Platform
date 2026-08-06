import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import i18n from '../i18n'
import { summarizeFlow } from '../quest/model'
import { loadAllQuests, saveQuest } from '../quest/storage'

export const useAppStore = defineStore('app', () => {
  // State
  const lang = ref('en')
  const theme = ref('birthday')
  const particlesOn = ref(true)

  // Actions
  const setLang = (newLang) => {
    lang.value = newLang
    i18n.global.locale.value = newLang
  }
  const toggleLang = () => {
    lang.value = lang.value === 'en' ? 'fa' : 'en'
    i18n.global.locale.value = lang.value
  }
  const setTheme = (newTheme) => theme.value = newTheme
  const toggleParticles = () => particlesOn.value = !particlesOn.value

  // Dashboard State
  const planTier = ref('free') // 'free' | 'premium' | 'corporate'
  const creatorInfo = ref({ name: 'Maya Kapoor', initials: 'MK' })
  
  // Mock Quests
  const quests = ref([
    { id: 1, name: 'A Year of Us', occasion: 'Anniversary', steps: 3, stepKinds: ['lock', 'trivia', 'hotspot'], status: 'Draft', plays: 0, completion: 0, avgSolve: 0, rewardType: 'Letter', lastActivity: 'Edited 2d ago', timestamp: Date.now() - 2 * 86400000 },
    { id: 2, name: "Mum's 60th", occasion: 'Birthday', steps: 4, stepKinds: ['lock', 'trivia', 'trivia', 'hotspot'], status: 'Published', plays: 38, completion: 82, avgSolve: 252, rewardType: 'Voucher', lastActivity: 'Played 3h ago', timestamp: Date.now() - 3 * 3600000 },
    { id: 3, name: 'Onboarding — Q3', occasion: 'Corporate', steps: 5, stepKinds: ['lock', 'trivia', 'hotspot', 'trivia', 'lock'], status: 'Published', plays: 126, completion: 71, avgSolve: 363, rewardType: 'Video', lastActivity: 'Played 12m ago', timestamp: Date.now() - 12 * 60000 },
    { id: 4, name: 'Sara, will you?', occasion: 'Proposal', steps: 3, stepKinds: ['trivia', 'hotspot', 'lock'], status: 'Published', plays: 1, completion: 100, avgSolve: 461, rewardType: 'Letter', lastActivity: 'Played yesterday', timestamp: Date.now() - 86400000 },
    { id: 5, name: "Dad's retirement", occasion: 'Celebration', steps: 4, stepKinds: ['lock', 'trivia', 'hotspot', 'trivia'], status: 'Published', plays: 52, completion: 88, avgSolve: 235, rewardType: 'Video', lastActivity: 'Played 1d ago', timestamp: Date.now() - 86400000 },
    { id: 6, name: 'Team offsite hunt', occasion: 'Corporate', steps: 5, stepKinds: ['hotspot', 'lock', 'trivia', 'hotspot', 'lock'], status: 'Draft', plays: 0, completion: 0, avgSolve: 0, rewardType: 'Voucher', lastActivity: 'Edited 5h ago', timestamp: Date.now() - 5 * 3600000 },
  ])
  
  // Quests the creator has actually built survive a reload; the six samples
  // above stay as demo content until Firebase Auth + Firestore land (PRD §6.1).
  for (const stored of loadAllQuests()) {
    const index = quests.value.findIndex((q) => String(q.id) === String(stored.id))
    if (index === -1) quests.value.push(stored)
    else quests.value[index] = stored
  }

  const searchQuery = ref('')
  const questFilter = ref('all') // 'all' | 'published' | 'drafts'
  const questSort = ref('recent') // 'recent'

  // Quest CRUD — in-memory until Firebase Auth + Firestore land (PRD §6.1).
  const getQuestById = (id) => quests.value.find((q) => String(q.id) === String(id)) || null

  const nextQuestId = () =>
    quests.value.reduce((max, q) => Math.max(max, Number(q.id) || 0), 0) + 1

  /**
   * Insert or update a quest from the builder. `steps` and `stepKinds` (what the
   * dashboard card renders) are always DERIVED from `flow`, so the two cannot drift.
   */
  const upsertQuest = (quest) => {
    const record = {
      plays: 0,
      completion: 0,
      avgSolve: 0,
      ...getQuestById(quest.id),
      ...quest,
      ...summarizeFlow(quest.flow),
      timestamp: Date.now(),
      lastActivity: 'Edited just now'
    }
    const index = quests.value.findIndex((q) => String(q.id) === String(record.id))
    if (index === -1) {
      quests.value.push(record)
    } else {
      quests.value[index] = record
    }
    saveQuest(record)
    return record
  }

  // Getters
  const isFa = computed(() => lang.value === 'fa')
  const isMystery = computed(() => theme.value === 'mystery')
  const dir = computed(() => isFa.value ? 'rtl' : 'ltr')
  
  const filteredQuests = computed(() => {
    let result = quests.value
    if (questFilter.value !== 'all') {
      result = result.filter(q => q.status.toLowerCase() === questFilter.value)
    }
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      result = result.filter(quest => quest.name.toLowerCase().includes(q))
    }
    return result.sort((a, b) => b.timestamp - a.timestamp)
  })

  // KPIs
  const totalGifts = computed(() => quests.value.length)
  const totalPublished = computed(() => quests.value.filter(q => q.status === 'Published').length)
  const totalPlays = computed(() => quests.value.reduce((sum, q) => sum + q.plays, 0))
  
  const avgCompletion = computed(() => {
    const published = quests.value.filter(q => q.status === 'Published')
    if (!published.length) return 0
    return Math.round(published.reduce((sum, q) => sum + q.completion, 0) / published.length)
  })
  
  const avgSolveSeconds = computed(() => {
    const played = quests.value.filter(q => q.plays > 0)
    if (!played.length) return 0
    return Math.round(played.reduce((sum, q) => sum + q.avgSolve, 0) / played.length)
  })
  
  return {
    lang, theme, particlesOn,
    setLang, toggleLang, setTheme, toggleParticles,
    planTier, quests, creatorInfo, searchQuery, questFilter, questSort,
    getQuestById, nextQuestId, upsertQuest,
    isFa, isMystery, dir,
    filteredQuests, totalGifts, totalPublished, totalPlays, avgCompletion, avgSolveSeconds
  }
})
