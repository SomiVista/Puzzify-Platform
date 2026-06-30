import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import i18n from '../i18n'

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
  const quests = ref([]) // empty for empty state
  const creatorInfo = ref({ name: 'Maya Kapoor', initials: 'MK' })

  // Getters
  const isFa = computed(() => lang.value === 'fa')
  const isMystery = computed(() => theme.value === 'mystery')
  const dir = computed(() => isFa.value ? 'rtl' : 'ltr')
  
  return {
    lang, theme, particlesOn,
    setLang, toggleLang, setTheme, toggleParticles,
    planTier, quests, creatorInfo,
    isFa, isMystery, dir
  }
})
