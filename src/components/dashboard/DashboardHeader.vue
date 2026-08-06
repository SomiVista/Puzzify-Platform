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
      <IconButton :label="t('dashboard.header.notifications')" :size="44">
        <Bell :size="20" />
      </IconButton>
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
import IconButton from '../ui/IconButton.vue'

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
.search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}
.search-icon {
  position: absolute;
  inset-inline-start: 14px;
  color: var(--pz-muted);
  pointer-events: none;
}
.search-input {
  width: 240px;
  height: 44px;
  padding-inline: 40px 16px;
  border-radius: var(--pz-r-full);
  border: 1px solid var(--pz-border);
  background: var(--pz-surface);
  color: var(--pz-text);
  font-family: var(--pz-font-ui);
  font-size: 14px;
  transition: all .2s;
  outline: none;
}
.search-input::placeholder {
  color: var(--pz-muted);
}
.search-input:focus {
  border-color: var(--pz-focus);
  box-shadow: 0 0 0 4px var(--pz-ring);
}
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
  transition: transform .15s, box-shadow .15s, filter .2s;
}
.avatar:hover {
  filter: brightness(0.95);
  box-shadow: var(--pz-e-1);
}
.avatar:focus-visible { outline: none; box-shadow: 0 0 0 4px var(--pz-ring); }

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
