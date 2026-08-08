<template>
  <section
    class="canvas"
    :class="{ 'is-dragging': builder.isDragging }"
    data-testid="flow-canvas"
    @dragover.prevent
    @drop.prevent="builder.dropAt(flow.length)"
  >
    <header class="canvas-head">
      <h2 class="pane-title">{{ t('builder.canvas.title') }}</h2>
      <p class="pane-hint">{{ t('builder.canvas.subtitle') }}</p>
    </header>

    <div class="rail">
      <!-- Start node: the recipient opening the link. -->
      <div class="node">
        <span class="node-dot"><Link2 :size="14" aria-hidden="true" /></span>
        <span class="node-text">
          <strong>{{ t('builder.canvas.start') }}</strong>
          <small>{{ t('builder.canvas.startCaption') }}</small>
        </span>
      </div>

      <DropSlot :index="0" />

      <ul v-if="flow.length" class="cards">
        <template v-for="(step, index) in flow" :key="step.id">
          <FlowStepCard
            :step="step"
            :index="index"
            :total="flow.length"
            :selected="step.id === builder.selectedStepId"
            :dragging="builder.dragIndex === index"
            :valid="builder.stepValidity[step.id]"
            :plays-first="isStepUnlocked(flow, index, [])"
            @select="builder.selectStep(step.id)"
            @move="(delta) => builder.nudgeStep(index, delta)"
            @delete="builder.deleteStep(index)"
            @dragstart="builder.beginCardDrag(index)"
            @dragend="builder.endDrag()"
          />
          <li class="connector" :aria-label="t('builder.canvas.unlocks', { n: index + 2 })">
            <ArrowDown :size="14" aria-hidden="true" />
          </li>
          <DropSlot :index="index + 1" tag="li" />
        </template>
      </ul>

      <div v-else class="empty" data-testid="canvas-empty">
        <PackagePlus :size="26" aria-hidden="true" />
        <strong>{{ t('builder.canvas.empty') }}</strong>
        <span>{{ t('builder.canvas.emptyBody') }}</span>
      </div>

      <!-- Grand Finale node: the reward screen (PRD §4.4). -->
      <div class="node finale">
        <span class="node-dot"><Gift :size="14" aria-hidden="true" /></span>
        <span class="node-text">
          <strong>{{ t('builder.canvas.finale') }}</strong>
          <small>{{ t('builder.canvas.finaleCaption') }}</small>
        </span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ArrowDown, Gift, Link2, PackagePlus } from 'lucide-vue-next'
import { isStepUnlocked } from '../../quest/model'
import { useBuilderStore } from '../../stores/useBuilderStore'
import FlowStepCard from './FlowStepCard.vue'
import DropSlot from './DropSlot.vue'

const { t } = useI18n()
const builder = useBuilderStore()
const flow = computed(() => builder.flow)
</script>

<style scoped>
.canvas {
  min-height: 100%;
  padding: 20px 24px 40px;
  /* Dotted design surface (design.md §3). */
  background-image: radial-gradient(var(--color-border) 1px, transparent 1px);
  background-size: 18px 18px;
}
.canvas-head {
  margin-bottom: 18px;
}
.pane-title {
  font-family: var(--font-ui);
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: var(--tracking-kicker);
  color: var(--color-muted);
  margin: 0 0 6px;
}
.pane-hint {
  font-size: 12.5px;
  color: var(--color-muted);
  margin: 0;
}

.rail {
  max-width: 520px;
  margin-inline: auto;
  display: flex;
  flex-direction: column;
}
.cards {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}

/* Start / finale bookends */
.node {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border: 1.5px dashed var(--color-border);
  border-radius: var(--radius-md);
  background: color-mix(in srgb, var(--color-surface) 65%, transparent);
}
.node.finale {
  border-style: solid;
  border-color: color-mix(in srgb, var(--color-primary) 40%, var(--color-border));
}
.node-dot {
  flex: none;
  width: 30px;
  height: 30px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-surface-2);
  color: var(--color-primary);
}
.node-text {
  display: flex;
  flex-direction: column;
}
.node-text strong {
  font-size: 13px;
  font-weight: 700;
}
.node-text small {
  font-size: 11.5px;
  color: var(--color-muted);
}

/* Linear connector — the visual expression of "step N unlocks step N+1". */
.connector {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 24px;
  color: var(--color-muted);
}
.connector::before {
  content: '';
  position: absolute;
  inset-block: 0;
  width: 1.5px;
  background: var(--color-border);
}
.connector > * {
  position: relative;
  padding-block: 2px;
  background: var(--color-bg);
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 36px 24px;
  text-align: center;
  border: 1.5px dashed var(--color-border);
  border-radius: var(--radius-lg);
  color: var(--color-muted);
}
.empty strong {
  font-family: var(--font-display);
  font-size: 16px;
  color: var(--color-text);
}
.empty span {
  font-size: 12.5px;
  max-width: 280px;
  line-height: 1.5;
}
</style>
