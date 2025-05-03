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

const props = defineProps({
  todos: Array
})
const emit = defineEmits(['update-pin', 'toggle-done', 'toggle-public', 'delete'])

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

function handleUpdatePin(payload) {
  emit('update-pin', payload)
}
function handleToggleDone(payload) {
  emit('toggle-done', payload)
}
function handleTogglePublic(payload) {
  emit('toggle-public', payload)
}
function handleDeleteTodo(payload) {
  emit('delete', payload)
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
