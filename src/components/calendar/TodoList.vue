<template>
  <div class="todo-list-wrapper">
    <div v-if="todos.length === 0" class="no-todos">할 일이 없어요!</div>
    <div v-else>
      <div
        v-for="(group, categoryName) in groupedTodos"
        :key="categoryName"
        class="category-group"
      >
        <div class="category-header" :style="{ color: group.color }">
          {{ categoryName }}
        </div>

        <TodoItem
          v-for="todo in group.todos"
          :key="todo.todoNum"
          :todo="todo"
          :categoryColor="group.color"
          @update-pin="handleUpdatePin"
          @toggle-done="handleToggleDone"
          @toggle-public="handleTogglePublic"
          @delete="handleDeleteTodo"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import TodoItem from './TodoItem.vue'
import axios from 'axios'

const props = defineProps({
  todos: Array
})
const emit = defineEmits(['update-pin', 'toggle-done', 'toggle-public', 'delete'])

const API_BASE = 'http://localhost:8080'  // API Base 설정

// 데이터를 카테고리별로 그룹화
const groupedTodos = computed(() => {
  const groups = {}
  props.todos.forEach(todo => {
    const category = todo.categoryName || '기타'
    if (!groups[category]) {
      groups[category] = {
        color: todo.categoryColor || '#ccc',
        todos: []
      }
    }
    groups[category].todos.push(todo)
  })
  return groups
})

console.log('✅ todos:', props.todos)

// 투두 항목을 핀 처리
function handleUpdatePin(payload) {
  emit('update-pin', payload)
  updateTodoOnServer(payload)
}

// 완료 처리 상태 변경
function handleToggleDone(payload) {
  emit('toggle-done', payload)
  updateTodoOnServer(payload)
}

// 공개/비공개 상태 변경
function handleTogglePublic(payload) {
  emit('toggle-public', payload)
  updateTodoOnServer(payload)
}

// 투두 삭제
function handleDeleteTodo(payload) {
  emit('delete', payload)
  deleteTodoFromServer(payload)
}

// 투두 데이터 서버와 동기화: 핀 처리, 완료 상태, 공개 상태
async function updateTodoOnServer(payload) {
  try {
    await axios.patch(`${API_BASE}/personal-todos/${payload.todoNum}`, payload)
  } catch (error) {
    console.error('Error updating todo:', error)
  }
}

// 투두 삭제 서버 연동
async function deleteTodoFromServer(payload) {
  try {
    await axios.delete(`${API_BASE}/personal-todos/${payload.todoNum}`, {
      data: payload
    })
  } catch (error) {
    console.error('Error deleting todo:', error)
  }
}
</script>

<style scoped>
.todo-list-wrapper {
  margin-bottom: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1px;
  background: #fff;
  padding: 0px 0 48px;
  border-radius: 18px;
  box-shadow: 0 2px 10px rgba(30, 30, 30, 0.05);
  width: 770px;
  max-width: 770px;
  user-select: none;
  scrollbar-gutter: stable both-edges;
  overflow-y: auto; /* 컨테이너 내부 스크롤 */
}

.category-group {
  margin-bottom: 32px;
  width: 100%;
}

.category-header {
  font-size: 17px;
  font-weight: 800;
  margin: 5px 0px 13px;
  user-select: none;
}

.no-todos {
  text-align: center;
  color: #888;
  padding: 40px 0;
  user-select: none;
}
</style>
