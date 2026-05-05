<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-5">
        <div class="card bg-dark text-white border-secondary">
          <div class="card-body p-4">
            <h2 class="text-center text-orange mb-4">Регистрация</h2>
            <form @submit.prevent="handleRegister">
              <div class="mb-3">
                <label class="form-label">Имя пользователя</label>
                <input type="text" class="form-control bg-secondary bg-opacity-25 text-white border-secondary" v-model="username" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input type="email" class="form-control bg-secondary bg-opacity-25 text-white border-secondary" v-model="email" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Пароль</label>
                <input type="password" class="form-control bg-secondary bg-opacity-25 text-white border-secondary" v-model="password" required>
              </div>
              <button type="submit" class="btn btn-primary w-100" :disabled="loading">
                {{ loading ? 'Регистрация...' : 'Зарегистрироваться' }}
              </button>
              <div v-if="errorMessage" class="alert alert-danger mt-3">{{ errorMessage }}</div>
            </form>
            <p class="text-center mt-3">
              Уже есть аккаунт? <router-link to="/login" class="text-orange">Войти</router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/userStore'

const router = useRouter()
const userStore = useUserStore()
const username = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')

const handleRegister = async () => {
  loading.value = true
  errorMessage.value = ''
  try {
    await userStore.register(username.value, email.value, password.value)
    alert('Регистрация успешна! Теперь войдите.')
    router.push('/login')
  } catch (err) {
    errorMessage.value = err.response?.data?.message || 'Ошибка регистрации'
  } finally {
    loading.value = false
  }
}
</script>