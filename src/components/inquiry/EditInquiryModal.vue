<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <div class="modal-title-area">
        <input
          v-model="editTitle"
          class="modal-input"
          placeholder="제목을 입력하세요"
        />
      </div>

      <textarea
        v-model="editContent"
        class="modal-textarea"
        placeholder="내용을 입력하세요."
      ></textarea>

      <div class="modal-buttons">
        <button class="exit-btn" @click="close">나가기</button>
        <button class="submit-btn" @click="submit">등록</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { defineProps, defineEmits } from 'vue'

const props = defineProps({ inquiry: Object })
const emit = defineEmits(['close', 'update'])

const editTitle = ref(props.inquiry.title)
const editContent = ref(props.inquiry.content)

function close() {
  emit('close')
}

function submit() {
  emit('update', {
    title: editTitle.value,
    content: editContent.value,
  })
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  display: flex; justify-content: center; align-items: center;
  z-index: 999;
}
.modal-content {
  background: white;
  border-radius: 12px;
  padding: 24px;
  width: 90%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.modal-title-area {
  border: none;
}
.modal-input {
  width: 100%;
  padding: 12px;
  font-size: 18px;
  border-radius: 8px;
  border: none;
  background: #f5f5f5;
  box-sizing: border-box;
}
.modal-textarea {
  height: 200px;
  resize: none;
  padding: 12px;
  font-size: 16px;
  border-radius: 8px;
  background: #f5f5f5;
  border: none;
}
.modal-buttons {
  display: flex;
  justify-content: space-between;
}
.exit-btn {
  background: white;
  padding: 10px 24px;
  border-radius: 24px;
  border: none;
  font-size: 16px;
  font-weight: bold;
  color: #f76e6e;
  cursor: pointer;
}
.submit-btn {
  background: black;
  color: white;
  padding: 10px 24px;
  border-radius: 24px;
  border: none;
  font-size: 16px;
  cursor: pointer;
}
.exit-btn:hover,
.submit-btn:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); /* 그림자 */
  transform: translateY(-2px);               /* 살짝 위로 띄움 */
  transition: all 0.2s ease;
}

</style>
