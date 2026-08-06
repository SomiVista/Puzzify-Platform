<template>
  <section class="preview-pane">
    <h2 class="pane-title">{{ t('builder.preview.title') }}</h2>

    <!-- The quest's own theme is applied HERE only, so the studio chrome keeps
         the app-wide theme while the preview shows what the recipient sees. -->
    <div class="phone" :style="themeVars" :data-pz-theme="builder.themePreset" data-testid="live-preview">
      <div v-if="particlesOn" class="particles" aria-hidden="true">
        <i
          v-for="n in 8"
          :key="n"
          class="pz-anim"
          :style="particleStyle(n)"
        ></i>
      </div>

      <div v-if="!step" class="phone-empty">{{ t('builder.preview.empty') }}</div>

      <div v-else class="screen">
        <div class="screen-top">
          <span class="kicker">{{ t(`builder.palette.${step.kind}.label`) }}</span>
          <Volume2 v-if="builder.draft.theme.ambientAudio" :size="14" class="audio-icon" aria-hidden="true" />
        </div>

        <h3 v-if="step.title" class="screen-title">{{ step.title }}</h3>
        <p class="screen-prompt">{{ step.prompt || t('builder.inspector.fields.promptPlaceholder') }}</p>

        <!-- Text / Password Lock -->
        <div v-if="step.kind === 'lock'" class="mock-input">
          {{ t('builder.preview.inputPlaceholder') }}
        </div>

        <!-- Trivia -->
        <ul v-else-if="step.kind === 'trivia'" class="mock-options">
          <li
            v-for="(option, i) in step.config.options"
            :key="i"
            :class="{ correct: step.config.correctIndex === i }"
          >
            <span class="radio"></span>
            {{ option || t('builder.inspector.fields.optionPlaceholder', { n: i + 1 }) }}
          </li>
        </ul>

        <!-- Image Hotspot -->
        <div v-else class="mock-hotspot">
          <img v-if="step.config.imageUrl" :src="step.config.imageUrl" alt="" />
          <div v-else class="hotspot-placeholder"><ImageIcon :size="20" aria-hidden="true" /></div>
          <span
            class="hotspot-ring pz-anim"
            :style="{
              left: `${step.config.target.x}%`,
              top: `${step.config.target.y}%`,
              width: `${step.config.target.w}%`,
              height: `${step.config.target.h}%`
            }"
          ></span>
        </div>

        <div class="screen-meta">
          <span v-if="step.hintText" class="hint-chip">
            <Lightbulb :size="12" aria-hidden="true" /> {{ t('builder.preview.hint') }}
          </span>
          <span v-if="step.maxAttempts" class="attempts">
            {{ t('builder.preview.attempts', { n: step.maxAttempts }) }}
          </span>
        </div>

        <div class="mock-submit">{{ t('builder.preview.submit') }}</div>

        <div v-if="step.successMessage" class="mock-toast">
          <Check :size="12" aria-hidden="true" /> {{ step.successMessage }}
        </div>

        <span class="watermark">{{ t('builder.preview.watermark') }}</span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Check, Image as ImageIcon, Lightbulb, Volume2 } from 'lucide-vue-next'
import { THEMES } from '../../themes'
import { useBuilderStore } from '../../stores/useBuilderStore'

const { t } = useI18n()
const builder = useBuilderStore()

const step = computed(() => builder.selectedStep)
const preset = computed(() => THEMES[builder.themePreset] || THEMES.birthday)
const themeVars = computed(() => preset.value.vars)
const particlesOn = computed(() => builder.draft.theme.particles)

/** Particle motion is a theme property (`fall` / `rise`), never an occasion. */
function particleStyle(n) {
  return {
    animationName: preset.value.particles.motion === 'rise' ? 'pzRise' : 'pzFall',
    animationDuration: `${5 + (n % 4)}s`,
    animationDelay: `${n * 0.6}s`,
    insetInlineStart: `${(n * 13) % 92}%`,
    background: n % 2 ? 'var(--pz-primary)' : 'var(--pz-accent)'
  }
}
</script>

<style scoped>
.preview-pane {
  padding: 20px 16px;
  border-top: 1px solid var(--pz-hairline);
}
.pane-title {
  font-family: var(--pz-font-ui);
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: var(--pz-track-kicker);
  color: var(--pz-muted);
  margin: 0 0 12px;
}

.phone {
  position: relative;
  overflow: hidden;
  border-radius: var(--pz-r-xl);
  border: 1px solid var(--pz-border);
  background: var(--pz-bg);
  color: var(--pz-text);
  box-shadow: var(--pz-e-2);
  padding: 16px;
  min-height: 260px;
  font-family: var(--pz-font-ui);
}

.particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}
.particles i {
  position: absolute;
  top: 0;
  width: 6px;
  height: 6px;
  border-radius: 2px;
  opacity: 0.75;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

.phone-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 228px;
  text-align: center;
  font-size: 12.5px;
  color: var(--pz-muted);
}

.screen {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.screen-top {
  display: flex;
  align-items: center;
  gap: 8px;
}
.kicker {
  padding: 4px 9px;
  border-radius: var(--pz-r-full);
  background: var(--pz-surface-2);
  color: var(--pz-primary);
  font-size: 9.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
.audio-icon {
  margin-inline-start: auto;
  color: var(--pz-muted);
}
.screen-title {
  font-family: var(--pz-font-display);
  font-size: 17px;
  font-weight: 800;
  letter-spacing: var(--pz-track-display);
  margin: 0;
}
.screen-prompt {
  font-size: 12.5px;
  line-height: 1.5;
  color: var(--pz-muted);
  margin: 0;
}

.mock-input {
  padding: 11px 12px;
  border-radius: var(--pz-r-md);
  border: 1.5px solid var(--pz-border);
  background: var(--pz-surface);
  color: var(--pz-muted);
  font-size: 12.5px;
  text-align: start;
}

.mock-options {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.mock-options li {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 11px;
  border-radius: var(--pz-r-md);
  border: 1.5px solid var(--pz-border);
  background: var(--pz-surface);
  font-size: 12.5px;
}
.mock-options li.correct {
  border-color: var(--pz-success);
}
.radio {
  flex: none;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  border: 2px solid var(--pz-border);
}
.mock-options li.correct .radio {
  border-color: var(--pz-success);
  background: var(--pz-success);
}

.mock-hotspot {
  position: relative;
  border-radius: var(--pz-r-md);
  overflow: hidden;
  border: 1.5px solid var(--pz-border);
  background: var(--pz-surface);
}
.mock-hotspot img {
  display: block;
  width: 100%;
}
.hotspot-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 96px;
  color: var(--pz-muted);
}
/* Hotspot coordinates are relative to the image, which does not mirror in RTL. */
.hotspot-ring {
  position: absolute;
  border: 2px solid var(--pz-primary);
  border-radius: var(--pz-r-full);
  animation: pzPulse 2.4s ease-out infinite;
}

.screen-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 18px;
}
.hint-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border-radius: var(--pz-r-full);
  background: color-mix(in srgb, var(--pz-accent) 20%, transparent);
  color: var(--pz-accent);
  font-size: 10.5px;
  font-weight: 700;
}
.attempts {
  margin-inline-start: auto;
  font-size: 10.5px;
  color: var(--pz-muted);
}

.mock-submit {
  padding: 11px;
  border-radius: var(--pz-r-md);
  background: var(--pz-primary);
  color: var(--pz-on-primary);
  font-size: 13px;
  font-weight: 700;
  text-align: center;
}

.mock-toast {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 10px;
  border-radius: var(--pz-r-md);
  background: var(--pz-text);
  color: var(--pz-bg);
  font-size: 11.5px;
  line-height: 1.4;
}

.watermark {
  text-align: center;
  font-size: 10px;
  color: var(--pz-muted);
}
</style>
