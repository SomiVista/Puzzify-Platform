<script setup>
/**
 * @file WhyPuzzify.vue
 * @description Value propositions block.
 */
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '../../stores/useAppStore'

const store = useAppStore()
const { t } = storeToRefs(store)

const why = computed(() => t.value.why.map(w => ({ t:w.t, d:w.d })))
</script>

<template>
  <section style="background:var(--pz-surface); border-top:1px solid var(--pz-hairline); border-bottom:1px solid var(--pz-hairline);">
    <div style="max-width:1180px; margin:0 auto; padding:clamp(56px,8vw,96px) clamp(16px,4vw,26px);">
      <div style="max-width:42ch; margin-bottom:clamp(32px,5vw,48px);">
        <span style="font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:.16em; color:var(--pz-secondary);">{{ t.whyKicker }}</span>
        <h2 style="margin:10px 0 12px; font-family:var(--pz-font-display); font-weight:800; font-size:clamp(28px,4vw,44px); line-height:1.05; letter-spacing:-.02em; color:var(--pz-text); text-wrap:balance;">{{ t.whyTitle }}</h2>
        <p style="margin:0; font-size:clamp(15px,1.5vw,17px); line-height:1.55; color:var(--pz-muted);">{{ t.whySub }}</p>
      </div>
      <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(240px,1fr)); gap:18px;">
        <div v-for="(w, index) in why" :key="index" style="display:flex; flex-direction:column; gap:10px; background:var(--pz-bg); border:1px solid var(--pz-border); border-radius:var(--pz-r-lg); padding:24px; box-shadow:var(--pz-e-1);">
          <span style="width:36px; height:36px; flex:none; border-radius:var(--pz-r-sm); background:var(--pz-surface-2); display:flex; align-items:center; justify-content:center;">
            <span style="width:13px; height:13px; border-radius:4px; background:var(--pz-primary);"></span>
          </span>
          <h3 style="margin:6px 0 0; font-family:var(--pz-font-display); font-weight:700; font-size:18px; line-height:1.14; color:var(--pz-text);">{{ w.t }}</h3>
          <p style="margin:0; font-size:13.5px; line-height:1.5; color:var(--pz-muted);">{{ w.d }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
