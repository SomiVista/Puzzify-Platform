<template>
  <div class="box-stage-wrapper" :style="{ width: size + 'px', height: size + 'px' }">
    <div class="box-stage-inner pz-anim">
      <div class="floating-asset pz-anim">
        <svg v-if="isMystery && asset === 'gift'" width="64" height="64" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="12" y="14" width="96" height="92" rx="12" fill="var(--pz-surface-2)" stroke="var(--pz-primary)" stroke-width="4"></rect>
          <rect x="26" y="28" width="68" height="64" rx="7" fill="var(--pz-bg)" stroke="var(--pz-border)" stroke-width="3"></rect>
          <circle cx="60" cy="60" r="17" fill="none" stroke="var(--pz-primary)" stroke-width="5"></circle>
          <circle cx="60" cy="60" r="4" fill="var(--pz-primary)"></circle>
          <rect x="58" y="40" width="4" height="12" rx="2" fill="var(--pz-primary)"></rect>
        </svg>
        <svg v-else-if="asset === 'gift'" width="64" height="64" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="14" y="50" width="92" height="58" rx="10" fill="var(--pz-primary)"></rect>
          <rect x="8" y="36" width="104" height="22" rx="7" fill="var(--pz-secondary)"></rect>
          <rect x="52" y="36" width="16" height="72" fill="var(--pz-accent)"></rect>
          <circle cx="48" cy="30" r="13" fill="none" stroke="var(--pz-accent)" stroke-width="8"></circle>
          <circle cx="72" cy="30" r="13" fill="none" stroke="var(--pz-accent)" stroke-width="8"></circle>
        </svg>
        
        <!-- Fallbacks for other asset types if needed -->
        <svg v-else-if="asset === 'envelope'" width="64" height="64" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="30" width="100" height="60" rx="6" fill="var(--pz-primary)"></rect>
          <path d="M10 30 L60 65 L110 30" fill="none" stroke="var(--pz-surface)" stroke-width="4" stroke-linecap="round"/>
        </svg>
        <svg v-else width="64" height="64" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="20" y="20" width="80" height="80" rx="12" fill="var(--pz-surface-2)"></rect>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useAppStore } from '../../stores/useAppStore'

defineProps({
  asset: { type: String, default: 'gift' },
  size: { type: [Number, String], default: 130 }
})

const store = useAppStore()
const { isMystery } = storeToRefs(store)
</script>

<style scoped>
.box-stage-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 36px;
  background: var(--pz-surface-2);
  padding: 12px;
}

.box-stage-inner {
  width: 100%;
  height: 100%;
  border-radius: 26px;
  background: var(--pz-surface);
  border: 1px solid var(--pz-border);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--pz-e-2);
  animation: pzPulse 2.6s ease-out infinite;
}

.floating-asset {
  animation: pzFloatBox 4s var(--pz-ease) infinite;
  display: flex;
  align-items: center;
  justify-content: center;
}

.floating-asset svg {
  width: 120%;
  height: 120%;
  max-width: 64px;
  max-height: 64px;
}
</style>
