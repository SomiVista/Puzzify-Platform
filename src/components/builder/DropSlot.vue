<template>
  <component
    :is="tag"
    class="drop-slot"
    :class="{ armed: builder.isDragging, active: builder.isDragging && builder.dropSlot === index }"
    :data-testid="`drop-slot-${index}`"
    @dragover.prevent.stop="builder.setDropSlot(index)"
    @drop.prevent.stop="builder.dropAt(index)"
  >
    <span class="drop-label">{{ t('builder.canvas.dropHere') }}</span>
  </component>
</template>

<script setup>
/**
 * A drop gap between two cards. Slot indexes are GAPS, not card positions —
 * see `moveStepToSlot` in quest/model.js.
 */
import { useI18n } from 'vue-i18n'
import { useBuilderStore } from '../../stores/useBuilderStore'

defineProps({
  index: { type: Number, required: true },
  tag: { type: String, default: 'div' }
})

const { t } = useI18n()
const builder = useBuilderStore()
</script>

<style scoped>
.drop-slot {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 10px;
  border: 1.5px dashed transparent;
  border-radius: var(--radius-md);
  transition: height var(--duration) var(--ease), background var(--duration) var(--ease);
}
.drop-slot.armed {
  height: 44px;
  background: color-mix(in srgb, var(--color-primary) 8%, transparent);
  border-color: color-mix(in srgb, var(--color-primary) 45%, transparent);
}
.drop-slot.active {
  background: color-mix(in srgb, var(--color-primary) 16%, transparent);
  border-style: solid;
}

.drop-label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-primary);
  opacity: 0;
  transition: opacity var(--duration) var(--ease);
}
.drop-slot.active .drop-label {
  opacity: 1;
}
</style>
