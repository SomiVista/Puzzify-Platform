<template>
  <header class="topbar">
    <router-link to="/dashboard/quests" class="back" :aria-label="t('builder.topbar.back')">
      <ArrowLeft :size="18" class="back-icon" aria-hidden="true" />
      <span class="back-text">{{ t('builder.topbar.back') }}</span>
    </router-link>

    <input
      class="name-input"
      type="text"
      data-testid="quest-name"
      :value="builder.draft.name"
      :placeholder="t('builder.topbar.namePlaceholder')"
      :aria-label="t('builder.topbar.namePlaceholder')"
      @input="builder.setName($event.target.value)"
    />

    <div class="topbar-end">
      <span class="steps-chip" data-testid="step-count">
        {{ t('builder.topbar.stepsLabel') }} · {{ builder.stepCount }}
      </span>

      <span v-if="firstIssue" class="issue-hint" data-testid="quest-issue">
        {{ t(`builder.issues.${firstIssue}`) }}
      </span>
      <span v-else-if="!builder.dirty" class="saved-hint">
        <Check :size="13" aria-hidden="true" /> {{ t('builder.topbar.saved') }}
      </span>

      <PzButton variant="secondary" size="md" data-testid="save-quest" @click="$emit('save')">
        <Save :size="16" /> {{ t('builder.topbar.save') }}
      </PzButton>

      <PzButton
        variant="primary"
        size="md"
        data-testid="publish-quest"
        :disabled="!canPublish"
        :title="canPublish ? '' : t('builder.publish.blocked')"
        @click="$emit('publish')"
      >
        <Rocket :size="16" />
        {{ builder.isPublished ? t('builder.publish.update') : t('builder.publish.action') }}
      </PzButton>
    </div>

    <!-- The shareable link, once the quest exists at /q/{id} (PRD §4.2.5). -->
    <div v-if="builder.isPublished" class="share" data-testid="share-row">
      <PzBadge tone="success">{{ t('builder.publish.published') }}</PzBadge>
      <a class="share-link" :href="builder.shareUrl" target="_blank" rel="noopener" data-testid="share-link">
        {{ builder.shareUrl }}
      </a>
      <button type="button" class="copy" data-testid="copy-link" @click="copyLink">
        <component :is="copied ? Check : LinkIcon" :size="14" aria-hidden="true" />
        {{ copied ? t('builder.publish.copied') : t('builder.publish.copyLink') }}
      </button>
      <span class="share-hint">{{ t('builder.publish.shareHint') }}</span>
    </div>
  </header>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ArrowLeft, Check, Save, Rocket, Link as LinkIcon } from 'lucide-vue-next'
import { useBuilderStore } from '../../stores/useBuilderStore'
import PzButton from '../ui/PzButton.vue'
import PzBadge from '../ui/PzBadge.vue'

defineEmits(['save', 'publish'])

const { t } = useI18n()
const builder = useBuilderStore()

const firstIssue = computed(() => builder.questIssues[0] || null)
// Publishing mints a link people will open — only allow it once the quest works.
const canPublish = computed(() => builder.questIssues.length === 0)

const copied = ref(false)
async function copyLink() {
  try {
    await navigator.clipboard.writeText(builder.shareUrl)
  } catch {
    // Clipboard permission denied — the link stays visible and selectable.
  }
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}
</script>

<style scoped>
.topbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
  padding: 12px 20px;
  background: var(--pz-surface);
  border-block-end: 1px solid var(--pz-hairline);
  flex-shrink: 0;
}

.back {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  padding-inline: 10px;
  border-radius: var(--pz-r-md);
  color: var(--pz-muted);
  text-decoration: none;
  font-size: 13px;
  font-weight: 600;
  outline: none;
}
.back:hover {
  background: var(--pz-surface-2);
  color: var(--pz-text);
}
.back:focus-visible {
  box-shadow: 0 0 0 4px var(--pz-ring);
}
/* The arrow points back along the reading direction. Scoped CSS only scopes the
   LAST selector, so the ancestor [dir='rtl'] (set on .pz-stage) matches as-is —
   wrapping it in :global() would hoist the whole rule and flip the page. */
[dir='rtl'] .back-icon {
  transform: scaleX(-1);
}

.name-input {
  flex: 1;
  min-width: 0;
  max-width: 420px;
  min-height: 44px;
  padding: 10px 14px;
  border: 1.5px solid transparent;
  border-radius: var(--pz-r-md);
  background: var(--pz-bg);
  color: var(--pz-text);
  font-family: var(--pz-font-display);
  font-size: 17px;
  font-weight: 700;
  letter-spacing: var(--pz-track-display);
  text-align: start;
  outline: none;
  transition: border-color var(--pz-dur) var(--pz-ease), box-shadow var(--pz-dur) var(--pz-ease);
}
.name-input::placeholder {
  color: var(--pz-muted);
  font-weight: 600;
}
.name-input:focus {
  border-color: var(--pz-focus);
  box-shadow: 0 0 0 4px var(--pz-ring);
}

.topbar-end {
  margin-inline-start: auto;
  display: flex;
  align-items: center;
  gap: 12px;
}
.steps-chip {
  padding: 6px 11px;
  border-radius: var(--pz-r-full);
  background: var(--pz-surface-2);
  color: var(--pz-muted);
  font-size: 11.5px;
  font-weight: 700;
  white-space: nowrap;
}
.issue-hint {
  font-size: 12px;
  color: var(--pz-accent);
  font-weight: 600;
}
.saved-hint {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: var(--pz-success);
  font-weight: 600;
}

.share {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 12px;
  border-radius: var(--pz-r-md);
  background: var(--pz-surface-2);
}
.share-link {
  flex: 1;
  min-width: 180px;
  font-family: var(--pz-font-mono);
  font-size: 12.5px;
  color: var(--pz-primary);
  text-align: start;
  word-break: break-all;
}
.copy {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 44px;
  padding: 0 14px;
  border: 1px solid var(--pz-border);
  border-radius: var(--pz-r-md);
  background: var(--pz-surface);
  color: var(--pz-text);
  font-family: var(--pz-font-ui);
  font-size: 12.5px;
  font-weight: 700;
  cursor: pointer;
}
.copy:focus-visible {
  outline: none;
  box-shadow: 0 0 0 4px var(--pz-ring);
}
.share-hint {
  flex-basis: 100%;
  font-size: 11.5px;
  color: var(--pz-muted);
}

@media (max-width: 860px) {
  .topbar {
    flex-wrap: wrap;
    gap: 10px;
  }
  .back-text {
    display: none;
  }
  .name-input {
    order: 3;
    max-width: none;
    flex-basis: 100%;
  }
}
</style>
