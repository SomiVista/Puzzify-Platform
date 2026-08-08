<template>
  <button
    :aria-label="label"
    :title="label"
    :disabled="disabled"
    :class="['base-icon-btn', { active, frosted }]"
    :style="buttonStyle"
  >
    <slot></slot>
  </button>
</template>

<script setup>
import { computed } from 'vue'

/** design.md §2.2 — the hit-target floor, in px. */
const MIN_HIT_TARGET = 44

const props = defineProps({
  label: { type: String, default: '' },
  // design.md §2.2 — nothing interactive may be touched in less than 44px.
  // (Literal, not MIN_HIT_TARGET: `defineProps` is hoisted above local consts.)
  size: { type: Number, default: 44 },
  shape: { type: String, default: 'square' }, // 'square' | 'circle'
  active: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  frosted: { type: Boolean, default: false }
})

const buttonStyle = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
  borderRadius: props.shape === 'circle' ? '50%' : `${Math.max(10, Math.round(props.size * 0.31))}px`,
  fontSize: `${Math.round(props.size * 0.42)}px`,
  // A button drawn smaller than the floor keeps its visual box but grows an
  // invisible 44px target around it, so dense desktop toolbars stay compact
  // without failing the touch requirement.
  '--hit-target': `${Math.max(MIN_HIT_TARGET, props.size)}px`
}))
</script>

<style scoped>
.base-icon-btn {
  position: relative;
  flex: none;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 1;
  transition: background .2s, box-shadow .3s;
  outline: none;
  color: inherit;
}
/* The hit-target extension. It is a child of the button, so anything landing on
   it activates the button; it never paints, so the visual size is unchanged. */
.base-icon-btn::after {
  content: '';
  position: absolute;
  top: 50%;
  inset-inline-start: 50%;
  width: var(--hit-target);
  height: var(--hit-target);
  transform: translate(-50%, -50%);
}
[dir='rtl'] .base-icon-btn::after {
  transform: translate(50%, -50%);
}
.base-icon-btn:disabled {
  cursor: not-allowed;
  opacity: 0.35;
}
.base-icon-btn:disabled::after {
  display: none;
}
.base-icon-btn:not(:disabled):hover, .base-icon-btn.active {
  background: var(--color-surface-2);
}
.base-icon-btn.frosted {
  background: color-mix(in srgb, var(--color-surface) 90%, transparent);
  backdrop-filter: blur(8px);
  box-shadow: var(--shadow-1);
}
.base-icon-btn:focus-visible {
  box-shadow: 0 0 0 4px var(--color-ring);
}
</style>
