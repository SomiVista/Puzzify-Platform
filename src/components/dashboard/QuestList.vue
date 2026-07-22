<template>
  <section class="quest-list-section">
    <div class="list-header">
      <h2 class="section-title">Your quests</h2>
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
        <PzButton variant="secondary" size="md" class="sort-btn">
          Recent
          <ChevronDown :size="14" />
        </PzButton>
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
      <p>No quests match your search or filter.</p>
    </div>
  </section>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { ChevronDown } from 'lucide-vue-next'
import { useAppStore } from '../../stores/useAppStore'
import PzButton from '../ui/PzButton.vue'
import QuestCard from './QuestCard.vue'

const store = useAppStore()
const { questFilter, filteredQuests } = storeToRefs(store)

const filters = [
  { label: 'All', value: 'all' },
  { label: 'Published', value: 'published' },
  { label: 'Drafts', value: 'drafts' }
]
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
  font-family: var(--pz-font-ui);
  font-size: 20px;
  font-weight: 800;
  color: var(--pz-text);
  margin: 0;
}
.list-controls {
  display: flex;
  align-items: center;
  gap: 16px;
}
.segmented-filter {
  display: flex;
  background: var(--pz-surface-2);
  padding: 4px;
  border-radius: var(--pz-r-md);
}
.filter-btn {
  padding: 8px 16px;
  border: none;
  background: transparent;
  font-family: var(--pz-font-ui);
  font-size: 13px;
  font-weight: 600;
  color: var(--pz-muted);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
}
.filter-btn:hover {
  color: var(--pz-text);
}
.filter-btn.active {
  background: var(--pz-surface);
  color: var(--pz-text);
  box-shadow: var(--pz-e-1);
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
  color: var(--pz-muted);
  font-size: 14px;
  background: var(--pz-surface);
  border-radius: var(--pz-r-md);
  border: 1px dashed var(--pz-border);
}

@media (max-width: 1100px) {
  .quests-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 768px) {
  .list-header { flex-direction: column; align-items: flex-start; gap: 16px; }
  .quests-grid { grid-template-columns: 1fr; }
}
</style>
