<template>
  <aside class="app-sidebar">
    <!-- Logo Lockup -->
    <div class="logo-lockup">
      <router-link to="/" class="logo-link">
        <span class="logo-icon">
          <span class="candle"></span>
        </span>
        <span class="logo-text">{{ APP_NAME }}</span>
      </router-link>
    </div>

    <!-- Workspace -->
    <div class="kicker">{{ t('dashboard.workspace') }}</div>
    <nav class="nav-menu">
      <router-link to="/dashboard/quests" class="nav-item">
        <LayoutGrid :size="18" /> {{ t('dashboard.nav.quests') }}
      </router-link>
      <router-link to="/dashboard/analytics" class="nav-item">
        <BarChart2 :size="18" /> {{ t('dashboard.nav.analytics') }}
      </router-link>
      <router-link to="/dashboard/presets" class="nav-item">
        <Star :size="18" /> {{ t('dashboard.nav.presets') }}
      </router-link>
      <router-link to="/dashboard/settings" class="nav-item">
        <Settings :size="18" /> {{ t('dashboard.nav.settings') }}
      </router-link>
    </nav>

    <!-- Upgrade Card -->
    <div v-if="planTier === 'free'" class="upgrade-card">
      <div class="upgrade-title">{{ t('dashboard.upgrade.title') }}</div>
      <div class="upgrade-body">{{ t('dashboard.upgrade.body') }}</div>
      <BaseButton variant="primary" size="sm" block class="upgrade-btn">{{ t('dashboard.upgrade.cta') }}</BaseButton>
    </div>

    <!-- User Row -->
    <router-link to="/dashboard/settings" class="user-row">
      <div class="avatar">{{ creatorInfo.initials }}</div>
      <div class="user-info">
        <div class="user-name">{{ creatorInfo.name }}</div>
        <div class="user-plan">{{ planLabel }}</div>
      </div>
    </router-link>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useAppStore } from '../../stores/useAppStore'
import { LayoutGrid, BarChart2, Star, Settings } from 'lucide-vue-next'
import BaseButton from '../ui/BaseButton.vue'
import { APP_NAME } from '../../config/app'

const { t } = useI18n()
const store = useAppStore()
const { planTier, creatorInfo } = storeToRefs(store)

const planLabel = computed(() => t(`dashboard.plans.${planTier.value}`))
</script>

<style scoped>
.app-sidebar {
  width: 250px;
  background: var(--color-surface);
  border-inline-end: 1px solid var(--color-hairline);
  padding: 22px 16px;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.logo-lockup {
  margin-bottom: 24px;
}
.logo-link {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}
.logo-icon {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: linear-gradient(140deg, var(--color-primary), var(--color-secondary));
  display: flex;
  align-items: center;
  justify-content: center;
}
.candle {
  width: 7px;
  height: 11px;
  border-radius: 99px 99px 4px 4px;
  background: var(--color-on-primary);
}
.logo-text {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--color-text);
}

.kicker {
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.13em;
  text-transform: uppercase;
  color: var(--color-muted);
  margin-bottom: 12px;
  padding: 0 12px;
}

.nav-menu {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.nav-item {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 11px 12px;
  border-radius: 12px;
  font-size: 14px;
  text-decoration: none;
  font-weight: 600;
  color: var(--color-muted);
  transition: all var(--duration) var(--ease);
}
.nav-item.router-link-active {
  background: var(--color-surface-2);
  color: var(--color-primary);
  font-weight: 700;
}
.nav-item:focus-visible { outline: none; box-shadow: 0 0 0 4px var(--color-ring); }

.upgrade-card {
  margin-top: auto;
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 15px;
  background: radial-gradient(140% 140% at 100% 0%, var(--color-surface-3), var(--color-surface-2));
  margin-bottom: 16px;
}
.upgrade-title {
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 800;
  margin-bottom: 4px;
}
.upgrade-body {
  font-size: 12px;
  color: var(--color-muted);
  margin-bottom: 12px;
  line-height: 1.4;
}

.user-row {
  margin-top: auto;
  border-top: 1px solid var(--color-hairline);
  padding-top: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  transition: opacity var(--duration) var(--ease);
}
.user-row:hover {
  opacity: 0.8;
}
.user-row:focus-visible { outline: none; box-shadow: 0 0 0 4px var(--color-ring); border-radius: var(--radius-md); }
.upgrade-card + .user-row {
  margin-top: 0;
}
.avatar {
  width: 38px;
  height: 38px;
  border-radius: var(--radius-full);
  background: var(--color-surface-2);
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
}
.user-name {
  font-size: 13.5px;
  font-weight: 700;
}
.user-plan {
  font-size: 11.5px;
  color: var(--color-muted);
}

/* On phones the rail becomes a compact top bar: logo and avatar on one line,
   the workspace nav scrolling horizontally beneath it. */
@media (max-width: 900px) {
  .app-sidebar {
    width: 100%;
    display: grid;
    grid-template-columns: auto 1fr auto;
    grid-template-areas:
      'logo . user'
      'nav nav nav'
      'upgrade upgrade upgrade';
    align-items: center;
    column-gap: 12px;
    row-gap: 12px;
    padding: 14px 16px;
    border-inline-end: none;
    border-block-end: 1px solid var(--color-hairline);
  }
  .logo-lockup {
    grid-area: logo;
    margin-bottom: 0;
  }
  .kicker {
    display: none;
  }
  .nav-menu {
    grid-area: nav;
    flex-direction: row;
    gap: 6px;
    overflow-x: auto;
    scrollbar-width: none;
    /* Bleed to the edges so the scroll affordance reaches the screen border. */
    margin-inline: -16px;
    padding-inline: 16px;
  }
  .nav-menu::-webkit-scrollbar {
    display: none;
  }
  .nav-item {
    flex: none;
    white-space: nowrap;
    min-height: 44px;
  }
  .upgrade-card {
    grid-area: upgrade;
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 0;
    padding: 10px 14px;
  }
  .upgrade-title {
    flex: 1;
    margin-bottom: 0;
  }
  .upgrade-body {
    display: none;
  }
  .upgrade-card .upgrade-btn {
    width: auto;
    flex: none;
  }
  .user-row {
    grid-area: user;
    margin-top: 0;
    border-top: none;
    padding-top: 0;
  }
  /* Avatar alone — the name and plan live in Settings anyway. */
  .user-info {
    display: none;
  }
}
</style>
