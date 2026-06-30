<template>
  <div class="dashboard-layout">
    <Sidebar />
    <div class="main-column">
      <DashboardHeader />
      <router-view class="main-content" />
    </div>
  </div>
</template>

<script setup>
import Sidebar from '../components/dashboard/Sidebar.vue'
import DashboardHeader from '../components/dashboard/DashboardHeader.vue'
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  height: 100vh;
  width: 100vw;
  background: var(--pz-surface);
  overflow: hidden;
}
.main-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: radial-gradient(120% 90% at 88% -12%, var(--pz-surface-2), var(--pz-bg) 56%);
  overflow: hidden;
}
.main-content {
  flex: 1;
  overflow-y: auto;
}
</style>
