<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import PuzzlePiece from './PuzzlePiece.vue'
import confetti from 'canvas-confetti'

const props = defineProps({
  imageSrc: {
    type: String,
    // Placeholder image implementation - USER: REPLACE THIS URL WITH YOUR PHOTO
    default: 'https://images.unsplash.com/photo-1518568814500-bf5f8ca66c6c?q=80&w=1000&auto=format&fit=crop'
  }
})

const emit = defineEmits(['complete'])

const rows = 3
const cols = 3
const pieces = ref([])
const isDragging = ref(false)
const draggedIndex = ref(null)

// Initialize pieces
const initBoard = () => {
  const tempPieces = []
  for (let i = 0; i < rows * cols; i++) {
    tempPieces.push({
      id: i,
      correctPosition: i,
      currentPosition: i
    })
  }
  // Shuffle logic
  // Simple shuffle: swap random pairs
  for (let i = tempPieces.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tempPieces[i], tempPieces[j]] = [tempPieces[j], tempPieces[i]];
  }
  pieces.value = tempPieces
}

const onDragStart = (index) => {
  draggedIndex.value = index
  isDragging.value = true
}

const onDropPiece = (targetIndex) => {
  if (draggedIndex.value === null) return

  // Swap pieces in the array
  const draggedPiece = pieces.value[draggedIndex.value]
  const targetPiece = pieces.value[targetIndex]
  
  // Swap positions in the array
  pieces.value[draggedIndex.value] = targetPiece
  pieces.value[targetIndex] = draggedPiece

  draggedIndex.value = null
  isDragging.value = false
  
  checkWin()
}

const checkWin = () => {
  const isWin = pieces.value.every((piece, index) => piece.correctPosition === index)
  if (isWin) {
    launchConfetti()
    setTimeout(() => {
         emit('complete')
    }, 3000)
  }
}

const launchConfetti = () => {
  const duration = 3000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  const random = (min, max) => Math.random() * (max - min) + min;

  const interval = setInterval(function() {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    // since particles fall down, start a bit higher than random
    confetti({ ...defaults, particleCount, origin: { x: random(0.1, 0.3), y: Math.random() - 0.2 } });
    confetti({ ...defaults, particleCount, origin: { x: random(0.7, 0.9), y: Math.random() - 0.2 } });
  }, 250);
}

onMounted(() => {
  initBoard()
})
</script>

<template>
  <div class="puzzle-board">
    <PuzzlePiece
      v-for="(piece, index) in pieces"
      :key="piece.id"
      :id="piece.id"
      :image-src="imageSrc"
      :total-rows="rows"
      :total-cols="cols"
      :position="index"
      :correct-position="piece.correctPosition"
      @drag-start="onDragStart(index)"
      @drop-piece="onDropPiece(index)"
      @drop-piece-mobile="onDropPiece"
    />
  </div>
</template>

<style scoped>
.puzzle-board {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 2px;
  width: 90vw;
  height: 90vw;
  max-width: 500px;
  max-height: 500px;
  border: 5px solid #fff;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  background-color: rgba(255,255,255,0.2);
  backdrop-filter: blur(5px);
  padding: 5px;
}
</style>
