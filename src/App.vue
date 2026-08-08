<script setup>
/**
 * @file App.vue
 * @description Root component. Owns the themed, direction-aware stage that
 * every route renders inside.
 */
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useAppStore } from './stores/useAppStore'
import { themeVars } from './themes'

const store = useAppStore()
const { isRtl, lang, theme, dir } = storeToRefs(store)

/* A theme is applied in two halves: the token values as inline custom
   properties, and `data-theme` so CSS can target the active preset. */
const stageVars = computed(() => themeVars(theme.value))
</script>

<template>
  <div
    :class="[
      'app-stage',
      `theme-${theme}`,
      `lang-${lang}`,
      { 'lang-rtl': isRtl }
    ]"
    :data-theme="theme"
    :dir="dir"
    :style="{ minHeight: '100vh', background: 'var(--color-bg)', overflowX: 'clip', ...stageVars }"
  >
    <router-view />
  </div>
</template>
