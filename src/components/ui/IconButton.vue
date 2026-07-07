<template>
  <button
    :aria-label="label"
    :title="label"
    :disabled="disabled"
    :class="['pz-icon-btn', { active, frosted }]"
    :style="buttonStyle"
  >
    <slot></slot>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: { type: String, default: '' },
  size: { type: Number, default: 38 },
  shape: { type: String, default: 'square' }, // 'square' | 'circle'
  active: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  frosted: { type: Boolean, default: false }
})

const buttonStyle = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
  borderRadius: props.shape === 'circle' ? '50%' : `${Math.max(10, Math.round(props.size * 0.31))}px`,
  fontSize: `${Math.round(props.size * 0.42)}px`
}))
</script>

<style scoped>
.pz-icon-btn {
  flex: none;
  background: var(--pz-bg);
  border: 1px solid var(--pz-border);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 1;
  transition: background .2s, box-shadow .3s;
  outline: none;
  color: inherit;
}
.pz-icon-btn:disabled {
  cursor: not-allowed;
  opacity: 0.35;
}
.pz-icon-btn:not(:disabled):hover, .pz-icon-btn.active {
  background: var(--pz-surface-2);
}
.pz-icon-btn.frosted {
  background: color-mix(in srgb, var(--pz-surface) 90%, transparent);
  backdrop-filter: blur(8px);
  box-shadow: var(--pz-e-1);
}
.pz-icon-btn:focus-visible {
  box-shadow: 0 0 0 4px var(--pz-ring);
}
</style>
