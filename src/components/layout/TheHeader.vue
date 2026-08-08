<script setup>
/**
 * @file TheHeader.vue
 * @description Site navigation, theme and language toggles.
 */
import { computed, ref, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useAppStore } from '../../stores/useAppStore'
import { APP_NAME } from '../../config/app'

const store = useAppStore()
const router = useRouter()
const { theme, lang } = storeToRefs(store)
const { setTheme, setLang } = store

// min-height 44px is the design-system floor for hit targets (design.md §2.2).
const pillBase = 'padding:7px 15px; min-height:44px; border:none; border-radius:999px; font-family:var(--font-ui); font-size:13px; font-weight:700; cursor:pointer; transition:all .2s;'
const pillOn = 'background:var(--color-primary); color:var(--color-on-primary);'
const pillOff = 'background:transparent; color:var(--color-muted);'

const getPillStyle = (t) => pillBase + (theme.value === t ? pillOn : pillOff)

const isLangMenuOpen = ref(false)
const toggleLangMenu = () => { isLangMenuOpen.value = !isLangMenuOpen.value }
const closeLangMenu = () => { isLangMenuOpen.value = false }

/* Focus leaving the menu closes it, but on a short delay: some browsers do not
   focus a <button> on mousedown, so closing synchronously would unmount the
   option before its click lands. `setTimeout` has to be resolved HERE — an
   expression in the template compiles to `_ctx.setTimeout`, which does not
   exist on the component instance and throws. */
let closeTimer = null
const scheduleCloseLangMenu = () => {
  clearTimeout(closeTimer)
  closeTimer = setTimeout(closeLangMenu, 200)
}
const cancelCloseLangMenu = () => clearTimeout(closeTimer)
onBeforeUnmount(cancelCloseLangMenu)

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
  <header style="position:sticky; top:0; z-index:60; background:color-mix(in srgb, var(--color-bg) 86%, transparent); backdrop-filter:blur(14px); border-bottom:1px solid var(--color-hairline);">
    <nav style="max-width:1180px; margin:0 auto; display:flex; align-items:center; gap:16px; flex-wrap:wrap; padding:13px clamp(16px,4vw,26px);">
      <a href="#top" style="display:flex; align-items:center; gap:10px; text-decoration:none; margin-inline-end:auto;">
        <span style="width:32px; height:32px; border-radius:10px; background:linear-gradient(140deg, var(--color-primary), var(--color-secondary)); display:flex; align-items:center; justify-content:center; box-shadow:var(--shadow-1);">
          <span style="width:8px; height:12px; border-radius:99px 99px 4px 4px; background:var(--color-on-primary);"></span>
        </span>
        <span style="font-family:var(--font-display); font-weight:800; font-size:19px; letter-spacing:-.02em; color:var(--color-text);">{{ APP_NAME }}</span>
      </a>
      <nav style="display:flex; align-items:center; gap:clamp(10px,2vw,22px); flex-wrap:wrap;">
        <a href="#how" style="font-size:13.5px; font-weight:600; color:var(--color-muted); text-decoration:none;">{{ $t('navHow') }}</a>
        <a href="#uses" style="font-size:13.5px; font-weight:600; color:var(--color-muted); text-decoration:none;">{{ $t('navUses') }}</a>
        <a href="#partners" style="font-size:13.5px; font-weight:600; color:var(--color-muted); text-decoration:none;">{{ $t('navPartners') }}</a>
        <a href="#pricing" style="font-size:13.5px; font-weight:600; color:var(--color-muted); text-decoration:none;">{{ $t('navPricing') }}</a>
      </nav>
      <div class="controls" style="display:flex; align-items:center; padding:4px; padding-inline-end:16px; background:var(--color-surface); border:1px solid var(--color-border); border-radius:var(--radius-full); box-shadow:var(--shadow-1);">
        <div class="theme-pills" style="display:flex; background:var(--color-surface-2); border-radius:var(--radius-full);">
          <button @click="setTheme('birthday')" :style="getPillStyle('birthday')">{{ $t('themeBirthday') || 'Birthday' }}</button>
          <button @click="setTheme('mystery')" :style="getPillStyle('mystery')">{{ $t('themeMystery') || 'Mystery' }}</button>
          <button @click="setTheme('spooky')" :style="getPillStyle('spooky')">Spooky</button>
          <button @click="setTheme('corporate')" :style="getPillStyle('corporate')">Corporate</button>
        </div>
        <div class="controls-divider" style="width:1px; height:20px; background:var(--color-border); margin:0 16px 0 12px;"></div>
        <div
          class="lang-menu"
          style="position:relative;"
          @focusin="cancelCloseLangMenu"
          @focusout="scheduleCloseLangMenu"
          @keydown.esc="closeLangMenu"
        >
          <button @click="toggleLangMenu" aria-label="Language options" :aria-expanded="isLangMenuOpen ? 'true' : 'false'" aria-haspopup="listbox" style="display:flex; align-items:center; gap:8px; padding:0; min-height:44px; background:transparent; border:none; color:var(--color-text); font-family:var(--font-ui); font-size:14px; font-weight:700; cursor:pointer;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-secondary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
            {{ currentLanguage.name }}
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style="margin-inline-start:2px; color:var(--color-muted);" :style="{ transform: isLangMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }">
              <path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <div v-if="isLangMenuOpen" style="position:absolute; top:calc(100% + 12px); inset-inline-end:0; width:180px; background:var(--color-surface); border:1px solid var(--color-border); border-radius:var(--radius-md); padding:8px; box-shadow:var(--shadow-2); display:flex; flex-direction:column; gap:4px; z-index:100;">
            <button v-for="l in languages" :key="l.code" @click="selectLang(l.code)" style="display:flex; align-items:center; justify-content:space-between; width:100%; padding:8px 12px; min-height:44px; border:none; background:transparent; border-radius:var(--radius-sm); font-family:var(--font-ui); font-size:14px; font-weight:600; color:var(--color-text); cursor:pointer; text-align:start; transition:background .2s;" :style="{ background: l.code === currentLanguage.code ? 'var(--color-surface-2)' : 'transparent' }" @mouseover="(e) => l.code !== currentLanguage.code && (e.currentTarget.style.background = 'color-mix(in srgb, var(--color-surface-2) 40%, transparent)')" @mouseout="(e) => l.code !== currentLanguage.code && (e.currentTarget.style.background = 'transparent')">
              <span>{{ l.name }}</span>
              <span style="display:flex; align-items:center; gap:8px; font-size:12px; font-weight:700; color:var(--color-muted);">
                {{ l.short }}
                <span v-if="l.code === currentLanguage.code" style="width:6px; height:6px; border-radius:50%; background:var(--color-primary);"></span>
                <span v-else style="width:6px; height:6px; display:inline-block;"></span>
              </span>
            </button>
          </div>
        </div>
      </div>
      <button @click="router.push('/dashboard')" style="padding:11px 22px; background:var(--color-text); color:var(--color-surface); border:none; border-radius:var(--radius-full); font-family:var(--font-ui); font-size:14px; font-weight:700; cursor:pointer; box-shadow:var(--shadow-1); transition:opacity .2s;" onmouseover="this.style.opacity='.9'" onmouseout="this.style.opacity='1'">
        {{ $t('navLogin') || 'Log in' }}
      </button>
    </nav>
  </header>
</template>

<style scoped>
/* The control cluster is one non-wrapping flex row, which pushed the language
   switcher past the viewport (and out of reach) on phones. None of these
   properties are set inline, so a plain stylesheet rule wins here. */
@media (max-width: 760px) {
  .controls {
    flex-wrap: wrap;
    justify-content: center;
    row-gap: 6px;
  }
  .theme-pills {
    flex-wrap: wrap;
    justify-content: center;
  }
  .controls-divider {
    display: none;
  }
  .lang-menu button {
    min-height: 44px;
  }
}
</style>
