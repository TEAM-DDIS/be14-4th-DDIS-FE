<template>
  <div class="change-password-page">
    <img src="/images/logo.png" alt="Logo" class="logo" />

    <div class="form-section">
      <input
        type="email"
        placeholder="이메일을 입력하세요."
        v-model="form.email"
      />
      <button @click="sendVerificationCode">인증번호 전송</button>

      <div v-if="isCodeSent" class="timer-code-row">
        <input type="text" placeholder="인증번호" v-model="form.code" />
        <span class="timer">
          {{ Math.floor(timer / 60) }}:{{ (timer % 60).toString().padStart(2, '0') }}
        </span>
        <button class="small-btn" @click="verifyCode">인증 완료</button>
      </div>

      <input
        :type="showNewPassword ? 'text' : 'password'"
        placeholder="새 비밀번호"
        v-model="form.newPassword"
      />
      <input
        :type="showConfirmPassword ? 'text' : 'password'"
        placeholder="비밀번호 확인"
        v-model="form.confirmPassword"
      />

      <button @click="changePassword">비밀번호 변경</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from '@/utils/axios'

const form = ref({
  email: '',
  code: '',
  newPassword: '',
  confirmPassword: '',
})

const isCodeSent = ref(false)
const isVerified = ref(false)
const timer = ref(0)
let timerInterval = null

const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const sendVerificationCode = async () => {
  if (!form.value.email) return alert('이메일을 입력하세요.')

  try {
    await axios.post('/email/send-code', { email: form.value.email })

    isCodeSent.value = true
    isVerified.value = false
    timer.value = 300

    if (timerInterval) clearInterval(timerInterval)
    timerInterval = setInterval(() => {
      if (timer.value > 0) timer.value--
      else {
        clearInterval(timerInterval)
        isCodeSent.value = false
      }
    }, 1000)

    alert('인증번호가 이메일로 발송되었습니다.')
  } catch (err) {
    console.error(err)
    alert('인증번호 전송 실패')
  }
}

const verifyCode = async () => {
  if (!form.value.code) return alert('인증번호를 입력하세요.')

  try {
    await axios.post('/email/verify-code', {
      email: form.value.email,
      code: form.value.code,
    })
    isVerified.value = true
    alert('이메일 인증이 완료되었습니다.')
  } catch (err) {
    console.error(err)
    alert('인증번호가 올바르지 않습니다.')
  }
}

const changePassword = async () => {
  if (!isVerified.value) return alert('이메일 인증을 먼저 완료해주세요.')
  if (!form.value.newPassword || !form.value.confirmPassword) {
    return alert('비밀번호를 입력해주세요.')
  }
  if (form.value.newPassword !== form.value.confirmPassword) {
    return alert('비밀번호가 일치하지 않습니다.')
  }

  try {
    const res = await axios.post('/clients/reset-password', {
      clientEmail: form.value.email,
      newPassword: form.value.newPassword,
    })

    alert(res.data.message || '비밀번호가 변경되었습니다.')
  } catch (err) {
    console.error(err)
    alert('오류 발생 또는 서버 응답 실패')
  }
}
</script>

<style scoped>
.change-password-page {
  max-width: 400px;
  margin: 80px auto;
  padding: 20px;
  text-align: center;
}

.logo {
  width: 120px;
  margin: 0 auto 30px;
  display: block;
}

.form-section input {
  width: 100%;
  padding: 10px;
  margin-bottom: 12px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.form-section button {
  width: 100%;
  padding: 10px;
  background-color: #50d4c6;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 10px;
}

.timer-code-row {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 12px;
}

.timer {
  font-weight: bold;
  color: #ff5a5a;
  white-space: nowrap;
}

.small-btn {
  padding: 8px 12px;
  background-color: #50d4c6;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 13px;
  cursor: pointer;
}
</style>
