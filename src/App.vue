<script setup>
/**
 * @file App.vue
 * @description Root component that assembles all page sections.
 */
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useAppStore } from './stores/useAppStore'
import { THEMES } from './themes'

const store = useAppStore()
const { isFa, theme, dir } = storeToRefs(store)

const themeVars = computed(() => {
  const currentTheme = THEMES[theme.value] || THEMES.birthday
  return currentTheme.vars
})
</script>

<template>
  <div 
    :class="['pz-stage', `pz-theme-${theme}`, { 'pz-lang-fa': isFa }]" 
    :dir="dir" 
    :style="{ minHeight: '100vh', background: 'var(--pz-bg)', overflowX: 'clip', ...themeVars }"
  >
    <router-view />
  </div>
</template>
