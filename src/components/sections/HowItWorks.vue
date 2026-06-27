<script setup>
/**
 * @file HowItWorks.vue
 * @description Three steps explaining the product.
 */
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '../../stores/useAppStore'

const store = useAppStore()
const { t, isFa } = storeToRefs(store)

const howCardBase = 'position:relative; background:var(--pz-surface); border:1px solid var(--pz-border); border-radius:var(--pz-r-lg); padding:26px; box-shadow:var(--pz-e-1);'
const how = computed(() => t.value.how.map((h,i) => ({ n: isFa.value ? ['۱','۲','۳'][i] : String(i+1), t:h.t, d:h.d, style:howCardBase })))
</script>

<template>
  <section id="how" style="max-width:1180px; margin:0 auto; padding:clamp(56px,8vw,96px) clamp(16px,4vw,26px);">
    <div style="max-width:42ch; margin-bottom:clamp(32px,5vw,48px);">
      <span style="font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:.16em; color:var(--pz-secondary);">{{ t.howKicker }}</span>
      <h2 style="margin:10px 0 12px; font-family:var(--pz-font-display); font-weight:800; font-size:clamp(28px,4vw,44px); line-height:1.05; letter-spacing:-.02em; color:var(--pz-text); text-wrap:balance;">{{ t.howTitle }}</h2>
      <p style="margin:0; font-size:clamp(15px,1.5vw,17px); line-height:1.55; color:var(--pz-muted);">{{ t.howSub }}</p>
    </div>
    <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:18px;">
      <div v-for="(h, index) in how" :key="index" :style="h.style">
        <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
          <span style="width:42px; height:42px; flex:none; border-radius:var(--pz-r-md); background:var(--pz-surface-2); color:var(--pz-primary); display:flex; align-items:center; justify-content:center; font-family:var(--pz-font-display); font-weight:800; font-size:18px;">{{ h.n }}</span>
          <span style="font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.12em; color:var(--pz-muted);">{{ t.howStepLabel }} {{ h.n }}</span>
        </div>
        <h3 style="margin:0 0 8px; font-family:var(--pz-font-display); font-weight:700; font-size:21px; line-height:1.1; color:var(--pz-text);">{{ h.t }}</h3>
        <p style="margin:0; font-size:14px; line-height:1.5; color:var(--pz-muted);">{{ h.d }}</p>
      </div>
    </div>
  </section>
</template>
