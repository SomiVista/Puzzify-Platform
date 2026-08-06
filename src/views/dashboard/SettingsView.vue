<template>
  <div class="placeholder-view">
    <p>{{ t('dashboard.soon.settings') }}</p>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style scoped>
.placeholder-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--pz-muted);
}
</style>
