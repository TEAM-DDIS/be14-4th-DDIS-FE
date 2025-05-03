<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <h2>TO-DO 신청</h2>
      <div class="todo-info">
        <h3>{{ todoData.title }}</h3>
        <div class="info-row">
          <span class="label">참여 기간:</span>
          <span>{{ formatDateRange(todoData.startDate, todoData.endDate) }}</span>
        </div>
        <div class="info-row">
          <span class="label">참여 인원:</span>
          <span>{{ todoData.currentParticipants }}/{{ todoData.maxParticipants }}명</span>
        </div>
      </div>

      <div class="todo-rules">
        <h4>TO-DO 리스트</h4>
        <ul>
          <li v-for="(todo, index) in todoData.todos" :key="index">
            {{ todo }}
          </li>
        </ul>

        <h4>인증 방법</h4>
        <p>{{ todoData.verificationGuide }}</p>
      </div>

      <div class="agreement">
        <label class="checkbox-label">
          <input type="checkbox" v-model="agreed">
          위 내용을 모두 확인하였으며, TO-DO 참여에 동의합니다.
        </label>
      </div>

      <div class="button-group">
        <button type="button" @click="closeModal" class="cancel-btn">취소</button>
        <button 
          type="button" 
          @click="handleApply" 
          class="submit-btn"
          :disabled="!agreed || todoData.currentParticipants >= todoData.maxParticipants"
        >
          신청하기
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'

interface TodoData {
  title: string
  startDate: Date
  endDate: Date
  currentParticipants: number
  maxParticipants: number
  todos: string[]
  verificationGuide: string
}

const props = defineProps<{
  modelValue: boolean
  todoData: TodoData
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'apply'): void
}>()

const agreed = ref(false)

const closeModal = () => {
  emit('update:modelValue', false)
}

const handleApply = () => {
  if (!agreed.value) return
  emit('apply')
  closeModal()
}

const formatDateRange = (start: Date, end: Date) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\//g, '-')
  }
  return `${formatDate(start)} ~ ${formatDate(end)}`
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
}

h2 {
  margin-bottom: 1.5rem;
  text-align: center;
}

.todo-info {
  margin-bottom: 2rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 4px;
}

.todo-info h3 {
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.info-row {
  display: flex;
  margin-bottom: 0.5rem;
}

.label {
  width: 100px;
  color: #666;
}

.todo-rules {
  margin-bottom: 2rem;
}

.todo-rules h4 {
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.todo-rules ul {
  list-style: none;
  padding-left: 0;
  margin-bottom: 1.5rem;
}

.todo-rules li {
  margin-bottom: 0.5rem;
  padding-left: 1rem;
  position: relative;
}

.todo-rules li::before {
  content: "•";
  position: absolute;
  left: 0;
}

.agreement {
  margin-bottom: 2rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.button-group {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.submit-btn,
.cancel-btn {
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
}

.submit-btn {
  background: #000;
  color: white;
}

.submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.cancel-btn {
  background: #6c757d;
  color: white;
}

.submit-btn:not(:disabled):hover,
.cancel-btn:hover {
  opacity: 0.9;
}
</style> 