<template>
  <div
    class="todo-item-wrapper"
    @mousedown="startSwipe"
    @mousemove="trackSwipe"
    @mouseup="endSwipe"
    @mouseleave="cancelSwipe"
    :class="{ hovered }"
    @mouseover="hovered = true"
  >
    <div v-if="swiped" class="delete-action" @click.stop="deleteTodo">삭제</div>

    <div
      class="todo-item"
      :class="{ hovered }"
      :style="{ transform: swiped ? 'translateX(80px)' : 'translateX(0)' }"
    >
      <div class="left-colored" :style="{ backgroundColor: todo.categoryColor }">
        <img
          class="lock-icon"
          :src="todo.isPublic ? lockIcons.public : lockIcons.private"
          :alt="todo.isPublic ? '공개' : '비공개'"
          width="25"
          height="25"
          @mousedown.stop
          @click.stop="togglePublic"
        />
      </div>

      <div class="right-content" :style="{ borderColor: todo.categoryColor }">
        <span class="todo-content">{{ todo.content }}</span>
        <div class="right-buttons">
          <div
            class="status-circle"
            :class="{ done: todo.isDone }"
            :style="{ backgroundColor: todo.isDone ? todo.categoryColor : '#e0e0e0' }"
            @click.stop="toggleDone"
          ></div>
          <button class="pin-btn" @click.stop="togglePin">📌</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({ todo: Object })
const emit = defineEmits(['update-pin', 'toggle-done', 'delete', 'toggle-public'])

const hovered = ref(false)
const swiped = ref(false)
const startX = ref(null)
const SWIPE_THRESHOLD = 30

function toggleDone() {
  emit('toggle-done', {
    todoNum: props.todo.todoNum,
    todoDate: props.todo.todoDate,
    isDone: !props.todo.isDone
  })
}

function togglePin() {
  emit('update-pin', {
    todoNum: props.todo.todoNum,
    todoDate: props.todo.todoDate
  })
}

function deleteTodo() {
  emit('delete', {
    todoNum: props.todo.todoNum,
    todoDate: props.todo.todoDate
  })
}

function togglePublic() {
  emit('toggle-public', {
    todoNum: props.todo.todoNum,
    todoDate: props.todo.todoDate,
    isPublic: !props.todo.isPublic
  })
}

function startSwipe(e) {
  startX.value = e.clientX
}

function trackSwipe(e) {
  if (startX.value === null) return
  const dx = e.clientX - startX.value
  swiped.value = dx > SWIPE_THRESHOLD
}

function endSwipe() {
  startX.value = null
}

function cancelSwipe() {
  startX.value = null
  swiped.value = false
}

const lockIcons = {
  public: new URL('@/assets/icons/todo-global.svg', import.meta.url).href,
  private: new URL('@/assets/icons/todo-lock.svg', import.meta.url).href
}
</script>

<style scoped>
.todo-item-wrapper {
  position: relative;
  width: 750px;
  margin: 0 auto 16px;
  border-radius: 12px;
}

.delete-action {
  position: absolute;
  left: 0;
  top: 0;
  width: 80px;
  height: 100%;
  background: #ff4d4d;
  color: #fff;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  cursor: pointer;
  z-index: 2;
}

.todo-item {
  display: flex;
  background: #fff;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  transition: transform 0.25s ease;
}

.left-colored {
  width: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;
  padding: 4px;
}

.lock-icon {
  width: 25px;
  height: 25px;
  filter: brightness(0) invert(1);
  cursor: pointer;
  transition: transform 0.3s ease;
}

.lock-icon:hover {
  transform: scale(1.2);
}

.right-content {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
}

.todo-content {
  font-size: 15px;
  font-weight: 500;
  color: #333;
}

.right-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-right: 10px;
}

.status-circle {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  cursor: pointer;
  background: #e0e0e0;
  transition: transform 0.2s ease;
}

.status-circle:hover {
  transform: scale(1.25);
}

.status-circle.done {
  background-color: var(--category-color, #50D4C6);
}

.pin-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  padding: 2px;
  transition: transform 0.3s ease, color 0.3s ease;
}

.pin-btn:hover {
  transform: scale(1.2);
  color: #f39c12;
}
</style>
