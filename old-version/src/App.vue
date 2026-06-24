<script setup>
import { ref, onMounted } from 'vue'
import PuzzleBoard from './components/PuzzleBoard.vue'
import SecretCodeGame from './components/SecretCodeGame.vue'
import weddingImage from '@/assets/images/wedding.jpg'

const currentStage = ref(1) // 1: Puzzle, 2: Secret Code, 3: Celebration
const isMusicPlaying = ref(false)
const audio = ref(null)
const puzzleImage = ref(weddingImage)

const nextStage = () => {
  currentStage.value++
}

const toggleMusic = () => {
  if (!audio.value) return 
  if (isMusicPlaying.value) {
    audio.value.pause()
  } else {
    audio.value.play().catch(e => console.log("Audio play failed (user interaction needed):", e))
  }
  isMusicPlaying.value = !isMusicPlaying.value
}

onMounted(() => {
  audio.value = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3') // Placeholder music
  audio.value.loop = true
})
</script>

<template>
  <div class="app-container">
    <div class="hearts-bg">
       <div v-for="n in 15" :key="n" class="heart" :style="{ 
           left: Math.random() * 100 + 'vw', 
           animationDelay: Math.random() * 5 + 's',
           animationDuration: (Math.random() * 5 + 5) + 's' 
       }"></div>
    </div>
    
    <button class="music-toggle" @click="toggleMusic">
      {{ isMusicPlaying ? '🔇 Stop Music' : '🎵 Play Music' }}
    </button>
    <div v-if="currentStage === 1" class="stage-container">
      <h2>Solve the Puzzle to Begin</h2>
      <PuzzleBoard 
        :image-src="puzzleImage" 
        @complete="nextStage" 
      />
      <p class="hint">Drag and drop the pieces to reveal the photo!</p>
    </div>
    <div v-else-if="currentStage === 2" class="stage-container">
      <h2>Stage 2: Our Secret Story</h2>
      <SecretCodeGame @complete="nextStage" />
    </div>
    <div v-else>
      <h1>Happy Valentine's Day!</h1>
    </div>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  flex-direction: column;
}
</style>
