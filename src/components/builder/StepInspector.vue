<template>
  <section class="inspector" data-testid="step-inspector">
    <header class="pane-head">
      <h2 class="pane-title">{{ t('builder.inspector.title') }}</h2>
    </header>

    <div v-if="!step" class="none">
      <MousePointerClick :size="22" aria-hidden="true" />
      <strong>{{ t('builder.inspector.none') }}</strong>
      <span>{{ t('builder.inspector.noneBody') }}</span>
    </div>

    <template v-else>
      <!-- Flow Manager wizard: walk the chain in strict order. -->
      <nav class="wizard" data-testid="wizard-nav">
        <IconButton
          :label="t('builder.inspector.prev')"
          :size="36"
          :disabled="builder.selectedIndex === 0"
          data-testid="wizard-prev"
          @click="builder.selectPrev()"
        >
          <ChevronLeft :size="16" class="nav-icon" />
        </IconButton>
        <span class="wizard-label" data-testid="wizard-label">
          {{ t('builder.inspector.stepOf', { n: builder.selectedIndex + 1, total: builder.stepCount }) }}
        </span>
        <IconButton
          :label="t('builder.inspector.next')"
          :size="36"
          :disabled="builder.selectedIndex === builder.stepCount - 1"
          data-testid="wizard-next"
          @click="builder.selectNext()"
        >
          <ChevronRight :size="16" class="nav-icon" />
        </IconButton>
      </nav>

      <div class="kind-chip">
        <component :is="blockIcon(step.kind)" :size="14" aria-hidden="true" />
        {{ t(`builder.palette.${step.kind}.label`) }}
      </div>

      <ul v-if="issues.length" class="issues" data-testid="step-issues">
        <li v-for="code in issues" :key="code">{{ t(`builder.issues.${code}`) }}</li>
      </ul>

      <!-- Shared fields -->
      <div class="field">
        <label :for="`${step.id}-title`">{{ t('builder.inspector.fields.title') }}</label>
        <input
          :id="`${step.id}-title`"
          class="pz-input"
          type="text"
          :value="step.title"
          :placeholder="t('builder.inspector.fields.titlePlaceholder')"
          @input="builder.updateStep({ title: $event.target.value })"
        />
      </div>

      <div class="field">
        <label :for="`${step.id}-prompt`">{{ t('builder.inspector.fields.prompt') }}</label>
        <textarea
          :id="`${step.id}-prompt`"
          class="pz-input"
          rows="3"
          data-testid="field-prompt"
          :value="step.prompt"
          :placeholder="t('builder.inspector.fields.promptPlaceholder')"
          @input="builder.updateStep({ prompt: $event.target.value })"
        ></textarea>
      </div>

      <!-- Text / Password Lock -->
      <template v-if="step.kind === 'lock'">
        <div class="field">
          <label :for="`${step.id}-answer`">{{ t('builder.inspector.fields.answer') }}</label>
          <input
            :id="`${step.id}-answer`"
            class="pz-input"
            type="text"
            data-testid="field-answer"
            :value="step.config.answer"
            :placeholder="t('builder.inspector.fields.answerPlaceholder')"
            @input="builder.updateConfig({ answer: $event.target.value })"
          />
        </div>
        <div class="row">
          <span class="row-label">{{ t('builder.inspector.fields.caseSensitive') }}</span>
          <PzToggle
            :model-value="step.config.caseSensitive"
            :label="t('builder.inspector.fields.caseSensitive')"
            data-testid="toggle-case"
            @update:model-value="builder.updateConfig({ caseSensitive: $event })"
          />
        </div>
      </template>

      <!-- Trivia -->
      <template v-else-if="step.kind === 'trivia'">
        <div class="field">
          <span class="field-label">{{ t('builder.inspector.fields.options') }}</span>
          <div v-for="(option, i) in step.config.options" :key="i" class="option-row">
            <input
              type="radio"
              class="option-radio"
              :name="`${step.id}-correct`"
              :checked="step.config.correctIndex === i"
              :aria-label="`${t('builder.inspector.fields.correct')} — ${t('builder.inspector.fields.optionPlaceholder', { n: i + 1 })}`"
              :data-testid="`option-correct-${i}`"
              @change="builder.updateConfig({ correctIndex: i })"
            />
            <input
              class="pz-input"
              type="text"
              :value="option"
              :placeholder="t('builder.inspector.fields.optionPlaceholder', { n: i + 1 })"
              :data-testid="`option-text-${i}`"
              :aria-label="t('builder.inspector.fields.optionPlaceholder', { n: i + 1 })"
              @input="setOption(i, $event.target.value)"
            />
            <IconButton
              :label="t('builder.inspector.fields.removeOption')"
              :size="36"
              :disabled="step.config.options.length <= TRIVIA_MIN_OPTIONS"
              @click="removeOption(i)"
            >
              <X :size="14" />
            </IconButton>
          </div>
          <PzButton
            variant="ghost"
            size="sm"
            :disabled="step.config.options.length >= TRIVIA_MAX_OPTIONS"
            data-testid="add-option"
            @click="addOption"
          >
            <Plus :size="14" /> {{ t('builder.inspector.fields.addOption') }}
          </PzButton>
        </div>
      </template>

      <!-- Image Hotspot -->
      <template v-else-if="step.kind === 'hotspot'">
        <div class="field">
          <label :for="`${step.id}-image`">{{ t('builder.inspector.fields.imageUrl') }}</label>
          <input
            :id="`${step.id}-image`"
            class="pz-input"
            type="url"
            data-testid="field-image"
            :value="step.config.imageUrl"
            :placeholder="t('builder.inspector.fields.imagePlaceholder')"
            @input="builder.updateConfig({ imageUrl: $event.target.value })"
          />
        </div>
        <div class="field">
          <span class="field-label">{{ t('builder.inspector.fields.target') }}</span>
          <div class="target-grid">
            <label v-for="axis in TARGET_AXES" :key="axis.key" class="target-cell">
              <span>{{ t(`builder.inspector.fields.${axis.labelKey}`) }}</span>
              <input
                class="pz-input"
                type="number"
                min="0"
                max="100"
                :value="step.config.target[axis.key]"
                @input="setTarget(axis.key, $event.target.value)"
              />
            </label>
          </div>
          <!-- Preview overlay. Coordinates are relative to the IMAGE, which does
               not mirror under RTL, so physical left/top are correct here. -->
          <div v-if="step.config.imageUrl" class="target-preview">
            <img :src="step.config.imageUrl" alt="" />
            <span
              class="target-box"
              :style="{
                left: `${step.config.target.x}%`,
                top: `${step.config.target.y}%`,
                width: `${step.config.target.w}%`,
                height: `${step.config.target.h}%`
              }"
            ></span>
          </div>
        </div>
      </template>

      <!-- Per-step advanced settings (PRD §4.2.4) -->
      <div class="advanced">
        <button
          type="button"
          class="advanced-toggle"
          :aria-expanded="advancedOpen ? 'true' : 'false'"
          :aria-controls="`${step.id}-advanced`"
          data-testid="advanced-toggle"
          @click="advancedOpen = !advancedOpen"
        >
          <ChevronDown :size="15" class="chevron" :class="{ open: advancedOpen }" aria-hidden="true" />
          {{ t('builder.inspector.advanced.title') }}
        </button>

        <div v-show="advancedOpen" :id="`${step.id}-advanced`" class="advanced-body">
          <div class="field">
            <label :for="`${step.id}-hint`">{{ t('builder.inspector.advanced.hintText') }}</label>
            <input
              :id="`${step.id}-hint`"
              class="pz-input"
              type="text"
              data-testid="field-hint"
              :value="step.hintText"
              :placeholder="t('builder.inspector.advanced.hintPlaceholder')"
              @input="builder.updateStep({ hintText: $event.target.value })"
            />
            <small>{{ t('builder.inspector.advanced.hintHelp') }}</small>
          </div>

          <div class="field">
            <label :for="`${step.id}-success`">{{ t('builder.inspector.advanced.successMessage') }}</label>
            <input
              :id="`${step.id}-success`"
              class="pz-input"
              type="text"
              data-testid="field-success"
              :value="step.successMessage"
              :placeholder="t('builder.inspector.advanced.successPlaceholder')"
              @input="builder.updateStep({ successMessage: $event.target.value })"
            />
            <small>{{ t('builder.inspector.advanced.successHelp') }}</small>
          </div>

          <div class="field">
            <label :for="`${step.id}-attempts`">{{ t('builder.inspector.advanced.maxAttempts') }}</label>
            <input
              :id="`${step.id}-attempts`"
              class="pz-input"
              type="number"
              :min="MAX_ATTEMPTS_MIN"
              :max="MAX_ATTEMPTS_MAX"
              data-testid="field-attempts"
              :value="step.maxAttempts ?? ''"
              :placeholder="t('builder.inspector.advanced.unlimited')"
              @input="builder.updateStep({ maxAttempts: $event.target.value })"
            />
            <small>{{ t('builder.inspector.advanced.maxAttemptsHelp') }}</small>
          </div>
        </div>
      </div>
    </template>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ChevronLeft, ChevronRight, ChevronDown, MousePointerClick, Plus, X } from 'lucide-vue-next'
import { blockIcon } from '../../quest/blocks'
import { TRIVIA_MIN_OPTIONS, TRIVIA_MAX_OPTIONS, MAX_ATTEMPTS_MIN, MAX_ATTEMPTS_MAX, validateStep } from '../../quest/model'
import { useBuilderStore } from '../../stores/useBuilderStore'
import IconButton from '../ui/IconButton.vue'
import PzButton from '../ui/PzButton.vue'
import PzToggle from '../ui/PzToggle.vue'

const { t } = useI18n()
const builder = useBuilderStore()
const advancedOpen = ref(false)

const step = computed(() => builder.selectedStep)
const issues = computed(() => (step.value ? validateStep(step.value) : []))

const TARGET_AXES = [
  { key: 'x', labelKey: 'targetX' },
  { key: 'y', labelKey: 'targetY' },
  { key: 'w', labelKey: 'targetW' },
  { key: 'h', labelKey: 'targetH' }
]

function setOption(index, value) {
  const options = [...step.value.config.options]
  options[index] = value
  builder.updateConfig({ options })
}

function addOption() {
  const options = step.value.config.options
  if (options.length >= TRIVIA_MAX_OPTIONS) return
  builder.updateConfig({ options: [...options, ''] })
}

function removeOption(index) {
  const { options, correctIndex } = step.value.config
  if (options.length <= TRIVIA_MIN_OPTIONS) return
  const next = options.filter((_, i) => i !== index)
  // Keep the correct answer pointing at the same option it did before.
  let nextCorrect = correctIndex
  if (index === correctIndex) nextCorrect = 0
  else if (index < correctIndex) nextCorrect = correctIndex - 1
  builder.updateConfig({ options: next, correctIndex: nextCorrect })
}

function setTarget(axis, value) {
  const number = Math.max(0, Math.min(100, Number(value) || 0))
  builder.updateConfig({ target: { ...step.value.config.target, [axis]: number } })
}
</script>

<style scoped>
.inspector {
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.pane-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
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

.none {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 28px 16px;
  text-align: center;
  color: var(--pz-muted);
  border: 1.5px dashed var(--pz-border);
  border-radius: var(--pz-r-md);
}
.none strong {
  font-size: 14px;
  color: var(--pz-text);
}
.none span {
  font-size: 12px;
  line-height: 1.5;
}

.wizard {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 6px;
  background: var(--pz-surface-2);
  border-radius: var(--pz-r-md);
}
.wizard-label {
  font-size: 12.5px;
  font-weight: 700;
  color: var(--pz-text);
}
/* Chevrons point along the reading direction, so mirror them for RTL. The
   ancestor selector needs no :global() — scoped CSS only scopes the last one. */
[dir='rtl'] .nav-icon {
  transform: scaleX(-1);
}

.kind-chip {
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
  gap: 6px;
  padding: 5px 10px;
  border-radius: var(--pz-r-full);
  background: var(--pz-surface-2);
  color: var(--pz-primary);
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.issues {
  margin: 0;
  padding: 10px 14px;
  padding-inline-start: 26px;
  border-radius: var(--pz-r-md);
  background: color-mix(in srgb, var(--pz-accent) 12%, transparent);
  color: var(--pz-text);
  font-size: 12px;
  line-height: 1.6;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.field label,
.field-label {
  font-size: 12px;
  font-weight: 700;
  color: var(--pz-text);
}
.field small {
  font-size: 11.5px;
  line-height: 1.45;
  color: var(--pz-muted);
}

.pz-input {
  width: 100%;
  min-height: 44px;
  padding: 11px 12px;
  border: 1.5px solid var(--pz-border);
  border-radius: var(--pz-r-md);
  background: var(--pz-bg);
  color: var(--pz-text);
  font-family: var(--pz-font-ui);
  font-size: 13.5px;
  text-align: start;
  outline: none;
  transition: border-color var(--pz-dur) var(--pz-ease), box-shadow var(--pz-dur) var(--pz-ease);
}
textarea.pz-input {
  min-height: 76px;
  resize: vertical;
  line-height: 1.5;
}
.pz-input:focus {
  border-color: var(--pz-focus);
  box-shadow: 0 0 0 4px var(--pz-ring);
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.row-label {
  font-size: 12.5px;
  font-weight: 600;
  color: var(--pz-text);
}

.option-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.option-radio {
  flex: none;
  width: 18px;
  height: 18px;
  accent-color: var(--pz-primary);
}

.target-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
}
.target-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 11px;
  font-weight: 600;
  color: var(--pz-muted);
}
.target-cell .pz-input {
  padding: 8px;
  min-height: 40px;
  font-size: 12.5px;
}
.target-preview {
  position: relative;
  margin-top: 8px;
  border-radius: var(--pz-r-md);
  overflow: hidden;
  border: 1px solid var(--pz-border);
}
.target-preview img {
  display: block;
  width: 100%;
}
.target-box {
  position: absolute;
  border: 2px solid var(--pz-primary);
  border-radius: 6px;
  background: color-mix(in srgb, var(--pz-primary) 18%, transparent);
}

.advanced {
  border-top: 1px solid var(--pz-hairline);
  padding-top: 12px;
}
.advanced-toggle {
  width: 100%;
  min-height: 44px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0;
  background: none;
  border: none;
  color: var(--pz-text);
  font-family: var(--pz-font-ui);
  font-size: 12.5px;
  font-weight: 700;
  text-align: start;
  cursor: pointer;
  outline: none;
}
.advanced-toggle:focus-visible {
  box-shadow: 0 0 0 4px var(--pz-ring);
  border-radius: var(--pz-r-sm);
}
.chevron {
  color: var(--pz-muted);
  transition: transform var(--pz-dur) var(--pz-ease);
}
.chevron.open {
  transform: rotate(180deg);
}
.advanced-body {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding-top: 6px;
}
</style>
