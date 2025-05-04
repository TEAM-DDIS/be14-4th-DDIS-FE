<template>
  <div class="find-id-page">
    <h2>아이디 찾기</h2>

    <div class="form-section">
      <input
        v-model="form.email"
        type="email"
        placeholder="이메일 입력"
        @blur="validateEmail"
      />
      <button @click="sendVerificationCode" :disabled="errors.email">
        인증번호 전송
      </button>
      <div v-if="isCodeSent">
        <input v-model="form.code" type="text" placeholder="인증번호 입력" />
        <button @click="verifyCode">인증 확인</button>
        <span>{{ formattedTimer }}</span>
      </div>
    </div>

    <div v-if="isVerified" class="form-section">
      <input v-model="form.name" type="text" placeholder="이름 입력" />
      <button @click="findId">아이디 찾기</button>
    </div>

    <div v-if="foundId" class="result">
      <p>회원님의 아이디는 <strong>{{ foundId }}</strong>입니다.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import axios from '@/utils/axios'

const form = ref({
  email: '',
  code: '',
  name: '',
})

const errors = ref({ email: false })
const isCodeSent = ref(false)
const isVerified = ref(false)
const foundId = ref('')
const timer = ref(0)
let timerInterval = null

const formattedTimer = computed(() => {
  const min = Math.floor(timer.value / 60)
  const sec = String(timer.value % 60).padStart(2, '0')
  return `${min}:${sec}`
})

function validateEmail() {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  errors.value.email = !regex.test(form.value.email)
}

async function sendVerificationCode() {
  if (!form.value.email || errors.value.email) return

  try {
    await axios.post('/email/send-code', { email: form.value.email })

    isCodeSent.value = true
    timer.value = 180

    if (timerInterval) clearInterval(timerInterval)
    timerInterval = setInterval(() => {
      if (timer.value > 0) timer.value--
      else {
        clearInterval(timerInterval)
        isCodeSent.value = false
        alert('인증 시간이 만료되었습니다. 다시 시도해주세요.')
      }
    }, 1000)

    alert('인증번호가 이메일로 발송되었습니다.')
  } catch (err) {
    alert('인증번호 발송에 실패했습니다.')
    console.error(err)
  }
}

async function verifyCode() {
  try {
    await axios.post('/email/verify-code', {
      email: form.value.email,
      code: form.value.code,
    })

    isVerified.value = true
    alert('이메일 인증이 완료되었습니다.')
  } catch (err) {
    alert('인증번호가 올바르지 않거나 시간이 초과되었습니다.')
    console.error(err)
  }
}

async function findId() {
  try {
    const { data } = await axios.post('/clients/find-ID', {
      clientEmail: form.value.email,
      clientName: form.value.name,
    })

    foundId.value = data.clientId
  } catch (err) {
    alert('입력하신 정보와 일치하는 아이디가 없습니다.')
    console.error(err)
  }
}
</script>

<style scoped>
/* 기존 스타일 유지 */
.find-id-page {
  width: 100%;
  min-height: calc(100vh - 80px);
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 120px;
  box-sizing: border-box;
}

.form-section {
  width: 100%;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

input {
  width: 100%;
  height: 45px;
  border: 0.5px solid #cdcdcd;
  border-radius: 5px;
  padding: 0 14px;
  margin-bottom: 25px;
  font-size: 15px;
  box-sizing: border-box;
}

button {
  width: 100%;
  height: 45px;
  background-color: #50d4c6;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  color: white;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 11px;
  transition: background-color 0.2s;
}

button:hover {
  background-color: #6ce4dc;
}

.result {
  margin-top: 20px;
  font-size: 16px;
  text-align: center;
}
</style>
