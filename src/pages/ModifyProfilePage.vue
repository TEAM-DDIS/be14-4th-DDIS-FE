<template>
  <div class="profile-edit-page">
    <h2 class="page-title">계정</h2>

    <div class="profile-section">
      <div class="nickname-row">
        <label>닉네임</label>
        <div class="nickname-input-wrapper">
          <input v-model="nickname" class="nickname-input" />
          <button class="edit-button" @click="updateNickname">✎</button>
        </div>
      </div>

      <div class="info-row">
        <label>이메일</label>
        <div class="info-box">
          <span class="enable-text">{{ email }}</span>
          <button class="small-button" disabled>이메일 변경</button>
        </div>
      </div>

      <div class="info-row">
        <label>비밀번호</label>
        <div class="info-box">
          <span class="description">비밀번호 변경을 통해 계정 보안을 유지할 수 있습니다.</span>
          <button class="small-button">비밀번호 변경</button>
        </div>
      </div>

      <div class="info-row">
        <label>회원 탈퇴</label>
        <div class="info-box">
          <span class="description">탈퇴 후에는 복구가 불가능하며, 계정 정보 및 데이터는 모두 삭제됩니다.</span>
          <button class="danger-button">회원 탈퇴</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/utils/axios'

const nickname = ref('')
const email = ref('')

onMounted(async () => {
  try {
    const response = await axios.get('/clients/mypage')
    nickname.value = response.data.clientNickname
    email.value = response.data.clientEmail
  } catch (error) {
    console.error('마이페이지 조회 실패:', error)
    alert('로그인이 필요하거나 마이페이지 정보를 불러오지 못했습니다.')
  }
})

const updateNickname = async () => {
  if (!nickname.value.trim()) return alert('닉네임을 입력해주세요.')

  try {
    const res = await axios.patch('/clients/update', {
      clientId: '', // 백엔드에서 토큰 기반으로 clientId 조회하면 이 필드는 필요 없을 수도 있음
      newNickname: nickname.value,
      newEmail: null, // 이메일은 안 바꾸므로 null
    })

    alert(res.data.message || '닉네임이 성공적으로 변경되었습니다.')
  } catch (err) {
    console.error('닉네임 수정 오류:', err)
    alert('닉네임 수정에 실패했습니다.')
  }
}
</script>

<style scoped>
  .profile-edit-page {
    max-width: 720px;
    margin: 100px auto;
    padding: 0 20px;
    font-family: sans-serif;
  }
  
  .page-title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 32px;
    border-bottom: 1px solid #eee;
    padding-bottom: 12px;
  }
  
  .profile-section {
    display: flex;
    flex-direction: column;
    gap: 28px;
    align-items: flex-start; /* 모든 요소를 왼쪽 정렬 */
  }
  
  .nickname-row label,
  .info-row label {
    font-weight: 600;
    font-size: 15px;
    margin-bottom: 6px;
    display: block;
  }
  
  .nickname-input-wrapper,
  .info-box {
    display: flex;
    align-items: center;
    justify-content: space-between; /* 내부 요소 간 균등한 간격 */
    width: 100%; /* 부모 요소 너비에 맞춤 */
   }
  
  .nickname-input {
    width: 240px;
    padding: 8px 12px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 6px;
  }
  
  .edit-button {
    background: none;
    border: none;
    font-size: 16px;
    cursor: pointer;
  }
  
  .info-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }
  
  .disabled-text {
    color: #888;
    font-size: 14px;
  }
  
  .description {
    color: #888;
    font-size: 13px;
    max-width: 400px;
  }
  
  .small-button {
    padding: 6px 12px;
    border: 1px solid #ccc;
    background-color: #fff;
    border-radius: 6px;
    font-size: 13px;
    cursor: pointer;
  }
  
  .danger-button {
    padding: 6px 12px;
    background-color: #ff4d4f;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 13px;
    cursor: pointer;
  }
  </style>
