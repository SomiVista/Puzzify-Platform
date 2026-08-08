<template>
  <div class="hotspot-block">
    <!-- The scene is a button so it is reachable by keyboard too; Enter/Space
         falls back to the centre of the image, which the creator can rely on
         only if the target covers it — so a visible focus ring matters. -->
    <button
      ref="scene"
      type="button"
      class="scene"
      :class="{ wrong: shaking }"
      :disabled="disabled"
      data-testid="hotspot-scene"
      :aria-label="t('player.tapPrompt')"
      @click="onTap"
    >
      <img :src="imageUrl" alt="" draggable="false" />
      <span v-for="mark in marks" :key="mark.id" class="miss" :style="{ left: `${mark.x}%`, top: `${mark.y}%` }"></span>
    </button>
    <p class="tap-hint">{{ t('player.tapPrompt') }}</p>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  stepId: { type: String, required: true },
  imageUrl: { type: String, default: '' },
  wrongNonce: { type: Number, default: 0 },
  disabled: { type: Boolean, default: false }
})
const emit = defineEmits(['submit'])

const { t } = useI18n()
const scene = ref(null)
const marks = ref([])
let markId = 0

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

/**
 * Convert the tap into percentages of the image box. Percentages are what the
 * creator configured, so this holds at any screen size — and because the image
 * itself never mirrors under RTL, physical offsets are correct here.
 */
function onTap(event) {
  if (props.disabled) return
  const box = scene.value.getBoundingClientRect()
  if (!box.width || !box.height) return

  // Keyboard activation reports 0,0 — treat that as the centre of the scene.
  const isPointer = event.clientX !== 0 || event.clientY !== 0
  const x = isPointer ? ((event.clientX - box.left) / box.width) * 100 : 50
  const y = isPointer ? ((event.clientY - box.top) / box.height) * 100 : 50

  markId += 1
  marks.value = [...marks.value.slice(-4), { id: markId, x, y }]
  emit('submit', { x, y })
}

watch(() => props.stepId, () => { marks.value = [] })
</script>

<style scoped>
.hotspot-block {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.scene {
  position: relative;
  display: block;
  width: 100%;
  padding: 0;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  overflow: hidden;
  cursor: crosshair;
  line-height: 0;
}
.scene:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.scene.wrong {
  border-color: var(--color-error);
  animation: shake 0.4s var(--ease);
}
.scene:focus-visible {
  outline: none;
  box-shadow: 0 0 0 4px var(--color-ring);
}
.scene img {
  display: block;
  width: 100%;
  height: auto;
  user-select: none;
  -webkit-user-drag: none;
}

/* Where they already tried — so a second guess is informed, not random. */
.miss {
  position: absolute;
  width: 22px;
  height: 22px;
  margin: -11px 0 0 -11px;
  border-radius: 50%;
  border: 2px solid var(--color-error);
  background: color-mix(in srgb, var(--color-error) 22%, transparent);
  pointer-events: none;
}

.tap-hint {
  margin: 0;
  text-align: center;
  font-size: 12.5px;
  color: var(--color-muted);
}

@media (prefers-reduced-motion: reduce) {
  .scene.wrong {
    animation: none;
  }
}
</style>
