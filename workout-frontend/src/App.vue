<template>
  <div class="min-vh-100 d-flex flex-column">
    <nav class="navbar navbar-dark bg-dark px-4 py-3">
      <div class="container-fluid d-flex justify-content-between align-items-center">
        <router-link to="/" class="navbar-brand fw-bold fs-3 text-orange">
          <i class="bi bi-activity me-2"></i>Трекинг тренировок
        </router-link>
        <div class="ms-auto d-flex gap-3">
          <router-link to="/" class="nav-link text-white">
            <i class="bi bi-house-door-fill me-1"></i> Упражнения
          </router-link>
          <router-link to="/calendar" class="nav-link text-white">
            <i class="bi bi-calendar-week-fill me-1"></i> Календарь
          </router-link>
          <router-link v-if="userStore.user" to="/profile" class="nav-link text-white">
            <i class="bi bi-person-circle me-1"></i> Профиль
          </router-link>
          <button v-if="userStore.user" @click="logout" class="btn btn-outline-warning btn-sm">
            <i class="bi bi-box-arrow-right me-1"></i> Выйти
          </button>
          <router-link v-else to="/login" class="btn btn-warning btn-sm">
            <i class="bi bi-door-open me-1"></i> Вход
          </router-link>
        </div>
      </div>
    </nav>
    <main class="flex-grow-1">
      <router-view />
    </main>
    <footer class="text-center text-muted py-3 small border-top border-secondary">
      <i class="bi bi-heart-fill text-danger me-1"></i> Трекинг тренировок – отслеживай прогресс
    </footer>
  </div>
</template>

<script setup>
import { useUserStore } from './stores/userStore'
import { useRouter } from 'vue-router'
const userStore = useUserStore()
const router = useRouter()
const logout = () => {
  userStore.logout()
  router.push('/')
}
</script>

<style>
body {
  background: url('/images/bg.jpg') no-repeat center center fixed;
  background-size: cover;
  position: relative;
}
body::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  z-index: -1;
}
.text-orange {
  color: #f97316 !important;
}
.btn-primary {
  background-color: #f97316;
  border-color: #f97316;
}
.btn-primary:hover {
  background-color: #e05e00;
}
</style>