<template>
  <section class="create-hero">
    <h2 class="hero-title">Start a new gift</h2>
    <div class="preset-grid">
      <PzButton 
        v-for="preset in presets" 
        :key="preset.id"
        variant="secondary"
        size="lg"
        class="preset-card"
        @click="createQuest(preset.id)"
      >
        <component :is="preset.icon" :size="20" class="preset-icon" />
        {{ preset.label }}
      </PzButton>
    </div>
  </section>
</template>

<script setup>
import { Heart, Cake, Briefcase, Gem, PartyPopper, Plus } from 'lucide-vue-next'
import PzButton from '../ui/PzButton.vue'

const presets = [
  { id: 'anniversary', label: 'Anniversary', icon: Heart },
  { id: 'birthday', label: 'Birthday', icon: Cake },
  { id: 'corporate', label: 'Corporate', icon: Briefcase },
  { id: 'proposal', label: 'Proposal', icon: Gem },
  { id: 'celebration', label: 'Celebration', icon: PartyPopper },
  { id: 'blank', label: 'Blank Quest', icon: Plus },
]

const createQuest = (id) => {
  console.log(`Starting a new quest: ${id}`)
}
</script>

<style scoped>
.create-hero {
  padding: 32px 30px;
}
.hero-title {
  font-family: var(--pz-font-ui);
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--pz-muted);
  margin: 0 0 16px 0;
}
.preset-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
}
.preset-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 24px 16px;
  height: 120px;
  background: var(--pz-surface);
  box-shadow: var(--pz-e-1);
  border-radius: var(--pz-r-lg);
  font-weight: 600;
  color: var(--pz-text);
  border: 1px solid var(--pz-border);
}
.preset-card:hover {
  background: var(--pz-surface-2);
  transform: translateY(-2px);
  box-shadow: var(--pz-e-2);
}
.preset-icon {
  color: var(--pz-primary);
}

@media (max-width: 1200px) {
  .preset-grid { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 768px) {
  .preset-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>
