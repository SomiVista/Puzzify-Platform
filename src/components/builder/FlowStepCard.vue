<template>
  <li
    class="step-card"
    :class="{ selected, dragging }"
    draggable="true"
    :data-testid="`step-card-${index}`"
    @dragstart="onDragStart"
    @dragend="$emit('dragend')"
  >
    <button type="button" class="card-main" @click="$emit('select')">
      <span class="card-top">
        <span class="index-badge">{{ index + 1 }}</span>
        <span class="kind">
          <component :is="icon" :size="14" aria-hidden="true" />
          {{ t(`builder.palette.${step.kind}.label`) }}
        </span>
        <span class="status" :class="{ ready: valid }">
          {{ valid ? t('builder.canvas.ready') : t('builder.canvas.incomplete') }}
        </span>
      </span>

      <span class="card-title">{{ headline }}</span>

      <span class="card-lock">
        <component :is="playsFirst ? Play : Lock" :size="12" aria-hidden="true" />
        {{ playsFirst ? t('builder.canvas.playsFirst') : t('builder.canvas.lockedUntil', { n: index }) }}
      </span>
    </button>

    <div class="card-actions">
      <IconButton
        :label="t('builder.canvas.moveUp')"
        :size="32"
        :disabled="index === 0"
        :data-testid="`move-up-${index}`"
        @click="$emit('move', -1)"
      >
        <ChevronUp :size="15" />
      </IconButton>
      <IconButton
        :label="t('builder.canvas.moveDown')"
        :size="32"
        :disabled="index === total - 1"
        :data-testid="`move-down-${index}`"
        @click="$emit('move', 1)"
      >
        <ChevronDown :size="15" />
      </IconButton>
      <IconButton
        :label="t('builder.canvas.delete')"
        :size="32"
        :data-testid="`delete-step-${index}`"
        @click="$emit('delete')"
      >
        <Trash2 :size="15" />
      </IconButton>
    </div>
  </li>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ChevronUp, ChevronDown, Trash2, Lock, Play } from 'lucide-vue-next'
import { blockIcon } from '../../quest/blocks'
import IconButton from '../ui/IconButton.vue'

const props = defineProps({
  step: { type: Object, required: true },
  index: { type: Number, required: true },
  total: { type: Number, required: true },
  selected: { type: Boolean, default: false },
  dragging: { type: Boolean, default: false },
  valid: { type: Boolean, default: false },
  /** True when no earlier step gates this one — i.e. `isStepUnlocked(flow, index, [])`. */
  playsFirst: { type: Boolean, default: false }
})

const emit = defineEmits(['select', 'move', 'delete', 'dragstart', 'dragend'])

const { t } = useI18n()

const icon = computed(() => blockIcon(props.step.kind))

const headline = computed(() => {
  const { title, prompt } = props.step
  return title?.trim() || prompt?.trim() || t('builder.canvas.untitled')
})

function onDragStart(event) {
  event.dataTransfer?.setData('text/plain', String(props.index))
  if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move'
  emit('dragstart')
}
</script>

<style scoped>
.step-card {
  position: relative;
  display: flex;
  align-items: stretch;
  gap: 8px;
  padding-block: 4px;
  padding-inline: 4px 6px;
  background: var(--pz-surface);
  border: 1.5px solid var(--pz-border);
  border-radius: var(--pz-r-lg);
  box-shadow: var(--pz-e-1);
  cursor: grab;
  transition: border-color var(--pz-dur) var(--pz-ease), box-shadow var(--pz-dur) var(--pz-ease),
    opacity var(--pz-dur) var(--pz-ease);
}
.step-card:hover {
  border-color: color-mix(in srgb, var(--pz-primary) 45%, var(--pz-border));
}
.step-card.selected {
  border-color: var(--pz-primary);
  box-shadow: var(--pz-e-2);
}
.step-card.dragging {
  opacity: 0.45;
}

.card-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  padding: 14px;
  background: none;
  border: none;
  text-align: start;
  font-family: var(--pz-font-ui);
  color: var(--pz-text);
  cursor: pointer;
  border-radius: var(--pz-r-md);
  outline: none;
}
.card-main:focus-visible {
  box-shadow: 0 0 0 4px var(--pz-ring);
}

.card-top {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}
.index-badge {
  flex: none;
  width: 22px;
  height: 22px;
  border-radius: var(--pz-r-full);
  background: var(--pz-primary);
  color: var(--pz-on-primary);
  font-size: 11.5px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}
.kind {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--pz-muted);
}
.status {
  margin-inline-start: auto;
  flex: none;
  padding: 3px 8px;
  border-radius: var(--pz-r-full);
  font-size: 10.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  background: color-mix(in srgb, var(--pz-accent) 18%, transparent);
  color: var(--pz-accent);
}
.status.ready {
  background: color-mix(in srgb, var(--pz-success) 15%, transparent);
  color: var(--pz-success);
}

.card-title {
  font-size: 14.5px;
  font-weight: 600;
  line-height: 1.35;
  width: 100%;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
.card-lock {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11.5px;
  color: var(--pz-muted);
}

.card-actions {
  flex: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  padding-block: 8px;
}
</style>
