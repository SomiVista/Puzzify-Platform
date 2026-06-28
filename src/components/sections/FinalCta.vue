<script setup>
/**
 * @file FinalCta.vue
 * @description Final call to action section.
 */
import { storeToRefs } from 'pinia'
import { useAppStore } from '../../stores/useAppStore'

const store = useAppStore()
</script>

<template>
  <section style="position:relative; overflow:hidden; background:radial-gradient(120% 120% at 50% -20%, var(--pz-surface-2), var(--pz-bg) 65%); border-top:1px solid var(--pz-hairline);">
    <div style="position:relative; max-width:760px; margin:0 auto; padding:clamp(56px,8vw,104px) clamp(16px,4vw,26px); text-align:center;">
      <span style="font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:.16em; color:var(--pz-secondary);">{{ $t('finalKicker') }}</span>
      <h2 style="margin:14px 0 14px; font-family:var(--pz-font-display); font-weight:800; font-size:clamp(30px,4.6vw,52px); line-height:1.04; letter-spacing:-.025em; color:var(--pz-text); text-wrap:balance;">{{ $t('finalLine') }}</h2>
      <p style="margin:0 auto 30px; max-width:46ch; font-size:clamp(15px,1.6vw,18px); line-height:1.55; color:var(--pz-muted);">{{ $t('finalSub') }}</p>
      <a href="#top" style="display:inline-flex; align-items:center; justify-content:center; padding:16px 30px; min-height:44px; background:var(--pz-primary); color:var(--pz-on-primary); border-radius:var(--pz-r-md); font-family:var(--pz-font-ui); font-weight:700; font-size:16px; text-decoration:none; box-shadow:var(--pz-e-2);">{{ $t('finalCta') }}</a>
    </div>
  </section>
</template>
