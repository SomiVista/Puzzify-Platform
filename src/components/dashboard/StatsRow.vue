<template>
  <section class="stats-row">
    <div class="stat-card">
      <div class="stat-value">{{ totalGifts }}</div>
      <div class="stat-label">{{ t('dashboard.stats.gifts') }}</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">{{ totalPlays }}</div>
      <div class="stat-label">{{ t('dashboard.stats.plays') }}</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">{{ avgCompletion }}<span class="stat-unit">%</span></div>
      <div class="stat-label">{{ t('dashboard.stats.completion') }}</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">{{ formatTime(avgSolveSeconds) }}</div>
      <div class="stat-label">{{ t('dashboard.stats.solve') }}</div>
    </div>
  </section>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useAppStore } from '../../stores/useAppStore'

const { t } = useI18n()
const store = useAppStore()
const { totalGifts, totalPlays, avgCompletion, avgSolveSeconds } = storeToRefs(store)

const formatTime = (seconds) => {
  if (seconds < 60) return `${seconds}s`
  const min = Math.floor(seconds / 60)
  const sec = seconds % 60
  return `${min}m ${sec}s`
}
</script>

<style scoped>
.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  padding: 0 30px 32px;
}
.stat-card {
  background: var(--pz-surface);
  border: 1px solid var(--pz-border);
  border-radius: var(--pz-r-md);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: var(--pz-e-1);
}
.stat-value {
  font-family: var(--pz-font-display);
  font-size: 32px;
  font-weight: 800;
  color: var(--pz-primary);
  line-height: 1;
  letter-spacing: -0.02em;
}
.stat-unit {
  font-size: 20px;
  margin-inline-start: 2px;
}
.stat-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--pz-muted);
}

@media (max-width: 900px) {
  .stats-row { grid-template-columns: repeat(2, 1fr); padding-inline: 16px; }
}
@media (max-width: 480px) {
  .stats-row { grid-template-columns: 1fr; }
}
</style>
