<script setup>
/**
 * @file PartnersSection.vue
 * @description Partners and collaborators section.
 */
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '../../stores/useAppStore'
import { useI18n } from 'vue-i18n'

const store = useAppStore()
const { tm } = useI18n()

const pb = computed(() => tm('partnerBlock'))
</script>

<template>
  <section id="partners" style="background:var(--pz-bg); padding:clamp(56px,8vw,96px) clamp(16px,4vw,26px);">
    <div style="max-width:1180px; margin:0 auto;">
      
      <!-- Main Partner Card -->
      <div style="background:linear-gradient(135deg, var(--pz-surface-2) 0%, var(--pz-surface) 100%); border:1px solid var(--pz-border); border-radius:var(--pz-r-xl); padding:clamp(32px,5vw,64px); display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:clamp(32px,5vw,64px); align-items:center; box-shadow:var(--pz-e-2);">
        
        <!-- Left Column -->
        <div style="display:flex; flex-direction:column; gap:24px;">
          
          <!-- Logos Row -->
          <div style="display:flex; align-items:center; gap:12px; font-family:var(--pz-font-display); font-weight:800; font-size:20px; color:var(--pz-text); flex-wrap:wrap;">
            <div style="display:flex; align-items:center; gap:8px;">
               <span style="width:32px; height:32px; border-radius:10px; background:linear-gradient(140deg, var(--pz-primary), var(--pz-secondary)); display:flex; align-items:center; justify-content:center; box-shadow:var(--pz-e-1);">
                 <span style="width:8px; height:12px; border-radius:99px 99px 4px 4px; background:var(--pz-on-primary);"></span>
               </span>
               Puzzify
            </div>
            <span style="color:var(--pz-muted); font-weight:400; font-size:24px; padding-bottom:4px;">&times;</span>
            <div style="display:flex; align-items:center; gap:8px;">
               <span style="width:32px; height:32px; border-radius:10px; background:var(--pz-text); display:flex; align-items:center; justify-content:center; color:var(--pz-bg); font-family:var(--pz-font-display); font-weight:800; font-size:16px;">
                 W
               </span>
               WelloWork
            </div>
          </div>

          <!-- Kicker Pill -->
          <div>
            <span style="display:inline-flex; align-items:center; gap:8px; background:var(--pz-surface); border:1px solid var(--pz-border); padding:6px 14px; border-radius:var(--pz-r-full); font-size:11.5px; font-weight:800; text-transform:uppercase; letter-spacing:.1em; color:var(--pz-secondary);">
              <span style="width:6px; height:6px; border-radius:50%; background:var(--pz-secondary);"></span>
              {{ pb.kicker }}
            </span>
          </div>

          <!-- Title & Desc -->
          <h2 style="margin:0; font-family:var(--pz-font-display); font-weight:800; font-size:clamp(32px, 4vw, 46px); line-height:1.05; letter-spacing:-.02em; color:var(--pz-text); text-wrap:balance;">
            {{ pb.title }}
          </h2>
          <p style="margin:0; font-size:clamp(15px,1.5vw,17px); line-height:1.6; color:var(--pz-muted); max-width:48ch;">
            {{ pb.desc }}
          </p>

          <!-- CTA Button -->
          <div>
            <a :href="pb.link" target="_blank" rel="noopener noreferrer" style="display:inline-flex; align-items:center; gap:8px; padding:14px 26px; background:var(--pz-primary); color:var(--pz-on-primary); border-radius:var(--pz-r-md); font-family:var(--pz-font-ui); font-weight:700; font-size:15px; text-decoration:none; box-shadow:var(--pz-e-1); transition:all .2s;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='var(--pz-e-2)';" onmouseout="this.style.transform='none'; this.style.boxShadow='var(--pz-e-1)';">
              {{ pb.cta }}
              <span style="font-size:12px; margin-inline-start:4px;" :style="{ transform: store.isFa ? 'rotate(180deg)' : 'none' }">▶</span>
            </a>
          </div>

        </div>

        <!-- Right Column (Feature Cards) -->
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div v-for="(f, i) in pb.features" :key="i" style="background:var(--pz-bg); border:1px solid var(--pz-border); border-radius:var(--pz-r-lg); padding:24px; display:flex; gap:18px; align-items:flex-start;">
            <div style="width:40px; height:40px; border-radius:var(--pz-r-sm); background:var(--pz-surface-2); display:flex; align-items:center; justify-content:center; flex:none;">
               <span style="width:14px; height:14px; border-radius:4px; background:var(--pz-primary);"></span>
            </div>
            <div>
              <h3 style="margin:0 0 6px 0; font-family:var(--pz-font-display); font-weight:700; font-size:18px; color:var(--pz-text);">{{ f.t }}</h3>
              <p style="margin:0; font-size:14px; line-height:1.55; color:var(--pz-muted);">{{ f.d }}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>
