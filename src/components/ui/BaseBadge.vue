<template>
  <span :class="['base-badge', `base-badge-${tone}`]">
    <slot></slot>
  </span>
</template>
<script setup>
defineProps({
  tone: { type: String, default: 'neutral' } // success, neutral
})
</script>
<style scoped>
.base-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: var(--radius-full);
  font-family: var(--font-ui);
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}
.base-badge-success { background: color-mix(in srgb, var(--color-success) 15%, transparent); color: var(--color-success); }
.base-badge-neutral { background: var(--color-surface-2); color: var(--color-muted); }
</style>
