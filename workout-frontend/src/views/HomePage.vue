<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
      <h1 class="text-orange">
        <i class="bi bi-barbell me-2"></i>База упражнений
      </h1>
      <div class="d-flex gap-2">
        <select v-model="selectedMuscleGroup" class="form-select bg-dark text-white border-secondary" style="width: 200px;">
          <option :value="null">Все мышцы</option>
          <option v-for="mg in muscleGroups" :key="mg.id" :value="mg.id">{{ mg.name }}</option>
        </select>
        <input type="text" v-model="search" class="form-control bg-dark text-white border-secondary" placeholder="Поиск по названию" style="width: 200px;">
      </div>
    </div>
    <div v-if="loading" class="text-center py-5">Загрузка...</div>
    <div v-else-if="filteredExercises.length === 0" class="text-center py-5">Нет упражнений</div>
    <div class="row g-4">
      <div v-for="ex in filteredExercises" :key="ex.id" class="col-md-6 col-lg-4">
        <div class="card card-exercise h-100 p-3" @click="openModal(ex)">
          <h5 class="card-title text-orange">
            <i class="bi bi-barbell me-2"></i>{{ ex.name }}
          </h5>
          <p class="card-text text-light-emphasis">{{ ex.description?.slice(0, 80) || 'Описание отсутствует' }}...</p>
          <div class="d-flex justify-content-between mt-auto">
            <small class="text-secondary">
              <i class="bi bi-fire me-1"></i>{{ ex.calories_per_minute || 5 }} ккал/мин
            </small>
            <span class="badge bg-secondary">
              <i class="bi bi-muscle me-1"></i>{{ getUniqueMuscleNames(ex).slice(0, 2).join(', ') || '—' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальное окно с вертикальным видео -->
    <div v-if="selectedExercise" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content bg-dark text-white p-4 rounded-4">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h3 class="text-orange">
            <i class="bi bi-play-circle me-2"></i>{{ selectedExercise.name }}
          </h3>
          <button class="btn-close btn-close-white" @click="closeModal"></button>
        </div>
        <div class="row g-3">
          <!-- Левая половина: вертикальное видео -->
          <div class="col-md-6 d-flex justify-content-center align-items-center">
            <div v-if="videoUrl" class="video-container">
              <video controls :src="videoUrl" class="vertical-video"></video>
            </div>
            <div v-else class="bg-secondary bg-opacity-25 rounded-3 p-5 text-center w-100">
              <i class="bi bi-file-earmark-play fs-1"></i>
              <p class="mt-2">Видео отсутствует</p>
            </div>
          </div>
          <!-- Правая половина: техника, рекомендации, мышцы -->
          <div class="col-md-6">
            <h5><i class="bi bi-info-circle me-2"></i>Техника выполнения</h5>
            <p>{{ selectedExercise.description || 'Описание не добавлено' }}</p>
            <hr>
            <h5><i class="bi bi-lightbulb me-2"></i>Рекомендации</h5>
            <ul>
              <li><i class="bi bi-check-lg text-success me-2"></i>Перед выполнением разогрейтесь</li>
              <li><i class="bi bi-check-lg text-success me-2"></i>Следите за дыханием</li>
              <li><i class="bi bi-check-lg text-success me-2"></i>Не используйте слишком большой вес</li>
            </ul>
            <div class="mt-3">
              <strong><i class="bi bi-muscle me-2"></i>Задействованные мышцы:</strong><br>
              {{ getUniqueMuscleNames(selectedExercise).join(', ') || '—' }}
            </div>
          </div>
        </div>
        <div class="mt-4 d-flex justify-content-end">
          <button class="btn btn-primary" @click="quickAddToWorkout">
            <i class="bi bi-plus-circle me-2"></i>Добавить в тренировку
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

const router = useRouter()
const exercises = ref([])
const muscleGroups = ref([])
const selectedMuscleGroup = ref(null)
const search = ref('')
const loading = ref(true)
const selectedExercise = ref(null)

// Уникальные названия мышц (без дублей)
const getUniqueMuscleNames = (ex) => {
  const names = ex.exercise_muscle_groups?.map(emg => emg.muscle_group?.name).filter(Boolean) || []
  return [...new Set(names)]
}

// Фильтр упражнений
const filteredExercises = computed(() => {
  let result = exercises.value
  if (selectedMuscleGroup.value) {
    result = result.filter(ex => {
      const groupIds = ex.exercise_muscle_groups?.map(emg => emg.muscle_group?.id) || []
      return groupIds.includes(selectedMuscleGroup.value)
    })
  }
  if (search.value.trim()) {
    const s = search.value.toLowerCase()
    result = result.filter(ex => ex.name.toLowerCase().includes(s))
  }
  return result
})

// Путь к видео
const videoUrl = computed(() => {
  if (!selectedExercise.value) return ''
  const url = selectedExercise.value.video_url
  if (!url) return ''
  return url.startsWith('http') ? url : `/videos/${url}`
})

const openModal = (exercise) => { selectedExercise.value = exercise }
const closeModal = () => { selectedExercise.value = null }

const quickAddToWorkout = () => {
  const today = new Date().toISOString().split('T')[0]
  router.push(`/workout/new?date=${today}`)
}

const loadData = async () => {
  try {
    const exercisesRes = await api.get('/exercises')
    exercises.value = exercisesRes.data
    // Уникальные группы мышц для выпадающего списка
    const groupsMap = new Map()
    exercises.value.forEach(ex => {
      ex.exercise_muscle_groups?.forEach(emg => {
        if (emg.muscle_group) groupsMap.set(emg.muscle_group.id, emg.muscle_group)
      })
    })
    muscleGroups.value = Array.from(groupsMap.values())
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(loadData)
</script>

<style scoped>
.card-exercise {
  background: #1e293b;
  border: none;
  border-radius: 1rem;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}
.card-exercise:hover {
  transform: translateY(-5px);
  box-shadow: 0 1rem 2rem rgba(0,0,0,0.3);
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  max-width: 900px;
  width: 95%;
  max-height: 90vh;
  overflow-y: auto;
}
/* Вертикальное видео – без скролла */
.video-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  min-height: 300px;
}
.vertical-video {
  max-height: 70vh;
  width: auto;
  max-width: 100%;
  object-fit: contain;
  border-radius: 12px;
  background: #000;
}
/* Для мобильных устройств */
@media (max-width: 768px) {
  .vertical-video {
    max-height: 40vh;
  }
}
.badge {
  white-space: normal;
  word-break: break-word;
}
</style>