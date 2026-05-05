import { defineStore } from 'pinia'
import api from '../services/api'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null
  }),
  actions: {
    async login(username, password) {
      const res = await api.post('/auth/login', { username, password })
      this.user = res.data
      this.token = res.data.token
      localStorage.setItem('token', this.token)
      localStorage.setItem('user', JSON.stringify(this.user))
      api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
    },
    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      delete api.defaults.headers.common['Authorization']
    },
    async register(username, email, password) {
      const res = await api.post('/auth/register', { username, email, password })
      return res.data
    },
    async updateUser(id, data) {
      const res = await api.put(`/users/${id}`, data)
      // обновляем локального пользователя
      this.user = { ...this.user, ...res.data }
      localStorage.setItem('user', JSON.stringify(this.user))
      return res.data
    }
  }
})