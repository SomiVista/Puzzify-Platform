<template>
  <header class="main-header">
    <h1>{{ pageTitle }}</h1>
    <div class="header-actions">
      <button class="icon-btn" aria-label="Notifications">
        <Bell :size="20" />
      </button>
      <router-link to="/dashboard/settings" class="avatar" aria-label="User settings">
        {{ creatorInfo.initials }}
      </router-link>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAppStore } from '../../stores/useAppStore'
import { Bell } from 'lucide-vue-next'

const route = useRoute()
const store = useAppStore()
const { creatorInfo } = storeToRefs(store)

const pageTitle = computed(() => route.meta?.title || 'Dashboard')
</script>

<style scoped>
.main-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 26px 30px 16px;
  background: transparent;
  flex-shrink: 0;
}
.main-header h1 {
  font-family: var(--pz-font-display);
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.025em;
  margin: 0;
  color: var(--pz-text);
}
.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}
.icon-btn {
  width: 44px;
  height: 44px;
  border-radius: 13px;
  border: 1px solid var(--pz-border);
  background: var(--pz-surface);
  color: var(--pz-text);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--pz-dur) var(--pz-ease);
}
.icon-btn:focus-visible { outline: none; box-shadow: 0 0 0 4px var(--pz-ring); }
.avatar {
  width: 44px;
  height: 44px;
  border-radius: var(--pz-r-full);
  background: linear-gradient(140deg, var(--pz-surface-2), var(--pz-surface));
  border: 1px solid var(--pz-border);
  color: var(--pz-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 15px;
  text-decoration: none;
  cursor: pointer;
  transition: all var(--pz-dur) var(--pz-ease);
}
.avatar:hover {
  filter: brightness(0.95);
  box-shadow: var(--pz-e-1);
}
.avatar:focus-visible { outline: none; box-shadow: 0 0 0 4px var(--pz-ring); }
</style>
