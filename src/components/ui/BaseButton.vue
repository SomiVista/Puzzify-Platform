<template>
  <button 
    :class="['base-btn', `base-btn-${variant}`, `base-btn-${size}`, { 'base-btn-block': fullWidth, 'base-btn-loading': loading }]" 
    :disabled="disabled || loading"
  >
    <span v-if="loading" class="anim base-spinner" aria-hidden="true"></span>
    <slot></slot>
  </button>
</template>

<script setup>
defineProps({
  variant: { type: String, default: 'primary' }, // primary, secondary, ghost, danger
  size: { type: String, default: 'lg' }, // sm, md, lg
  fullWidth: { type: Boolean, default: false },
  block: { type: Boolean, default: false }, // Backwards compatibility
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false }
})
</script>

<style scoped>
.base-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  font-family: var(--font-ui);
  font-weight: 700;
  cursor: pointer;
  border: none;
  outline: none;
  transition: transform .15s, box-shadow .15s, background .2s;
}
.base-btn-block, .base-btn[style*="width: 100%"] { width: 100%; }

/* Variants */
.base-btn-primary { background: var(--color-primary); color: var(--color-on-primary); }
.base-btn-primary:not(:disabled):hover { transform: translateY(-2px); box-shadow: var(--shadow-2); }

.base-btn-secondary { background: var(--color-surface-2); color: var(--color-primary); border: 1px solid var(--color-border); }
.base-btn-secondary:not(:disabled):hover { background: color-mix(in srgb, var(--color-surface-2) 80%, var(--color-surface)); }

.base-btn-ghost { background: transparent; color: var(--color-primary); }
.base-btn-ghost:not(:disabled):hover { background: var(--color-surface-2); }

.base-btn-danger { background: var(--color-error); color: var(--color-on-error); }

/* Sizes */
/* Every size clears the 44px hit-target floor (design.md §2.2); `sm` only
   trims the horizontal padding and type size. */
.base-btn-sm { padding: 10px 16px; min-height: 44px; font-size: 12.5px; border-radius: 12px; }
.base-btn-md { padding: 11px 18px; min-height: 44px; font-size: 13.5px; border-radius: var(--radius-md); }
.base-btn-lg { padding: 13px 22px; min-height: 48px; font-size: 14.5px; border-radius: var(--radius-md); }

/* States */
.base-btn:disabled {
  background: var(--color-border);
  color: var(--color-muted);
  border: none;
  opacity: 0.7;
  cursor: not-allowed;
}
.base-btn:not(:disabled):active { transform: scale(0.98); }
.base-btn:focus-visible { box-shadow: 0 0 0 4px var(--color-ring); }

/* Spinner */
.base-spinner {
  width: 14px;
  height: 14px;
  flex: none;
  border: 2.5px solid color-mix(in srgb, currentColor 35%, transparent);
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin { 100% { transform: rotate(360deg); } }
</style>
