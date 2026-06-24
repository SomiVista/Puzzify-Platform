<script setup>
import { computed } from 'vue'

const props = defineProps({
  id: Number,
  imageSrc: String,
  totalRows: Number,
  totalCols: Number,
  position: Number, // Current index in the grid (0 to 8)
  correctPosition: Number // Targeted index (0 to 8)
})

// Calculate background position based on correctPosition
const emit = defineEmits(['drag-start', 'drop-piece', 'drop-piece-mobile'])

const backgroundPosition = computed(() => {
  const row = Math.floor(props.correctPosition / props.totalCols)
  const col = props.correctPosition % props.totalCols
  const percentageX = (col / (props.totalCols - 1)) * 100
  const percentageY = (row / (props.totalRows - 1)) * 100
  return `${percentageX}% ${percentageY}%`
})

const onTouchStart = (e) => {
  emit('drag-start', props.position)
}

const onTouchMove = (e) => {
  e.preventDefault()
}

const onTouchEnd = (e) => {
  const touch = e.changedTouches[0]
  const target = document.elementFromPoint(touch.clientX, touch.clientY)
  const piece = target?.closest('.puzzle-piece')
  
  if (piece) {
    const targetPos = parseInt(piece.dataset.position)
    if (!isNaN(targetPos)) {
      emit('drop-piece-mobile', targetPos)
    }
  }
}
</script>

<template>
  <div
    class="puzzle-piece"
    :data-position="position"
    :style="{
      backgroundImage: `url(${imageSrc})`,
      backgroundPosition: backgroundPosition,
      backgroundSize: `${totalCols * 100}% ${totalRows * 100}%`
    }"
    draggable="true"
    @dragstart="$emit('drag-start', position)"
    @dragover.prevent
    @drop="$emit('drop-piece', position)"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
  >
    <!-- Optional: Overlay number for easy debugging or hint
    <span class="debug-hint">{{ correctPosition + 1 }}</span> 
    -->
  </div>
</template>

<style scoped>
.puzzle-piece {
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  cursor: grab;
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  transition: transform 0.2s;
  border-radius: 5px;
}

.puzzle-piece:active {
  cursor: grabbing;
  transform: scale(0.95);
  z-index: 10;
}
</style>
