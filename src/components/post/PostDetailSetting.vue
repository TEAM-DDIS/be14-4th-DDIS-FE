<template>
    <div class="detail-section" :class="{ 'show-detail': modelValue }">
      <h3>모집게시글 상세 설정</h3>
  
      <!-- 공개여부 + 비밀번호 한 줄 -->
      <div class="form-group row">
        <label>공개여부</label>
        <div class="visibility-group">
          <label class="radio-label">
            <input type="radio" v-model="formData.visibility" value="public" />
            공개
          </label>
          <label class="radio-label">
            <input type="radio" v-model="formData.visibility" value="private" />
            비공개
          </label>
  
          <!-- 비밀번호 입력칸: 비공개 선택 시만 보임 -->
          <input
            v-if="formData.visibility === 'private'"
            type="password"
            class="password-input"
            v-model="formData.password"
            placeholder="비밀번호"
          />
        </div>
      </div>
  
      <!-- 모집기간 / 참여기간 한 줄 -->
      <div class="input-row">
        <div class="form-group">
          <label>모집기간</label>
          <div class="date-range">
            <input 
              type="date" 
              v-model="formData.recruitStartDate"
              :min="today"
              :max="maxRecruitEndDate"
              @change="validateRecruitDates"
            >
            <span>~</span>
            <input 
              type="date" 
              v-model="formData.recruitEndDate"
              :min="formData.recruitStartDate"
              :max="maxRecruitEndDate"
              @change="validateRecruitDates"
            >
          </div>
          <p class="hint">모집기간은 최대 30일까지 설정 가능합니다.</p>
        </div>
  
        <div class="form-group">
          <label>참여기간</label>
          <div class="date-range">
            <input 
              type="date" 
              v-model="formData.participateStartDate"
              :min="formData.recruitEndDate"
              :max="maxParticipateEndDate"
              @change="validateParticipateDates"
            >
            <span>~</span>
            <input 
              type="date" 
              v-model="formData.participateEndDate"
              :min="formData.participateStartDate"
              :max="maxParticipateEndDate"
              @change="validateParticipateDates"
            >
          </div>
          <p class="hint">참여기간은 최대 90일까지 설정 가능합니다.</p>
        </div>
      </div>
  
      <!-- 모집인원: 아래 단독 -->
      <div class="form-group full">
        <label>모집인원</label>
        <input type="number" v-model="formData.maxParticipants" min="1" />
      </div>
  
      <!-- 하단 버튼 -->
      <div class="button-group">
        <button class="cancel-btn" @click="closeDetail">취소</button>
        <button class="submit-btn" @click="submitDetail">확인</button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, defineProps, defineEmits, computed } from 'vue'
  
  const props = defineProps<{ modelValue: boolean }>()
  const emit = defineEmits(['update:modelValue', 'submit'])
  
  const formData = ref({
    visibility: 'public',
    password: '',
    recruitStartDate: '',
    recruitEndDate: '',
    participateStartDate: '',
    participateEndDate: '',
    maxParticipants: 1
  })
  
  const today = computed(() => {
    const date = new Date()
    return date.toISOString().split('T')[0]
  })
  
  const maxRecruitEndDate = computed(() => {
    if (!formData.value.recruitStartDate) return ''
    const date = new Date(formData.value.recruitStartDate)
    date.setDate(date.getDate() + 30)
    return date.toISOString().split('T')[0]
  })
  
  const maxParticipateEndDate = computed(() => {
    if (!formData.value.participateStartDate) return ''
    const date = new Date(formData.value.participateStartDate)
    date.setDate(date.getDate() + 90)
    return date.toISOString().split('T')[0]
  })
  
  const validateRecruitDates = () => {
    if (!formData.value.recruitStartDate || !formData.value.recruitEndDate) return
    
    const start = new Date(formData.value.recruitStartDate)
    const end = new Date(formData.value.recruitEndDate)
    const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffDays > 30) {
      alert('모집기간은 최대 30일까지 설정 가능합니다.')
      formData.value.recruitEndDate = maxRecruitEndDate.value
    }
  }
  
  const validateParticipateDates = () => {
    if (!formData.value.participateStartDate || !formData.value.participateEndDate) return
    
    const start = new Date(formData.value.participateStartDate)
    const end = new Date(formData.value.participateEndDate)
    const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffDays > 90) {
      alert('참여기간은 최대 90일까지 설정 가능합니다.')
      formData.value.participateEndDate = maxParticipateEndDate.value
    }
  }
  
  const closeDetail = () => emit('update:modelValue', false)
  
  const submitDetail = () => {
    if (!formData.value.recruitStartDate || !formData.value.recruitEndDate) {
      alert('모집기간을 설정해주세요.')
      return
    }
  
    if (!formData.value.participateStartDate || !formData.value.participateEndDate) {
      alert('참여기간을 설정해주세요.')
      return
    }
  
    if (formData.value.visibility === 'private' && !formData.value.password) {
      alert('비밀번호를 입력해주세요.')
      return
    }
  
    emit('submit', {
      ...formData.value,
      startDate: new Date(formData.value.recruitStartDate),
      endDate: new Date(formData.value.recruitEndDate)
    })
    closeDetail()
  }
  </script>
  
  <style scoped>
  .detail-section {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: white;
    z-index: 10;
    padding: 30px;
    box-sizing: border-box;
    border-radius: 12px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12); /* ✅ 그림자 추가 */
    border: 1px solid #eee;
    min-height: auto;
    max-height: 55vh;
  }
  
  .detail-section h3 {
    font-size: 20px;
    margin-bottom: 24px;
  }
  
  .form-group {
    margin-bottom: 20px;
    width: 100%;
  }
  
  .form-group.row {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .form-group.full {
    margin-bottom: 16px;
  }
  
  .form-group.half {
    flex: 1;
    min-width: 200px;
  }
  
  .form-group label {
    font-weight: bold;
    font-size: 16px;
    white-space: nowrap;
  }
  
  .visibility-group {
    display: flex;
    align-items: center;
    gap: 16px;
    flex: 1;
  }
  
  .radio-label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 15px;
    white-space: nowrap;
  }
  
  .password-input {
    padding: 8px 12px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 6px;
    width: 200px;
    margin-left: auto;
  }
  
  .input-row {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
    margin-bottom: 20px;
  }
  
  .form-group input {
    width: 100%;
    padding: 12px;
    font-size: 16px;
    border: 1px solid #ddd;
    border-radius: 6px;
    box-sizing: border-box;
  }
  
  .button-group {
    display: flex;
    justify-content: center;
    gap: 12px;
    margin-top: 20px;
    padding-bottom: 20px;
  }
  
  .cancel-btn,
  .submit-btn {
    padding: 12px 24px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 16px;
    min-width: 120px;
  }
  
  .cancel-btn {
    background: #e0e0e0;
  }
  
  .submit-btn {
    background: #000;
    color: white;
  }
  
  .submit-btn:hover {
    background: #333;
  }
  
  .hint-text {
    font-size: 12px;
    color: #666;
    margin-top: 4px;
  }
  
  .date-range {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .date-range input {
    flex: 1;
  }
  
  .date-range span {
    color: #666;
  }
  
  .hint {
    font-size: 12px;
    color: #666;
    margin-top: 5px;
  }
  </style>
  