<script setup>
/**
 * @file App.vue
 * @description Root component that assembles all page sections.
 */
import { storeToRefs } from 'pinia'
import { useAppStore } from './stores/useAppStore'

const store = useAppStore()
const { isFa, isMystery, dir } = storeToRefs(store)
</script>

<template>
  <div 
    :class="['pz-stage', { 'pz-theme-mystery': isMystery, 'pz-lang-fa': isFa }]" 
    :dir="dir" 
    style="min-height:100vh; background:var(--pz-bg); overflow-x:clip;"
  >
    <router-view />
  </div>
</template>
