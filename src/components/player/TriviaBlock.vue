<template>
  <div class="trivia-block" role="radiogroup" :aria-label="prompt">
    <button
      v-for="(option, index) in options"
      :key="index"
      type="button"
      role="radio"
      class="option"
      :class="{ selected: selected === index, wrong: shaking && selected === index }"
      :aria-checked="selected === index ? 'true' : 'false'"
      :disabled="disabled"
      :data-testid="`option-${index}`"
      @click="choose(index)"
    >
      <span class="radio" aria-hidden="true"></span>
      <span class="label">{{ option }}</span>
    </button>

    <button
      type="button"
      class="submit"
      data-testid="submit-answer"
      :disabled="disabled || selected === null"
      @click="$emit('submit', selected)"
    >
      {{ t('player.submit') }}
    </button>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  stepId: { type: String, required: true },
  prompt: { type: String, default: '' },
  options: { type: Array, default: () => [] },
  wrongNonce: { type: Number, default: 0 },
  disabled: { type: Boolean, default: false }
})
defineEmits(['submit'])

const { t } = useI18n()
const selected = ref(null)

/** Replay the shake on every wrong answer — a boolean cannot change twice. */
const shaking = ref(false)
let shakeTimer = null
watch(
  () => props.wrongNonce,
  (nonce) => {
    clearTimeout(shakeTimer)
    if (!nonce) {
      shaking.value = false
      return
    }
    shaking.value = false
    nextTick(() => {
      shaking.value = true
      shakeTimer = setTimeout(() => { shaking.value = false }, 450)
    })
  }
)

const choose = (index) => {
  if (props.disabled) return
  selected.value = index
}

watch(() => props.stepId, () => { selected.value = null })
</script>

<style scoped>
.trivia-block {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.option {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  min-height: 52px;
  padding: 13px 15px;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  color: var(--color-text);
  font-family: var(--font-ui);
  font-size: 15px;
  font-weight: 600;
  text-align: start;
  cursor: pointer;
  transition: border-color var(--duration) var(--ease), background var(--duration) var(--ease);
}
.option:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.option.selected {
  border-color: var(--color-primary);
  background: var(--color-surface-2);
}
.option.wrong {
  border-color: var(--color-error);
  animation: shake 0.4s var(--ease);
}
.option:focus-visible {
  outline: none;
  box-shadow: 0 0 0 4px var(--color-ring);
}

.radio {
  flex: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid var(--color-border);
  transition: border-color var(--duration) var(--ease), box-shadow var(--duration) var(--ease);
}
.option.selected .radio {
  border-color: var(--color-primary);
  box-shadow: inset 0 0 0 4px var(--color-primary);
}
.option.wrong .radio {
  border-color: var(--color-error);
  box-shadow: inset 0 0 0 4px var(--color-error);
}
.label {
  flex: 1;
  min-width: 0;
}

.submit {
  width: 100%;
  min-height: 52px;
  margin-top: 6px;
  border: none;
  border-radius: var(--radius-md);
  background: var(--color-primary);
  color: var(--color-on-primary);
  font-family: var(--font-ui);
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: var(--shadow-1);
}
.submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.submit:focus-visible {
  outline: none;
  box-shadow: 0 0 0 4px var(--color-ring);
}

@media (prefers-reduced-motion: reduce) {
  .option.wrong {
    animation: none;
  }
}
</style>
