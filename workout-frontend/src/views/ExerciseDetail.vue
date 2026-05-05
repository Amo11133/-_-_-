<template>
  <div class="container py-4">
    <div v-if="loading" class="text-center">Загрузка...</div>
    <div v-else-if="exercise" class="card bg-dark text-white p-4">
      <div class="d-flex justify-content-between align-items-start">
        <h2 class="text-orange">{{ exercise.name }}</h2>
        <button class="btn btn-outline-secondary" @click="$router.back()">Назад</button>
      </div>
      <p class="text-secondary mt-2">{{ exercise.description || 'Описание отсутствует' }}</p>

      <div class="row mt-4">
        <!-- Видео или анимация -->
        <div class="col-md-6">
          <h4>Техника выполнения</h4>
          <div v-if="exercise.video_url" class="ratio ratio-16x9 mt-2">
            <iframe :src="videoEmbedUrl" frameborder="0" allowfullscreen></iframe>
          </div>
          <div v-else class="bg-secondary bg-opacity-25 rounded p-5 text-center">
            <p>Анимация скоро появится</p>
          </div>
        </div>

        <!-- Группы мышц -->
        <div class="col-md-6">
          <h4>Задействованные мышцы</h4>
          <div class="d-flex flex-wrap gap-2 mt-2">
            <span v-for="mg in muscleGroups" :key="mg.id" class="badge bg-warning text-dark px-3 py-2">
              {{ mg.name }}
            </span>
          </div>
          <!-- Можно добавить схему тела с подсветкой (в будущем) -->
        </div>
      </div>

      <!-- Кнопка добавления в тренировку (быстрое действие) -->
      <button class="btn btn-primary mt-4" @click="quickAddToWorkout">➕ Добавить в сегодняшнюю тренировку</button>
    </div>
    <div v-else class="alert alert-danger">Упражнение не найдено</div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../services/api'
import { useUserStore } from '../stores/userStore'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const exercise = ref(null)
const muscleGroups = ref([])
const loading = ref(true)

// Преобразуем ссылку на YouTube в embed-формат
const videoEmbedUrl = computed(() => {
  const url = exercise.value?.video_url
  if (!url) return ''
  let videoId = ''
  if (url.includes('youtube.com/watch?v=')) {
    videoId = url.split('v=')[1]?.split('&')[0]
  } else if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1]?.split('?')[0]
  }
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url
})

const quickAddToWorkout = () => {
  // Перенаправляем на форму создания тренировки с заданной датой (сегодня)
  const today = new Date().toISOString().split('T')[0]
  router.push(`/workout/new?date=${today}`)
}

onMounted(async () => {
  try {
    const res = await api.get(`/exercises/${route.params.id}`)
    exercise.value = res.data
    // Извлекаем группы мышц из связи exercise_muscle_groups
    if (exercise.value.exercise_muscle_groups) {
      muscleGroups.value = exercise.value.exercise_muscle_groups.map(emg => emg.muscle_group).filter(Boolean)
    }
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
})
</script>