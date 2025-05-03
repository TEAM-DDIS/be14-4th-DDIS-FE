<template>
  <div class="container">
    <!-- 왼쪽: 프로필 + SUMMARY -->
    <div class="side-area">
      <div class="side-profile">
        <img src="/images/header-profile.png" alt="프로필" class="profile-img" />
        <div class="nickname">CANDDY</div>
        <div class="follow-info">
          <span>팔로우 <b>32</b></span>
          <span>팔로잉 <b>59</b></span>
        </div>
        <button class="follow-btn">팔로우</button>
      </div>

      <div class="today-comment">
        <h3 class="pinned-title">ACHIEVEMENT </h3>
        <TodoCompletionChart :done-count="doneCount" :total-count="allTodos.length" />
      </div>
    </div>

    <!-- 가운데: 캘린더더 영역 -->
    <div class="calendar-area">
      <div class="calendar-header">
        <div class="settings-wrapper" @click="toggleSettingsDropdown">
          <button class="settings-btn">설정</button>
          <div v-if="showSettingsDropdown" class="dropdown-menu">
            <div class="dropdown-item" @click="openCategoryModal">카테고리 설정</div>
            <div class="dropdown-item">캘린더 설정</div>
          </div>
        </div>
      </div>

      <Calendar
        :day-completion-rate="dayCompletionRate"
        :todo-exists-dates="todoExistsDates"
        :selected-date="selectedDate"
        @select-date="handleSelectDate"
      />

      <button class="add-todo-btn" @click="openAddModal">추가</button>

      <TodoAddModal
        v-if="showAddModal"
        :visible="showAddModal"
        :default-date="selectedDate"
        @add="handleAddTodo"
        @close="closeAddModal"
      />

      <TodoList
        :todos="unpinnedTodos"
        @update-pin="handleTogglePin"
        @toggle-public="handleTogglePublic"
        @toggle-done="handleToggleDone"
        @delete="handleDeleteTodo"
      />
    </div>

    <!-- 오른쪽: 고정 할 일 -->
    <div class="pinned-area">
      <h3 class="pinned-title">REMINDER</h3>
      <PinnedTodoList
        :todos="pinnedTodos"
        @toggle-done="handleToggleDone"
        @update-order="handleUpdatePinOrder"
        @update-pin="handleUnpinFromPinned"
      />
    </div>
  </div>
  <CategorySettingModal
    v-if="showCategoryModal"
    @close="showCategoryModal = false"
    @refresh="handleCategoryRefresh"
  />
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import axios from '@/utils/axios'
import Calendar from '@/components/calendar/PersonalCalendar.vue'
import TodoList from '@/components/calendar/TodoList.vue'
import PinnedTodoList from '@/components/calendar/PinnedTodoList.vue'
import TodoAddModal from '@/components/calendar/TodoAddModal.vue'
import TodoCompletionChart from '@/components/calendar/TodoCompletionChart.vue'
import CategorySettingModal from '@/components/calendar/CategorySettingModal.vue'

const API_BASE = 'http://localhost:8080'
const clientNum = 6

const dayCompletionRate = ref({})
const todoExistsDates = ref({})
const selectedDate = ref(getToday())
const allTodos = ref([])
const todosForDate = ref([])
const pinnedTodos = ref([])
const showAddModal = ref(false)
const showSettingsDropdown = ref(false)
const showCategoryModal = ref(false)
const doneCount = computed(() => allTodos.value.filter(t => t.isDone).length)

function pad(n) {
  return n.toString().padStart(2, '0')
}
function formatLocalDate(dateInput) {
  const d = new Date(dateInput)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}
function getToday() {
  return formatLocalDate(new Date())
}

onMounted(fetchAllTodos)

watch(selectedDate, date => loadTodosForDate(date))

function toggleSettingsDropdown() {
  showSettingsDropdown.value = !showSettingsDropdown.value
}
function openCategoryModal() {
  showCategoryModal.value = true
  showSettingsDropdown.value = false
}
function handleCategoryRefresh() {
  fetchAllTodos()
}

async function fetchAllTodos() {
  try {
    const allRes = await axios.get(`${API_BASE}/personal-todos/${clientNum}`)
    allTodos.value = allRes.data.map(item => ({
      ...item,
      todoDate: formatLocalDate(item.todoDate)
    }))
    updateCalendarState()
    await loadTodosForDate(selectedDate.value)
    await loadPinnedTodos()
  } catch (e) {
    console.error('[❌ 전체 투두 로딩 실패]', e)
  }
}

async function loadTodosForDate(date) {
  const { data: mappings } = await axios.get(
    `${API_BASE}/personal-todos/${clientNum}/date`,
    { params: { todoDate: date } }
  )

  const todosMap = Object.fromEntries(
    allTodos.value.map(t => [String(t.todoNum), t])
  )

  todosForDate.value = mappings.filter(m => {
    const base = todosMap[String(m.todoNum)]
    return base?.todoContent || m.todoContent
  }).map(m => {
    const base = todosMap[String(m.todoNum)] || {}
    return {
      todoNum: m.todoNum,
      todoDate: formatLocalDate(m.todoDate),
      content: base?.todoContent ?? m.todoContent ?? '(내용 없음)',
      personalCategoryNum: base?.personalCategoryNum ?? m.personalCategoryNum ?? -1,
      isDone: m.isDone,
      isPublic: m.isPublic,
      pinOrder: m.pinOrder,
      categoryName: base?.personalCategoryName ?? m.personalCategoryName ?? '',
      categoryColor: base?.personalCategoryColorRgb ?? m.personalCategoryColorRgb ?? '#ccc'
    }
  })
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

function handleSelectDate(date) { selectedDate.value = date }
function openAddModal() { showAddModal.value = true }
function closeAddModal() { showAddModal.value = false }

async function handleAddTodo(payload) {
  try {
    await axios.post(`${API_BASE}/personal-todos`, payload, {
      params: { clientNum }
    })
    await fetchAllTodos()
  } catch (e) {
    console.error('[❌ handleAddTodo 에러]', e)
  } finally {
    closeAddModal()
  }
}

async function handleToggleDone({ todoNum, todoDate, isDone }) {
  try {
    await axios.patch(`${API_BASE}/personal-todos`,
      { todoNum, existingTodoDate: todoDate, isDone },
      { params: { clientNum } }
    )
    await fetchAllTodos()
  } catch (e) {
    console.error(e)
  }
}

async function handleTogglePublic({ todoNum, todoDate, isPublic }) {
  try {
    await axios.patch(`${API_BASE}/personal-todos`,
      { todoNum, existingTodoDate: todoDate, isPublic },
      { params: { clientNum } }
    )
    await fetchAllTodos()
  } catch (e) {
    console.error(e)
  }
}

async function handleDeleteTodo({ todoNum, todoDate }) {
  try {
    await axios.delete(`${API_BASE}/personal-todos/date`, {
      params: { clientNum, todoNum, todoDate }
    })
    await fetchAllTodos()
  } catch (e) {
    console.error(e)
  }
}

async function handleUpdatePinOrder(newOrder) {
  if (!Array.isArray(newOrder)) return
  try {
    for (let i = 0; i < newOrder.length; i++) {
      const t = newOrder[i]
      await axios.patch(`${API_BASE}/personal-todos`, {
        todoNum: t.todoNum, existingTodoDate: t.todoDate, pinOrderUpdate: i + 1
      }, { params: { clientNum } })
    }
    await fetchAllTodos()
  } catch (e) {
    console.error(e)
  }
}

async function loadPinnedTodos() {
  const { data } = await axios.get(`${API_BASE}/personal-todos/${clientNum}/pinned`)
  pinnedTodos.value = data.map((item, i) => ({
    ...item,
    todoNum: item.todoNum,
    content: item.todoContent,
    todoDate: formatLocalDate(item.todoDate),
    pinOrder: item.pinOrder ?? i + 1,
    categoryColor: item.personalCategoryColorRgb || '#ccc'
  }))
}

async function handleTogglePin({ todoNum, todoDate }) {
  try {
    await axios.patch(`${API_BASE}/personal-todos`, {
      todoNum, existingTodoDate: todoDate, pinOrderUpdate: true
    }, { params: { clientNum } })
    await fetchAllTodos()
  } catch (e) {
    console.error(e)
  }
}

async function handleUnpinFromPinned(todo) {
  try {
    await axios.patch(`${API_BASE}/personal-todos`, {
      todoNum: todo.todoNum, existingTodoDate: todo.todoDate, pinOrderUpdate: 0
    }, { params: { clientNum } })
    await fetchAllTodos()
  } catch (e) {
    console.error(e)
  }
}

const unpinnedTodos = computed(() => todosForDate.value)
</script>



<style scoped>
.container {
  overflow: visible;
  position: relative; 
  margin-top: 100px !important;  
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  width: 100%;
  max-width: 1350px;
  margin: 60px auto 0;
  justify-content: space-between;
  gap: 40px;
  /* overflow-x: hidden; */
}

.side-area {
  overflow: visible;
  position: relative; 
  display: flex;
  flex-direction: column;
  min-width: 210px;
  max-width: 210px;
}

.side-profile {
  margin-top: 55px;
  background: #fff;
  border: 1.5px solid #ededed;
  border-radius: 18px;
  padding: 25px 20px 22px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 2px 10px 0 rgba(30,30,30,0.04);
}

.today-comment {
  margin-top: 20px;
  overflow: visible;
  position: relative; 
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
  margin-bottom: 16px;
  letter-spacing: 1px;
  text-align: center;
}

.follow-info {
  font-size: 14px;
  color: #888;
  margin-bottom: 16px;
  display: flex;
  gap: 18px;
  justify-content: center;
}

.follow-info b {
  color: #222;
  font-weight: 800;
}

.follow-btn {
  width: 100%;
  height: 36px;
  background: #111;
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  margin-top: 6px;
}

.calendar-area {
  flex: 2;
  min-width: 750px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.calendar-header {
  display: flex;
  justify-content: flex-end;
  
}

.settings-wrapper {
  position: relative;
  display: inline-block;
margin-bottom: 10px;  
}

.settings-btn {
  margin-top: 10px;
  align-self: flex-end;
  padding: 6px 25px;
  margin-bottom:-60px;
  margin-right: 20px;
  background: #000;
  color: #fff;
  border: 1px solid transparent;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 700;
  font-size: 1.125rem;
  
}

.settings-btn:hover{
  border: 1px solid #111;
  background: #fff;
  color: #000;
  box-shadow: 0 2px 10px 0 rgba(30,30,30,0.04);
}

.dropdown-menu {
  margin-top: 10px;
  margin-right: 20px;
  position: absolute;
  top: 120%;
  right: 0;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  z-index: 10;
  min-width: 160px;
}

.dropdown-item {
  padding: 10px 16px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s ease;
}

.dropdown-item:hover {
  background: #f5f5f5;
}

.pinned-area {
  margin-top: 55px;

  flex: 1;
  max-width: 250px;
  min-width: 250px;
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 1.5px solid #ededed;
  border-radius: 18px;
  padding: 5px 10px 10px;
  box-shadow: 0 2px 10px 0 rgba(30,30,30,0.04);
}

.pinned-title {
  font-size: 20px;
  font-weight: 700;
  padding-top: 13px;
  padding-bottom: 13px;
  margin-bottom: 20px;
  text-align: center;
  color: #50D4C6;
  border: 2px solid #50D4C6;
  border-radius: 25px;
  user-select: none;
}

.add-todo-btn {
  align-self: flex-end;
  /* margin-right: 5px; */
  padding: 6px 25px;
  margin-right: 10px;
  background: #000;
  color: #fff;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 700;
  font-size: 1.125rem;
  border: 1px solid transparent;
}

.add-todo-btn:hover {
  border: 1px solid #111;
  background: #fff;
  color: #000;
  box-shadow: 0 2px 10px 0 rgba(30,30,30,0.04);
}

</style>
