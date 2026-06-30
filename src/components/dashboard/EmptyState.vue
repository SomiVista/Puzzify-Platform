<template>
  <div class="empty-state-view">

    <div class="empty-content">
      <BoxStage asset="gift" :size="160" />
      <h2>Create your first gift</h2>
      <p>Build a quest in a few minutes — a few clues, then the reward. Start from an occasion and we'll set the theme, audio and box for you.</p>
      <PzButton variant="primary" size="lg" class="new-quest-btn">
        <Plus :size="20" /> New quest
      </PzButton>

      <div class="kicker">OR START FROM AN OCCASION</div>
      <div class="preset-grid">
        <button v-for="preset in presets" :key="preset.name" class="preset-card">
          <div class="preset-icon">
            <component :is="preset.icon" :size="20" />
          </div>
          <div class="preset-name">{{ preset.name }}</div>
        </button>
      </div>
    </div>

    <footer class="empty-footer">
      The delivery is the gift.
    </footer>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useAppStore } from '../../stores/useAppStore'
import { Plus, Cake, Heart, Search, Briefcase, Snowflake } from 'lucide-vue-next'
import BoxStage from '../ui/BoxStage.vue'
import PzButton from '../ui/PzButton.vue'

const store = useAppStore()
const { creatorInfo } = storeToRefs(store)

const presets = [
  { name: 'Birthday', icon: Cake },
  { name: 'Anniversary', icon: Heart },
  { name: 'Mystery night', icon: Search },
  { name: 'Corporate', icon: Briefcase },
  { name: 'Holiday', icon: Snowflake },
  { name: 'Start blank', icon: Plus }
]
</script>

<style scoped>
.empty-state-view {
  display: flex;
  flex-direction: column;
}

.empty-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
}
.empty-content h2 {
  font-family: var(--pz-font-display);
  font-size: 30px;
  font-weight: 800;
  margin: 24px 0 12px;
}
.empty-content p {
  font-size: 15px;
  color: var(--pz-muted);
  max-width: 430px;
  line-height: 1.5;
  margin: 0 0 32px;
}

.new-quest-btn {
  margin-bottom: 48px;
}

.kicker {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--pz-muted);
  margin-bottom: 24px;
}

.preset-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 12px;
  max-width: 800px;
  width: 100%;
}
.preset-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--pz-bg);
  border: 1px solid var(--pz-border);
  border-radius: 14px;
  padding: 16px 12px;
  cursor: pointer;
  transition: all var(--pz-dur) var(--pz-ease);
}
.preset-card:hover {
  transform: translateY(-2px);
  border-color: var(--pz-primary);
  box-shadow: var(--pz-e-1);
}
.preset-card:focus-visible { outline: none; box-shadow: 0 0 0 4px var(--pz-ring); }
.preset-icon {
  width: 36px;
  height: 36px;
  border-radius: 11px;
  background: var(--pz-surface-2);
  color: var(--pz-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}
.preset-name {
  font-size: 13.5px;
  font-weight: 700;
  color: var(--pz-text);
  line-height: 1.2;
}

.empty-footer {
  text-align: center;
  padding: 24px;
  font-family: var(--pz-font-display);
  font-size: 15px;
  font-weight: 800;
  color: var(--pz-muted);
}

@media (max-width: 900px) {
  .preset-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
@media (max-width: 500px) {
  .preset-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
