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
  <section style="background:var(--pz-surface); border-top:1px solid var(--pz-hairline); border-bottom:1px solid var(--pz-hairline);">
    <div style="max-width:1180px; margin:0 auto; padding:clamp(56px,8vw,96px) clamp(16px,4vw,26px);">
      <div style="max-width:42ch; margin-bottom:clamp(32px,5vw,48px);">
        <span style="font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:.16em; color:var(--pz-secondary);">{{ $t('ptKicker') }}</span>
        <h2 style="margin:10px 0 12px; font-family:var(--pz-font-display); font-weight:800; font-size:clamp(28px,4vw,44px); line-height:1.05; letter-spacing:-.02em; color:var(--pz-text); text-wrap:balance;">{{ $t('ptTitle') }}</h2>
        <p style="margin:0; font-size:clamp(15px,1.5vw,17px); line-height:1.55; color:var(--pz-muted);">{{ $t('ptSub') }}</p>
      </div>
      <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); gap:18px;">
        <div v-for="(p, index) in pt" :key="index" style="display:flex; flex-direction:column; background:var(--pz-bg); border:1px solid var(--pz-border); border-radius:var(--pz-r-lg); padding:20px; box-shadow:var(--pz-e-1);">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:14px;">
            <span style="font-size:10.5px; font-weight:700; text-transform:uppercase; letter-spacing:.1em; color:var(--pz-secondary); background:var(--pz-surface-2); padding:5px 11px; border-radius:var(--pz-r-full);">{{ p.tag }}</span>
            <span v-if="p.isPremium" style="font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:.08em; color:var(--pz-on-primary); background:var(--pz-primary); padding:5px 10px; border-radius:var(--pz-r-full);">{{ p.premium }}</span>
          </div>
          <!-- module preview -->
          <div style="height:128px; border-radius:var(--pz-r-md); margin-bottom:16px; overflow:hidden; position:relative; background:repeating-linear-gradient(45deg,var(--pz-surface-2),var(--pz-surface-2) 9px,var(--pz-surface) 9px,var(--pz-surface) 18px); border:1px solid var(--pz-border); display:flex; align-items:center; justify-content:center;">
            <span v-if="p.isLock" style="display:flex; align-items:center; gap:8px; padding:10px 14px; background:var(--pz-bg); border:1.5px solid var(--pz-focus); border-radius:var(--pz-r-md); box-shadow:0 0 0 4px var(--pz-ring); font-family:'IBM Plex Mono',monospace; font-size:14px; letter-spacing:.2em; color:var(--pz-text);">••••<span class="pz-anim" style="width:1.5px; height:16px; background:var(--pz-primary); animation:pzCaret 1s step-end infinite;"></span></span>
            
            <span v-if="p.isTrivia" style="display:flex; flex-direction:column; gap:7px; width:78%;">
              <span style="display:flex; align-items:center; gap:8px; padding:8px 11px; background:var(--pz-bg); border:1.5px solid var(--pz-success); border-radius:var(--pz-r-sm);"><span style="width:13px; height:13px; border-radius:50%; border:4px solid var(--pz-success);"></span><span style="height:6px; flex:1; border-radius:3px; background:var(--pz-border);"></span></span>
              <span style="display:flex; align-items:center; gap:8px; padding:8px 11px; background:var(--pz-bg); border:1.5px solid var(--pz-border); border-radius:var(--pz-r-sm);"><span style="width:13px; height:13px; border-radius:50%; border:2px solid var(--pz-border);"></span><span style="height:6px; flex:1; border-radius:3px; background:var(--pz-border); opacity:.6;"></span></span>
            </span>
            
            <span v-if="p.isHotspot" class="pz-anim" style="position:absolute; inset-inline-end:34px; top:34px; width:32px; height:32px; border-radius:50%; border:2.5px solid var(--pz-primary); box-shadow:0 0 0 6px var(--pz-ring); animation:pzPulse 2s ease-out infinite;"></span>
          </div>
          <h3 style="margin:0 0 7px; font-family:var(--pz-font-display); font-weight:700; font-size:18px; line-height:1.12; color:var(--pz-text);">{{ p.title }}</h3>
          <p style="margin:0; font-size:13.5px; line-height:1.5; color:var(--pz-muted);">{{ p.desc }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
