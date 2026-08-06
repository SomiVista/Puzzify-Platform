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
          <i :style="{ background: preset.vars['--pz-primary'] }"></i>
          <i :style="{ background: preset.vars['--pz-secondary'] }"></i>
          <i :style="{ background: preset.vars['--pz-accent'] }"></i>
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
      <PzToggle
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
      <PzToggle
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
import { THEMES } from '../../themes'
import { useBuilderStore } from '../../stores/useBuilderStore'
import PzToggle from '../ui/PzToggle.vue'

const { t } = useI18n()
const builder = useBuilderStore()

const presets = Object.values(THEMES)
const activePreset = computed(() => THEMES[builder.themePreset] || THEMES.birthday)

/* Swatches must show the preset's OWN palette, so they read raw values from the
   preset object rather than the ambient --pz-* tokens of the studio chrome. */
function swatchStyle(preset) {
  return {
    background: preset.vars['--pz-bg'],
    borderColor: preset.vars['--pz-border']
  }
}
</script>

<style scoped>
.theme-config {
  padding: 20px 16px;
  border-top: 1px solid var(--pz-hairline);
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.pane-title {
  font-family: var(--pz-font-ui);
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: var(--pz-track-kicker);
  color: var(--pz-muted);
  margin: 0;
}
.field-label {
  font-size: 12px;
  font-weight: 700;
  color: var(--pz-text);
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
  background: var(--pz-surface);
  border: 1.5px solid var(--pz-border);
  border-radius: var(--pz-r-md);
  font-family: var(--pz-font-ui);
  color: var(--pz-text);
  text-align: start;
  cursor: pointer;
  transition: border-color var(--pz-dur) var(--pz-ease), box-shadow var(--pz-dur) var(--pz-ease);
}
.preset:hover {
  border-color: color-mix(in srgb, var(--pz-primary) 45%, var(--pz-border));
}
.preset.selected {
  border-color: var(--pz-primary);
  box-shadow: var(--pz-e-1);
}
.preset:focus-visible {
  outline: none;
  box-shadow: 0 0 0 4px var(--pz-ring);
}
.swatch {
  display: flex;
  align-items: center;
  gap: 3px;
  width: 100%;
  padding: 6px;
  border-radius: var(--pz-r-sm);
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
  color: var(--pz-muted);
  line-height: 1.3;
}
.preset-check {
  position: absolute;
  top: 8px;
  inset-inline-end: 8px;
  color: var(--pz-primary);
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
  color: var(--pz-text);
}
.row-text small {
  font-size: 11px;
  line-height: 1.4;
  color: var(--pz-muted);
}
</style>
