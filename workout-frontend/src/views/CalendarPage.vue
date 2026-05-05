<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <button class="btn btn-outline-primary" @click="prevMonth">◀ {{ currentMonthName }}</button>
      <h2 class="text-orange m-0"><i class="bi bi-calendar-week me-2"></i>{{ currentMonthName }} {{ currentYear }}</h2>
      <button class="btn btn-outline-primary" @click="nextMonth">{{ nextMonthName }} ▶</button>
    </div>

    <div class="card bg-dark text-white">
      <div class="card-body">
        <div class="row mb-2 text-center fw-bold">
          <div class="col">Пн</div><div class="col">Вт</div><div class="col">Ср</div>
          <div class="col">Чт</div><div class="col">Пт</div><div class="col">Сб</div>
          <div class="col">Вс</div>
        </div>
        <div v-for="week in weeks" :key="week" class="row">
          <div v-for="day in week" :key="day.date" class="col text-center p-2">
            <div v-if="day.date" class="calendar-day" 
                 :class="{ 'bg-orange text-dark': isToday(day.date), 'has-workout': day.hasWorkout }"
                 @click="selectDay(day.date)">
              {{ day.date.getDate() }}
            </div>
            <div v-else class="p-2"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Список тренировок на выбранный день -->
    <div v-if="selectedDate" class="mt-4">
      <h4 class="text-orange"><i class="bi bi-list-check me-2"></i>Тренировки на {{ formatDate(selectedDate) }}</h4>
      <div v-if="loadingWorkouts" class="text-muted">Загрузка...</div>
      <div v-else-if="selectedDateWorkouts.length === 0" class="text-muted">Нет тренировок</div>
      <div v-for="w in selectedDateWorkouts" :key="w.id" class="workout-card mb-3" @click="toggleWorkoutDetails(w.id)">
        <div class="workout-card-header d-flex justify-content-between align-items-center p-3">
          <div>
            <strong><i class="bi bi-clock me-1"></i>{{ w.duration_minutes || 0 }} мин</strong>
            <span class="ms-3"><i class="bi bi-arrow-repeat me-1"></i>{{ w.workout_exercises?.length || 0 }} упр.</span>
            <span v-if="w.notes" class="ms-3 text-muted"><i class="bi bi-chat me-1"></i>{{ w.notes }}</span>
          </div>
          <div>
            <i class="bi bi-chevron-down" :class="{ 'rotate': expandedWorkout === w.id }"></i>
          </div>
        </div>
        <!-- Блок с деталями упражнений (раскрывается при клике) -->
        <div v-if="expandedWorkout === w.id" class="workout-card-details p-3 pt-0">
          <hr class="my-2">
          <div v-for="we in w.workout_exercises" :key="we.id" class="exercise-item mb-2">
            <strong><i class="bi bi-barbell me-1"></i>{{ we.exercise?.name || 'Упражнение' }}</strong>
            <div class="exercise-stats">
              {{ we.sets || 0 }} подходов × {{ we.reps || 0 }} повторений
              <span v-if="we.weight_kg"> | вес: {{ we.weight_kg }} кг</span>
            </div>
          </div>
          <div class="mt-2 d-flex justify-content-end">
            <button class="btn btn-sm btn-outline-primary me-2" @click.stop="editWorkout(w.id)">
              <i class="bi bi-pencil"></i> Редактировать
            </button>
            <button class="btn btn-sm btn-outline-danger" @click.stop="deleteWorkout(w.id)">
              <i class="bi bi-trash"></i> Удалить
            </button>
          </div>
        </div>
      </div>
      <button class="btn btn-primary mt-2" @click="createWorkout(selectedDate)">
        <i class="bi bi-plus-circle me-2"></i>Добавить тренировку
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'
import { useUserStore } from '../stores/userStore'

const router = useRouter()
const userStore = useUserStore()
const currentDate = ref(new Date())
const workouts = ref([])           // все тренировки пользователя
const selectedDate = ref(null)
const loadingWorkouts = ref(false)
const expandedWorkout = ref(null)   // id раскрытой тренировки

const currentYear = computed(() => currentDate.value.getFullYear())
const currentMonth = computed(() => currentDate.value.getMonth())
const currentMonthName = computed(() => currentDate.value.toLocaleString('ru', { month: 'long' }))
const nextMonthName = computed(() => {
  const d = new Date(currentYear.value, currentMonth.value + 1, 1)
  return d.toLocaleString('ru', { month: 'long' })
})

const formatDate = (date) => {
  return date.toLocaleDateString('ru')
}

// Загрузка тренировок за текущий месяц
const fetchWorkouts = async () => {
  if (!userStore.user) return
  const start = new Date(currentYear.value, currentMonth.value, 1)
  const end = new Date(currentYear.value, currentMonth.value + 1, 0)
  const from = start.toISOString().split('T')[0]
  const to = end.toISOString().split('T')[0]
  try {
    const res = await api.get('/workouts', {
      params: { userId: userStore.user.id, from, to }
    })
    workouts.value = res.data
  } catch (err) {
    console.error(err)
  }
}

// Проверка наличия тренировки в день
const hasWorkoutOnDate = (date) => {
  const dateStr = date.toISOString().split('T')[0]
  return workouts.value.some(w => w.date?.split('T')[0] === dateStr)
}

// Тренировки для выбранной даты
const selectedDateWorkouts = computed(() => {
  if (!selectedDate.value) return []
  const dateStr = selectedDate.value.toISOString().split('T')[0]
  return workouts.value.filter(w => w.date?.split('T')[0] === dateStr)
})

// Генерация календаря
const weeks = computed(() => {
  const firstDayOfMonth = new Date(currentYear.value, currentMonth.value, 1)
  const startDay = firstDayOfMonth.getDay() || 7
  const daysInMonth = new Date(currentYear.value, currentMonth.value + 1, 0).getDate()
  const days = []
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(currentYear.value, currentMonth.value, i))
  }
  const prevMonthDays = startDay - 1
  const allDays = [...Array(prevMonthDays).fill(null), ...days]
  const weeksArray = []
  for (let i = 0; i < allDays.length; i += 7) {
    weeksArray.push(allDays.slice(i, i + 7))
  }
  return weeksArray.map(week => week.map(day => ({
    date: day,
    hasWorkout: day ? hasWorkoutOnDate(day) : false
  })))
})

const isToday = (date) => {
  const today = new Date()
  return date && date.toDateString() === today.toDateString()
}

const selectDay = (date) => {
  if (!date) return
  selectedDate.value = date
  expandedWorkout.value = null
}

const toggleWorkoutDetails = (workoutId) => {
  if (expandedWorkout.value === workoutId) {
    expandedWorkout.value = null
  } else {
    expandedWorkout.value = workoutId
  }
}

const editWorkout = (workoutId) => {
  router.push(`/workout/${workoutId}`)
}

const deleteWorkout = async (workoutId) => {
  if (!confirm('Удалить тренировку?')) return
  try {
    await api.delete(`/workouts/${workoutId}`)
    await fetchWorkouts()
    // если удалена тренировка на выбранный день, возможно, список изменится
  } catch (err) {
    console.error(err)
    alert('Ошибка удаления')
  }
}

const createWorkout = (date) => {
  const dateStr = date.toISOString().split('T')[0]
  router.push(`/workout/new?date=${dateStr}`)
}

const prevMonth = async () => {
  currentDate.value = new Date(currentYear.value, currentMonth.value - 1, 1)
  await fetchWorkouts()
  selectedDate.value = null
  expandedWorkout.value = null
}
const nextMonth = async () => {
  currentDate.value = new Date(currentYear.value, currentMonth.value + 1, 1)
  await fetchWorkouts()
  selectedDate.value = null
  expandedWorkout.value = null
}

onMounted(async () => {
  await fetchWorkouts()
})
</script>

<style scoped>
.calendar-day {
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: 0.2s;
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.calendar-day:hover {
  background-color: #f97316;
  color: #0a0f1c;
}
.bg-orange {
  background-color: #f97316;
  color: #0a0f1c;
}
.has-workout {
  border: 2px solid #f97316;
  font-weight: bold;
}
/* Карточка тренировки – светлый фон, контрастный текст */
.workout-card {
  background: #2d3748;
  border-radius: 12px;
  cursor: pointer;
  transition: 0.2s;
}
.workout-card:hover {
  background: #374151;
}
.workout-card-header {
  color: #e2e8f0;
}
.workout-card-details {
  background: #1f2937;
  border-radius: 0 0 12px 12px;
  color: #cbd5e1;
}
.exercise-item {
  border-left: 2px solid #f97316;
  padding-left: 10px;
}
.exercise-stats {
  font-size: 0.85rem;
  color: #9ca3af;
}
.rotate {
  transform: rotate(180deg);
  transition: transform 0.2s;
}
i.bi-chevron-down {
  display: inline-block;
  transition: transform 0.2s;
}
</style>