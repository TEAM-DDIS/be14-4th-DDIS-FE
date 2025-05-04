<template>
    <div class="modal-overlay" @click.self="close">
        <div class="modal-content">
          <div class="modal-title-area">
            <div v-if="!isEditingTitle" class="title-display" @click="editTitle">
              {{ title || '제목입력' }}
            </div>
            <input
              v-else
              v-model="title"
              class="modal-input"
              @blur="isEditingTitle = false"
              @keyup.enter="isEditingTitle = false"
              placeholder="제목을 입력하세요"
              autofocus
            />
          </div>

          <textarea
            v-model="content"
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
  // import { defineEmits, ref } from 'vue'
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'

  const router = useRouter()
  
  const emit = defineEmits(['close', 'submit'])

  const title = ref('')
  const content = ref('')
  const isEditingTitle = ref(false)
  
  function close() {
    emit('close')
  }
  
  function submit() {
    if (!title.value.trim() || !content.value.trim()) {
      alert('제목과 내용을 모두 입력해주세요.')
      return
    }

    emit('submit', {
      title: title.value,
      content: content.value,
    })
      // 초기화
    title.value = ''
    content.value = ''
    isEditingTitle.value = false
  }

  function editTitle() {
    isEditingTitle.value = true
  }
</script>
  
<style scoped>
    .modal-overlay {
      position: fixed;
      top: 0; left: 0;
      width: 100vw;
      height: 100vh;
      background-color: rgba(0, 0, 0, 0.6); /* 배경색과 투명도 */
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 999;
    }
  
    .modal-content {
      background: white;
      border-radius: 12px;
      padding: 24px;
      width: 90%;
      max-width: 500px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .modal-title-area {
      border-bottom: 3px solid #eee;
      padding-bottom: 8px;
    }

    .title-display {
      font-size: 20px;
      font-weight: bold;
      color: #333;
      cursor: text;
      padding: 6px 2px;
    }

    .modal-input {
      border: none;
      background: #fafafa;
      border-radius: 8px;
      padding: 10px 12px;
      font-size: 15px;
      font-weight: bold;
      width: 100%;
      box-sizing: border-box;
    }
    
    .modal-textarea {
      width: 100%;
      height: 200px;
      border: none;
      resize: none;
      font-size: 15px;
      font-weight: bold;
      padding: 12px;
      box-sizing: border-box;
      background: #fafafadd;
      border-radius: 8px;
    }
    
    .modal-buttons {
      display: flex;
      justify-content: space-between;
      margin-top: 8px;
    }
    
    .exit-btn {
      background: white;
      padding: 8px 20px;
      border-radius: 24px;
      border: none;
      font-size: 16px;
      color: #555;
      cursor: pointer;
    }
    
    .submit-btn {
      background: black;
      color: white;
      padding: 8px 20px;
      border-radius: 24px;
      border: none;
      font-size: 15px;
      font-weight: bold;
      cursor: pointer;
    }

    .exit-btn:hover,
    .submit-btn:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); /* 그림자 */
      transform: translateY(-2px);               /* 살짝 위로 띄움 */
      transition: all 0.2s ease;
    }
</style>
  