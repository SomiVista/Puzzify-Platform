<template>
  <button
    type="button"
    role="switch"
    :aria-checked="modelValue ? 'true' : 'false'"
    :aria-label="label"
    class="base-toggle"
    @click="$emit('update:modelValue', !modelValue)"
  >
    <span class="track" :class="{ on: modelValue }">
      <span class="knob"></span>
    </span>
  </button>
</template>

<script setup>
defineProps({
  modelValue: { type: Boolean, default: false },
  label: { type: String, default: '' }
})
defineEmits(['update:modelValue'])
</script>

<style scoped>
/* design.md §2.5 — 46×27 pill track. The button itself carries the 44px hit
   target while the visible track stays the specified size. */
.base-toggle {
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 46px;
  min-height: 44px;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  outline: none;
}
.track {
  position: relative;
  display: block;
  width: 46px;
  height: 27px;
  border-radius: var(--radius-full);
  background: var(--color-border);
  transition: background var(--duration) var(--ease);
}
.track.on {
  background: var(--color-primary);
}
/* Knob position uses a logical inset so it slides toward the correct edge
   under RTL without a direction-specific transform. */
.knob {
  position: absolute;
  top: 3px;
  inset-inline-start: 3px;
  width: 21px;
  height: 21px;
  border-radius: 50%;
  background: #ffffff;
  box-shadow: var(--shadow-1);
  transition: inset-inline-start var(--duration) var(--ease);
}
.track.on .knob {
  inset-inline-start: 22px;
}
.base-toggle:focus-visible .track {
  box-shadow: 0 0 0 4px var(--color-ring);
}
</style>
