<template>
  <div class="container py-4">
    <div class="card bg-dark text-white p-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2 class="text-orange">
          <i class="bi bi-person-circle me-2"></i>Профиль
        </h2>
        <button v-if="!isEditing" class="btn btn-outline-warning" @click="enableEditing">
          <i class="bi bi-pencil me-1"></i>Редактировать
        </button>
        <div v-else class="d-flex gap-2">
          <button class="btn btn-success" @click="saveProfile" :disabled="saving">
            <i class="bi bi-check-lg me-1"></i>{{ saving ? 'Сохранение...' : 'Сохранить' }}
          </button>
          <button class="btn btn-secondary" @click="cancelEditing">
            <i class="bi bi-x-lg me-1"></i>Отмена
          </button>
        </div>
      </div>

      <div class="row">
        <div class="col-md-6">
          <div class="mb-3">
            <label class="form-label">Имя пользователя</label>
            <input type="text" class="form-control" :value="user?.username" disabled>
          </div>
          <div class="mb-3">
            <label class="form-label">Email</label>
            <input type="email" class="form-control" v-model="formData.email" :disabled="!isEditing">
          </div>
          <div class="mb-3">
            <label class="form-label">Вес (кг)</label>
            <input type="number" step="0.1" class="form-control" v-model="formData.weight" :disabled="!isEditing">
          </div>
          <div class="mb-3">
            <label class="form-label">Рост (см)</label>
            <input type="number" step="1" class="form-control" v-model="formData.height" :disabled="!isEditing">
          </div>
        </div>

        <div class="col-md-6">
          <div class="bg-secondary bg-opacity-25 rounded-3 p-3">
            <h5><i class="bi bi-graph-up me-2"></i>Твоя статистика</h5>
            <p><strong>Всего тренировок:</strong> {{ totalWorkouts }}</p>
            <p><strong>Всего упражнений (сетов):</strong> {{ totalSets }}</p>
            <p><strong>Общий объём (кг):</strong> {{ totalVolume }}</p>
          </div>
          <hr>
          <div v-if="bestSet" class="mt-3">
            <h5><i class="bi bi-trophy me-2"></i>Лучший подход</h5>
            <p><strong>Упражнение:</strong> {{ bestSet.exercise_name }}</p>
            <p><strong>Вес:</strong> {{ bestSet.weight_kg }} кг × {{ bestSet.sets }}×{{ bestSet.reps }}</p>
            <p><strong>Дата:</strong> {{ formatDate(bestSet.date) }}</p>
          </div>
          <div v-else class="text-muted">Нет данных</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '../stores/userStore'
import api from '../services/api'

const userStore = useUserStore()
const user = userStore.user

const isEditing = ref(false)
const saving = ref(false)
const formData = ref({
  email: user?.email || '',
  weight: user?.weight || '',
  height: user?.height || ''
})

const totalWorkouts = ref(0)
const totalSets = ref(0)
const totalVolume = ref(0)
const bestSet = ref(null)

const enableEditing = () => {
  isEditing.value = true
  formData.value = {
    email: user.email,
    weight: user.weight || '',
    height: user.height || ''
  }
}

const cancelEditing = () => {
  isEditing.value = false
  // сброс
  formData.value = {
    email: user.email,
    weight: user.weight || '',
    height: user.height || ''
  }
}

const saveProfile = async () => {
  if (!user) return
  saving.value = true
  try {
    await userStore.updateUser(user.id, {
      email: formData.value.email,
      weight: formData.value.weight || null,
      height: formData.value.height || null
    })
    // обновляем ссылку
    user.email = formData.value.email
    user.weight = formData.value.weight
    user.height = formData.value.height
    isEditing.value = false
    alert('Профиль обновлён')
    loadStats() // перезагружаем статистику (если нужно)
  } catch (err) {
    console.error(err)
    alert('Ошибка сохранения: ' + (err.response?.data?.message || err.message))
  } finally {
    saving.value = false
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString()
}

const loadStats = async () => {
  if (!user) return
  try {
    const workoutsRes = await api.get('/workouts', { params: { userId: user.id } })
    const workouts = workoutsRes.data
    totalWorkouts.value = workouts.length
    let sets = 0, volume = 0
    workouts.forEach(w => {
      (w.workout_exercises || []).forEach(we => {
        sets += we.sets || 0
        volume += (we.sets || 0) * (we.reps || 0) * (we.weight_kg || 0)
      })
    })
    totalSets.value = sets
    totalVolume.value = volume

    const freqRes = await api.get(`/analytics/frequent/${user.id}`)
    if (freqRes.data.length) {
      const topExerciseId = freqRes.data[0].id
      const bestRes = await api.get(`/analytics/best-set/${topExerciseId}`)
      bestSet.value = bestRes.data
    }
  } catch (err) {
    console.error('Статистика не загружена:', err)
  }
}

onMounted(() => {
  loadStats()
})
</script>