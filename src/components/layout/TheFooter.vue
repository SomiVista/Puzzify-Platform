<script setup>
/**
 * @file TheFooter.vue
 * @description Standard footer with links and language selection.
 */
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '../../stores/useAppStore'

const store = useAppStore()
const { t, isFa } = storeToRefs(store)
const { setLang } = store

const footCols = computed(() => t.value.footCols.map(c => ({ h:c.h, links:c.links })))
const langEnStyle = computed(() => !isFa.value ? 'font-weight:700; color:var(--pz-primary);' : 'font-weight:600; color:var(--pz-muted);')
const langFaStyle = computed(() => isFa.value ? 'font-weight:700; color:var(--pz-primary);' : 'font-weight:600; color:var(--pz-muted);')
</script>

<template>
  <footer style="background:var(--pz-surface); border-top:1px solid var(--pz-hairline);">
    <div style="max-width:1180px; margin:0 auto; padding:clamp(48px,6vw,72px) clamp(16px,4vw,26px);">
      <div style="display:flex; gap:clamp(28px,5vw,64px); flex-wrap:wrap; margin-bottom:48px;">
        <div style="flex:1 1 280px; min-width:240px;">
          <a href="#top" style="display:flex; align-items:center; gap:10px; text-decoration:none; margin-bottom:16px;">
            <span style="width:32px; height:32px; border-radius:10px; background:linear-gradient(140deg, var(--pz-primary), var(--pz-secondary)); display:flex; align-items:center; justify-content:center; box-shadow:var(--pz-e-1);">
              <span style="width:8px; height:12px; border-radius:99px 99px 4px 4px; background:var(--pz-on-primary);"></span>
            </span>
            <span style="font-family:var(--pz-font-display); font-weight:800; font-size:19px; letter-spacing:-.02em; color:var(--pz-text);">Puzzify</span>
          </a>
          <p style="margin:0; max-width:30ch; font-size:14px; line-height:1.55; color:var(--pz-muted);">{{ t.footTagline }}</p>
        </div>
        <div v-for="(col, index) in footCols" :key="index" style="flex:0 1 150px; min-width:130px;">
          <h4 style="margin:0 0 14px; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.12em; color:var(--pz-text);">{{ col.h }}</h4>
          <ul style="list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:10px;">
            <li v-for="(lnk, i) in col.links" :key="i"><a href="#top" style="font-size:13.5px; color:var(--pz-muted); text-decoration:none;">{{ lnk }}</a></li>
          </ul>
        </div>
      </div>
      <div style="display:flex; align-items:center; justify-content:space-between; gap:16px; flex-wrap:wrap; padding-top:24px; border-top:1px solid var(--pz-hairline);">
        <span style="font-size:13px; color:var(--pz-muted);">{{ t.footLegal }}</span>
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="font-size:12.5px; font-weight:700; color:var(--pz-text);">{{ t.footLang }}:</span>
          <button @click="setLang('en')" style="background:transparent; border:none; padding:4px 8px; cursor:pointer; font-family:var(--pz-font-ui); font-size:12.5px;" :style="langEnStyle">EN</button>
          <span style="color:var(--pz-border);">|</span>
          <button @click="setLang('fa')" style="background:transparent; border:none; padding:4px 8px; cursor:pointer; font-family:'Vazirmatn',sans-serif; font-size:12.5px;" :style="langFaStyle">فارسی</button>
        </div>
      </div>
    </div>
  </footer>
</template>
