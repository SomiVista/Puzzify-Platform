<template>
  <aside class="pz-sidebar">
    <!-- Logo Lockup -->
    <div class="logo-lockup">
      <router-link to="/" class="logo-link">
        <span class="logo-icon">
          <span class="candle"></span>
        </span>
        <span class="logo-text">Puzzify</span>
      </router-link>
    </div>

    <!-- Workspace -->
    <div class="kicker">WORKSPACE</div>
    <nav class="nav-menu">
      <router-link to="/dashboard/quests" class="nav-item">
        <LayoutGrid :size="18" /> Quests
      </router-link>
      <router-link to="/dashboard/analytics" class="nav-item">
        <BarChart2 :size="18" /> Analytics
      </router-link>
      <router-link to="/dashboard/presets" class="nav-item">
        <Star :size="18" /> Presets
      </router-link>
      <router-link to="/dashboard/settings" class="nav-item">
        <Settings :size="18" /> Settings
      </router-link>
    </nav>

    <!-- Upgrade Card -->
    <div v-if="planTier === 'free'" class="upgrade-card">
      <div class="upgrade-title">You're on Free</div>
      <div class="upgrade-body">Get advanced features and more quests.</div>
      <PzButton variant="primary" size="sm" block class="upgrade-btn">Upgrade a gift</PzButton>
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
import { storeToRefs } from 'pinia'
import { useAppStore } from '../../stores/useAppStore'
import { LayoutGrid, BarChart2, Star, Settings } from 'lucide-vue-next'
import PzButton from '../ui/PzButton.vue'

const store = useAppStore()
const { planTier, creatorInfo } = storeToRefs(store)

const planLabel = computed(() => {
  if (planTier.value === 'free') return 'Free plan'
  if (planTier.value === 'premium') return 'Premium'
  return 'Corporate workspace'
})
</script>

<style scoped>
.pz-sidebar {
  width: 250px;
  background: var(--pz-surface);
  border-inline-end: 1px solid var(--pz-hairline);
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
  background: linear-gradient(140deg, var(--pz-primary), var(--pz-secondary));
  display: flex;
  align-items: center;
  justify-content: center;
}
.candle {
  width: 7px;
  height: 11px;
  border-radius: 99px 99px 4px 4px;
  background: var(--pz-on-primary);
}
.logo-text {
  font-family: var(--pz-font-display);
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--pz-text);
}

.kicker {
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.13em;
  text-transform: uppercase;
  color: var(--pz-muted);
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
  color: var(--pz-muted);
  transition: all var(--pz-dur) var(--pz-ease);
}
.nav-item.router-link-active {
  background: var(--pz-surface-2);
  color: var(--pz-primary);
  font-weight: 700;
}
.nav-item:focus-visible { outline: none; box-shadow: 0 0 0 4px var(--pz-ring); }

.upgrade-card {
  margin-top: auto;
  border: 1px solid var(--pz-border);
  border-radius: 16px;
  padding: 15px;
  background: radial-gradient(140% 140% at 100% 0%, var(--pz-surface-3), var(--pz-surface-2));
  margin-bottom: 16px;
}
.upgrade-title {
  font-family: var(--pz-font-display);
  font-size: 14px;
  font-weight: 800;
  margin-bottom: 4px;
}
.upgrade-body {
  font-size: 12px;
  color: var(--pz-muted);
  margin-bottom: 12px;
  line-height: 1.4;
}

.user-row {
  margin-top: auto;
  border-top: 1px solid var(--pz-hairline);
  padding-top: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  transition: opacity var(--pz-dur) var(--pz-ease);
}
.user-row:hover {
  opacity: 0.8;
}
.user-row:focus-visible { outline: none; box-shadow: 0 0 0 4px var(--pz-ring); border-radius: var(--pz-r-md); }
.upgrade-card + .user-row {
  margin-top: 0;
}
.avatar {
  width: 38px;
  height: 38px;
  border-radius: var(--pz-r-full);
  background: var(--pz-surface-2);
  color: var(--pz-primary);
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
  color: var(--pz-muted);
}
</style>
