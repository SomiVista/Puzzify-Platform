<script setup>
/**
 * @file PricingSection.vue
 * @description Subscription and single purchase tiers.
 */
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '../../stores/useAppStore'

const store = useAppStore()
const { t } = storeToRefs(store)

const tierCard = 'display:flex; flex-direction:column; background:var(--pz-surface); border:1px solid var(--pz-border); border-radius:var(--pz-r-xl); padding:28px; box-shadow:var(--pz-e-1);'
const tierCardRec = 'display:flex; flex-direction:column; background:var(--pz-surface); border:2px solid var(--pz-primary); border-radius:var(--pz-r-xl); padding:28px; box-shadow:var(--pz-e-2); position:relative;'
const ctaPrimary = 'display:inline-flex; align-items:center; justify-content:center; width:100%; padding:14px; min-height:44px; background:var(--pz-primary); color:var(--pz-on-primary); border:none; border-radius:var(--pz-r-md); font-family:var(--pz-font-ui); font-weight:700; font-size:14.5px; cursor:pointer; text-decoration:none;'
const ctaSecondary = 'display:inline-flex; align-items:center; justify-content:center; width:100%; padding:14px; min-height:44px; background:var(--pz-surface-2); color:var(--pz-primary); border:1px solid var(--pz-border); border-radius:var(--pz-r-md); font-family:var(--pz-font-ui); font-weight:700; font-size:14.5px; cursor:pointer; text-decoration:none;'

const pricing = computed(() => t.value.pricing.map(p => ({
  name:p.name, price:p.price, period:p.period, tagline:p.tagline, cta:p.cta, rec:!!p.rec,
  features:p.features,
  cardStyle: p.rec ? tierCardRec : tierCard,
  ctaStyle: p.rec ? ctaPrimary : ctaSecondary,
})))
</script>

<template>
  <section id="pricing" style="max-width:1180px; margin:0 auto; padding:clamp(56px,8vw,96px) clamp(16px,4vw,26px);">
    <div style="max-width:42ch; margin-bottom:clamp(32px,5vw,48px);">
      <span style="font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:.16em; color:var(--pz-secondary);">{{ t.prKicker }}</span>
      <h2 style="margin:10px 0 12px; font-family:var(--pz-font-display); font-weight:800; font-size:clamp(28px,4vw,44px); line-height:1.05; letter-spacing:-.02em; color:var(--pz-text); text-wrap:balance;">{{ t.prTitle }}</h2>
      <p style="margin:0; font-size:clamp(15px,1.5vw,17px); line-height:1.55; color:var(--pz-muted);">{{ t.prSub }}</p>
    </div>
    <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); gap:18px; align-items:start;">
      <div v-for="(tier, index) in pricing" :key="index" :style="tier.cardStyle">
        <span v-if="tier.rec" style="position:absolute; top:-13px; inset-inline-start:28px; font-size:10.5px; font-weight:700; text-transform:uppercase; letter-spacing:.1em; color:var(--pz-on-primary); background:var(--pz-primary); padding:6px 13px; border-radius:var(--pz-r-full); box-shadow:var(--pz-e-1);">{{ t.recommended }}</span>
        <h3 style="margin:0 0 4px; font-family:var(--pz-font-display); font-weight:700; font-size:19px; color:var(--pz-text);">{{ tier.name }}</h3>
        <p style="margin:0 0 18px; font-size:13px; line-height:1.4; color:var(--pz-muted);">{{ tier.tagline }}</p>
        <div style="display:flex; align-items:baseline; gap:8px; margin-bottom:6px;">
          <span style="font-family:var(--pz-font-display); font-weight:800; font-size:clamp(34px,4vw,42px); line-height:1; letter-spacing:-.02em; color:var(--pz-text);">{{ tier.price }}</span>
        </div>
        <span style="display:block; font-size:12.5px; font-weight:600; color:var(--pz-muted); margin-bottom:20px;">{{ tier.period }}</span>
        <a href="#top" :style="tier.ctaStyle">{{ tier.cta }}</a>
        <div style="height:1px; background:var(--pz-hairline); margin:22px 0;"></div>
        <ul style="list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:11px;">
          <li v-for="(f, i) in tier.features" :key="i" style="display:flex; align-items:flex-start; gap:10px; font-size:13.5px; line-height:1.4; color:var(--pz-text);">
            <span style="flex:none; width:18px; height:18px; margin-top:1px; border-radius:50%; background:var(--pz-surface-2); display:flex; align-items:center; justify-content:center;">
              <span style="width:7px; height:4px; border-inline-start:2px solid var(--pz-success); border-bottom:2px solid var(--pz-success); transform:rotate(-45deg); margin-top:-2px;"></span>
            </span>{{ f }}
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
