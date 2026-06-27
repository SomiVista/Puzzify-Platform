<script setup>
/**
 * @file App.vue
 * @description Root component that assembles all page sections.
 */
import { storeToRefs } from 'pinia'
import { useAppStore } from './stores/useAppStore'

import TheHeader from './components/layout/TheHeader.vue'
import HeroSection from './components/sections/HeroSection.vue'
import TrustStrip from './components/sections/TrustStrip.vue'
import HowItWorks from './components/sections/HowItWorks.vue'
import PuzzleTypes from './components/sections/PuzzleTypes.vue'
import UseCases from './components/sections/UseCases.vue'
import WhyPuzzify from './components/sections/WhyPuzzify.vue'
import PricingSection from './components/sections/PricingSection.vue'
import FinalCta from './components/sections/FinalCta.vue'
import TheFooter from './components/layout/TheFooter.vue'

const store = useAppStore()
const { isFa, isMystery, dir } = storeToRefs(store)
</script>

<template>
  <div 
    :class="['pz-stage', { 'pz-theme-mystery': isMystery, 'pz-lang-fa': isFa }]" 
    :dir="dir" 
    style="min-height:100vh; background:var(--pz-bg); overflow-x:hidden;"
  >
    <TheHeader />
    <HeroSection />
    <TrustStrip />
    <HowItWorks />
    <PuzzleTypes />
    <UseCases />
    <WhyPuzzify />
    <PricingSection />
    <FinalCta />
    <TheFooter />
  </div>
</template>
