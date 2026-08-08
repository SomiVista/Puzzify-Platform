<script setup>
/**
 * @file PuzzleTypes.vue
 * @description Showcase of available puzzle types with interactive mocks.
 */
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { tm } = useI18n()
const pt = computed(() => tm('pt').map((p,i) => ({ 
  tag:p.tag, title:p.title, desc:p.desc, premium:p.premium||'', isPremium:!!p.premium, kind:i,
  isLock: i===0, isTrivia: i===1, isHotspot: i===2 
})))
</script>

<template>
  <section style="background:var(--color-surface); border-top:1px solid var(--color-hairline); border-bottom:1px solid var(--color-hairline);">
    <div style="max-width:1180px; margin:0 auto; padding:clamp(56px,8vw,96px) clamp(16px,4vw,26px);">
      <div style="max-width:42ch; margin-bottom:clamp(32px,5vw,48px);">
        <span style="font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:.16em; color:var(--color-secondary);">{{ $t('ptKicker') }}</span>
        <h2 style="margin:10px 0 12px; font-family:var(--font-display); font-weight:800; font-size:clamp(28px,4vw,44px); line-height:1.05; letter-spacing:-.02em; color:var(--color-text); text-wrap:balance;">{{ $t('ptTitle') }}</h2>
        <p style="margin:0; font-size:clamp(15px,1.5vw,17px); line-height:1.55; color:var(--color-muted);">{{ $t('ptSub') }}</p>
      </div>
      <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); gap:18px;">
        <div v-for="(p, index) in pt" :key="index" style="display:flex; flex-direction:column; background:var(--color-bg); border:1px solid var(--color-border); border-radius:var(--radius-lg); padding:20px; box-shadow:var(--shadow-1);">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:14px;">
            <span style="font-size:10.5px; font-weight:700; text-transform:uppercase; letter-spacing:.1em; color:var(--color-secondary); background:var(--color-surface-2); padding:5px 11px; border-radius:var(--radius-full);">{{ p.tag }}</span>
            <span v-if="p.isPremium" style="font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:.08em; color:var(--color-on-primary); background:var(--color-primary); padding:5px 10px; border-radius:var(--radius-full);">{{ p.premium }}</span>
          </div>
          <!-- module preview -->
          <div style="height:128px; border-radius:var(--radius-md); margin-bottom:16px; overflow:hidden; position:relative; background:repeating-linear-gradient(45deg,var(--color-surface-2),var(--color-surface-2) 9px,var(--color-surface) 9px,var(--color-surface) 18px); border:1px solid var(--color-border); display:flex; align-items:center; justify-content:center;">
            <span v-if="p.isLock" style="display:flex; align-items:center; gap:8px; padding:10px 14px; background:var(--color-bg); border:1.5px solid var(--color-focus); border-radius:var(--radius-md); box-shadow:0 0 0 4px var(--color-ring); font-family:'IBM Plex Mono',monospace; font-size:14px; letter-spacing:.2em; color:var(--color-text);">••••<span class="anim" style="width:1.5px; height:16px; background:var(--color-primary); animation:caret 1s step-end infinite;"></span></span>
            
            <span v-if="p.isTrivia" style="display:flex; flex-direction:column; gap:7px; width:78%;">
              <span style="display:flex; align-items:center; gap:8px; padding:8px 11px; background:var(--color-bg); border:1.5px solid var(--color-success); border-radius:var(--radius-sm);"><span style="width:13px; height:13px; border-radius:50%; border:4px solid var(--color-success);"></span><span style="height:6px; flex:1; border-radius:3px; background:var(--color-border);"></span></span>
              <span style="display:flex; align-items:center; gap:8px; padding:8px 11px; background:var(--color-bg); border:1.5px solid var(--color-border); border-radius:var(--radius-sm);"><span style="width:13px; height:13px; border-radius:50%; border:2px solid var(--color-border);"></span><span style="height:6px; flex:1; border-radius:3px; background:var(--color-border); opacity:.6;"></span></span>
            </span>
            
            <span v-if="p.isHotspot" class="anim" style="position:absolute; inset-inline-end:34px; top:34px; width:32px; height:32px; border-radius:50%; border:2.5px solid var(--color-primary); box-shadow:0 0 0 6px var(--color-ring); animation:pulse 2s ease-out infinite;"></span>
          </div>
          <h3 style="margin:0 0 7px; font-family:var(--font-display); font-weight:700; font-size:18px; line-height:1.12; color:var(--color-text);">{{ p.title }}</h3>
          <p style="margin:0; font-size:13.5px; line-height:1.5; color:var(--color-muted);">{{ p.desc }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
