<template>
    <div class="timeline-wrapper">
      <div class="timeline-line"></div>
      <div
        v-for="log in doneLogs"
        :key="log.nickname + log.doneTime"
        class="timeline-entry"
      >
        <div class="timeline-dot"></div>
        <div class="text-area">
          <p class="nickname">{{ log.nickname }}</p>
          <p class="message">{{ log.message }}</p>
          <p class="time">{{ log.doneTime }}</p>
        </div>
      </div>
    </div>
  </template>
  
  
  <script setup>
  import { ref, watch } from 'vue'
  import dayjs from 'dayjs'
  
  const props = defineProps({
    selectedDate: String,
    roomNum: Number
  })
  
  const doneLogs = ref([])
  console.log('✅ 선택한 날짜:', props.selectedDate)
  
  watch(
    () => props.selectedDate,
    async (newDate) => {
      if (!newDate) return

      console.log('✅ done-log 요청 날짜:', newDate)
      const formattedDate = dayjs(newDate).format('YYYY-MM-DD')
      try {
        const res = await fetch(
          `http://localhost:8080/calendar/room/${props.roomNum}/done-logs?date=${newDate}`
        )
        if (!res.ok) throw new Error('완료 로그 불러오기 실패')
        doneLogs.value = await res.json()
      } catch (err) {
        console.error('Done log fetch error:', err)
      }
    },
    { immediate: true }
  )
  </script>
  
  <style scoped>
  .timeline-wrapper {
    position: relative;
    padding-left: 40px;
    margin-top: 30px;
  }
  
  .timeline-line {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 20px;
    width: 4px;
    background: #7bd4c2;
  }
  
  .timeline-entry {
    position: relative;
    margin-bottom: 30px;
  }
  
  .timeline-dot {
    position: absolute;
    left: 12px;
    width: 16px;
    height: 16px;
    background: #7bd4c2;
    border-radius: 50%;
    z-index: 1;
  }
  
  .text-area {
    display: inline-block;
    margin-left: 30px;
    vertical-align: top;
  }
  
  .nickname {
    font-weight: bold;
    font-size: 16px;
  }
  
  .message {
    font-size: 14px;
    margin: 4px 0;
  }
  
  .time {
    font-size: 12px;
    color: #888;
  }
  </style>
  