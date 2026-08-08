<template>
  <section class="create-hero">
    <div class="hero-head">
      <h2 class="hero-title">{{ t('dashboard.createHero.title') }}</h2>
      <BaseButton variant="primary" size="md" data-testid="new-quest" @click="startQuest()">
        <Plus :size="18" /> {{ t('dashboard.createHero.newQuest') }}
      </BaseButton>
    </div>

    <div class="preset-grid">
      <button
        v-for="preset in OCCASION_PRESETS"
        :key="preset.id"
        type="button"
        class="preset-card"
        :data-testid="`occasion-${preset.id}`"
        @click="startQuest(preset.id)"
      >
        <span class="preset-icon">
          <component :is="preset.icon" :size="20" />
        </span>
        <span class="preset-name">{{ t(preset.labelKey) }}</span>
      </button>
    </div>
  </section>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { Plus } from 'lucide-vue-next'
import { OCCASION_PRESETS } from '../../quest/occasions'
import BaseButton from '../ui/BaseButton.vue'

const { t } = useI18n()
const router = useRouter()

/** Both paths open the Quest Builder; an occasion just pre-seeds the theme. */
function startQuest(occasion) {
  router.push({ name: 'quest-builder-new', query: occasion ? { occasion } : {} })
}
</script>

<style scoped>
.create-hero {
  padding: 32px 30px;
}
.hero-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}
.hero-title {
  font-family: var(--font-ui);
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: var(--tracking-kicker);
  color: var(--color-muted);
  margin: 0;
}
.preset-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
}
.preset-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 24px 16px;
  min-height: 120px;
  background: var(--color-surface);
  box-shadow: var(--shadow-1);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  font-family: var(--font-ui);
  font-size: 13.5px;
  font-weight: 600;
  color: var(--color-text);
  cursor: pointer;
  transition: transform var(--duration) var(--ease), box-shadow var(--duration) var(--ease),
    border-color var(--duration) var(--ease);
}
.preset-card:hover {
  border-color: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-2);
}
.preset-card:focus-visible {
  outline: none;
  box-shadow: 0 0 0 4px var(--color-ring);
}
.preset-icon {
  color: var(--color-primary);
  display: inline-flex;
}
.preset-name {
  line-height: 1.2;
  text-align: center;
}

@media (max-width: 1200px) {
  .preset-grid { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 900px) {
  .create-hero { padding: 24px 16px; }
}
@media (max-width: 768px) {
  .preset-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>
