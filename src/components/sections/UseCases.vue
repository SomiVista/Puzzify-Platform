<script setup>
/**
 * @file UseCases.vue
 * @description Tag list of use cases.
 */
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '../../stores/useAppStore'
import { useI18n } from 'vue-i18n'

const store = useAppStore()
const { tm } = useI18n()
const ucAccents = ['var(--pz-primary)','var(--pz-secondary)','var(--pz-accent)','var(--pz-secondary)','var(--pz-primary)','var(--pz-accent)']
const uc = computed(() => tm('uc').map((u,i) => ({ label:u, dot:ucAccents[i % ucAccents.length] })))
</script>

<template>
  <section id="uses" style="max-width:1180px; margin:0 auto; padding:clamp(56px,8vw,96px) clamp(16px,4vw,26px);">
    <div style="max-width:42ch; margin-bottom:clamp(32px,5vw,48px);">
      <span style="font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:.16em; color:var(--pz-secondary);">{{ $t('ucKicker') }}</span>
      <h2 style="margin:10px 0 12px; font-family:var(--pz-font-display); font-weight:800; font-size:clamp(28px,4vw,44px); line-height:1.05; letter-spacing:-.02em; color:var(--pz-text); text-wrap:balance;">{{ $t('ucTitle') }}</h2>
      <p style="margin:0; font-size:clamp(15px,1.5vw,17px); line-height:1.55; color:var(--pz-muted);">{{ $t('ucSub') }}</p>
    </div>
    <div style="display:flex; flex-wrap:wrap; gap:12px;">
      <span v-for="(u, index) in uc" :key="index" style="display:inline-flex; align-items:center; gap:10px; padding:13px 20px; background:var(--pz-surface); border:1px solid var(--pz-border); border-radius:var(--pz-r-full); box-shadow:var(--pz-e-1); font-family:var(--pz-font-display); font-weight:700; font-size:clamp(15px,1.6vw,18px); color:var(--pz-text);">
        <span style="width:10px; height:10px; border-radius:3px;" :style="{ background: u.dot }"></span>{{ u.label }}
      </span>
    </div>
  </section>
</template>
