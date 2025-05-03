<template>
  <div class="report-modal">
    <h2 class="title">신고</h2>

    <div class="report-grid">
      <label
        v-for="option in options"
        :key="option.value"
        class="report-option"
      >
        <input
          type="radio"
          name="report"
          :value="option.value"
          v-model="selected"
        />
        {{ option.label }}
      </label>
    </div>

    <textarea
      class="report-textarea"
      placeholder="신고 내용을 입력해 주세요."
      v-model="textareaValue"
      :disabled="selected !== '기타'"
    />

    <div class="report-buttons">
      <button class="cancel-btn" @click="emit('close')">취소</button>
      <button class="submit-btn" @click="handleSubmit">신고하기</button>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits, onMounted } from 'vue'

const emit = defineEmits(['close'])

const selected = ref('')
const textareaValue = ref('')
const clientNum = ref(null)
const clientId = ref('')

const props = defineProps({
  reportType: String,       // 'client' 또는 'post'
  reportTypeNum: Number     // 신고 대상 ID
})

// ✅ 라벨 및 고정된 신고 항목
const options = [
  { label: '상업적/홍보성', value: '상업적/홍보성' },
  { label: '음란/선정성', value: '음란/선정성' },
  { label: '불법정보', value: '불법정보' },
  { label: '욕설/인신공격', value: '욕설/인신공격' },
  { label: '개인정보노출', value: '개인정보노출' },
  { label: '기타', value: '기타' }
]

// ✅ 토큰에서 clientNum 추출
onMounted(() => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      clientNum.value = payload.sub // 문자열 그대로 저장
      console.log('🔥 clientNum (토큰):', clientNum.value)
    } catch (err) {
      console.error('토큰 파싱 실패:', err)
    }
  }
})

// ✅ 신고 제출
async function handleSubmit() {
  if (!selected.value) {
    alert('신고 사유를 선택해주세요.')
    return
  }

  const reportContent =
    selected.value === '기타' ? textareaValue.value.trim() : selected.value

  if (!reportContent) {
    alert('기타 사유를 입력해주세요.')
    return
  }

  const payload = {
    reportContent,
    reportType: props.reportType,
    clientId: clientNum.value,
    reportTypeNum: props.reportTypeNum
  }

  try {
    const res = await fetch('http://localhost:8080/report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      },
      body: JSON.stringify(payload)
    })

    if (!res.ok) throw new Error('요청 실패')

    alert('신고가 접수되었습니다.')
    emit('close')
  } catch (err) {
    console.error('신고 등록 실패:', err)
    alert('신고 등록 중 오류가 발생했습니다.')
  }
  console.log('🟢 최종 payload:', payload)
console.log('🔥 clientNum:', clientNum.value)
}
</script>


<style scoped>
.report-modal {
  position: fixed;
  top: 300px; /* ✅ 고정 거리로 위치 설정 */
  left: 50%;
  transform: translateX(-50%); /* ✅ 수평 중앙 정렬만 */
  width: 300px;
  padding: 30px;
  border-radius: 20px;
  border: 0.5px solid #cdcdcd;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 999;
}

.title {
  font-size: 20px;
  font-weight: bold;
  margin-top: 0;
  margin-bottom: 30px;
}

.report-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px 28px;
  margin-bottom: 20px;
  width: 100%;
}

.report-option {
  display: flex;
  align-items: center;
  font-size: 14px;
  gap: 6px;
  white-space: nowrap;
}

input[type='radio'] {
  accent-color: #000;
  margin: 0;
}

.report-textarea {
  width: 100%;
  height: 32px;
  resize: none;
  padding: 8px;
  font-size: 14px;
  border: 0.5px solid #cdcdcd;
  border-radius: 5px;
  margin-bottom: 24px;
  transition: opacity 0.2s;
}

.report-textarea:disabled {
  opacity: 0.3;
  background: #f8f8f8;
  cursor: not-allowed;
}

.report-buttons {
  display: flex;
  justify-content: space-between;
  width: 80%;
}

.cancel-btn {
  background: none;
  border: none;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
}

.submit-btn {
  background: none;
  border: none;
  font-weight: bold;
  font-size: 16px;
  color: red;
  cursor: pointer;
}
</style>
