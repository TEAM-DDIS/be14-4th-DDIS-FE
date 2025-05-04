<template>
  <div class="calendar-wrapper">
    <v-calendar
      is-expanded
      :attributes="[]"
      title-position="center"
      hide-header
      :title-format="formatTitle"
      class="custom-calendar"
      :week-start="1"
    >
      <template #day-content="{ day }">
        <div class="date-svg-cell" @click="handleSelect(day)">
          <component
            :is="getStoneComponent(day.day)"
            :fill="getDayColor(day)"
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
    </v-calendar>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue'
import Stone01 from '@/components/stone/Stone01.vue'
import Stone02 from '@/components/stone/Stone02.vue'
import Stone03 from '@/components/stone/Stone03.vue'
import Stone04 from '@/components/stone/Stone04.vue'
import Stone05 from '@/components/stone/Stone05.vue'

const props = defineProps({
  dayCompletionRate: Object,  // 일별 완료 비율
  todoExistsDates: Object,    // 할 일이 존재하는 날짜
  selectedDate: String       // 선택된 날짜
})

const emit = defineEmits(['select-date'])

const stoneComponents = [Stone01, Stone02, Stone03, Stone04, Stone05]
const getStoneComponent = (day) => stoneComponents[(day - 1) % stoneComponents.length]

function formatTitle({ year, month }) {
  return `${year}년 ${month}월`
}

function handleSelect(day) {
  const localDate = formatLocalDate(day.date)
  emit('select-date', localDate)
}

function isSelected(day) {
  return formatLocalDate(day.date) === props.selectedDate
}

function getDayColor(day) {
  const dateStr = formatLocalDate(day.date)
  const rate = props.dayCompletionRate[dateStr] || 0
  const hasTodo = props.todoExistsDates?.[dateStr] || false

  if (rate === 0 && hasTodo) return '#DBDBDB'  // 할 일이 있는데 완료되지 않은 날
  if (rate === 0) return '#F2F2F2'  // 할 일이 없거나 완료되지 않은 날

  const baseColor = '80, 212, 198'  // 기본 색상 (컬러의 채도와 불투명도 조정)
  return `rgba(${baseColor}, ${rate})`
}

function formatLocalDate(dateInput) {
  const date = new Date(dateInput)
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

function pad(n) {
  return n.toString().padStart(2, '0')
}
</script>

<style scoped>
.calendar-wrapper {
  justify-items: center;
  width: 100%;
  max-width: 750px;
  margin: 0 auto;
  padding: 5px 0 10px;
  border: 1.5px solid #ededed;
  border-radius: 18px;
  box-shadow: 0 2px 10px 0 rgba(30, 30, 30, 0.04);
  background: #fff;
}

:deep(.custom-calendar .vc-weeks) {
  min-height: unset !important;
}

:deep(.custom-calendar .vc-weekdays .vc-weekday:nth-child(1)) {
  color: #FF1B1B !important;
  font-weight: 700 !important;
}
:deep(.custom-calendar .vc-weekdays .vc-weekday:nth-child(7)) {
  color: #3A43FF !important;
  font-weight: 700 !important;
}

.date-svg-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 81px;
  height: 112px;
  margin: 8px 11.5px 5.5px;
  position: relative;
}

.stone-svg {
  width: 65px;
  height: 62px;
  margin-bottom: 2px;
  filter: drop-shadow(0px 0px 4px rgba(0, 0, 0, 0.1));
  transition: transform 0.25s ease, filter 0.25s ease;
}

.date-svg-cell:hover .stone-svg {
  transform: scale(1.03);
  filter: brightness(1.1) drop-shadow(0px 3px 6px rgba(0, 0, 0, 0.25));
}

.date-text {
  margin-top: 4px;
  font-size: 15px;
  font-weight: 500;
  color: #222 !important;
  z-index: 2;
  transition: all 0.12s;
  user-select: none;
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
  font-weight: 600 !important;
  font-size: 16px;
  margin: 0 auto;
}

:deep(.custom-calendar .vc-pane-container),
:deep(.custom-calendar .vc-pane-layout),
:deep(.custom-calendar .vc-pane),
:deep(.custom-calendar),
:deep(.custom-calendar .vc-weekdays) {
  background: #fff !important;
  border: none !important;
  box-shadow: none !important;
  border-radius: 20px !important;
}

:deep(.custom-calendar .vc-weekdays) {
  border-top: 1px solid #eee !important;
  padding-top: 15px;
}

:deep(.custom-calendar .vc-title) {
  font-size: 24px !important;
  font-weight: 600 !important;
  letter-spacing: -1px;
  color: #222;
  background: none !important;
  box-shadow: none !important;
}
</style>
