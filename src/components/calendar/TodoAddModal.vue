<template>
  <transition name="fade">
    <div v-if="visible" class="modal-overlay" @click.self="handleClose">
      <div class="modal-content">
        <h2>To-do를 추가하세요</h2>

        <!-- Todo 내용 입력 -->
        <input
          v-model="content"
          type="text"
          placeholder="할 일 내용을 입력하세요"
        />

        <!-- 카테고리 선택 -->
        <select v-model.number="personalCategoryNum">
          <option :value="null">카테고리 선택 안함</option>
          <option
            v-for="cat in fetchedCategories"
            :key="cat.personalCategoryNum"
            :value="cat.personalCategoryNum"
          >
            {{ cat.personalCategoryName }}
          </option>
        </select>

        <!-- 모드 선택 -->
        <div class="mode-buttons">
          <button :class="{ active: mode === 'SINGLE' }" @click="mode = 'SINGLE'">일반</button>
          <button :class="{ active: mode === 'REPEAT' }" @click="mode = 'REPEAT'">반복</button>
          <button :class="{ active: mode === 'MULTI' }" @click="mode = 'MULTI'">다중</button>
        </div>

        <!-- 날짜 선택 -->
        <div v-show="mode === 'SINGLE'" class="date-picker">
          <input type="date" v-model="selectedDate" class="date-input" />
        </div>

        <div v-show="mode === 'MULTI'" class="date-picker">
          <div class="month-select">
            <select v-model="selectedMonth">
              <option v-for="(label, index) in monthLabels" :key="index" :value="index">
                {{ label }}
              </option>
            </select>
          </div>
          <div class="calendar-grid">
            <div
              v-for="date in calendarDates"
              :key="date"
              :class="['calendar-date', { selected: multiDates.includes(date) } ]"
              @click="toggleMultiDate(date)"
            >
              {{ date.slice(-2) }}
            </div>
          </div>
          <div class="selected-dates">
            <span
              v-for="(d, i) in multiDates"
              :key="i"
              class="tag"
              @click="removeMultiDate(i)"
            >
              {{ d }} ✕
            </span>
          </div>
        </div>

        <div v-show="mode === 'REPEAT'" class="repeat-section">
          <div class="repeat-days">
            <label v-for="(day, index) in weekDays" :key="day">
              <input type="checkbox" :value="index" v-model="repeatDays" />
              <span>{{ day }}</span>
            </label>
          </div>
          <div class="repeat-range">
            <label>시작일: <input type="date" v-model="repeatStart" /></label>
            <label>종료일: <input type="date" v-model="repeatEnd" /></label>
          </div>
        </div>

        <!-- 버튼 -->
        <div class="modal-actions">
          <button class="btn-cancel" @click="handleClose">취소</button>
          <button class="btn-confirm" @click="handleConfirm">확인</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import axios from 'axios'

const API_BASE = 'http://localhost:8080'
const CLIENT_NUM = 6

// Props & Emit 설정
const props = defineProps({
  visible: { type: Boolean, required: true },
  defaultDate: { type: String, default: '' }
})
const emit = defineEmits(['add', 'close'])

// Reactive Data
const content = ref('')
const personalCategoryNum = ref(null)
const mode = ref('SINGLE')
const selectedDate = ref(props.defaultDate)
const fetchedCategories = ref([])

const multiDates = ref([])
const selectedMonth = ref(new Date().getMonth())
const today = new Date()
const currentYear = today.getFullYear()

const repeatDays = ref([])
const repeatStart = ref('')
const repeatEnd = ref('')

const monthLabels = [
  '1월', '2월', '3월', '4월', '5월', '6월',
  '7월', '8월', '9월', '10월', '11월', '12월'
]

const weekDays = ['월', '화', '수', '목', '금', '토', '일']

const calendarDates = computed(() => {
  const dates = []
  const mm = String(selectedMonth.value + 1).padStart(2, '0')
  for (let d = 1; d <= 31; d++) {
    const dd = String(d).padStart(2, '0')
    const dateStr = `${currentYear}-${mm}-${dd}`
    const testDate = new Date(dateStr)
    if (testDate.getMonth() === selectedMonth.value) {
      dates.push(dateStr)
    }
  }
  return dates
})

// Watchers
watch(
  () => props.visible,
  async (open) => {
    if (open) {
      resetForm()
      await loadCategories()
    }
  },
  { immediate: true }
)

// Methods
async function loadCategories() {
  try {
    const { data } = await axios.get(`${API_BASE}/personal-categories/${CLIENT_NUM}`)
    fetchedCategories.value = data
  } catch (e) {
    console.error('카테고리 로딩 실패:', e)
  }
}

function toggleMultiDate(date) {
  const idx = multiDates.value.indexOf(date)
  if (idx >= 0) multiDates.value.splice(idx, 1)
  else multiDates.value.push(date)
}

function removeMultiDate(index) {
  multiDates.value.splice(index, 1)
}

function handleClose() {
  emit('close')
}

function handleConfirm() {
  if (!content.value) {
    alert('내용을 입력해주세요.')
    return
  }

  const base = {
    todoContent: content.value,
    personalCategoryNum: personalCategoryNum.value,
    clientNum: CLIENT_NUM,
    createType: mode.value,
    isPublic: false,
    pinOrder: 0
  }

  let payload = {}

  if (mode.value === 'SINGLE') {
    payload = { ...base, todoDate: selectedDate.value }
  } else if (mode.value === 'MULTI') {
    if (multiDates.value.length === 0) {
      alert('날짜를 하나 이상 선택해주세요.')
      return
    }
    payload = { ...base, todoDates: multiDates.value }
  } else if (mode.value === 'REPEAT') {
    if (!repeatStart.value || !repeatEnd.value || repeatDays.value.length === 0) {
      alert('시작일, 종료일, 요일을 모두 선택해주세요.')
      return
    }
    payload = {
      ...base,
      repeatInfo: {
        startDate: repeatStart.value,
        endDate: repeatEnd.value,
        days: repeatDays.value.map(Number)  // 0~6 (월~일)
      }
    }
  }

  emit('add', payload)
  emit('close')
}

function resetForm() {
  content.value = ''
  personalCategoryNum.value = null
  mode.value = 'SINGLE'
  selectedDate.value = props.defaultDate
  multiDates.value = []
  selectedMonth.value = today.getMonth()
  repeatDays.value = []
  repeatStart.value = ''
  repeatEnd.value = ''
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-content {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  width: 100%;
  max-width: 360px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.modal-content input {
  width: 94%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
}

.modal-content select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
}

.mode-buttons {
  display: flex;
  gap: 8px;
}

.mode-buttons button {
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: #f8f8f8;
  cursor: pointer;
}

.mode-buttons button.active {
  background: #000;
  color: #fff;
}

.mode-button:hover {
  background: #fff;
  border: 1px solid #000;
  color: #000;
}

.modal-actions {
  display: flex;
  gap: 8px;
}

.btn-cancel,
.btn-confirm {
  flex: 1;
  padding: 10px;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.btn-cancel {
  background: #eee;
  border: 1px solid transparent;
}

.btn-confirm {
  background: #000;
  color: #fff;
  border: 1px solid transparent;
}

.btn-cancel:hover,
.btn-confirm:hover {
  background: #fff;
  border: 1px solid #000;
  color: #000;
}

.selected-dates {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.tag {
  background: #eee;
  padding: 4px 8px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 0.9rem;
  user-select: none;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-top: 8px;
}

.calendar-date {
  padding: 6px;
  text-align: center;
  border-radius: 8px;
  cursor: pointer;
  border: 1px solid #ccc;
}

.calendar-date.selected {
  background: #000;
  color: #fff;
  border-color: #000;
}

.month-select {
  margin-bottom: 8px;
}

.repeat-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.repeat-days {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  justify-content: space-between;
}

.repeat-days label {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 30px;
  border-radius: 5px;
  border: 1px solid #ccc;
  background: #f5f5f5;
  font-weight: 500;
  font-size: 0.9rem;
  user-select: none;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, border-color 0.2s;
}

.repeat-days label:hover {
  background: #000;
  color: #fff;
  border-color: #000;
}

.repeat-days input[type="checkbox"] {
  display: none;
}

.repeat-days input[type="checkbox"]:checked + span {
  background: #000;
  color: #fff;
  border-color: #000;
}

.repeat-days label span {
  display: inline-block;
  width: 100%;
  height: 100%;
  line-height: 40px;
  text-align: center;
  border-radius: 3px;
  transition: inherit;
}

.repeat-days label:hover span {
  background: #000;
  color: #fff;
  border-color: #000;
}

.repeat-days input[type="checkbox"] {
  margin-right: 6px;
}

.repeat-range {
  display: flex;
  flex-direction: column; /* 이 줄이 핵심! */
  gap: 8px;
  flex-wrap: wrap;
  font-size: 15px;
  user-select: none;
}

.repeat-range label {
  flex: 1;
}
</style>
