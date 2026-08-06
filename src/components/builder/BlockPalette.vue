<template>
  <section class="palette">
    <h2 class="pane-title">{{ t('builder.palette.title') }}</h2>
    <p class="pane-hint">{{ t('builder.palette.hint') }}</p>

    <ul class="block-list">
      <li v-for="block in BLOCKS" :key="block.kind">
        <button
          type="button"
          class="block"
          draggable="true"
          :data-testid="`palette-${block.kind}`"
          :aria-label="t('builder.palette.add', { block: t(`builder.palette.${block.kind}.label`) })"
          @dragstart="onDragStart($event, block.kind)"
          @dragend="builder.endDrag()"
          @click="builder.addStep(block.kind)"
        >
          <span class="block-icon">
            <component :is="block.icon" :size="18" />
          </span>
          <span class="block-text">
            <span class="block-label">{{ t(`builder.palette.${block.kind}.label`) }}</span>
            <span class="block-desc">{{ t(`builder.palette.${block.kind}.desc`) }}</span>
          </span>
          <GripVertical class="block-grip" :size="16" aria-hidden="true" />
        </button>
      </li>
    </ul>
  </section>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { GripVertical } from 'lucide-vue-next'
import { BLOCKS } from '../../quest/blocks'
import { useBuilderStore } from '../../stores/useBuilderStore'

const { t } = useI18n()
const builder = useBuilderStore()

function onDragStart(event, kind) {
  builder.beginPaletteDrag(kind)
  // Firefox only starts a drag once dataTransfer carries something.
  event.dataTransfer?.setData('text/plain', kind)
  if (event.dataTransfer) event.dataTransfer.effectAllowed = 'copy'
}
</script>

<style scoped>
.palette {
  padding: 20px 16px;
}
.pane-title {
  font-family: var(--pz-font-ui);
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: var(--pz-track-kicker);
  color: var(--pz-muted);
  margin: 0 0 6px;
}
.pane-hint {
  font-size: 12px;
  line-height: 1.45;
  color: var(--pz-muted);
  margin: 0 0 16px;
}

.block-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.block {
  width: 100%;
  min-height: 44px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  text-align: start;
  background: var(--pz-surface);
  border: 1px solid var(--pz-border);
  border-radius: var(--pz-r-md);
  color: var(--pz-text);
  font-family: var(--pz-font-ui);
  cursor: grab;
  transition: border-color var(--pz-dur) var(--pz-ease), box-shadow var(--pz-dur) var(--pz-ease);
}
.block:hover {
  border-color: var(--pz-primary);
  box-shadow: var(--pz-e-1);
}
.block:active {
  cursor: grabbing;
}
.block:focus-visible {
  outline: none;
  border-color: var(--pz-focus);
  box-shadow: 0 0 0 4px var(--pz-ring);
}

.block-icon {
  flex: none;
  width: 34px;
  height: 34px;
  border-radius: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--pz-surface-2);
  color: var(--pz-primary);
}
.block-text {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.block-label {
  font-size: 13.5px;
  font-weight: 700;
  line-height: 1.2;
}
.block-desc {
  font-size: 11.5px;
  line-height: 1.35;
  color: var(--pz-muted);
}
.block-grip {
  flex: none;
  color: var(--pz-muted);
}
</style>
