import axios from 'axios'
import { useAuthStore } from '@/stores/useAuthStore'

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
})

// 요청 인터셉터 - accessToken 붙이기
api.interceptors.request.use((config) => {
  const authStore = useAuthStore()
  const token = authStore.accessToken

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

// 응답 인터셉터 - 401일 때 refresh 시도
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const authStore = useAuthStore()

      try {
        const res = await axios.post('http://localhost:8080/clients/token/refresh', null, {
          headers: {
            'Refresh-Token': authStore.refreshToken,
          },
        })

        const newAccessToken = res.data.accessToken
        authStore.accessToken = newAccessToken
        localStorage.setItem('accessToken', newAccessToken)

        // 헤더에 새 토큰으로 재요청
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return api(originalRequest)
      } catch (refreshError) {
        console.error('Refresh Token 만료됨. 로그아웃 처리 필요')
        authStore.logout() // 로그아웃 로직 실행
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api