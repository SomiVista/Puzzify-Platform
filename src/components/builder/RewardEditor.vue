<template>
  <section class="reward-editor" data-testid="reward-editor">
    <h2 class="pane-title">{{ t('builder.reward.title') }}</h2>

    <span class="field-label">{{ t('builder.reward.type') }}</span>
    <div class="types">
      <button
        v-for="type in REWARD_TYPES"
        :key="type"
        type="button"
        class="type"
        :class="{ selected: type === reward.type }"
        :aria-pressed="type === reward.type ? 'true' : 'false'"
        :data-testid="`reward-${type}`"
        @click="builder.setRewardType(type)"
      >
        <component :is="ICONS[type]" :size="15" aria-hidden="true" />
        {{ t(`builder.reward.${type}`) }}
      </button>
    </div>

    <div class="field">
      <label for="reward-headline">{{ t('builder.reward.headline') }}</label>
      <input
        id="reward-headline"
        class="pz-input"
        type="text"
        data-testid="reward-headline"
        :value="reward.title || ''"
        :placeholder="t('builder.reward.headlinePlaceholder')"
        @input="builder.updateReward({ title: $event.target.value })"
      />
    </div>

    <!-- video points at an embed; letter and voucher carry written copy. -->
    <div v-if="reward.type === 'video'" class="field">
      <label for="reward-url">{{ t('builder.reward.videoUrl') }}</label>
      <input
        id="reward-url"
        class="pz-input"
        type="url"
        data-testid="reward-url"
        :value="reward.url || ''"
        :placeholder="t('builder.reward.videoPlaceholder')"
        @input="builder.updateReward({ url: $event.target.value })"
      />
    </div>

    <div v-else class="field">
      <label for="reward-message">{{ t('builder.reward.message') }}</label>
      <textarea
        id="reward-message"
        class="pz-input"
        rows="4"
        data-testid="reward-message"
        :value="reward.body || ''"
        :placeholder="t('builder.reward.messagePlaceholder')"
        @input="builder.updateReward({ body: $event.target.value })"
      ></textarea>
    </div>

    <div v-if="reward.type === 'voucher'" class="field">
      <label for="reward-code">{{ t('builder.reward.code') }}</label>
      <input
        id="reward-code"
        class="pz-input mono"
        type="text"
        data-testid="reward-code"
        :value="reward.code || ''"
        :placeholder="t('builder.reward.codePlaceholder')"
        @input="builder.updateReward({ code: $event.target.value })"
      />
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Mail, Film, Ticket } from 'lucide-vue-next'
import { REWARD_TYPES } from '../../quest/model'
import { useBuilderStore } from '../../stores/useBuilderStore'

const { t } = useI18n()
const builder = useBuilderStore()

const ICONS = { letter: Mail, video: Film, voucher: Ticket }
const reward = computed(() => builder.draft.reward)
</script>

<style scoped>
.reward-editor {
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
.field-label,
.field label {
  font-size: 12px;
  font-weight: 700;
  color: var(--pz-text);
}

.types {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
}
.type {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  min-height: 44px;
  padding: 9px 6px;
  border: 1.5px solid var(--pz-border);
  border-radius: var(--pz-r-md);
  background: var(--pz-surface);
  color: var(--pz-muted);
  font-family: var(--pz-font-ui);
  font-size: 11.5px;
  font-weight: 700;
  cursor: pointer;
  transition: border-color var(--pz-dur) var(--pz-ease), color var(--pz-dur) var(--pz-ease);
}
.type.selected {
  border-color: var(--pz-primary);
  color: var(--pz-primary);
  background: var(--pz-surface-2);
}
.type:focus-visible {
  outline: none;
  box-shadow: 0 0 0 4px var(--pz-ring);
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
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
.pz-input.mono {
  font-family: var(--pz-font-mono);
  letter-spacing: 0.04em;
}
textarea.pz-input {
  min-height: 88px;
  resize: vertical;
  line-height: 1.5;
}
.pz-input:focus {
  border-color: var(--pz-focus);
  box-shadow: 0 0 0 4px var(--pz-ring);
}
</style>
