<template>
  <div class="empty-state-view">
    <div class="empty-content">
      <BaseBoxStage asset="gift" :size="160" />
      <h2>{{ t('dashboard.empty.title') }}</h2>
      <p>{{ t('dashboard.empty.body') }}</p>
      <BaseButton variant="primary" size="lg" class="new-quest-btn" data-testid="new-quest" @click="startQuest()">
        <Plus :size="20" /> {{ t('dashboard.empty.newQuest') }}
      </BaseButton>

      <div class="kicker">{{ t('dashboard.empty.kicker') }}</div>
      <div class="preset-grid">
        <button
          v-for="preset in OCCASION_PRESETS"
          :key="preset.id"
          type="button"
          class="preset-card"
          :data-testid="`occasion-${preset.id}`"
          @click="startQuest(preset.id)"
        >
          <div class="preset-icon">
            <component :is="preset.icon" :size="20" />
          </div>
          <div class="preset-name">{{ t(preset.labelKey) }}</div>
        </button>
      </div>
    </div>

    <footer class="empty-footer">
      {{ t('dashboard.empty.tagline') }}
    </footer>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { Plus } from 'lucide-vue-next'
import { OCCASION_PRESETS } from '../../quest/occasions'
import BaseBoxStage from '../ui/BaseBoxStage.vue'
import BaseButton from '../ui/BaseButton.vue'

const { t } = useI18n()
const router = useRouter()

function startQuest(occasion) {
  router.push({ name: 'quest-builder-new', query: occasion ? { occasion } : {} })
}
</script>

<style scoped>
.empty-state-view {
  display: flex;
  flex-direction: column;
}

.empty-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
}
.empty-content h2 {
  font-family: var(--font-display);
  font-size: 30px;
  font-weight: 800;
  margin: 24px 0 12px;
}
.empty-content p {
  font-size: 15px;
  color: var(--color-muted);
  max-width: 430px;
  line-height: 1.5;
  margin: 0 0 32px;
}

.new-quest-btn {
  margin-bottom: 48px;
}

.kicker {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: var(--tracking-kicker);
  color: var(--color-muted);
  margin-bottom: 24px;
}

.preset-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 12px;
  max-width: 800px;
  width: 100%;
}
.preset-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 14px;
  padding: 16px 12px;
  cursor: pointer;
  transition: all var(--duration) var(--ease);
}
.preset-card:hover {
  transform: translateY(-2px);
  border-color: var(--color-primary);
  box-shadow: var(--shadow-1);
}
.preset-card:focus-visible { outline: none; box-shadow: 0 0 0 4px var(--color-ring); }
.preset-icon {
  width: 36px;
  height: 36px;
  border-radius: 11px;
  background: var(--color-surface-2);
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}
.preset-name {
  font-size: 13.5px;
  font-weight: 700;
  color: var(--color-text);
  line-height: 1.2;
}

.empty-footer {
  text-align: center;
  padding: 24px;
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 800;
  color: var(--color-muted);
}

@media (max-width: 900px) {
  .preset-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
@media (max-width: 500px) {
  .preset-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
