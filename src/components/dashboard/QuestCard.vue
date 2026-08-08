<template>
  <div class="quest-card">
    <div class="card-header">
      <div class="title-block">
        <span v-if="occasionLabel" class="occasion-kicker" data-testid="quest-occasion">
          {{ occasionLabel }}
        </span>
        <h3 class="quest-title">{{ quest.name }}</h3>
      </div>
      <BaseBadge :tone="isPublished ? 'success' : 'neutral'">
        {{ isPublished ? t('dashboard.card.statusPublished') : t('dashboard.card.statusDraft') }}
      </BaseBadge>
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
        <span class="metric-label">{{ t('dashboard.card.plays') }}</span>
        <span class="metric-value">{{ quest.plays }}</span>
      </div>
      <div class="metric">
        <span class="metric-label">{{ t('dashboard.card.avgSolve') }}</span>
        <span class="metric-value">{{ formatTime(quest.avgSolve) }}</span>
      </div>
      <div class="metric">
        <span class="metric-label">{{ t('dashboard.card.reward') }}</span>
        <span class="metric-value" data-testid="quest-reward">{{ rewardLabel }}</span>
      </div>
    </div>

    <div class="completion-bar-container">
      <div class="completion-header">
        <span class="completion-label">{{ t('dashboard.card.completion') }}</span>
        <span class="completion-value">{{ quest.completion }}%</span>
      </div>
      <div class="completion-track">
        <div class="completion-fill" :style="{ width: `${quest.completion}%` }"></div>
      </div>
    </div>

    <div class="card-footer">
      <span class="last-activity">{{ quest.lastActivity }}</span>
      <div class="footer-actions">
        <!-- A draft has no /q/{id} yet, so there is nothing to copy. -->
        <BaseIconButton
          v-if="shareUrl"
          :label="copied ? t('dashboard.card.copied') : t('dashboard.card.copyLink')"
          :size="36"
          frosted
          :data-testid="`copy-link-${quest.id}`"
          @click="copyLink"
        >
          <component :is="copied ? Check : LinkIcon" :size="14" />
        </BaseIconButton>
        <BaseButton
          variant="secondary"
          size="sm"
          :data-testid="`edit-quest-${quest.id}`"
          @click="openBuilder"
        >
          {{ t('dashboard.card.open') }}
        </BaseButton>
      </div>
    </div>

    <!-- Confirmation for the copy action, announced rather than drawn as a toast
         so it reaches screen readers too. -->
    <span class="sr-only" role="status" aria-live="polite">
      {{ copied ? t('dashboard.card.copied') : '' }}
    </span>
  </div>
</template>

<script setup>
import { computed, ref, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { Gift, Check, Link as LinkIcon } from 'lucide-vue-next'
import { blockIcon } from '../../quest/blocks'
import { occasionLabelKey } from '../../quest/occasions'
import { playerUrl } from '../../quest/publish'
import BaseBadge from '../ui/BaseBadge.vue'
import BaseButton from '../ui/BaseButton.vue'
import BaseIconButton from '../ui/BaseIconButton.vue'

const props = defineProps({
  quest: {
    type: Object,
    required: true
  }
})

const { t, te } = useI18n()
const router = useRouter()

const isPublished = computed(() => props.quest.status === 'Published')

const getStepIcon = blockIcon

/** Preset occasions localize; anything the creator typed shows verbatim. */
const occasionLabel = computed(() => {
  const key = occasionLabelKey(props.quest.occasion)
  return key ? t(key) : props.quest.occasion || ''
})

/** Reward types are the canonical ids of PRD §4.4; older records may be labels. */
const rewardLabel = computed(() => {
  const type = String(props.quest.rewardType || '').toLowerCase()
  const key = `dashboard.card.rewards.${type}`
  return te(key) ? t(key) : props.quest.rewardType || '--'
})

const shareUrl = computed(() => (props.quest.playerId ? playerUrl(props.quest.playerId) : ''))

const copied = ref(false)
let copiedTimer = null
async function copyLink() {
  try {
    await navigator.clipboard.writeText(shareUrl.value)
  } catch {
    // Clipboard is blocked in some in-app browsers; the link is still on the
    // quest, so fall through to the confirmation rather than failing loudly.
  }
  copied.value = true
  clearTimeout(copiedTimer)
  copiedTimer = setTimeout(() => { copied.value = false }, 2000)
}
onBeforeUnmount(() => clearTimeout(copiedTimer))

const openBuilder = () =>
  router.push({ name: 'quest-builder', params: { id: props.quest.id } })

const formatTime = (seconds) => {
  if (!seconds) return '--'
  if (seconds < 60) return `${seconds}s`
  const min = Math.floor(seconds / 60)
  return `${min}m`
}
</script>

<style scoped>
.quest-card {
  position: relative;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: var(--shadow-1);
  transition: transform .2s, box-shadow .2s;
}
.quest-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-2);
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}
.title-block {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}
.occasion-kicker {
  font-family: var(--font-ui);
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: var(--tracking-kicker);
  color: var(--color-secondary);
}
.quest-title {
  font-family: var(--font-ui);
  font-size: 16px;
  font-weight: 700;
  color: var(--color-text);
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
  background: var(--color-surface-2);
  color: var(--color-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
}
.reward-glyph {
  background: color-mix(in srgb, var(--color-primary) 15%, transparent);
  color: var(--color-primary);
}

.metrics-row {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
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
  color: var(--color-muted);
}
.metric-value {
  font-size: 15px;
  font-weight: 700;
  color: var(--color-text);
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
  color: var(--color-muted);
}
.completion-value {
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text);
}
.completion-track {
  height: 6px;
  border-radius: var(--radius-full);
  background: var(--color-surface-2);
  overflow: hidden;
}
.completion-fill {
  height: 100%;
  background: var(--color-secondary);
  border-radius: var(--radius-full);
  transition: width 0.5s ease;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 4px;
  padding-top: 16px;
  border-top: 1px solid var(--color-hairline);
}
.last-activity {
  font-size: 12px;
  color: var(--color-muted);
  min-width: 0;
}
.footer-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: none;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
</style>
