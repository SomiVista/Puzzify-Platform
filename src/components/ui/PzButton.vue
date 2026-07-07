<template>
  <button 
    :class="['pz-btn', `pz-btn-${variant}`, `pz-btn-${size}`, { 'pz-btn-block': fullWidth, 'pz-btn-loading': loading }]" 
    :disabled="disabled || loading"
  >
    <span v-if="loading" class="pz-anim pz-spinner" aria-hidden="true"></span>
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
.pz-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  font-family: var(--pz-font-ui);
  font-weight: 700;
  cursor: pointer;
  border: none;
  outline: none;
  transition: transform .15s, box-shadow .15s, background .2s;
}
.pz-btn-block, .pz-btn[style*="width: 100%"] { width: 100%; }

/* Variants */
.pz-btn-primary { background: var(--pz-primary); color: var(--pz-on-primary); }
.pz-btn-primary:not(:disabled):hover { transform: translateY(-2px); box-shadow: var(--pz-e-2); }

.pz-btn-secondary { background: var(--pz-surface-2); color: var(--pz-primary); border: 1px solid var(--pz-border); }
.pz-btn-secondary:not(:disabled):hover { background: color-mix(in srgb, var(--pz-surface-2) 80%, var(--pz-surface)); }

.pz-btn-ghost { background: transparent; color: var(--pz-primary); }
.pz-btn-ghost:not(:disabled):hover { background: var(--pz-surface-2); }

.pz-btn-danger { background: var(--pz-error); color: #FFFFFF; }

/* Sizes */
.pz-btn-sm { padding: 10px 16px; min-height: 40px; font-size: 12.5px; border-radius: 12px; }
.pz-btn-md { padding: 11px 18px; min-height: 44px; font-size: 13.5px; border-radius: var(--pz-r-md); }
.pz-btn-lg { padding: 13px 22px; min-height: 48px; font-size: 14.5px; border-radius: var(--pz-r-md); }

/* States */
.pz-btn:disabled {
  background: var(--pz-border);
  color: var(--pz-muted);
  border: none;
  opacity: 0.7;
  cursor: not-allowed;
}
.pz-btn:not(:disabled):active { transform: scale(0.98); }
.pz-btn:focus-visible { box-shadow: 0 0 0 4px var(--pz-ring); }

/* Spinner */
.pz-spinner {
  width: 14px;
  height: 14px;
  flex: none;
  border: 2.5px solid color-mix(in srgb, currentColor 35%, transparent);
  border-top-color: currentColor;
  border-radius: 50%;
  animation: pzSpin 1s linear infinite;
}
@keyframes pzSpin { 100% { transform: rotate(360deg); } }
</style>
