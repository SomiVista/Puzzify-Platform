<template>
  <EmptyState v-if="quests.length === 0" />
  <div v-else class="populated-state">
    <CreateHero />
    <StatsRow />
    <QuestList />
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useAppStore } from '../../stores/useAppStore'
import EmptyState from '../../components/dashboard/EmptyState.vue'
import CreateHero from '../../components/dashboard/CreateHero.vue'
import StatsRow from '../../components/dashboard/StatsRow.vue'
import QuestList from '../../components/dashboard/QuestList.vue'

const store = useAppStore()
const { quests } = storeToRefs(store)
</script>

<style scoped>
.populated-state {
  display: flex;
  flex-direction: column;
}
</style>
