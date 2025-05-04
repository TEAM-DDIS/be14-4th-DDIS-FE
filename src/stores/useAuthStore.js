import { defineStore } from 'pinia'
import axios from '@/utils/axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: null,
    refreshToken: null,
    user: {
      nickname: '',
      email: '',
      image: '',
    }
  }),

  actions: {
    // 토큰 저장
    setTokens(accessToken, refreshToken) {
      this.accessToken = accessToken
      this.refreshToken = refreshToken
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
    },

    // 토큰 제거
    clearTokens() {
      this.accessToken = null
      this.refreshToken = null
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    },

    // 페이지 새로고침 시 토큰 불러오기
    loadTokens() {
      this.accessToken = localStorage.getItem('accessToken')
      this.refreshToken = localStorage.getItem('refreshToken')
    },

    // 유저 프로필 불러오기
    async fetchUserProfile() {
        if (!this.accessToken) return;

        try {
          const res = await axios.get('/clients/mypage'); // 서버에서 토큰 파싱해 clientId 추출
          this.user = res.data;
        } catch (err) {
          console.error('유저 정보 불러오기 실패', err);
        }
    },

    // 로그아웃 처리
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