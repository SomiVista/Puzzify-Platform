<script setup>
/**
 * @file TheHeader.vue
 * @description Site navigation, theme and language toggles.
 */
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '../../stores/useAppStore'

const store = useAppStore()
const { t, isMystery, lang } = storeToRefs(store)
const { setTheme, toggleLang } = store

const pillBase = 'padding:7px 15px; min-height:38px; border:none; border-radius:999px; font-family:var(--pz-font-ui); font-size:13px; font-weight:700; cursor:pointer; transition:all .2s;'
const pillOn = 'background:var(--pz-primary); color:var(--pz-on-primary);'
const pillOff = 'background:transparent; color:var(--pz-muted);'

const pillBirthday = computed(() => pillBase + (isMystery.value ? pillOff : pillOn))
const pillMystery = computed(() => pillBase + (isMystery.value ? pillOn : pillOff))
const langButton = computed(() => lang.value === 'fa' ? 'فارسی → EN' : 'EN → فارسی')
</script>

<template>
  <header style="position:sticky; top:0; z-index:60; background:color-mix(in srgb, var(--pz-bg) 86%, transparent); backdrop-filter:blur(14px); border-bottom:1px solid var(--pz-hairline);">
    <nav style="max-width:1180px; margin:0 auto; display:flex; align-items:center; gap:16px; flex-wrap:wrap; padding:13px clamp(16px,4vw,26px);">
      <a href="#top" style="display:flex; align-items:center; gap:10px; text-decoration:none; margin-inline-end:auto;">
        <span style="width:32px; height:32px; border-radius:10px; background:linear-gradient(140deg, var(--pz-primary), var(--pz-secondary)); display:flex; align-items:center; justify-content:center; box-shadow:var(--pz-e-1);">
          <span style="width:8px; height:12px; border-radius:99px 99px 4px 4px; background:var(--pz-on-primary);"></span>
        </span>
        <span style="font-family:var(--pz-font-display); font-weight:800; font-size:19px; letter-spacing:-.02em; color:var(--pz-text);">Puzzify</span>
      </a>
      <nav style="display:flex; align-items:center; gap:clamp(10px,2vw,22px); flex-wrap:wrap;">
        <a href="#how" style="font-size:13.5px; font-weight:600; color:var(--pz-muted); text-decoration:none;">{{ t.navHow }}</a>
        <a href="#uses" style="font-size:13.5px; font-weight:600; color:var(--pz-muted); text-decoration:none;">{{ t.navUses }}</a>
        <a href="#partners" style="font-size:13.5px; font-weight:600; color:var(--pz-muted); text-decoration:none;">{{ t.navPartners }}</a>
        <a href="#pricing" style="font-size:13.5px; font-weight:600; color:var(--pz-muted); text-decoration:none;">{{ t.navPricing }}</a>
      </nav>
      <div style="display:flex; padding:3px; background:var(--pz-surface-2); border:1px solid var(--pz-border); border-radius:var(--pz-r-full); gap:2px;">
        <button @click="setTheme('birthday')" :style="pillBirthday">{{ t.themeBirthday }}</button>
        <button @click="setTheme('mystery')" :style="pillMystery">{{ t.themeMystery }}</button>
      </div>
      <button @click="toggleLang" aria-label="Toggle language" style="display:flex; align-items:center; gap:7px; padding:8px 13px; background:var(--pz-surface); border:1px solid var(--pz-border); border-radius:var(--pz-r-full); color:var(--pz-text); font-family:var(--pz-font-ui); font-size:12.5px; font-weight:700; cursor:pointer; box-shadow:var(--pz-e-1);">{{ langButton }}</button>
      <a href="#pricing" style="padding:10px 18px; background:var(--pz-primary); color:var(--pz-on-primary); border-radius:var(--pz-r-full); font-family:var(--pz-font-ui); font-weight:700; font-size:13.5px; text-decoration:none; box-shadow:var(--pz-e-1); min-height:44px; display:inline-flex; align-items:center;">{{ t.navCta }}</a>
    </nav>
  </header>
</template>
