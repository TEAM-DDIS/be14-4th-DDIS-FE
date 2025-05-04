<template>
    <div class="mypage">
      <h2>마이페이지</h2>
      <div v-if="user.clientId">
        <p><strong>아이디:</strong> {{ user.clientId }}</p>
        <p><strong>이메일:</strong> {{ user.clientEmail }}</p>
        <p><strong>생년월일:</strong> {{ user.clientBirth }}</p>
        <p><strong>닉네임:</strong> {{ user.clientNickname }}</p>
        <p><strong>색상코드:</strong> {{ user.clientColorRgb }}</p>
      </div>
      <div v-else>
        <p>정보를 불러오는 중이거나 인증되지 않았습니다.</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import axios from '@/utils/axios'
  
  const user = ref({})
  
  onMounted(async () => {
    try {
      const res = await axios.get('/clients/mypage') // ✅ 토큰 필요
      user.value = res.data
    } catch (err) {
      console.error('마이페이지 불러오기 실패', err)
      user.value = {}
    }
  })
  </script>
  
  <style scoped>
  .mypage {
    max-width: 600px;
    margin: 100px auto;
    padding: 20px;
  }
  </style>