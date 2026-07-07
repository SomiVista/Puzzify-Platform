<template>
  <div class="quest-card">
    <div class="card-header">
      <h3 class="quest-title">{{ quest.name }}</h3>
      <PzBadge :tone="quest.status === 'Published' ? 'success' : 'neutral'">
        {{ quest.status }}
      </PzBadge>
    </div>

    <div class="step-row">
      <div v-for="(kind, index) in quest.stepKinds" :key="index" class="step-glyph">
        <component :is="getStepIcon(kind)" :size="14" />
      </div>
      <div v-if="quest.stepKinds.length > 0" class="step-glyph reward-glyph">
        <Gift :size="14" />
      </div>
    </div>

    <div class="metrics-row">
      <div class="metric">
        <span class="metric-label">Plays</span>
        <span class="metric-value">{{ quest.plays }}</span>
      </div>
      <div class="metric">
        <span class="metric-label">Avg Solve</span>
        <span class="metric-value">{{ formatTime(quest.avgSolve) }}</span>
      </div>
    </div>

    <div class="completion-bar-container">
      <div class="completion-header">
        <span class="completion-label">Completion</span>
        <span class="completion-value">{{ quest.completion }}%</span>
      </div>
      <div class="completion-track">
        <div class="completion-fill" :style="{ width: `${quest.completion}%` }"></div>
      </div>
    </div>

    <div class="card-footer">
      <span class="last-activity">{{ quest.lastActivity }}</span>
      <div class="footer-actions">
        <IconButton label="Edit quest" :size="32" frosted>
          <Edit2 :size="14" />
        </IconButton>
        <IconButton label="Analytics" :size="32" frosted>
          <BarChart2 :size="14" />
        </IconButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Lock, HelpCircle, MapPin, Gift, Edit2, BarChart2 } from 'lucide-vue-next'
import PzBadge from '../ui/PzBadge.vue'
import IconButton from '../ui/IconButton.vue'

defineProps({
  quest: {
    type: Object,
    required: true
  }
})

const getStepIcon = (kind) => {
  switch (kind) {
    case 'lock': return Lock
    case 'trivia': return HelpCircle
    case 'hotspot': return MapPin
    default: return Lock
  }
}

const formatTime = (seconds) => {
  if (!seconds) return '--'
  if (seconds < 60) return `${seconds}s`
  const min = Math.floor(seconds / 60)
  return `${min}m`
}
</script>

<style scoped>
.quest-card {
  background: var(--pz-surface);
  border: 1px solid var(--pz-border);
  border-radius: var(--pz-r-md);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: var(--pz-e-1);
  transition: transform .2s, box-shadow .2s;
}
.quest-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--pz-e-2);
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}
.quest-title {
  font-family: var(--pz-font-ui);
  font-size: 16px;
  font-weight: 700;
  color: var(--pz-text);
  margin: 0;
  line-height: 1.3;
}

.step-row {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}
.step-glyph {
  width: 24px;
  height: 24px;
  border-radius: 7px;
  background: var(--pz-surface-2);
  color: var(--pz-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
}
.reward-glyph {
  background: color-mix(in srgb, var(--pz-primary) 15%, transparent);
  color: var(--pz-primary);
}

.metrics-row {
  display: flex;
  align-items: center;
  gap: 24px;
}
.metric {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.metric-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--pz-muted);
}
.metric-value {
  font-size: 15px;
  font-weight: 700;
  color: var(--pz-text);
}

.completion-bar-container {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.completion-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.completion-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--pz-muted);
}
.completion-value {
  font-family: var(--pz-font-display);
  font-size: 13px;
  font-weight: 600;
  color: var(--pz-text);
}
.completion-track {
  height: 6px;
  border-radius: var(--pz-r-full);
  background: var(--pz-surface-2);
  overflow: hidden;
}
.completion-fill {
  height: 100%;
  background: var(--pz-secondary);
  border-radius: var(--pz-r-full);
  transition: width 0.5s ease;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 4px;
  padding-top: 16px;
  border-top: 1px solid var(--pz-hairline);
}
.last-activity {
  font-size: 12px;
  color: var(--pz-muted);
}
.footer-actions {
  display: flex;
  gap: 8px;
}
</style>
