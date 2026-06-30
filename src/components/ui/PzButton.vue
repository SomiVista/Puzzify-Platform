<template>
  <button :class="['pz-btn', `pz-btn-${variant}`, `pz-btn-${size}`]" :style="block ? 'width: 100%' : ''">
    <slot></slot>
  </button>
</template>
<script setup>
defineProps({
  variant: { type: String, default: 'primary' }, // primary, secondary
  size: { type: String, default: 'md' }, // sm, md, lg
  block: { type: Boolean, default: false }
})
</script>
<style scoped>
.pz-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: var(--pz-font-ui);
  font-weight: 700;
  cursor: pointer;
  border: none;
  border-radius: var(--pz-r-md);
  transition: all var(--pz-dur) var(--pz-ease);
}
.pz-btn-primary { background: var(--pz-primary); color: var(--pz-on-primary); box-shadow: var(--pz-e-1); }
.pz-btn-primary:hover { filter: brightness(1.1); }
.pz-btn-secondary { background: var(--pz-surface-2); color: var(--pz-primary); }
.pz-btn-secondary:hover { background: color-mix(in srgb, var(--pz-surface-2) 80%, var(--pz-primary) 20%); }

.pz-btn-sm { padding: 6px 12px; font-size: 13px; }
.pz-btn-md { padding: 10px 18px; font-size: 14px; }
.pz-btn-lg { padding: 14px 24px; font-size: 16px; border-radius: var(--pz-r-lg); }

.pz-btn:focus-visible { outline: none; box-shadow: 0 0 0 4px var(--pz-ring); border: 1px solid var(--pz-focus); }
</style>
