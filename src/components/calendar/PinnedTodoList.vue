<template>
  <div class="pinned-wrapper">
    <draggable
      tag="div"
      :list="internalTodos"
      item-key="todoNum"
      handle=".drag-handle"
      @end="onDragEnd"
    >
      <template #item="{ element: todo, index }">
        <div
          class="pinned-item-wrapper"
          :key="`${todo.todoNum}-${todo.todoDate}`"
          @mousedown.prevent="startSwipe($event, index)"
          @mousemove.prevent="trackSwipe($event, index)"
          @mouseup.prevent="endSwipe(index)"
          @mouseleave.prevent="resetSwipe(index)"
        >
          <!-- 핀 해제 버튼 -->
          <div
            v-if="swipedIndex === index"
            class="unpin-action"
            @click.stop="unpin(todo)"
          >
            핀 해제
          </div>

          <!-- 전체 카드 swipe -->
          <div
            class="pinned-item"
            :style="{
              borderColor: todo.categoryColor,
              transform: swipedIndex === index ? 'translateX(80px)' : 'translateX(0)',
              transition: 'transform 0.25s ease'
            }"
          >
            <div class="content-area">
              <div class="left-area">
                <div
                  v-if="swipedIndex !== index"
                  class="pinned-date"
                  :style="{ backgroundColor: todo.categoryColor }"
                >
                  {{ formatDate(todo.todoDate) }}
                </div>
              </div>
              <div class="middle-content">
                {{ todo.content }}
              </div>
            </div>
            <div
              class="drag-handle"
              @mousedown.stop
            >
              ≡
            </div>
          </div>
        </div>
      </template>
    </draggable>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import draggable from 'vuedraggable'

const props = defineProps({ todos: Array })
const emit = defineEmits(['update-order', 'update-pin'])

const internalTodos = ref([])

watch(
  () => props.todos,
  newList => {
    internalTodos.value = [...(newList || [])]
      .filter(t => t && t.pinOrder > 0 && t.todoNum != null)
      .sort((a, b) => a.pinOrder - b.pinOrder)
  },
  { immediate: true, deep: true }
)

const swipedIndex = ref(null)
const startX = ref({})
const isSwiping = ref({})
const SWIPE_THRESHOLD = 40

function startSwipe(e, idx) {
  startX.value[idx] = e.clientX
  isSwiping.value[idx] = true
}
function trackSwipe(e, idx) {
  if (!isSwiping.value[idx]) return
  const dx = e.clientX - startX.value[idx]
  if (dx > SWIPE_THRESHOLD) swipedIndex.value = idx
  else if (dx < -SWIPE_THRESHOLD) swipedIndex.value = null
}
function endSwipe(idx) {
  startX.value[idx] = null
  isSwiping.value[idx] = false
}
function resetSwipe(idx) {
  startX.value[idx] = null
  isSwiping.value[idx] = false
  swipedIndex.value = null
}

function unpin(todo) {
  emit('update-pin', {
    todoNum: todo.todoNum,
    todoDate: todo.todoDate,
    pinOrderUpdate: false
  })
}

function onDragEnd() {
  internalTodos.value.forEach((t, i) => {
    t.pinOrder = i + 1
  })
  emit('update-order', internalTodos.value)
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const [y, m, d] = dateStr.split('-')
  return `${m}/${d}`
}
</script>

<style scoped>
.pinned-wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 8px 0;
}
.pinned-item-wrapper {
  position: relative;
  overflow: hidden;
  margin-bottom: 5px;
}
.unpin-action {
  position: absolute;
  left: 0;
  width: 80px;
  height: 100%;
  background: #ff4d4d;
  color: #fff;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  cursor: pointer;
  z-index: 2;
  user-select: none;
}
.pinned-item {
  margin-bottom: 3px;
  display: flex;
  align-items: center;
  background: #fff;
  border: 2px solid;
  border-radius: 12px;
  overflow: hidden;
}
.content-area {
  font-size: 14px;
  flex: 1;
  display: flex;
  align-items: center;
  padding: 4px 5px;
  gap: 12px;
  user-select: none;
}
.left-area {
  min-width: 48px;
  display: flex;
  justify-content: center;
}
.pinned-date {
  background: #ccc;
  padding: 4px 6px;
  border-radius: 8px;
  color: #fff;
  font-weight: bold;
}
.middle-content {
  flex: 1;
  padding: 4px 5px;

  color: #333;
  transition: transform 0.2s ease;
}
.drag-handle {
  width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  user-select: none;
}
</style>
