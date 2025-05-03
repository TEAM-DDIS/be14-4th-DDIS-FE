<template>
    <div class="modal-overlay" @click.self="close">
      <div class="modal-box">
        <p class="modal-message">정말 삭제하시겠습니까?</p>
        <div class="button-row">
          <button class="cancel-btn" @click="close">취소</button>
          <button class="delete-btn" @click="confirmDelete">삭제</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  const emit = defineEmits(['close', 'confirm'])
  
  function close() {
    emit('close')
  }
  
  function confirmDelete() {
    emit('confirm')
  }
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0; left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
  }
  
  .modal-box {
    background: white;
    border-radius: 14px;
    padding: 30px;
    width: 280px;
    text-align: center;
    box-shadow: 0 10px 20px rgba(0,0,0,0.2);
  }
  
  .modal-message {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 20px;
  }
  
  .button-row {
    display: flex;
    justify-content: space-between;
    gap: 12px;
  }
  
  .cancel-btn {
    flex: 1;
    padding: 10px;
    background: #ddd;
    color: black;
    font-weight: bold;
    border: none;
    border-radius: 8px;
    cursor: pointer;
  }
  
  .delete-btn {
    flex: 1;
    padding: 10px;
    background: #e84545;
    color: white;
    font-weight: bold;
    border: none;
    border-radius: 8px;
    cursor: pointer;
  }
  .cancel-btn:hover,
  .delete-btn:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); /* 그림자 */
    transform: translateY(-2px);               /* 살짝 위로 띄움 */
    transition: all 0.2s ease;
  }

  </style>
  