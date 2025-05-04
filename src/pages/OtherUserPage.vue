<template>
    <div class="container">
      <!-- 왼쪽: 유저 프로필 -->
      <div class="side-area">
        <div class="side-profile">
          <img src="/images/header-profile.png" alt="프로필" class="profile-img" />
          <div class="nickname" v-if="profile.clientNickname">{{ profile.clientNickname }}</div>
        </div>
      </div>
  
      <!-- 가운데: 공개 투두 -->
      <div class="calendar-area">
        <Calendar
          :day-completion-rate="dayCompletionRate"
          :todo-exists-dates="todoExistsDates"
          :selected-date="selectedDate"
          @select-date="handleSelectDate"
        />
        <TodoList :todos="unpinnedTodos" readOnly />
      </div>
  
      <!-- 오른쪽: 고정 공개 투두 -->
      <!-- <div class="pinned-area">
        <h3 class="pinned-title">공개 고정</h3>
        <PinnedTodoList :todos="pinnedTodos" readOnly />
      </div> -->
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import Calendar from '@/components/calendar/PersonalCalendar.vue'
  import TodoList from '@/components/calendar/TodoList.vue'
  import PinnedTodoList from '@/components/calendar/PinnedTodoList.vue'
  
  const route = useRoute()
  const clientNum = route.params.clientNum
  
  const selectedDate = ref(getToday())
  const allTodos = ref([])
  const todosForDate = ref([])
  const pinnedTodos = ref([])
  const profile = ref({})
  const dayCompletionRate = ref({})
  const todoExistsDates = ref({})
  
  function getToday() {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  }
  
  onMounted(() => {
    fetchPublicTodos()
    fetchProfile()
  })
  
  async function fetchProfile() {
    try {
      const res = await fetch(`http://localhost:8080/clients/${clientNum}/profile`)
      profile.value = await res.json()
    } catch (e) {
      console.error('[❌ 프로필 로딩 실패]', e)
    }
  }
  
  async function fetchPublicTodos() {
    try {
      const res = await fetch(`http://localhost:8080/personal-todos/${clientNum}/visibility?isPublic=true`)
      const data = await res.json()
      allTodos.value = data.map(t => ({
        ...t,
        todoDate: t.todoDate.slice(0, 10)
      }))
  
      updateCalendarState()
      updateTodosForDate(selectedDate.value)
      updatePinnedTodos()
    } catch (e) {
      console.error('[❌ 공개 TODO 로딩 실패]', e)
    }
  }
  
  function updateCalendarState() {
    const rate = {}, exist = {}
    allTodos.value.forEach(item => {
      exist[item.todoDate] = true
      rate[item.todoDate] = rate[item.todoDate] || { total: 0, done: 0 }
      rate[item.todoDate].total++
      if (item.isDone) rate[item.todoDate].done++
    })
    Object.entries(rate).forEach(([d, { total, done }]) => {
      rate[d] = done / total
    })
    dayCompletionRate.value = rate
    todoExistsDates.value = exist
  }
  
  function handleSelectDate(date) {
    selectedDate.value = date
    updateTodosForDate(date)
  }
  
  function updateTodosForDate(date) {
    todosForDate.value = allTodos.value.filter(t => t.todoDate === date)
  }
  
  function updatePinnedTodos() {
    pinnedTodos.value = allTodos.value.filter(t => t.pinOrder && t.pinOrder > 0)
  }
  
  const unpinnedTodos = computed(() => todosForDate.value.filter(t => !t.pinOrder))
  </script>
  
  <style scoped>
  .todo-item-wrapper {
  max-width: 750px;
  width: 100%;
  margin: 0 auto 16px;
  border-radius: 12px;
}
  .container {
    display: flex;
    justify-content: space-between;
    margin-top: 150px;
    gap: 40px;
    max-width: 1350px;
    margin-left: auto;
    margin-right: auto;
  }
  
  .side-area {
    width: 210px;
  }
  
  .side-profile {
    background: #fff;
    border: 1.5px solid #ededed;
    border-radius: 18px;
    padding: 25px 20px 22px;
    text-align: center;
    box-shadow: 0 2px 10px rgba(30, 30, 30, 0.04);
  }
  
  .profile-img {
    width: 96px;
    height: 96px;
    border-radius: 50%;
    border: 3px solid #111;
    object-fit: cover;
    margin-bottom: 16px;
  }
  
  .nickname {
    font-size: 24px;
    font-weight: 700;
    letter-spacing: 1px;
  }
  
  .calendar-area {
  flex: 2;
  min-width: 750px;
  display: flex;
  flex-direction: column;
  align-items: center; /* ✅ 캘린더와 TodoList를 가운데 정렬 */
  gap: 10px;
}
  
  .pinned-area {
    margin-top: 55px;
    width: 250px;
    background: #fff;
    border: 1.5px solid #ededed;
    border-radius: 18px;
    padding: 10px;
    box-shadow: 0 2px 10px rgba(30, 30, 30, 0.04);
  }
  
  .pinned-title {
    font-size: 20px;
    font-weight: 700;
    text-align: center;
    color: #50D4C6;
    border: 2px solid #50D4C6;
    border-radius: 25px;
    padding: 13px 0;
  }
  </style>
  