<template>
  <div
    class="player"
    :class="{ 'lang-rtl': isRtl }"
    :style="stageVars"
    :data-theme="preset"
    :dir="dir"
  >
    <ParticleField v-if="showParticles" :preset="preset" />

    <!-- Link is dead or the quest was never published. -->
    <section v-if="notFound" class="screen centered" data-testid="player-not-found">
      <h1 class="title">{{ t('player.notFoundTitle') }}</h1>
      <p class="muted">{{ t('player.notFoundBody') }}</p>
      <router-link to="/dashboard/quests" class="ghost-cta">{{ t('player.notFoundCta') }}</router-link>
    </section>

    <section v-else-if="!quest" class="screen centered" data-testid="player-loading">
      <p class="muted">{{ t('player.loading') }}</p>
    </section>

    <GrandFinale
      v-else-if="finished"
      class="screen"
      :reward="reward"
      :quest-name="quest.name"
      :preset="preset"
      :watermark="quest.watermark"
    />

    <section v-else class="screen" data-testid="player-step">
      <header class="bar">
        <StepIndicator
          :total="session.stepCount"
          :solved="session.solved.length"
          :label="stepLabel"
        />
        <AmbientAudio v-if="quest.theme.ambientAudio" :preset="preset" />
      </header>

      <p class="step-count" data-testid="step-count">{{ stepLabel }}</p>
      <h1 v-if="step.title" class="title">{{ step.title }}</h1>
      <p class="prompt" data-testid="step-prompt">{{ step.prompt }}</p>

      <!-- Locked out: the cap has teeth, but the gift is never bricked. -->
      <div v-if="locked" class="locked" data-testid="locked-out">
        <strong>{{ t('player.lockedTitle') }}</strong>
        <span>{{ t('player.lockedBody') }}</span>
        <p v-if="step.hintText" class="hint revealed">{{ step.hintText }}</p>
        <button type="button" class="ghost-cta" data-testid="restart" @click="restart">
          {{ t('player.restart') }}
        </button>
      </div>

      <template v-else>
        <LockBlock
          v-if="step.kind === 'lock'"
          :step-id="step.id"
          :wrong-nonce="wrongNonce"
          @submit="onSubmit"
        />
        <TriviaBlock
          v-else-if="step.kind === 'trivia'"
          :step-id="step.id"
          :prompt="step.prompt"
          :options="step.options"
          :wrong-nonce="wrongNonce"
          @submit="onSubmit"
        />
        <HotspotBlock
          v-else
          :step-id="step.id"
          :image-url="step.imageUrl"
          :wrong-nonce="wrongNonce"
          @submit="onSubmit"
        />

        <p v-if="wrong" class="feedback error" role="alert" data-testid="wrong-answer">
          {{ t('player.incorrect') }}
        </p>

        <div class="meta">
          <button
            v-if="step.hintText"
            type="button"
            class="hint-button"
            data-testid="hint-button"
            :aria-expanded="hintOpen ? 'true' : 'false'"
            @click="hintOpen = !hintOpen"
          >
            <Lightbulb :size="14" aria-hidden="true" />
            {{ hintOpen ? t('player.hint') : t('player.showHint') }}
          </button>
          <span v-if="attemptsRemaining !== null" class="attempts" data-testid="attempts-left">
            {{ attemptsRemaining === 1 ? t('player.lastAttempt') : t('player.attemptsLeft', { n: attemptsRemaining }) }}
          </span>
        </div>

        <p v-if="hintOpen && step.hintText" class="hint revealed" data-testid="hint-text">
          {{ step.hintText }}
        </p>
      </template>

      <p v-if="quest.watermark" class="watermark">{{ t('player.watermark') }}</p>
    </section>

    <!-- Success message from the step the recipient just solved (PRD §4.2.4). -->
    <Transition name="toast">
      <div v-if="toast" class="toast" role="status" data-testid="success-toast">
        <Check :size="14" aria-hidden="true" /> {{ toast }}
      </div>
    </Transition>
  </div>
</template>

<script setup>
/**
 * Interactive Player (PRD §4.4) — the recipient's whole experience.
 *
 * Everything the engine decides (what step, is it right, how many guesses are
 * left, may the finale mount) comes from quest/engine.js; this component only
 * renders it and persists the session so a closed tab resumes where it left off.
 */
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Lightbulb, Check } from 'lucide-vue-next'
import { DEFAULT_THEME, themeVars } from '../themes'
import { isRtlLocale, dirForLocale } from '../i18n'
import {
  SUBMIT,
  createSession,
  currentStep,
  submitAnswer,
  isComplete,
  isLockedOut,
  attemptsLeft,
  restartSession,
  completionProof
} from '../quest/engine'
import { loadPlayPayload, redeemReward, saveProgress, loadProgress, clearProgress } from '../quest/storage'
import LockBlock from '../components/player/LockBlock.vue'
import TriviaBlock from '../components/player/TriviaBlock.vue'
import HotspotBlock from '../components/player/HotspotBlock.vue'
import StepIndicator from '../components/player/StepIndicator.vue'
import ParticleField from '../components/player/ParticleField.vue'
import AmbientAudio from '../components/player/AmbientAudio.vue'
import GrandFinale from '../components/player/GrandFinale.vue'

const route = useRoute()
const { t, locale } = useI18n()

const quest = ref(null)
const session = ref(null)
const reward = ref(null)
const notFound = ref(false)
/** Bumped on every wrong answer: drives the message AND replays the shake,
    which a plain boolean cannot do twice in a row. */
const wrongNonce = ref(0)
const hintOpen = ref(false)
const toast = ref('')

const preset = computed(() => quest.value?.theme?.preset || DEFAULT_THEME)
const stageVars = computed(() => themeVars(preset.value))
const showParticles = computed(() => quest.value?.theme?.particles !== false)
const step = computed(() => (quest.value && session.value ? currentStep(quest.value, session.value) : null))
const finished = computed(() => Boolean(session.value) && isComplete(session.value))
const wrong = computed(() => wrongNonce.value > 0)
const locked = computed(() => Boolean(step.value) && isLockedOut(step.value, session.value))
const attemptsRemaining = computed(() =>
  step.value ? attemptsLeft(step.value, session.value) : null
)
const stepLabel = computed(() =>
  session.value
    ? t('player.stepOf', { n: session.value.solved.length + 1, total: session.value.stepCount })
    : ''
)

/** The gift is written in the sender's language, so the player follows it —
    including the Vazirmatn font swap that `.lang-rtl` carries. */
const isRtl = computed(() => isRtlLocale(quest.value?.lang))
const dir = computed(() => dirForLocale(quest.value?.lang))

onMounted(load)
watch(() => route.params.questId, load)

function load() {
  const payload = loadPlayPayload(route.params.questId)
  if (!payload) {
    notFound.value = true
    return
  }
  notFound.value = false
  quest.value = payload
  if (payload.lang) locale.value = payload.lang
  session.value = createSession(payload, loadProgress(payload.id))
  if (isComplete(session.value)) unlockReward()
}

async function onSubmit(response) {
  const result = await submitAnswer(quest.value, session.value, response)
  session.value = result.session
  saveProgress(session.value)

  if (result.status === SUBMIT.CORRECT) {
    wrongNonce.value = 0
    hintOpen.value = false
    if (result.message) showToast(result.message)
    if (result.complete) await unlockReward()
    return
  }
  if (result.status === SUBMIT.EMPTY) return

  // Incorrect, or the guess that used up the cap.
  wrongNonce.value += 1
}

/**
 * Exchange proof of completion for the reward. The payload was never in the
 * initial download (PRD §4.5); today this reads a separate local record, and
 * becomes a Cloud Function call with the same arguments once Firebase lands.
 */
async function unlockReward() {
  const proof = await completionProof(quest.value, session.value)
  reward.value = redeemReward(quest.value.id, proof)
}

function restart() {
  clearProgress(quest.value.id)
  session.value = restartSession(quest.value)
  wrongNonce.value = 0
  hintOpen.value = false
}

let toastTimer = null
function showToast(message) {
  toast.value = message
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toast.value = '' }, 2600)
}
</script>

<style scoped>
/* Thumb-first, single purpose, safe-area aware (design.md principles 3 & 5). */
.player {
  position: relative;
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: max(24px, env(safe-area-inset-top)) 20px max(24px, env(safe-area-inset-bottom));
  background: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-ui);
  overflow: hidden;
}

.screen {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 420px;
  margin-inline: auto;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.centered {
  align-items: center;
  text-align: center;
}

.bar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 4px;
}
.bar > :first-child {
  flex: 1;
}

.step-count {
  margin: 0;
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
}
.prompt {
  margin: 0 0 6px;
  font-size: 16px;
  line-height: var(--line-height-body);
  color: var(--color-text);
}
.muted {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  color: var(--color-muted);
}

.meta {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 44px;
}
.hint-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 44px;
  padding: 0 12px;
  border: none;
  border-radius: var(--radius-full);
  background: color-mix(in srgb, var(--color-accent) 18%, transparent);
  color: var(--color-accent);
  font-family: var(--font-ui);
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}
.hint-button:focus-visible {
  outline: none;
  box-shadow: 0 0 0 4px var(--color-ring);
}
.attempts {
  margin-inline-start: auto;
  font-size: 12.5px;
  color: var(--color-muted);
}

.hint.revealed {
  margin: 0;
  padding: 12px 14px;
  border-radius: var(--radius-md);
  background: color-mix(in srgb, var(--color-accent) 12%, transparent);
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--color-accent) 30%, transparent);
  font-size: 14px;
  line-height: 1.5;
  text-align: start;
}

.feedback {
  margin: 0;
  font-size: 13.5px;
  font-weight: 600;
}
.feedback.error {
  color: var(--color-error);
}

.locked {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  text-align: center;
}
.locked strong {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 800;
}
.locked span {
  font-size: 13.5px;
  color: var(--color-muted);
}

.ghost-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  margin-top: 8px;
  padding: 0 22px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  background: var(--color-surface-2);
  color: var(--color-primary);
  font-family: var(--font-ui);
  font-size: 14.5px;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
}
.ghost-cta:focus-visible {
  outline: none;
  box-shadow: 0 0 0 4px var(--color-ring);
}

.watermark {
  margin: 8px 0 0;
  text-align: center;
  font-size: var(--font-size-caption);
  color: var(--color-muted);
}

.toast {
  position: fixed;
  inset-inline: 20px;
  bottom: max(20px, env(safe-area-inset-bottom));
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  max-width: 420px;
  margin-inline: auto;
  padding: 13px 16px;
  border-radius: var(--radius-md);
  background: var(--color-text);
  color: var(--color-bg);
  font-size: 14px;
  font-weight: 600;
  box-shadow: var(--shadow-2);
}
.toast-enter-active,
.toast-leave-active {
  transition: opacity var(--duration) var(--ease), transform var(--duration) var(--ease);
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
</style>
