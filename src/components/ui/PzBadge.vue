<template>
  <span :class="['pz-badge', `pz-badge-${tone}`]">
    <slot></slot>
  </span>
</template>
<script setup>
defineProps({
  tone: { type: String, default: 'neutral' } // success, neutral
})
</script>
<style scoped>
.pz-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: var(--pz-r-full);
  font-family: var(--pz-font-ui);
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}
.pz-badge-success { background: color-mix(in srgb, var(--pz-success) 15%, transparent); color: var(--pz-success); }
.pz-badge-neutral { background: var(--pz-surface-2); color: var(--pz-muted); }
</style>
