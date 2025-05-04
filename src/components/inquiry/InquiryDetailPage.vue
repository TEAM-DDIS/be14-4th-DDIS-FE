<template>
  <div class="inquiry-detail-page">
    <h1 class="main-title">문의 사항</h1>

    <div class="inquiry-box">
      <div class="title-row">
        <h3 class="inquiry-title">{{ inquiry.title }}</h3>
        <span class="inquiry-date">{{ inquiry.date }}</span>
      </div>

      <div class="inquiry-client">작성자: {{ inquiry.client }}</div>

      <div class="inquiry-content">
        {{ inquiry.content }}
      </div>
    </div>

    <div class="bottom-btn">
      <RouterLink to="/inquiry">
        <button class="back-btn">목록</button>
      </RouterLink>
    </div>

    <div class="comment-section">
      <h4 class="comment-title">문의 사항 답변</h4>

      <div v-if="comments.length">
        <div class="comment" v-for="c in comments" :key="c.id">
            <div class="comment-meta">
              <span class="comment-date">{{ c.date }}</span>
            </div>
            <div class="comment-content">{{ c.content }}</div>
          </div>
        </div>
        <p v-else class="no-comments">답변이 없습니다.</p>
      </div>


  </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue'
    import { useRoute } from 'vue-router'
    import axios from '@/utils/axios'
  
    const inquiry = ref({})
    const route = useRoute()

    const comments = ref([])       // 댓글 목록

    const showEditModal = ref(false)
    const showDeleteModal = ref(false)
    
    const newComment = ref('')


    onMounted(async () => {
      const id = route.params.id
      try {
        const res = await axios.get(`http://localhost:3001/inquiries/${id}`)
        inquiry.value = res.data

            // 댓글 불러오기
        const cRes = await axios.get(`http://localhost:3001/inquiries_response?inquiryId=${id}`)
        comments.value = cRes.data
      } catch (err) {
        console.error('문의사항 상세 조회 실패:', err)
      }
    })

</script>

<style scoped>
  .inquiry-detail-page {
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

  .inquiry-box {
    padding-top: 20px;
    position: relative;
  }

  .title-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding-bottom: 12px;
  }

  .inquiry-title {
    font-size: 20px;
    font-weight: bold;
  }

  .inquiry-date {
    font-size: 14px;
    color: #777;
    margin-bottom: 20px;
    margin-right: 30px;
  }

  .action-row {
    position: absolute;
    top: 16px;
    right: 0;
    display: flex;
    gap: 10px;
    margin-right: 30px;
  }

  .action-btn {
    background: none;
    border: none;
    font-size: 15px;
    color: #000;
    font-weight: bold;
    cursor: pointer;
    padding: 4px 8px;
  }

  .inquiry-client{
    margin-top: 20px;
    font-size: 16px;
    color: gray;
  }

  .inquiry-content {
    margin-top: 50px;
    line-height: 1.6;
    white-space: pre-line;
    font-size: 18px;
    padding-bottom: 100px;
  }

  .bottom-btn {
    text-align: center;
    margin-top: 100px;
    font-weight: bold;
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

  .comment-section {
    margin-top: 80px;
    padding-top: 40px;
    border-top: 2px solid #ddd;
  }

  .comment-title {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 20px;
  }

  .comment {
    padding: 20px 0;
  }

  .comment-meta {
    font-size: 14px;
    color: #555;
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .comment-content {
    font-size: 16px;
    margin-top: 5px;
    white-space: pre-wrap;
  }

  .no-comments {
    color: #999;
    font-size: 16px;
    border-bottom: 2px solid #eee;
    padding: 20px 0;
  }
</style>
