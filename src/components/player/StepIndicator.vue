<template>
  <div class="step-indicator" role="progressbar" :aria-valuenow="solved" :aria-valuemin="0" :aria-valuemax="total" :aria-label="label">
    <span
      v-for="index in total"
      :key="index"
      class="dot"
      :class="{ done: index - 1 < solved, active: index - 1 === solved }"
    ></span>
  </div>
</template>

<script setup>
/** design.md §2.4 — completed dots fill, the active dot widens, the rest wait. */
defineProps({
  total: { type: Number, required: true },
  solved: { type: Number, required: true },
  label: { type: String, default: '' }
})
</script>

<style scoped>
.step-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}
.dot {
  width: 8px;
  height: 8px;
  border-radius: var(--radius-full);
  background: var(--color-border);
  transition: width var(--duration) var(--ease), background var(--duration) var(--ease);
}
.dot.done {
  background: var(--color-primary);
}
.dot.active {
  width: 30px;
  background: var(--color-primary);
}
</style>
