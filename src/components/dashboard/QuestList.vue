<template>
  <section class="quest-list-section">
    <div class="list-header">
      <h2 class="section-title">{{ t('dashboard.list.title') }}</h2>
      <div class="list-controls">
        <div class="segmented-filter">
          <button 
            v-for="filter in filters" 
            :key="filter.value"
            :class="['filter-btn', { active: questFilter === filter.value }]"
            @click="questFilter = filter.value"
          >
            {{ filter.label }}
          </button>
        </div>
        <BaseButton
          variant="secondary"
          size="md"
          class="sort-btn"
          data-testid="quest-sort"
          @click="toggleQuestSort"
        >
          {{ questSort === 'name' ? t('dashboard.list.sortName') : t('dashboard.list.sortRecent') }}
          <ChevronDown :size="14" />
        </BaseButton>
      </div>
    </div>

    <div v-if="filteredQuests.length > 0" class="quests-grid">
      <QuestCard 
        v-for="quest in filteredQuests" 
        :key="quest.id" 
        :quest="quest" 
      />
    </div>
    <div v-else class="no-results">
      <p>{{ t('dashboard.list.noResults') }}</p>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { ChevronDown } from 'lucide-vue-next'
import { useAppStore } from '../../stores/useAppStore'
import BaseButton from '../ui/BaseButton.vue'
import QuestCard from './QuestCard.vue'

const { t } = useI18n()
const store = useAppStore()
const { questFilter, questSort, filteredQuests } = storeToRefs(store)
const { toggleQuestSort } = store

const filters = computed(() => [
  { label: t('dashboard.list.all'), value: 'all' },
  { label: t('dashboard.list.published'), value: 'published' },
  { label: t('dashboard.list.drafts'), value: 'drafts' }
])
</script>

<style scoped>
.quest-list-section {
  padding: 0 30px 40px;
}
.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}
.section-title {
  font-family: var(--font-ui);
  font-size: 20px;
  font-weight: 800;
  color: var(--color-text);
  margin: 0;
}
.list-controls {
  display: flex;
  align-items: center;
  gap: 16px;
}
.segmented-filter {
  display: flex;
  background: var(--color-surface-2);
  padding: 4px;
  border-radius: var(--radius-md);
}
.filter-btn {
  padding: 8px 16px;
  border: none;
  background: transparent;
  font-family: var(--font-ui);
  font-size: 13px;
  font-weight: 600;
  color: var(--color-muted);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
}
.filter-btn:hover {
  color: var(--color-text);
}
.filter-btn.active {
  background: var(--color-surface);
  color: var(--color-text);
  box-shadow: var(--shadow-1);
}
.sort-btn {
  gap: 6px;
}
.quests-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
.no-results {
  padding: 40px;
  text-align: center;
  color: var(--color-muted);
  font-size: 14px;
  background: var(--color-surface);
  border-radius: var(--radius-md);
  border: 1px dashed var(--color-border);
}

@media (max-width: 1100px) {
  .quests-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 900px) {
  .quest-list-section { padding-inline: 16px; }
  /* 44px hit-target floor on touch (PRD §6.3). */
  .filter-btn { min-height: 44px; }
}
@media (max-width: 768px) {
  .list-header { flex-direction: column; align-items: flex-start; gap: 16px; }
  .quests-grid { grid-template-columns: 1fr; }
}
</style>
