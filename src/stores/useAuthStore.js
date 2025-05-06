import { defineStore } from 'pinia'
import axios from '@/utils/axios'
import { jwtDecode } from 'jwt-decode'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: null,
    refreshToken: null,
    clientId: null,
    user: {
      nickname: '',
      email: '',
      image: '',
    }
  }),

  actions: {
    // ✅ 토큰 저장 + clientId 디코딩
    setTokens(accessToken, refreshToken) {
      this.accessToken = accessToken
      this.refreshToken = refreshToken
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)

      try {
        const decoded = jwtDecode(accessToken)
        this.clientId = decoded.clientNum
      } catch (err) {
        console.error('JWT 디코딩 실패', err)
        this.clientId = null
      }
    },

    // ✅ 토큰 제거
    clearTokens() {
      this.accessToken = null
      this.refreshToken = null
      this.clientId = null
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    },

    // ✅ 페이지 새로고침 시 토큰 & clientId 불러오기
    loadTokens() {
      this.accessToken = localStorage.getItem('accessToken')
      this.refreshToken = localStorage.getItem('refreshToken')

      if (this.accessToken) {
        try {
          const decoded = jwtDecode(this.accessToken)
          this.clientId = decoded.clientNum
        } catch (err) {
          console.error('JWT 디코딩 실패', err)
          this.clientId = null
        }
      }
    },

    // ✅ 유저 프로필 불러오기
    async fetchUserProfile() {
      if (!this.accessToken) return
    
      try {
        const res = await axios.get('/clients/mypage')
        this.user = {
          nickname: res.data.clientNickname,
          email: res.data.clientEmail,
          image: '', // 백엔드에서 이미지 URL 안 주는 중이면 기본값 처리
        }
      } catch (err) {
        console.error('유저 정보 불러오기 실패', err)
      }
    },

    // ✅ 로그아웃
    logout() {
      this.clearTokens()
      this.user = {
        nickname: '',
        email: '',
        image: ''
      }
    }
  }
})
