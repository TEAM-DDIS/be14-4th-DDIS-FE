<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <h2>Approve 등록</h2>

      <!-- todo 선택 -->
      <select v-model="selectedTodoId" class="modal-select">
        <option disabled value="">-- 투두를 선택해주세요 --</option>
        <option
          v-for="todo in props.todoList"
          :key="todo.memberShareTodoNum"
          :value="todo.memberShareTodoNum"
        >
          {{ todo.shareTodoName }}
        </option>
      </select>

      <!-- 제목 입력 -->
      <input
        v-model="approveTitle"
        type="text"
        placeholder="제목을 입력하세요."
        class="modal-input"
      />

      <!-- 내용 입력 -->
      <textarea
        v-model="approveContent"
        placeholder="내용을 입력하세요."
        class="modal-textarea"
      ></textarea>

      <!-- 등록 버튼 -->
      <button @click="submitApprove" class="modal-submit">
        등록
      </button>

      <!-- 모달 닫기 -->
      <button @click="closeModal" class="modal-close">
        닫기
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const emit = defineEmits(['close'])  // ✅ 상위에 닫기 이벤트 알림

// Props 받기
const props = defineProps({
  todoList: {
    type: Array,
    required: true
  },
  selectedDate: {
    type: String,
    required: true
  },
  memberNum: {
    type: Number,
    required: true
  },
  roomNum: {
    type: Number,
    required: true
  }
})

const selectedTodoId = ref(null)
const approveTitle = ref('')
const approveContent = ref('')

async function submitApprove() {
  if (!selectedTodoId.value || !approveTitle.value || !approveContent.value) {
    alert('모든 항목을 입력하세요.')
    return
  }

  const requestBody = {
    memberNum: props.memberNum,
    memberShareTodoNum: selectedTodoId.value,
    roomNum: props.roomNum,
    todoDate: props.selectedDate,
    approveTitle: approveTitle.value,
    approveContent: approveContent.value,
    approveTime: new Date().toISOString()
  }

  console.log('보낼 데이터:', requestBody)
  try {
    await fetch('http://localhost:8080/approve/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    })
    emit('close')
  } catch (err) {
    alert('등록 실패')
    console.error(err)
  }

  emit('close')  // ✅ 모달 닫기
}

function closeModal() {
  emit('close')  // ✅ 닫기 버튼도 마찬가지
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-content {
  width: 400px;
  background: #fff;
  padding: 24px;
  border-radius: 10px;
  text-align: center;
}

.modal-input,
.modal-textarea,
.modal-select {
  width: 100%;
  margin-top: 10px;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
}

.modal-textarea {
  resize: none;
}

.modal-submit {
  margin-top: 20px;
  width: 100%;
  padding: 12px;
  background: #36c5f0;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.modal-close {
  margin-top: 10px;
  background: transparent;
  color: #555;
  border: none;
  cursor: pointer;
}
</style>
