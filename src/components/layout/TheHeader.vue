<script setup>
/**
 * @file TheHeader.vue
 * @description Site navigation, theme and language toggles.
 */
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '../../stores/useAppStore'

const store = useAppStore()
const { isMystery, lang } = storeToRefs(store)
const { setTheme, setLang } = store

const pillBase = 'padding:7px 15px; min-height:38px; border:none; border-radius:999px; font-family:var(--pz-font-ui); font-size:13px; font-weight:700; cursor:pointer; transition:all .2s;'
const pillOn = 'background:var(--pz-primary); color:var(--pz-on-primary);'
const pillOff = 'background:transparent; color:var(--pz-muted);'

const pillBirthday = computed(() => pillBase + (isMystery.value ? pillOff : pillOn))
const pillMystery = computed(() => pillBase + (isMystery.value ? pillOn : pillOff))

const isLangMenuOpen = ref(false)
const toggleLangMenu = () => { isLangMenuOpen.value = !isLangMenuOpen.value }
const closeLangMenu = () => { isLangMenuOpen.value = false }

const languages = [
  { code: 'en', name: 'English', short: 'EN' },
  { code: 'sv', name: 'Svenska', short: 'SV' },
  { code: 'es', name: 'Español', short: 'ES' },
  { code: 'fr', name: 'Français', short: 'FR' },
  { code: 'de', name: 'Deutsch', short: 'DE' },
  { code: 'pt', name: 'Português', short: 'PT' },
  { code: 'it', name: 'Italiano', short: 'IT' },  
  { code: 'fa', name: 'فارسی', short: 'FA' },
  { code: 'ar', name: 'العربية', short: 'AR' },
]

const currentLanguage = computed(() => languages.find(l => l.code === lang.value) || languages[0])

const selectLang = (code) => {
  setLang(code)
  closeLangMenu()
}
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
        <a href="#how" style="font-size:13.5px; font-weight:600; color:var(--pz-muted); text-decoration:none;">{{ $t('navHow') }}</a>
        <a href="#uses" style="font-size:13.5px; font-weight:600; color:var(--pz-muted); text-decoration:none;">{{ $t('navUses') }}</a>
        <a href="#partners" style="font-size:13.5px; font-weight:600; color:var(--pz-muted); text-decoration:none;">{{ $t('navPartners') }}</a>
        <a href="#pricing" style="font-size:13.5px; font-weight:600; color:var(--pz-muted); text-decoration:none;">{{ $t('navPricing') }}</a>
      </nav>
      <div style="display:flex; align-items:center; padding:4px; padding-inline-end:16px; background:var(--pz-surface); border:1px solid var(--pz-border); border-radius:var(--pz-r-full); box-shadow:var(--pz-e-1);">
        <div style="display:flex; background:var(--pz-surface-2); border-radius:var(--pz-r-full);">
          <button @click="setTheme('birthday')" :style="pillBirthday">{{ $t('themeBirthday') }}</button>
          <button @click="setTheme('mystery')" :style="pillMystery">{{ $t('themeMystery') }}</button>
        </div>
        <div style="width:1px; height:20px; background:var(--pz-border); margin:0 16px 0 12px;"></div>
        <div style="position:relative;" @focusout="setTimeout(closeLangMenu, 200)">
          <button @click="toggleLangMenu" aria-label="Language options" style="display:flex; align-items:center; gap:8px; padding:0; background:transparent; border:none; color:var(--pz-text); font-family:var(--pz-font-ui); font-size:14px; font-weight:700; cursor:pointer;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--pz-secondary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
            {{ currentLanguage.name }}
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style="margin-inline-start:2px; color:var(--pz-muted);" :style="{ transform: isLangMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }">
              <path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <div v-if="isLangMenuOpen" style="position:absolute; top:calc(100% + 12px); inset-inline-end:0; width:180px; background:var(--pz-surface); border:1px solid var(--pz-border); border-radius:var(--pz-r-md); padding:8px; box-shadow:var(--pz-e-2); display:flex; flex-direction:column; gap:4px; z-index:100;">
            <button v-for="l in languages" :key="l.code" @click="selectLang(l.code)" style="display:flex; align-items:center; justify-content:space-between; width:100%; padding:8px 12px; border:none; background:transparent; border-radius:var(--pz-r-sm); font-family:var(--pz-font-ui); font-size:14px; font-weight:600; color:var(--pz-text); cursor:pointer; text-align:start; transition:background .2s;" :style="{ background: l.code === currentLanguage.code ? 'var(--pz-surface-2)' : 'transparent' }" @mouseover="(e) => l.code !== currentLanguage.code && (e.currentTarget.style.background = 'color-mix(in srgb, var(--pz-surface-2) 40%, transparent)')" @mouseout="(e) => l.code !== currentLanguage.code && (e.currentTarget.style.background = 'transparent')">
              <span>{{ l.name }}</span>
              <span style="display:flex; align-items:center; gap:8px; font-size:12px; font-weight:700; color:var(--pz-muted);">
                {{ l.short }}
                <span v-if="l.code === currentLanguage.code" style="width:6px; height:6px; border-radius:50%; background:var(--pz-primary);"></span>
                <span v-else style="width:6px; height:6px; display:inline-block;"></span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>
