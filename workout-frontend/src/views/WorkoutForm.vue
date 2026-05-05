<template>
  <div class="container py-4">
    <h2 class="text-orange mb-3">{{ isEdit ? 'Редактировать тренировку' : 'Новая тренировка' }}</h2>
    <div class="card bg-dark text-white p-3">
      <div class="mb-3">
        <label class="form-label">Дата</label>
        <input type="date" class="form-control" v-model="workoutDate">
      </div>
      <div class="mb-3">
        <label class="form-label">Общая продолжительность (мин)</label>
        <input type="number" class="form-control" v-model="duration">
      </div>
      <hr>
      <h4>Упражнения</h4>
      <div v-for="(ex, idx) in exerciseItems" :key="idx" class="border rounded p-2 mb-2">
        <select v-model="ex.exerciseId" class="form-select mb-2">
          <option :value="null">-- Выберите упражнение --</option>
          <option v-for="e in exercises" :key="e.id" :value="e.id">{{ e.name }}</option>
        </select>
        <div class="row g-2">
          <div class="col"><input type="number" class="form-control" placeholder="Подходы" v-model="ex.sets"></div>
          <div class="col"><input type="number" class="form-control" placeholder="Повторы" v-model="ex.reps"></div>
          <div class="col"><input type="number" class="form-control" placeholder="Вес (кг)" v-model="ex.weight"></div>
          <div class="col-auto"><button class="btn btn-danger" @click="removeExercise(idx)">✖</button></div>
        </div>
      </div>
      <button class="btn btn-secondary mb-3" @click="addExercise">+ Добавить упражнение</button>
      <button class="btn btn-primary" @click="saveWorkout">Сохранить тренировку</button>
    </div>
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
const exercises = ref([])
const workoutDate = ref(route.query.date || new Date().toISOString().split('T')[0])
const duration = ref(0)
const exerciseItems = ref([])

const isEdit = computed(() => !!route.params.id)

const addExercise = () => {
  exerciseItems.value.push({ exerciseId: null, sets: null, reps: null, weight: null })
}
const removeExercise = (idx) => {
  exerciseItems.value.splice(idx, 1)
}

const loadExercises = async () => {
  const res = await api.get('/exercises')
  exercises.value = res.data
}

// Загрузка тренировки для редактирования
const loadWorkout = async () => {
  const id = route.params.id
  try {
    const res = await api.get(`/workouts/${id}`)
    const workout = res.data
    workoutDate.value = workout.date?.split('T')[0] || workoutDate.value
    duration.value = workout.duration_minutes || 0
    exerciseItems.value = (workout.workout_exercises || []).map(we => ({
      id: we.id,
      exerciseId: we.exerciseId,
      sets: we.sets,
      reps: we.reps,
      weight: we.weight_kg
    }))
    if (exerciseItems.value.length === 0) addExercise()
  } catch (err) {
    console.error(err)
    alert('Не удалось загрузить тренировку')
  }
}

const saveWorkout = async () => {
  if (!userStore.user) return
  try {
    let workoutId
    if (isEdit.value) {
      // Обновляем тренировку
      await api.put(`/workouts/${route.params.id}`, {
        date: workoutDate.value,
        duration_minutes: duration.value,
        userId: userStore.user.id
      })
      workoutId = route.params.id
      // Удаляем старые упражнения
      await api.delete(`/workout-exercises/workout/${workoutId}`)
    } else {
      // Создаём новую
      const workoutRes = await api.post('/workouts', {
        date: workoutDate.value,
        duration_minutes: duration.value,
        userId: userStore.user.id
      })
      workoutId = workoutRes.data.id
    }

    // Добавляем упражнения заново
    for (let i = 0; i < exerciseItems.value.length; i++) {
      const ex = exerciseItems.value[i]
      if (ex.exerciseId) {
        await api.post('/workout-exercises', {
          workoutId,
          exerciseId: ex.exerciseId,
          sets: ex.sets || 0,
          reps: ex.reps || 0,
          weight_kg: ex.weight || 0,
          order: i + 1
        })
      }
    }
    router.push('/calendar')
  } catch (err) {
    console.error(err)
    alert('Ошибка сохранения тренировки')
  }
}

onMounted(async () => {
  await loadExercises()
  if (isEdit.value) {
    await loadWorkout()
  } else {
    if (exerciseItems.value.length === 0) addExercise()
  }
})
</script>