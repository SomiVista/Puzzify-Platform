<template>
  <form class="lock-block" @submit.prevent="$emit('submit', value)">
    <input
      ref="field"
      v-model="value"
      class="answer-input"
      type="text"
      data-testid="answer-input"
      autocomplete="off"
      autocapitalize="off"
      autocorrect="off"
      spellcheck="false"
      enterkeyhint="go"
      :disabled="disabled"
      :placeholder="t('player.inputPlaceholder')"
      :aria-label="t('player.inputPlaceholder')"
      :aria-invalid="wrong ? 'true' : 'false'"
      :class="{ wrong: shaking }"
    />
    <button type="submit" class="submit" data-testid="submit-answer" :disabled="disabled">
      {{ t('player.submit') }}
    </button>
  </form>
</template>

<script setup>
import { computed, ref, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  stepId: { type: String, required: true },
  wrongNonce: { type: Number, default: 0 },
  disabled: { type: Boolean, default: false }
})
defineEmits(['submit'])

const { t } = useI18n()
const value = ref('')
const field = ref(null)

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

/** Only for aria-invalid; the visual shake uses `shaking`. */
const wrong = computed(() => props.wrongNonce > 0)

// A new step means a clean field; a wrong answer keeps what they typed so they
// can edit rather than retype the whole thing on a phone keyboard.
watch(
  () => props.stepId,
  async () => {
    value.value = ''
    await nextTick()
    field.value?.focus()
  }
)
</script>

<style scoped>
.lock-block {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.answer-input {
  width: 100%;
  min-height: 52px;
  padding: 14px 16px;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  color: var(--color-text);
  font-family: var(--font-ui);
  font-size: 16px; /* 16px keeps iOS from zooming the viewport on focus */
  text-align: start;
  outline: none;
  transition: border-color var(--duration) var(--ease), box-shadow var(--duration) var(--ease);
}
.answer-input::placeholder {
  color: var(--color-muted);
}
.answer-input:focus {
  border-color: var(--color-focus);
  box-shadow: 0 0 0 4px var(--color-ring);
}
.answer-input.wrong {
  border-color: var(--color-error);
  animation: shake 0.4s var(--ease);
}
.answer-input:disabled {
  opacity: 0.6;
}

.submit {
  width: 100%;
  min-height: 52px;
  border: none;
  border-radius: var(--radius-md);
  background: var(--color-primary);
  color: var(--color-on-primary);
  font-family: var(--font-ui);
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: var(--shadow-1);
  transition: transform 0.15s, box-shadow 0.15s;
}
.submit:not(:disabled):active {
  transform: scale(0.98);
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
  .answer-input.wrong {
    animation: none;
  }
}
</style>
