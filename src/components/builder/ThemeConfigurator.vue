<template>
  <section class="theme-config" data-testid="theme-configurator">
    <h2 class="pane-title">{{ t('builder.theme.title') }}</h2>

    <span class="field-label">{{ t('builder.theme.preset') }}</span>
    <div class="presets">
      <button
        v-for="preset in presets"
        :key="preset.id"
        type="button"
        class="preset"
        :class="{ selected: preset.id === builder.themePreset }"
        :aria-pressed="preset.id === builder.themePreset ? 'true' : 'false'"
        :data-testid="`theme-${preset.id}`"
        @click="builder.setThemePreset(preset.id)"
      >
        <span class="swatch" :style="swatchStyle(preset)">
          <i :style="{ background: preset.vars['--color-primary'] }"></i>
          <i :style="{ background: preset.vars['--color-secondary'] }"></i>
          <i :style="{ background: preset.vars['--color-accent'] }"></i>
        </span>
        <span class="preset-label">{{ preset.label }}</span>
        <span class="preset-tagline">{{ preset.tagline }}</span>
        <Check v-if="preset.id === builder.themePreset" class="preset-check" :size="14" aria-hidden="true" />
      </button>
    </div>

    <div class="row">
      <span class="row-text">
        <span class="row-label">{{ t('builder.theme.ambientAudio') }}</span>
        <small>{{ activePreset.audio }} · {{ t('builder.theme.ambientAudioHelp') }}</small>
      </span>
      <BaseToggle
        :model-value="builder.draft.theme.ambientAudio"
        :label="t('builder.theme.ambientAudio')"
        data-testid="toggle-audio"
        @update:model-value="builder.setAmbientAudio($event)"
      />
    </div>

    <div class="row">
      <span class="row-text">
        <span class="row-label">{{ t('builder.theme.particles') }}</span>
        <small>{{ activePreset.particles.label }} · {{ t('builder.theme.particlesHelp') }}</small>
      </span>
      <BaseToggle
        :model-value="builder.draft.theme.particles"
        :label="t('builder.theme.particles')"
        data-testid="toggle-particles"
        @update:model-value="builder.setParticles($event)"
      />
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Check } from 'lucide-vue-next'
import { THEMES, themeOf } from '../../themes'
import { useBuilderStore } from '../../stores/useBuilderStore'
import BaseToggle from '../ui/BaseToggle.vue'

const { t } = useI18n()
const builder = useBuilderStore()

const presets = Object.values(THEMES)
const activePreset = computed(() => themeOf(builder.themePreset))

/* Swatches must show the preset's OWN palette, so they read raw values from the
   preset object rather than the ambient --color-* tokens of the studio chrome. */
function swatchStyle(preset) {
  return {
    background: preset.vars['--color-bg'],
    borderColor: preset.vars['--color-border']
  }
}
</script>

<style scoped>
.theme-config {
  padding: 20px 16px;
  border-top: 1px solid var(--color-hairline);
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.pane-title {
  font-family: var(--font-ui);
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: var(--tracking-kicker);
  color: var(--color-muted);
  margin: 0;
}
.field-label {
  font-size: 12px;
  font-weight: 700;
  color: var(--color-text);
}

.presets {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}
.preset {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  min-height: 44px;
  padding: 10px;
  background: var(--color-surface);
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-md);
  font-family: var(--font-ui);
  color: var(--color-text);
  text-align: start;
  cursor: pointer;
  transition: border-color var(--duration) var(--ease), box-shadow var(--duration) var(--ease);
}
.preset:hover {
  border-color: color-mix(in srgb, var(--color-primary) 45%, var(--color-border));
}
.preset.selected {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-1);
}
.preset:focus-visible {
  outline: none;
  box-shadow: 0 0 0 4px var(--color-ring);
}
.swatch {
  display: flex;
  align-items: center;
  gap: 3px;
  width: 100%;
  padding: 6px;
  border-radius: var(--radius-sm);
  border: 1px solid;
}
.swatch i {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}
.preset-label {
  font-size: 12.5px;
  font-weight: 700;
}
.preset-tagline {
  font-size: 10.5px;
  color: var(--color-muted);
  line-height: 1.3;
}
.preset-check {
  position: absolute;
  top: 8px;
  inset-inline-end: 8px;
  color: var(--color-primary);
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.row-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.row-label {
  font-size: 12.5px;
  font-weight: 700;
  color: var(--color-text);
}
.row-text small {
  font-size: 11px;
  line-height: 1.4;
  color: var(--color-muted);
}
</style>
