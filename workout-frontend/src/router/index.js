import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import ExerciseDetail from '../views/ExerciseDetail.vue'
import CalendarPage from '../views/CalendarPage.vue'
import WorkoutForm from '../views/WorkoutForm.vue'
import ProfilePage from '../views/ProfilePage.vue'
import LoginPage from '../views/LoginPage.vue'
import RegisterPage from '../views/RegisterPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomePage },
    { path: '/exercise/:id', name: 'exercise-detail', component: ExerciseDetail },
    { path: '/calendar', name: 'calendar', component: CalendarPage },
    { path: '/workout/new', name: 'workout-new', component: WorkoutForm },
    { path: '/workout/:id', name: 'workout-edit', component: WorkoutForm },
    { path: '/profile', name: 'profile', component: ProfilePage },
    { path: '/login', name: 'login', component: LoginPage },
    { path: '/register', name: 'register', component: RegisterPage }
  ]
})

export default router