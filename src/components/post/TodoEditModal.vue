<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <h2>TO-DO 수정</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="title">제목</label>
          <input 
            id="title" 
            v-model="formData.title" 
            required
            class="form-input"
            placeholder="제목을 입력하세요"
          />
        </div>

        <div class="form-group">
          <label for="content">내용</label>
          <div class="content-guide">
            아래 형식에 맞춰 작성해주세요:
            <pre class="guide-format">
[TO-DO 소개]
소개 내용을 작성하세요.

[TO-DO 리스트]
• 할 일 1
• 할 일 2
• 할 일 3

[인증 방법]
인증 방법을 작성하세요.</pre>
          </div>
          <textarea 
            id="content" 
            v-model="formData.content" 
            required
            class="form-textarea"
            rows="15"
            placeholder="내용을 입력하세요"
          ></textarea>
        </div>

        <div class="button-group">
          <button type="button" class="btn btn-cancel" @click="closeModal">취소</button>
          <button type="submit" class="btn btn-submit">수정</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'

interface TodoData {
  title: string
  content: string
}

const props = defineProps<{
  todoData: TodoData
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', data: { title: string; content: string }): void
}>()

const formData = ref({
  title: props.todoData.title,
  content: props.todoData.content
})

const closeModal = () => {
  emit('close')
}

const handleSubmit = () => {
  emit('submit', {
    title: formData.value.title,
    content: formData.value.content
  })
  closeModal()
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #212529;
  margin-bottom: 1.5rem;
  text-align: center;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #495057;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  font-size: 1rem;
  color: #495057;
  transition: border-color 0.2s;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #228be6;
}

.form-textarea {
  resize: vertical;
  min-height: 200px;
  line-height: 1.6;
}

.content-guide {
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: #495057;
}

.guide-format {
  margin: 0.5rem 0 0;
  padding: 0.5rem;
  background-color: white;
  border-radius: 4px;
  font-size: 0.85rem;
  color: #868e96;
  white-space: pre-wrap;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.btn {
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel {
  background-color: #e9ecef;
  color: #495057;
}

.btn-cancel:hover {
  background-color: #dee2e6;
}

.btn-submit {
  background-color: #228be6;
  color: white;
}

.btn-submit:hover {
  background-color: #1c7ed6;
}

@media (max-width: 768px) {
  .modal-content {
    padding: 1.5rem;
  }

  .button-group {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style> 