<template>
  <div class="inquiry-detail-page">
    <h1 class="main-title">문의 사항</h1>

    <div class="inquiry-box">
      <div class="title-row">
        <h3 class="inquiry-title">{{ inquiry.title }}</h3>
        <span class="inquiry-date">{{ inquiry.date }}</span>
      </div>

      <div class="action-row">
        <button class="action-btn" @click="showEditModal = true">수정</button>
        <button class="action-btn" @click="showDeleteModal = true">삭제</button>
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
    
      <!-- 댓글 입력 -->
    <div class="comment-form">
      <input
        v-model="newComment"
        class="comment-input"
        placeholder="댓글을 입력하세요"
      />
      <button class="comment-submit" @click="submitComment">저장</button>
    </div>


      <!-- 🔻 수정 모달 -->
      <EditInquiryModal
        v-if="showEditModal"
        :inquiry="inquiry"
        @close="showEditModal = false"
        @update="handleUpdate"
      />
      <DeleteInquiryModal
        v-if="showDeleteModal"
        @close="showDeleteModal = false"
        @confirm="handleDelete"
      />

  </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue'
    import { useRoute } from 'vue-router'
    import axios from '@/utils/axios'
    import EditInquiryModal from '@/components/inquiry/EditInquiryModal.vue'
    import DeleteInquiryModal from '@/components/inquiry/DeleteInquiryModal.vue'

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
      } catch (err) {
        console.error('문의사항 상세 조회 실패:', err)
      }
    })

    function handleUpdate(updatedData) {
      inquiry.value.title = updatedData.title
      inquiry.value.content = updatedData.content
      showEditModal.value = false
    }

    async function handleDelete() {
      const id = route.params.id

      try {
        // 댓글 목록 가져오기
        const commentRes = await axios.get(`http://localhost:3001/inquiries_response?inquiryId=${id}`)
        const commentList = commentRes.data

        // 각 댓글 개별 삭제
        for (const comment of commentList) {
          await axios.delete(`http://localhost:3001/inquiries_response/${comment.id}`)
        }

        // 문의사항 삭제
        await axios.delete(`http://localhost:3001/inquiries/${id}`)

        alert('삭제되었습니다.')
        router.push('/inquiry')
      } catch (err) {
        console.error('삭제 실패:', err)
        alert('삭제에 실패했습니다.')
      }
    }

    async function submitComment() {
      if (!newComment.value.trim()) return alert('댓글을 입력하세요.')

      const comment = {
        inquiryId: inquiry.value.id,
        content: newComment.value,
        date: new Date().toISOString().slice(0, 10)
      }

      try {
        const res = await axios.post(`http://localhost:3001/inquiries_response`, comment)
        comments.value.push(res.data)
        newComment.value = ''
      } catch (err) {
        console.error('댓글 등록 실패:', err)
        alert('댓글 등록에 실패했습니다.')
      }
    }
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
    margin-bottom: 5px;
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

  .comment-form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 20px;
    align-items: center; 
  }

  .comment-input {
    width: 100%;
    flex: 1;
    padding: 10px;
    font-size: 15px;
    border: 1px solid #ccc;
    border-radius: 8px;
  }

  .comment-submit {
    background: black;
    color: white;
    padding: 10px 32px;
    font-weight: bold;
    font-size: 15px;
    border-radius: 24px;
    cursor: pointer;
    border: none;
  }
</style>
