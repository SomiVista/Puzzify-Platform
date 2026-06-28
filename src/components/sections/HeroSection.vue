<script setup>
/**
 * @file HeroSection.vue
 * @description The main hero banner with animated player mock and particles.
 */
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '../../stores/useAppStore'

const store = useAppStore()
const { isMystery, particlesOn } = storeToRefs(store)

const stepDots = computed(() => [0,1,2,3].map(i => {
  const active = i === 1, done = i < 1
  return { style: { height:'8px', borderRadius:'999px', width: active ? '30px' : '8px', background: (active||done) ? 'var(--pz-primary)' : 'var(--pz-border)', transition:'all .3s' } }
}))

const heroParticles = computed(() => {
  const cols = ['var(--pz-primary)','var(--pz-secondary)','var(--pz-accent)']
  const out = []
  for(let i=0;i<16;i++){
    const sz = 6 + (i*7 % 12); const round = (i % 3 === 0)
    out.push({ style: {
      position:'absolute', insetInlineStart: ((i*53) % 100) + '%', top:'-20px',
      width: sz+'px', height: sz+'px', background: cols[i % 3],
      borderRadius: round ? '50%' : '2px', opacity: 0.8,
      animationName: isMystery.value ? 'pzRise' : 'pzFall',
      animationDuration: (6 + (i % 5)) + 's', animationDelay: (-(i*0.6)) + 's',
      animationIterationCount: 'infinite', animationTimingFunction: 'linear',
    }})
  }
  return out
})
</script>

<template>
  <section id="top" style="position:relative; overflow:hidden; background:radial-gradient(120% 90% at 80% -10%, var(--pz-surface-2), var(--pz-bg) 60%);">
    <div v-if="particlesOn" aria-hidden="true" style="position:absolute; inset:0; pointer-events:none; overflow:hidden;">
      <div v-for="(p, index) in heroParticles" :key="index" class="pz-anim" :style="p.style"></div>
    </div>
    <div style="position:relative; max-width:1180px; margin:0 auto; padding:clamp(36px,6vw,76px) clamp(16px,4vw,26px); display:flex; gap:clamp(28px,5vw,56px); align-items:center; flex-wrap:wrap;">
      <div style="flex:1 1 380px; min-width:min(100%,340px);">
        <span style="display:inline-flex; align-items:center; gap:8px; font-size:12.5px; font-weight:700; color:var(--pz-secondary); background:var(--pz-surface); border:1px solid var(--pz-border); padding:7px 14px; border-radius:var(--pz-r-full); box-shadow:var(--pz-e-1); margin-bottom:20px;">
          <span style="width:7px; height:7px; border-radius:50%; background:var(--pz-primary);"></span>{{ $t('heroKicker') }}
        </span>
        <h1 style="margin:0 0 18px; font-family:var(--pz-font-display); font-weight:800; font-size:clamp(34px,5.6vw,60px); line-height:1.02; letter-spacing:-.025em; color:var(--pz-text); text-wrap:balance; max-width:16ch;">{{ $t('heroHeadline') }}</h1>
        <p style="margin:0 0 28px; font-size:clamp(15px,1.5vw,18px); line-height:1.55; color:var(--pz-muted); max-width:42ch;">{{ $t('heroSub') }}</p>
        <div style="display:flex; gap:12px; flex-wrap:wrap;">
          <a href="#pricing" style="display:inline-flex; align-items:center; justify-content:center; padding:15px 24px; min-height:44px; background:var(--pz-primary); color:var(--pz-on-primary); border-radius:var(--pz-r-md); font-family:var(--pz-font-ui); font-weight:700; font-size:15px; text-decoration:none; box-shadow:var(--pz-e-2);">{{ $t('heroCta1') }}</a>
          <a href="#how" style="display:inline-flex; align-items:center; justify-content:center; gap:9px; padding:15px 22px; min-height:44px; background:var(--pz-surface-2); color:var(--pz-primary); border:1px solid var(--pz-border); border-radius:var(--pz-r-md); font-family:var(--pz-font-ui); font-weight:700; font-size:15px; text-decoration:none;">
            <span style="width:0; height:0; border-style:solid; border-width:6px 0 6px 9px; border-color:transparent transparent transparent currentColor;"></span>{{ $t('heroCta2') }}
          </a>
        </div>
      </div>

      <!-- animated player mock -->
      <div style="flex:0 1 312px; min-width:280px; display:flex; justify-content:center; margin-inline:auto;">
        <div style="width:312px; max-width:100%; aspect-ratio:312/646; background:#0c0c10; border-radius:46px; padding:11px; box-shadow:var(--pz-e-3);">
          <div style="position:relative; width:100%; height:100%; background:var(--pz-bg); border-radius:36px; overflow:hidden; display:flex; flex-direction:column;">
            <div style="display:flex; align-items:center; justify-content:space-between; padding:14px 24px 4px; font-size:13px; font-weight:600; color:var(--pz-text); position:relative;">
              <span>9:41</span>
              <span style="position:absolute; inset-inline:0; top:9px; margin:0 auto; width:96px; height:26px; background:#0c0c10; border-radius:99px;"></span>
              <span style="width:17px; height:11px; border:1.5px solid var(--pz-text); border-radius:3px; opacity:.8;"></span>
            </div>
            <div style="flex:1; display:flex; flex-direction:column; padding:16px 20px 0;">
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:14px;">
                <span style="font-size:12px; font-weight:600; color:var(--pz-muted);">{{ $t('playerKicker') }}</span>
                <span style="display:flex; align-items:flex-end; gap:2px; height:13px;">
                  <span class="pz-anim" style="width:2.5px; height:13px; background:var(--pz-primary); border-radius:2px; transform-origin:bottom; animation:pzBars 1s var(--pz-ease) infinite;"></span>
                  <span class="pz-anim" style="width:2.5px; height:13px; background:var(--pz-primary); border-radius:2px; transform-origin:bottom; animation:pzBars 1s var(--pz-ease) .25s infinite;"></span>
                  <span class="pz-anim" style="width:2.5px; height:13px; background:var(--pz-primary); border-radius:2px; transform-origin:bottom; animation:pzBars 1s var(--pz-ease) .5s infinite;"></span>
                </span>
              </div>
              <div style="display:flex; gap:6px; margin-bottom:18px;">
                <div v-for="(d, index) in stepDots" :key="index" :style="d.style"></div>
              </div>
              <div style="display:flex; justify-content:center; margin-bottom:16px;">
                <div class="pz-anim" style="position:relative; width:118px; height:118px; border-radius:30px; background:var(--pz-surface); border:1px solid var(--pz-border); display:flex; align-items:center; justify-content:center; box-shadow:var(--pz-e-2); animation:pzPulse 2.6s ease-out infinite;">
                  <div class="pz-anim" style="animation:pzFloatBox 4s var(--pz-ease) infinite;">
                    <svg v-if="isMystery" width="64" height="64" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="12" y="14" width="96" height="92" rx="12" fill="var(--pz-surface-2)" stroke="var(--pz-primary)" stroke-width="4"></rect>
                      <rect x="26" y="28" width="68" height="64" rx="7" fill="var(--pz-bg)" stroke="var(--pz-border)" stroke-width="3"></rect>
                      <circle cx="60" cy="60" r="17" fill="none" stroke="var(--pz-primary)" stroke-width="5"></circle>
                      <circle cx="60" cy="60" r="4" fill="var(--pz-primary)"></circle>
                      <rect x="58" y="40" width="4" height="12" rx="2" fill="var(--pz-primary)"></rect>
                    </svg>
                    <svg v-else width="64" height="64" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="14" y="50" width="92" height="58" rx="10" fill="var(--pz-primary)"></rect>
                      <rect x="8" y="36" width="104" height="22" rx="7" fill="var(--pz-secondary)"></rect>
                      <rect x="52" y="36" width="16" height="72" fill="var(--pz-accent)"></rect>
                      <circle cx="48" cy="30" r="13" fill="none" stroke="var(--pz-accent)" stroke-width="8"></circle>
                      <circle cx="72" cy="30" r="13" fill="none" stroke="var(--pz-accent)" stroke-width="8"></circle>
                    </svg>
                  </div>
                </div>
              </div>
              <div style="background:var(--pz-surface); border:1px solid var(--pz-border); border-radius:var(--pz-r-lg); padding:16px; box-shadow:var(--pz-e-1);">
                <span style="display:inline-block; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:.1em; color:var(--pz-secondary); background:var(--pz-surface-2); padding:4px 9px; border-radius:var(--pz-r-full); margin-bottom:10px;">{{ $t('puzzleType') }}</span>
                <h2 style="margin:0 0 5px; font-family:var(--pz-font-display); font-weight:700; font-size:20px; line-height:1.1; color:var(--pz-text);">{{ $t('playerTitle') }}</h2>
                <p style="margin:0 0 12px; font-size:13px; line-height:1.4; color:var(--pz-muted);">{{ $t('playerPrompt') }}</p>
                <div style="display:flex; align-items:center; gap:10px; padding:11px 13px; background:var(--pz-bg); border:1.5px solid var(--pz-focus); border-radius:var(--pz-r-md); box-shadow:0 0 0 4px var(--pz-ring); margin-bottom:12px;">
                  <span style="flex:1; font-size:14px; color:var(--pz-muted);">{{ $t('inputPlaceholder') }}</span>
                  <span class="pz-anim" style="width:1.5px; height:18px; background:var(--pz-primary); animation:pzCaret 1s step-end infinite;"></span>
                </div>
                <button style="width:100%; padding:13px; background:var(--pz-primary); color:var(--pz-on-primary); border:none; border-radius:var(--pz-r-md); font-family:var(--pz-font-ui); font-weight:700; font-size:15px; cursor:pointer; min-height:44px;">{{ $t('submit') }}</button>
              </div>
            </div>
            <div style="text-align:center; padding:11px; font-size:10.5px; color:var(--pz-muted);">{{ $t('watermark') }}</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
