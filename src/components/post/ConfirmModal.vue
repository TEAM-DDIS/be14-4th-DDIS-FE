<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <h2>{{ title }}</h2>
      <p class="message">{{ message }}</p>
      <div class="button-group">
        <button class="cancel-btn" @click="closeModal">취소</button>
        <button class="confirm-btn" @click="handleConfirm">확인</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const props = defineProps<{
  title: string
  message: string
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm'): void
}>()

const closeModal = () => {
  emit('update:modelValue', false)
}

const handleConfirm = () => {
  emit('confirm')
  closeModal()
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  text-align: center;
}

h2 {
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.message {
  margin-bottom: 2rem;
  color: #666;
}

.button-group {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.cancel-btn,
.confirm-btn {
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
}

.cancel-btn {
  background: #6c757d;
  color: white;
}

.confirm-btn {
  background: #000;
  color: white;
}

.cancel-btn:hover,
.confirm-btn:hover {
  opacity: 0.9;
}
</style> 