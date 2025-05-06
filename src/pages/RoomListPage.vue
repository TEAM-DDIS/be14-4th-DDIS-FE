<template>
    <div class="page-wrapper">
      <h2 class="title">공동 To-do 방 선택</h2>
  
      <!-- 공동방 목록 -->
      <div class="story-bar">
        <div
          v-for="room in rooms"
          :key="room.roomNum"
          class="story-item"
          @click="selectRoom(room)"
        >
          <div class="circle" :style="{ backgroundColor: getColor(room.roomNum) }">
            {{ getInitial(room.title) }}
          </div>
        </div>
      </div>
  
      <!-- 선택된 방 상세 페이지 -->
      <ShareRoomPage v-if="selectedRoom" :room="selectedRoom" :clientNum="clientNum" />
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, reactive } from 'vue'
  import ShareRoomPage from '@/pages/ShareRoomPage.vue'
  import axios from '@/utils/axios'
  
  const rooms = ref([])
  const selectedRoom = ref(null)
  const token = localStorage.getItem('accessToken');
  const payload = JSON.parse(atob(token.split('.')[1]));
  const clientNum = payload.clientNum
  
  onMounted(async () => {
    try {
      const res = await fetch(`http://localhost:8080/room/member/${clientNum}`)
      rooms.value = await res.json()
    } catch (err) {
      console.error('방 목록 불러오기 실패:', err)
    }
  })
  
  function selectRoom(room) {
    console.log('클릭한 방:', room)
    selectedRoom.value = room
  }
  
  function getInitial(title) {
    return title?.charAt(0).toUpperCase() || '?'
  }
  
  function getColor(id) {
    const colors = ['#36c5f0', '#ff7f50', '#00c49f', '#ffcc00', '#9966ff']
    return colors[id % colors.length]
  }
  </script>
  
  <style scoped>
  .page-wrapper {
    padding: 32px;
    max-width: 1200px;
    margin: 0 auto;
    margin-top: 80px;
  }
  
  .title {
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 24px;
  }
  
  .story-bar {
    display: flex;
    gap: 24px;
    overflow-x: auto;
    padding: 16px 0;
    justify-content: center;
  }
  
  .story-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    gap: 8px;
  }
  
  .circle {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 22px;
    color: white;
  }
  
  .story-name {
    font-size: 15px;
    white-space: nowrap;
    color: #333;
  }
  </style>
  