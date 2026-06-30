<template>
  <EmptyState v-if="quests.length === 0" />
  <div v-else class="populated-state">
    <!-- Populated State to be implemented -->
    Populated State
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useAppStore } from '../../stores/useAppStore'
import EmptyState from '../../components/dashboard/EmptyState.vue'

const store = useAppStore()
const { quests } = storeToRefs(store)
</script>
