<template>
  <div class="particle-field" aria-hidden="true">
    <i v-for="p in particles" :key="p.id" class="anim" :style="p.style"></i>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { THEMES } from '../../themes'

const props = defineProps({
  preset: { type: String, default: 'birthday' },
  count: { type: Number, default: 14 }
})

/**
 * Decorative only — motion direction comes from the theme preset (`fall` or
 * `rise`), never from an occasion. All of it stops under prefers-reduced-motion
 * via the shared `.anim` rule in tokens/motion.css.
 */
const particles = computed(() => {
  const theme = THEMES[props.preset] || THEMES.birthday
  const name = theme.particles.motion === 'rise' ? 'rise' : 'fall'
  const colors = ['var(--color-primary)', 'var(--color-accent)', 'var(--color-secondary)']

  return Array.from({ length: props.count }, (_, i) => ({
    id: i,
    style: {
      animationName: name,
      animationDuration: `${6 + ((i * 7) % 9)}s`,
      animationDelay: `${(i * 0.7) % 6}s`,
      insetInlineStart: `${(i * 37) % 97}%`,
      width: `${5 + (i % 4)}px`,
      height: `${5 + (i % 4)}px`,
      borderRadius: i % 3 === 0 ? '50%' : '2px',
      background: colors[i % colors.length]
    }
  }))
})
</script>

<style scoped>
.particle-field {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}
.particle-field i {
  position: absolute;
  top: 0;
  opacity: 0.7;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}
</style>
