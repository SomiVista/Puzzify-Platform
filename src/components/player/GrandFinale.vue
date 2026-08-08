<template>
  <section class="finale anim" data-testid="grand-finale">
    <BaseBoxStage :asset="boxAsset" :size="128" />

    <p class="kicker">{{ t('player.finaleKicker') }}</p>
    <h1 class="title">{{ reward?.title || questName || t('player.finaleTitle') }}</h1>

    <!-- letter — an animated rich-text note (PRD §4.4) -->
    <article v-if="type === 'letter'" class="letter" data-testid="reward-letter">
      <p class="typed">{{ typed }}<span v-if="!typingDone" class="caret anim" aria-hidden="true"></span></p>
    </article>

    <!-- video — an embedded stream -->
    <div v-else-if="type === 'video'" class="video" data-testid="reward-video">
      <iframe
        v-if="reward?.url"
        :src="reward.url"
        :title="reward?.title || t('player.finaleTitle')"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
      <p v-else class="fallback">{{ reward?.body }}</p>
    </div>

    <!-- voucher — a copyable code -->
    <div v-else class="voucher" data-testid="reward-voucher">
      <p v-if="reward?.body" class="voucher-body">{{ reward.body }}</p>
      <div class="code-row">
        <code data-testid="voucher-code">{{ reward?.code || '—' }}</code>
        <button type="button" class="copy" data-testid="copy-code" @click="copy">
          <component :is="copied ? Check : Copy" :size="14" aria-hidden="true" />
          {{ copied ? t('player.copied') : t('player.copyCode') }}
        </button>
      </div>
    </div>

    <!-- The viral loop: delight converted straight into adoption (PRD §5.2). -->
    <aside class="cta anim" data-testid="viral-cta">
      <strong>{{ t('player.ctaTitle') }}</strong>
      <span>{{ t('player.ctaBody') }}</span>
      <router-link to="/dashboard/quests" class="cta-button" data-testid="viral-cta-button">
        {{ t('player.ctaButton') }}
      </router-link>
    </aside>

    <p v-if="watermark" class="watermark">{{ t('player.watermark') }}</p>
  </section>
</template>

<script setup>
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { Copy, Check } from 'lucide-vue-next'
import { THEMES } from '../../themes'
import BaseBoxStage from '../ui/BaseBoxStage.vue'

const props = defineProps({
  reward: { type: Object, default: null },
  questName: { type: String, default: '' },
  preset: { type: String, default: 'birthday' },
  watermark: { type: Boolean, default: true }
})

const { t } = useI18n()

const type = computed(() => props.reward?.type || 'letter')
const boxAsset = computed(() => (THEMES[props.preset] || THEMES.birthday).box)

/* ── Typewriter for the letter reward ───────────────────────────────── */

const typed = ref('')
const typingDone = ref(false)
let timer = null

function playTypewriter() {
  clearInterval(timer)
  timer = null
  typed.value = ''
  typingDone.value = false

  const full = props.reward?.body || ''
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  // Honour reduced motion by simply presenting the finished letter.
  if (!full || reduced || type.value !== 'letter') {
    typed.value = full
    typingDone.value = true
    return
  }
  let i = 0
  timer = setInterval(() => {
    i += 1
    typed.value = full.slice(0, i)
    if (i >= full.length) {
      clearInterval(timer)
      timer = null
      typingDone.value = true
    }
  }, 28)
}

/**
 * The finale mounts the moment the last step is solved, but the reward arrives
 * a tick later from the gated fetch — so drive the typewriter off the prop,
 * not off mount, or the letter renders empty.
 */
watch(() => props.reward, playTypewriter, { immediate: true })
onBeforeUnmount(() => timer && clearInterval(timer))

/* ── Voucher copy ───────────────────────────────────────────────────── */

const copied = ref(false)

async function copy() {
  const code = props.reward?.code
  if (!code) return
  try {
    await navigator.clipboard.writeText(code)
  } catch {
    // Clipboard is blocked in some in-app browsers; the code stays selectable.
  }
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}
</script>

<style scoped>
.finale {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
  animation: fadeUp 0.5s var(--ease) both;
}

.kicker {
  margin: 8px 0 0;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: var(--tracking-kicker);
  color: var(--color-secondary);
}
.title {
  margin: 0;
  font-family: var(--font-display);
  font-size: var(--font-size-display);
  font-weight: 800;
  line-height: var(--line-height-display);
  letter-spacing: var(--tracking-display);
  color: var(--color-text);
}

.letter {
  width: 100%;
  padding: 18px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  box-shadow: var(--shadow-2);
}
.typed {
  margin: 0;
  text-align: start;
  font-size: 15px;
  line-height: 1.65;
  color: var(--color-text);
  white-space: pre-wrap;
}
.caret {
  display: inline-block;
  width: 2px;
  height: 1em;
  margin-inline-start: 2px;
  vertical-align: text-bottom;
  background: var(--color-primary);
  animation: caret 1s steps(1) infinite;
}

.video {
  width: 100%;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-2);
}
.video iframe {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  border: none;
}
.fallback {
  margin: 0;
  padding: 24px;
  background: var(--color-surface);
  color: var(--color-muted);
}

.voucher {
  width: 100%;
  padding: 18px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  box-shadow: var(--shadow-2);
}
.voucher-body {
  margin: 0 0 14px;
  font-size: 14px;
  line-height: 1.5;
  color: var(--color-muted);
}
.code-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border: 1.5px dashed var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-bg);
}
.code-row code {
  flex: 1;
  min-width: 0;
  font-family: var(--font-mono);
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text);
  text-align: start;
  word-break: break-all;
}
.copy {
  flex: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 44px;
  padding: 0 14px;
  border: none;
  border-radius: var(--radius-md);
  background: var(--color-primary);
  color: var(--color-on-primary);
  font-family: var(--font-ui);
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}
.copy:focus-visible {
  outline: none;
  box-shadow: 0 0 0 4px var(--color-ring);
}

.cta {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  width: 100%;
  margin-top: 12px;
  padding: 18px;
  border-radius: var(--radius-lg);
  background: var(--color-surface-2);
  animation: fadeUp 0.5s var(--ease) 0.6s both;
}
.cta strong {
  font-family: var(--font-display);
  font-size: 17px;
  font-weight: 800;
  color: var(--color-text);
}
.cta span {
  font-size: 13.5px;
  color: var(--color-muted);
}
.cta-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  margin-top: 8px;
  padding: 0 22px;
  border-radius: var(--radius-full);
  background: var(--color-primary);
  color: var(--color-on-primary);
  font-size: 14.5px;
  font-weight: 700;
  text-decoration: none;
}
.cta-button:focus-visible {
  outline: none;
  box-shadow: 0 0 0 4px var(--color-ring);
}

.watermark {
  margin: 6px 0 0;
  font-size: var(--font-size-caption);
  color: var(--color-muted);
}
</style>
