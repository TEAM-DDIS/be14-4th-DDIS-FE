<template>
  <div class="notice-detail-page">
    <h1 class="main-title">공지 사항</h1>

    <div class="notice-box">
      <div class="title-row">
        <h3 class="notice-title">{{ notice.title }}</h3>
        <span class="notice-date">{{ notice.date }}</span>
      </div>



      <div class="notice-content">
        {{ notice.content }}
      </div>
    </div>

    <div class="bottom-btn">
      <RouterLink to="/notice">
        <button class="back-btn">목록</button>
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue'
    import { useRoute } from 'vue-router'
    import axios from '@/utils/axios'

    const notice = ref({})
    const route = useRoute()

    onMounted(async () => {
      const id = route.params.id
      try {
        const res = await axios.get(`http://localhost:3001/notices/${id}`)
        notice.value = res.data
      } catch (err) {
        console.error('공지사항 상세 조회 실패:', err)
      }
    })
</script>

<style scoped>
  .notice-detail-page {
    max-width: 700px;
    margin: 100px auto;
    background: white;
    padding: 40px;
    border-radius: 10px;
    /* font-family: 'Pretendard', sans-serif; */
  }

  .main-title {
    font-size: 30px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 40px;
  }

  .notice-box {
    padding-top: 20px;
    position: relative;
  }

  .title-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding-bottom: 12px;
  }

  .notice-title {
    font-size: 20px;
    font-weight: bold;
  }

  .notice-date {
    font-size: 14px;
    color: #777;
    margin-bottom: 20px;
    margin-right: 30px;
  }

  .notice-content {
    margin-top: 50px;
    line-height: 1.6;
    white-space: pre-line;
    font-size: 18px;
    padding-bottom: 100px;
  }

  .bottom-btn {
    text-align: center;
    margin-top: 200px;
    font-weight: bold;
    margin-bottom: 80px;
  }

  .back-btn {
    background: black;
    color: white;
    padding: 10px 32px;
    border: none;
    border-radius: 24px;
    font-size: 15px;
    font-weight: bold;
    cursor: pointer;
  }
</style>
