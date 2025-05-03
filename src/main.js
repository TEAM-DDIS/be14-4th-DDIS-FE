import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import VCalendar from 'v-calendar'
import 'v-calendar/style.css'
import router from './router'

// main.js 또는 main.ts 상단에 추가
window.global = window

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(VCalendar, {
  locales: {
    'ko': {
      firstDayOfWeek: 1, // 월요일 시작
      masks: {
        title: 'YYYY년 M월',
        weekdays: 'WWW',  // 월, 화, 수, 목, 금, 토, 일
        navMonths: 'M월',
        input: ['YYYY-MM-DD', 'YYYY/MM/DD'],
        dayPopover: 'YYYY년 M월 D일',
      }
    }
  },
  locale: 'ko' // 여기 추가
})
app.mount('#app')
