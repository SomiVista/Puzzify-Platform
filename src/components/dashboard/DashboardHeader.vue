<template>
  <header class="main-header">
    <h1>{{ pageTitle }}</h1>
    <div class="header-actions">
      <div class="search-wrapper">
        <Search class="search-icon" :size="16" />
        <input 
          type="text" 
          class="search-input" 
          :placeholder="t('dashboard.header.searchPlaceholder')"
          
          v-model="searchQuery"
          :aria-label="t('dashboard.header.searchLabel')"
        />
      </div>
      <BaseIconButton :label="t('dashboard.header.notifications')" :size="44">
        <Bell :size="20" />
      </BaseIconButton>
      <router-link to="/dashboard/settings" class="avatar" :aria-label="t('dashboard.header.userSettings')">
        {{ creatorInfo.initials }}
      </router-link>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useAppStore } from '../../stores/useAppStore'
import { Bell, Search } from 'lucide-vue-next'
import BaseIconButton from '../ui/BaseIconButton.vue'

const { t } = useI18n()
const route = useRoute()
const store = useAppStore()
const { creatorInfo, searchQuery } = storeToRefs(store)

const pageTitle = computed(() =>
  route.meta?.titleKey ? t(route.meta.titleKey) : t('dashboard.titles.quests')
)
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
  font-family: var(--font-display);
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.025em;
  margin: 0;
  color: var(--color-text);
}
.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}
.search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}
.search-icon {
  position: absolute;
  inset-inline-start: 14px;
  color: var(--color-muted);
  pointer-events: none;
}
.search-input {
  width: 240px;
  height: 44px;
  padding-inline: 40px 16px;
  border-radius: var(--radius-full);
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text);
  font-family: var(--font-ui);
  font-size: 14px;
  transition: all .2s;
  outline: none;
}
.search-input::placeholder {
  color: var(--color-muted);
}
.search-input:focus {
  border-color: var(--color-focus);
  box-shadow: 0 0 0 4px var(--color-ring);
}
.avatar {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-full);
  background: linear-gradient(140deg, var(--color-surface-2), var(--color-surface));
  border: 1px solid var(--color-border);
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 15px;
  text-decoration: none;
  cursor: pointer;
  transition: transform .15s, box-shadow .15s, filter .2s;
}
.avatar:hover {
  filter: brightness(0.95);
  box-shadow: var(--shadow-1);
}
.avatar:focus-visible { outline: none; box-shadow: 0 0 0 4px var(--color-ring); }

@media (max-width: 900px) {
  .main-header {
    flex-wrap: wrap;
    gap: 12px;
    padding: 18px 16px 12px;
  }
  .main-header h1 {
    font-size: 20px;
  }
  /* Search takes the full second line rather than fighting the title for room. */
  .header-actions {
    width: 100%;
    gap: 10px;
  }
  .search-wrapper {
    flex: 1;
    min-width: 0;
  }
  .search-input {
    width: 100%;
  }
  /* The sidebar collapses into a top bar that already shows the avatar. */
  .avatar {
    display: none;
  }
}
</style>
