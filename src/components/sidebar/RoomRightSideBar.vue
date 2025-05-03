<template>
  <div class="right-sidebar">
    <!-- 📍 ShareTODO 버튼 -->
    <button class="share-todo-button" @click="openShareTodoModal">
      📍 ShareTODO
    </button>

    <!-- ✅ ShareTodoModal 컴포넌트 모달창 -->
    <ShareTodoModal
      v-if="isShareTodoModalOpen"
      :roomNum="roomNum"
      @close="isShareTodoModalOpen = false"
    />

    <!-- 공유 TODO 리스트 -->
    <draggable
      :list="uniqueTodoList"
      tag="ul"
      handle=".drag-handle"
      animation="200"
      class="todo-list"
      item-key="shareTodoNum"
    >
      <template #item="{ element }">
        <li>
          <span class="drag-handle">⠿</span> {{ element.shareTodoName }}
        </li>
      </template>
    </draggable>

    <!-- ✔️ Approve 버튼 -->
    <button class="approve-button" @click="openModal">
      ✔️ Approve
    </button>

    <!-- 승인 요청 목록 -->
    <div class="approve-list">
      <div v-for="approve in approveList" :key="approve.id" class="approve-box">
        <p class="approve-title">요청: {{ approve.title }}</p>
        <p class="approve-content">{{ approve.content }}</p>
        <div class="approve-actions">
          <button class="approve-yes" @click="approveItem(approve.id)">✔️</button>
          <button class="approve-no" @click="rejectItem(approve.id)">❌</button>
        </div>
      </div>
    </div>

    <!-- 🛠 승인 수 설정 -->
    <div class="approve-count-editor">
      <label for="approveRequiredCount">필요 승인 수:</label>
      <input
        id="approveRequiredCount"
        type="number"
        v-model.number="approveCount"
        min="0"
      />
      <button @click="updateApproveCount">수정</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import draggable from 'vuedraggable'
import ShareTodoModal from '@/components/modal/ShareTodoModal.vue'

// ✅ Props 및 Emit 정의
const props = defineProps({
  todoList: Array,
  approveList: Array,
  memberNum: Number,
  roomNum: Number
})

const emit = defineEmits([
  'open-approve-modal',
  'approve-success',
  'approve-reject',
  'open-share-todo-modal'
])

// ✅ 공유 TODO 중복 제거
const uniqueTodoList = computed(() => {
  return Array.from(
    new Map(props.todoList.map(todo => [todo.shareTodoNum, todo])).values()
  )
})

// ✅ Approve Modal
function openModal() {
  emit('open-approve-modal')
}

// ✅ ShareTodo Modal
const isShareTodoModalOpen = ref(false)
const openShareTodoModal = () => {
  emit('open-share-todo-modal')
}
// ✅ 승인 처리
async function approveItem(id) {
  console.log("값 출력", id,props.memberNum)
  try {
    await fetch('http://localhost:8080/approve/status', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        approveNum: id,
        memberNum: props.memberNum,
        action: 'permit'
      })
    })
    emit('approve-success', id)
  } catch (err) {
    console.error('승인 실패:', err)
  }
}

// ✅ 거절 처리
function rejectItem(id) {
  emit('approve-reject', id)
}

// ✅ 승인 수 설정 기능
const approveCount = ref(0)

// ✅ memberNum 감시해서 승인 수 받아오기
watch(
  () => props.memberNum,
  async (newVal) => {
    if (!newVal) return
    try {
      const res = await fetch(`http://localhost:8080/room/${props.roomNum}/data?memberNum=${newVal}`)
      const data = await res.json()
      approveCount.value = data.approveRequiredCount
    } catch (err) {
      console.error('초기 승인 수 불러오기 실패:', err)
    }
  },
  { immediate: true }
)

// ✅ 승인 수 서버 반영
const updateApproveCount = async () => {
  try {
    await fetch(`http://localhost:8080/rooms/${props.roomNum}/approve-count`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ approveRequiredCount: approveCount.value })
    })
    alert('승인 수가 수정되었습니다!')
  } catch (err) {
    console.error('승인 수 수정 실패:', err)
    alert('오류가 발생했습니다.')
  }
}
</script>

<style scoped>
.right-sidebar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.share-todo-button,
.approve-button {
  width: 200px;
  padding: 10px;
  border: 2px solid #000;
  border-radius: 30px;
  background: white;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
}

.todo-list {
  width: 200px;
  padding-left: 0;
  font-size: 14px;
  color: #333;
  margin: 0;
}

.todo-list li {
  margin: 6px 0;
  list-style: none;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: grab;
}

.drag-handle {
  cursor: move;
  font-size: 18px;
}

.approve-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.approve-box {
  width: 200px;
  padding: 16px;
  border: 1px solid #aaa;
  border-radius: 12px;
  background: #f8f8f8;
}

.approve-title {
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 12px;
  text-align: center;
}

.approve-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.approve-yes,
.approve-no {
  width: 36px;
  height: 36px;
  font-size: 20px;
  background: white;
  border: 1px solid #aaa;
  border-radius: 50%;
  cursor: pointer;
}

.approve-count-editor {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-top: 20px;
}

.approve-count-editor input {
  width: 60px;
  padding: 4px;
  text-align: center;
  font-size: 16px;
}
</style>
