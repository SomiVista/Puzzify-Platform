<script setup>
import { ref, computed } from 'vue'
import confetti from 'canvas-confetti'

// Import images explicitly
import kubaPubImage from '@/assets/images/kuba-pub.jpg'
import istanbulImage from '@/assets/images/first-event-istanbul.jpg'
import firstYearImage from '@/assets/images/first-year-meet.jpg'

const emit = defineEmits(['complete'])

// USER: CUSTOMIZE QUESTIONS HERE
const questions = [
  {
    id: 1,
    question: "Where did we have our Christmas 2025?",
    answer: "Kuba Pub", // Case insensitive check
    type: "text",
    image: kubaPubImage,
    memory: "That night on the pub..."
  },
  {
    id: 2,
    question: "What was the first event we attended together in Istanbul?",
    answer: "Rafting",
    type: "text",
    image: istanbulImage,
    memory: "Just like the ocean!"
  },
  {
    id: 3,
    question: "What year did we meet?",
    answer: "2020",
    type: "text",
    image: firstYearImage,
    memory: "A crazy year, but the best one because I met you."
  }
]

const currentQuestionIndex = ref(0)
const userAnswer = ref('')
const error = ref(false)
const unlockedMemories = ref([])
const showCelebration = ref(false)

const currentQuestion = computed(() => questions[currentQuestionIndex.value])
const progress = computed(() => (currentQuestionIndex.value / questions.length) * 100)

const checkAnswer = () => {
  if (!userAnswer.value) return

  const correct = currentQuestion.value.answer.toLowerCase().trim()
  const user = userAnswer.value.toLowerCase().trim()

  if (user === correct) {
    // Correct!
    error.value = false
    unlockedMemories.value.push(currentQuestion.value)
    userAnswer.value = ''
    launchMiniConfetti()
    
    if (currentQuestionIndex.value < questions.length - 1) {
      currentQuestionIndex.value++
    } else {
      finishGame()
    }
  } else {
    // Incorrect
    error.value = true
    shakeInput()
  }
}

const shakeInput = () => {
  const input = document.querySelector('.answer-input')
  if (input) {
    input.classList.add('shake')
    setTimeout(() => input.classList.remove('shake'), 500)
  }
}

const launchMiniConfetti = () => {
   confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
   });
}

const finishGame = () => {
  showCelebration.value = true
  confetti({
    particleCount: 200,
    spread: 160,
    origin: { y: 0.6 }
  })
  setTimeout(() => {
      emit('complete')
  }, 4000) // Wait a bit before emitting complete to show the final card
}
</script>

<template>
  <div class="secret-game">
    <div v-if="!showCelebration" class="game-container">
      <div class="progress-bar">
        <div class="progress" :style="{ width: `${progress}%` }"></div>
      </div>

      <div class="card-container">
        <div class="question-card">
          <h3>Question {{ currentQuestionIndex + 1 }}/{{ questions.length }}</h3>
          <p class="question-text">{{ currentQuestion.question }}</p>
          
          <div class="input-group">
            <input 
              v-model="userAnswer" 
              @keyup.enter="checkAnswer"
              type="text" 
              placeholder="Type your answer..."
              class="answer-input"
              :class="{ 'error': error }"
            />
            <button @click="checkAnswer" class="submit-btn">Unlock ❤️</button>
          </div>
          <p v-if="error" class="error-msg">Not quite! Try again, love.</p>
        </div>
      </div>

      <div class="memories-grid">
        <div v-for="memory in unlockedMemories" :key="memory.id" class="memory-card">
           <img :src="memory.image" alt="Memory" />
           <p>{{ memory.memory }}</p>
        </div>
      </div>
    </div>

    <div v-else class="celebration-container">
       <h2>You unlocked everything!</h2>
       <p>My heart is yours forever.</p>
       <div class="final-gallery">
          <div v-for="q in questions" :key="q.id" class="final-card">
             <img :src="q.image" />
             <p>{{ q.memory }}</p>
          </div>
       </div>
    </div>
  </div>
</template>

<style scoped>
.secret-game {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.progress-bar {
  width: 100%;
  height: 10px;
  background: #eee;
  border-radius: 5px;
  margin-bottom: 20px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background: linear-gradient(90deg, #ff80ab, #f50057);
  transition: width 0.5s ease;
}

.question-card {
  background: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  text-align: center;
  transition: all 0.3s ease;
}

.question-text {
  font-size: 1.5rem;
  margin: 20px 0;
  color: #333;
}

.input-group {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 20px;
}

.answer-input {
  padding: 10px 15px;
  border: 2px solid #ddd;
  border-radius: 25px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s;
  width: 60%;
}

.answer-input:focus {
  border-color: #f50057;
}

.answer-input.error {
  border-color: red;
  animation: shake 0.5s;
}

.submit-btn {
  background: #f50057;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 25px;
  cursor: pointer;
  font-size: 1rem;
  transition: transform 0.2s;
}

.submit-btn:hover {
  transform: scale(1.05);
}

.error-msg {
  color: #e53935;
  margin-top: 10px;
  font-size: 0.9rem;
}

.memories-grid, .final-gallery {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 30px;
  justify-content: center;
}

.memory-card, .final-card {
  width: 150px;
  background: white;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.memory-card img, .final-card img {
  width: 100%;
  height: 100px; /* Fixed height for consistency */
  border-radius: 5px;
  object-fit: cover;
}

.memory-card p, .final-card p {
    font-size: 0.8rem;
    margin-top: 5px;
    color: #555;
    text-align: center;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

@keyframes popIn {
  from { opacity: 0; transform: scale(0.5); }
  to { opacity: 1; transform: scale(1); }
}

/* Celebration styles */
.celebration-container {
    text-align: center;
    color: #880e4f;
}
</style>
