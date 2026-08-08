<script setup>
/**
 * @file WhySection.vue
 * @description Value propositions block.
 */
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { tm } = useI18n()
const why = computed(() => tm('why').map(w => ({ t:w.t, d:w.d })))
</script>

<template>
  <section style="background:var(--color-surface); border-top:1px solid var(--color-hairline); border-bottom:1px solid var(--color-hairline);">
    <div style="max-width:1180px; margin:0 auto; padding:clamp(56px,8vw,96px) clamp(16px,4vw,26px);">
      <div style="max-width:42ch; margin-bottom:clamp(32px,5vw,48px);">
        <span style="font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:.16em; color:var(--color-secondary);">{{ $t('whyKicker') }}</span>
        <h2 style="margin:10px 0 12px; font-family:var(--font-display); font-weight:800; font-size:clamp(28px,4vw,44px); line-height:1.05; letter-spacing:-.02em; color:var(--color-text); text-wrap:balance;">{{ $t('whyTitle') }}</h2>
        <p style="margin:0; font-size:clamp(15px,1.5vw,17px); line-height:1.55; color:var(--color-muted);">{{ $t('whySub') }}</p>
      </div>
      <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(240px,1fr)); gap:18px;">
        <div v-for="(w, index) in why" :key="index" style="display:flex; flex-direction:column; gap:10px; background:var(--color-bg); border:1px solid var(--color-border); border-radius:var(--radius-lg); padding:24px; box-shadow:var(--shadow-1);">
          <span style="width:36px; height:36px; flex:none; border-radius:var(--radius-sm); background:var(--color-surface-2); display:flex; align-items:center; justify-content:center;">
            <span style="width:13px; height:13px; border-radius:4px; background:var(--color-primary);"></span>
          </span>
          <h3 style="margin:6px 0 0; font-family:var(--font-display); font-weight:700; font-size:18px; line-height:1.14; color:var(--color-text);">{{ w.t }}</h3>
          <p style="margin:0; font-size:13.5px; line-height:1.5; color:var(--color-muted);">{{ w.d }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
