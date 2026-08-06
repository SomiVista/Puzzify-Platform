<template>
  <button
    type="button"
    class="audio-toggle"
    data-testid="audio-toggle"
    :aria-pressed="playing ? 'true' : 'false'"
    :aria-label="playing ? t('player.audioOff') : t('player.audioOn')"
    :title="playing ? t('player.audioOff') : t('player.audioOn')"
    @click="toggle"
  >
    <span v-if="playing" class="bars" aria-hidden="true">
      <i class="pz-anim" v-for="n in 3" :key="n" :style="{ animationDelay: `${n * 0.12}s` }"></i>
    </span>
    <VolumeX v-else :size="16" aria-hidden="true" />
  </button>
</template>

<script setup>
import { ref, onBeforeUnmount, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { VolumeX } from 'lucide-vue-next'

const props = defineProps({
  preset: { type: String, default: 'birthday' }
})

const { t } = useI18n()
const playing = ref(false)

/**
 * The ambient loop is synthesised rather than streamed: no audio assets exist
 * yet, and a generated pad costs zero bytes against the player's 2s budget
 * (PRD §6.2). Each theme gets its own root note, so the mood follows the preset
 * the way every other themed axis does.
 */
const ROOTS = { birthday: 220, mystery: 110, spooky: 98, corporate: 174.6 }

let ctx = null
let nodes = null

function start() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext
  if (!AudioCtx) return false

  ctx = ctx || new AudioCtx()
  // Mobile browsers block autoplay; this only ever runs from a real tap.
  if (ctx.state === 'suspended') ctx.resume()

  const root = ROOTS[props.preset] ?? ROOTS.birthday
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0, ctx.currentTime)
  gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 1.2)

  const filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = 900

  const oscillators = [root, root * 1.5].map((frequency, i) => {
    const osc = ctx.createOscillator()
    osc.type = i === 0 ? 'sine' : 'triangle'
    osc.frequency.value = frequency
    osc.detune.value = i * 6
    osc.connect(filter)
    osc.start()
    return osc
  })

  // Slow swell so the pad breathes instead of sitting flat.
  const lfo = ctx.createOscillator()
  const lfoGain = ctx.createGain()
  lfo.frequency.value = 0.08
  lfoGain.gain.value = 0.02
  lfo.connect(lfoGain).connect(gain.gain)
  lfo.start()

  filter.connect(gain).connect(ctx.destination)
  nodes = { gain, oscillators, lfo }
  return true
}

function stop() {
  if (!nodes || !ctx) return
  const { gain, oscillators, lfo } = nodes
  gain.gain.cancelScheduledValues(ctx.currentTime)
  gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime)
  gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4)
  const stopAt = ctx.currentTime + 0.5
  oscillators.forEach((osc) => osc.stop(stopAt))
  lfo.stop(stopAt)
  nodes = null
}

function toggle() {
  if (playing.value) {
    stop()
    playing.value = false
    return
  }
  try {
    playing.value = start() !== false
  } catch {
    // No Web Audio (or blocked) — leave the control off rather than break play.
    playing.value = false
  }
}

// Re-voice the pad when the theme changes mid-session.
watch(() => props.preset, () => {
  if (!playing.value) return
  stop()
  start()
})

onBeforeUnmount(stop)
</script>

<style scoped>
.audio-toggle {
  flex: none;
  width: 44px;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  border: 1px solid var(--pz-border);
  border-radius: var(--pz-r-full);
  background: var(--pz-surface);
  color: var(--pz-muted);
  cursor: pointer;
  outline: none;
}
.audio-toggle:focus-visible {
  box-shadow: 0 0 0 4px var(--pz-ring);
}

.bars {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  height: 16px;
}
.bars i {
  width: 3px;
  height: 100%;
  border-radius: 2px;
  background: var(--pz-primary);
  transform-origin: center;
  animation: pzBars 1s ease-in-out infinite;
}
</style>
