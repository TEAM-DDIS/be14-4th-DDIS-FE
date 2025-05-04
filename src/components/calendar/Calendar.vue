<template>
  <div class="calendar-wrapper">
    <VCalendar
      v-model="focusedDate"
      is-expanded
      :attributes="[]"
      title-position="center"
      hide-header
      class="custom-calendar"
      :week-start="1"
    >
      <template #day-content="{ day }">
        <div class="date-svg-cell" @click="selectDate(day)">
          <component
            :is="getStoneComponent(day.day)"
            :fill="getDayColor(dayjs(day.date).format('YYYY-MM-DD'))"
            class="stone-svg"
          />
          <span
            class="date-text"
            :class="{
              sunday: day.weekday === 1,
              saturday: day.weekday === 7,
              selected: isSelected(day)
            }"
          >
            {{ day.day }}
          </span>
        </div>
      </template>
    </VCalendar>
  </div>
</template>

<script setup>
import { ref, computed, defineModel, onMounted } from 'vue'
import dayjs from 'dayjs'
import Stone01 from '@/components/stone/Stone01.vue'
import Stone02 from '@/components/stone/Stone02.vue'
import Stone03 from '@/components/stone/Stone03.vue'
import Stone04 from '@/components/stone/Stone04.vue'
import Stone05 from '@/components/stone/Stone05.vue'

const props = defineProps({
  roomNum: Number,
  clientNum: Number
})

const focusedDate = defineModel('focusedDate')
const emit = defineEmits(['update-todo-approve'])
const selectedDate = ref(null)
const colorMap = ref({})

const stoneComponents = [Stone01, Stone02, Stone03, Stone04, Stone05]
const getStoneComponent = (day) => stoneComponents[(day - 1) % stoneComponents.length]

const getDayColor = (dateStr) => {
  return colorMap.value[dateStr] || '#F2F2F2'
}

async function fetchHeatMapData() {
  try {
    const res = await fetch(`http://localhost:8080/calendar/room/${props.roomNum}/color-mapping`)
    if (!res.ok) throw new Error('히트맵 색상 데이터 불러오기 실패')
    colorMap.value = await res.json()
  } catch (err) {
    console.error('HeatMap 로딩 실패:', err)
  }
}

async function selectDate(day) {
  selectedDate.value = day.id
  focusedDate.value = new Date(day.id)
  try {
    const res = await fetch(`http://localhost:8080/calendar/room/${props.roomNum}/todos?clientNum=${props.clientNum}&date=${day.id}`)
    const data = await res.json()

    const newTodoList = data.map(item => ({
      memberShareTodoNum: item.memberShareTodoNum,
      shareTodoNum: item.shareTodoNum,
      shareTodoName: item.shareTodoName
    }))

    const newApproveList = data.filter(item => item.approveNum !== null).map(item => ({
      id: item.approveNum,
      title: item.approveTitle,
      content: item.approveContent,
      time: item.approveTime,
      permitCount: item.approvePermitCount,
      refuseCount: item.approveRefuseCount
    }))

    emit('update-todo-approve', { todoList: newTodoList, approveList: newApproveList, selectedDate: day.id })
  } catch (err) {
    console.error('날짜별 투두 로딩 실패:', err)
  }
}

function isSelected(day) {
  return selectedDate.value === day.id
}

onMounted(fetchHeatMapData)
</script>


  
  <style scoped>
  .calendar-wrapper {
    width: 720px;
    padding: 32px;
    border: 1px solid #CDCDCD;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  
  :deep(.custom-calendar .vc-weeks) {
    min-height: unset !important;
    transition: height 0.3s ease;

  }
  
  .date-svg-cell {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: 87px;
    height: 112px;
    margin: 4px;
    position: relative;
  }
  
  .stone-svg {
    width: 73px;
    height: 70px;
    margin-bottom: 2px;
  }
  
  .date-text {
    margin-top: 4px;
    font-size: 15px;
    font-weight: 500;
    color: #222 !important;
    z-index: 2;
    transition: all 0.12s;
  }
  
  .date-text.sunday {
    color: #FF1B1B !important;
    font-weight: 700 !important;
  }
  
  .date-text.saturday {
    color: #3A43FF !important;
    font-weight: 700 !important;
  }
  
  .date-text.selected {
    background: #111;
    color: #fff !important;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700 !important;
    font-size: 18px;
    margin: 0 auto;
  }
  
  :deep(.custom-calendar) {
    border: none !important;
    box-shadow: none !important;
    border-radius: 20px !important;
    background: #fff !important;
  }
  
  :deep(.custom-calendar .vc-pane-container),
  :deep(.custom-calendar .vc-pane-layout),
  :deep(.custom-calendar .vc-pane) {
    border: none !important;
    box-shadow: none !important;
    border-radius: 20px !important;
    background: #fff !important;
  }
  
  :deep(.custom-calendar .vc-weekdays) {
    border-top: 2px solid #CDCDCD !important;
    padding-top: 10px;
  }
  
  :deep(.custom-calendar .vc-weekdays .vc-weekday:nth-child(1)) {
    color: #FF1B1B !important;
    font-weight: 700 !important;
  }
  
  :deep(.custom-calendar .vc-weekdays .vc-weekday:nth-child(7)) {
    color: #3A43FF !important;
    font-weight: 700 !important;
  }
  
  :deep(.custom-calendar .vc-title) {
    font-size: 26px !important;
    font-weight: 800 !important;
    letter-spacing: -1px;
    color: #222;
  }
  </style>
  