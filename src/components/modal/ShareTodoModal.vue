<template>
    <div class="modal-overlay">
      <div class="modal-content">
        <div class="share-todo-modal">
          <h2>공통 TODO 생성</h2>
  
          <!-- 탭 선택 -->
          <div class="tab-buttons">
            <button :class="{ active: mode === 'ai' }" @click="mode = 'ai'">🤖 AI 생성</button>
            <button :class="{ active: mode === 'manual' }" @click="mode = 'manual'">✍️ 직접 작성</button>
          </div>
  
          <!-- 🤖 AI 추천 탭 -->
          <div v-if="mode === 'ai'" class="tab-content">
            <input
              v-model="topic"
              class="topic-input"
              placeholder="주제를 입력하세요 (예: 플랭크 챌린지)"
            />
            <button @click="fetchAiTodos">AI 추천 TODO 가져오기</button>
  
            <ul class="todo-list">
              <li v-for="(todo, idx) in aiTodos" :key="todo.shareTodoNum">
                📌 {{ todo.shareTodoName }}
                <div class="weekday-selector">
                  <label
                    v-for="day in weekdays"
                    :key="day.value"
                    class="weekday-option"
                  >
                    <input
                      type="checkbox"
                      :value="day.value"
                      v-model="todoSelections[idx].selectedWeekdays"
                    />
                    {{ day.label }}
                  </label>
                </div>
              </li>
            </ul>
  
            <button @click="registerTodosToServer" class="register-button">📤 등록</button>
          </div>
  
          <!-- ✍️ 수동 작성 탭 -->
          <div v-else class="tab-content">
            <div v-for="(entry, index) in manualTodos" :key="index">
              <textarea
                v-model="entry.text"
                placeholder="공통 TODO를 입력하세요"
                class="manual-textarea"
              />
  
              <div class="weekday-selector">
                <label
                  v-for="day in weekdays"
                  :key="day.value"
                  class="weekday-option"
                >
                  <input
                    type="checkbox"
                    :value="day.value"
                    v-model="entry.selectedWeekdays"
                  />
                  {{ day.label }}
                </label>
              </div>
            </div>
            <button @click="addManualTodo">➕ 추가 작성란</button>
            <button @click="submitManualTodos" class="register-button">📤 등록</button>
          </div>
  
          <!-- 닫기 -->
          <button class="close-button" @click="$emit('close')">❌ 닫기</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, nextTick } from 'vue'
  
  const props = defineProps({
    roomNum: Number,
    year: Number,
    month: Number
  })
  
  const emit = defineEmits(['close', 'refresh'])
  
  const mode = ref('ai')
  const topic = ref('')
  const aiTodos = ref([])
  const todoSelections = ref([])
  const manualTodos = ref([{ text: '', selectedWeekdays: [] }])
  
  const weekdays = [
    { label: '월', value: 1 },
    { label: '화', value: 2 },
    { label: '수', value: 3 },
    { label: '목', value: 4 },
    { label: '금', value: 5 },
    { label: '토', value: 6 },
    { label: '일', value: 7 }
  ]
  
  const fetchAiTodos = async () => {
    if (!topic.value.trim()) {
      alert('주제를 입력해주세요.')
      return
    }
    try {
      const res = await fetch('http://localhost:8080/gpt/generate-todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomNum: props.roomNum, topic: topic.value })
      })
      const data = await res.json()
      aiTodos.value = Array.from(
        new Map(data.map(todo => [todo.shareTodoNum, todo])).values()
      ).slice(0, 5)
  
      todoSelections.value = aiTodos.value.map(todo => ({
        shareTodoNum: todo.shareTodoNum,
        selectedWeekdays: []
      }))
    } catch (err) {
      console.error('AI TODO 불러오기 실패:', err)
      alert('AI TODO 불러오기 실패: ' + err.message)
    }
  }
  
  const addManualTodo = () => {
    manualTodos.value.push({ text: '', selectedWeekdays: [] })
  }
  
  const submitManualTodos = async () => {
    const validTodos = manualTodos.value.filter(
      todo => todo.text.trim() && todo.selectedWeekdays.length > 0
    )
    if (validTodos.length === 0) {
      alert('모든 입력란을 채워주세요.')
      return
    }
  
    try {
      const response = await fetch('http://localhost:8080/room/share-todo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          validTodos.map(todo => ({
            shareTodoName: todo.text,
            roomNum: props.roomNum,
            pinOrder: 0
          }))
        )
      })
  
      const createdList = await response.json()
  
      const datesPayload = createdList.map((res, idx) => ({
        shareTodoNum: res.shareTodoNum,
        selectedWeekdays: validTodos[idx].selectedWeekdays,
        year: props.year,
        month: props.month
      }))
  
      await fetch('http://localhost:8080/api/member-share-todo-date/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datesPayload)
      })
  
      manualTodos.value = [{ text: '', selectedWeekdays: [] }]
      alert('수동 TODO가 등록되었습니다!')
      await nextTick()
      emit('refresh')
      emit('close')
    } catch (err) {
      console.error('수동 TODO 등록 실패:', err)
      alert('TODO 등록 중 오류 발생')
    }
  }
  
  const registerTodosToServer = async () => {
    const payload = todoSelections.value.map(todo => ({
      shareTodoNum: todo.shareTodoNum,
      selectedWeekdays: todo.selectedWeekdays,
      year: props.year,
      month: props.month
    }))
  
    try {
      await fetch('http://localhost:8080/api/member-share-todo-date/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
  
      alert('모든 TODO가 등록되었습니다!')
      await nextTick()
      emit('refresh')
      emit('close')
    } catch (err) {
      console.error('TODO 등록 실패:', err)
      alert('등록 실패!')
    }
  }
  </script>
  
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .modal-content {
    background: white;
    border-radius: 12px;
    padding: 0;
  }
  .share-todo-modal {
    width: 460px;
    background: white;
    padding: 24px;
    border-radius: 12px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  }
  h2 {
    text-align: center;
    margin-bottom: 20px;
  }
  .tab-buttons {
    display: flex;
    justify-content: space-around;
    margin-bottom: 20px;
  }
  .tab-buttons button {
    flex: 1;
    padding: 10px;
    font-weight: bold;
    cursor: pointer;
    border: none;
    background: #eee;
    border-radius: 8px;
    transition: 0.2s;
  }
  .tab-buttons button.active {
    background: #d1f7d6;
  }
  .tab-content {
    margin-bottom: 20px;
  }
  .topic-input {
    width: 100%;
    padding: 8px;
    margin-bottom: 12px;
    border-radius: 8px;
    border: 1px solid #ccc;
  }
  .todo-list {
    list-style: none;
    padding: 0;
  }
  .todo-list li {
    padding: 12px 0;
    border-bottom: 1px solid #eee;
  }
  .weekday-selector {
    display: flex;
    gap: 6px;
    margin-top: 6px;
    flex-wrap: wrap;
  }
  .weekday-option {
    font-size: 13px;
  }
  .manual-textarea {
    width: 100%;
    height: 80px;
    padding: 8px;
    resize: none;
    border: 1px solid #ccc;
    border-radius: 8px;
    margin-bottom: 10px;
  }
  .register-button {
    margin-top: 16px;
    width: 100%;
    padding: 10px;
    border-radius: 8px;
    background: #d1f7d6;
    border: none;
    font-weight: bold;
    cursor: pointer;
  }
  .close-button {
    display: block;
    margin: 20px auto 0;
    padding: 10px 20px;
    border-radius: 30px;
    background: #eee;
    border: none;
    font-weight: bold;
    cursor: pointer;
  }
  </style>
  