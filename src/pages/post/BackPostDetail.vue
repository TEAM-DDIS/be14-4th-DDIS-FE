<template>
  <div v-if="todoData" class="todo-detail-page">
    <div class="todo-detail-page">
      <div class="content-container">
        <div class="content-wrapper">
          <!-- Header Section -->
          <div class="header-section" style="margin-top: 100px">
            <span class="category-tag">{{ todoData.categoryName }}</span>
            <h1 class="title">{{ todoData.title }}</h1>
            <div class="meta-info">
              <span>작성자: {{ todoData.writerName }}</span>
              <span class="divider">|</span>
              <span>작성일: {{ formatDate(todoData.createdDate) }}</span>
            </div>
          </div>

        <!-- Status Grid -->
        <div class="status-grid">
          <div class="status-item">
            <h3>참여 기간</h3>
            <p>{{ formatDateRange(todoData.startDate, todoData.endDate) }}</p>
          </div>
          <div class="status-item">
            <h3>모집 기간</h3>
            <p>{{ formatDateRange(todoData.recruitStartDate, todoData.recruitEndDate) }}</p>
          </div>
          <div class="status-item">
            <h3>참여 현황</h3>
            <p>
              <span class="highlight">{{ todoData.applicants }}</span> /
              <span>{{ todoData.limit }}명</span>
            </p>
          </div>
        </div>

        <!-- Main Content -->
        <div class="main-content">
          <section class="content-section">
            <h2>TO-DO 내용</h2>
            <div class="content-box">
              <div class="content-text">
                {{ todoData.content }}
              </div>
            </div>
          </section>
        </div>

          <!-- Action Buttons -->
          <div class="action-buttons">
            <button class="btn btn-secondary" @click="goToList">목록으로</button>
            <div class="right-buttons">
              <template v-if="isAuthor">
                <button class="btn btn-edit" @click="handleEdit">수정</button>
                <button class="btn btn-delete" @click="handleDelete">삭제</button>
              </template>
              <template v-else>
                <button class="btn btn-primary" @click="handleApply">신청하기</button>
                <button class="btn btn-create" @click="handleCreateRoom">공동방 생성</button>
              </template>
            </div>
          </div>
          <!-- 신고 버튼 -->
          <button class="report-btn" @click="handleReport">
            <span class="report-icon">⚠️</span>
            <span class="report-text">신고</span>
          </button>
        </div>
      </div>

      <!-- Edit(수정) Modal -->
      <TodoEditModal
        v-if="showEditModal"
        :todo-data="{
          title: todoData.title,
          content: todoData.content
        }"
        @close="showEditModal = false"
        @submit="handleEditSubmit"
      />

      <!-- Report Modal -->
      <ReportModal 
        v-if="showModal"
        :reportType="modalReportType"
        :reportTypeNum="modalReportTypeNum"
        @close="showModal = false"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import TodoEditModal from '@/components/post/TodoEditModal.vue'
import ReportModal from '@/components/report/ReportModal.vue'

const router = useRouter()
const route = useRoute()
const showEditModal = ref(false)
const showModal = ref(false)
const modalReportType = ref('')
const modalReportTypeNum = ref(0)
const todoData = ref(null)
const currentUserId = 1
const searchKeyword = ref('')
const sortOption = ref('latest')

// 게시글 데이터 로드
onMounted(async () => {
  try {
    const postNum = route.params.id
    console.log('🔎 요청할 postNum:', postNum)

    const res = await fetch(`http://localhost:8080/post/${postNum}`)
    if (!res.ok) throw new Error('게시글을 불러오는 데 실패했습니다.')

    const data = await res.json()
    console.log('📦 백엔드 응답 data:', data)

    // 날짜 확인용 로그 (raw)
    console.log('📆 원본 createdDate:', data.createdDate)
    console.log('📆 원본 startDate:', data.startDate)
    console.log('📆 원본 endDate:', data.endDate)
    console.log('📆 원본 recruitStartDate:', data.recruitStartDate)
    console.log('📆 원본 recruitEndDate:', data.recruitEndDate)

    // 날짜를 ISO 문자열로 변환
    data.createdDate = data.createdDate ? new Date(data.createdDate).toISOString() : null
    data.startDate = data.startDate ? new Date(data.startDate).toISOString() : null
    data.endDate = data.endDate ? new Date(data.endDate).toISOString() : null
    data.recruitStartDate = data.recruitStartDate ? new Date(data.recruitStartDate).toISOString() : null
    data.recruitEndDate = data.recruitEndDate ? new Date(data.recruitEndDate).toISOString() : null

    // 변환된 결과 확인
    console.log('✅ 변환된 날짜 데이터:', {
      createdDate: data.createdDate,
      startDate: data.startDate,
      endDate: data.endDate,
      recruitStartDate: data.recruitStartDate,
      recruitEndDate: data.recruitEndDate,
    })

    todoData.value = data
    console.log('✅ 최종 todoData:', todoData.value)
  } catch (e) {
    console.error('❌ 게시글 로딩 실패:', e)
    alert('해당 게시글을 찾을 수 없습니다.')
    router.push('/posts')
  }
})

// 작성자 여부 확인
const isAuthor = computed(() => todoData.value?.authorId === currentUserId)

// 날짜 형식 변환
const formatDate = (date) => {
  if (!date) return '날짜 없음'
  return new Date(date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 날짜 범위 형식 변환
const formatDateRange = (start, end) => {
  if (!start || !end) return '기간 없음'
  
  const formatSimpleDate = (date) => {
    return new Date(date).toLocaleDateString('ko-KR', {
      month: 'long',
      day: 'numeric'
    })
  }
  return `${formatSimpleDate(start)} ~ ${formatSimpleDate(end)}`
}

const goToList = () => {
  router.push('/posts')
}

const handleEdit = () => {
  showEditModal.value = true
}

const handleEditSubmit = (data) => {
  todoData.value.title = data.title
  todoData.value.content = data.content
  showEditModal.value = false
}

const handleDelete = async () => {
  if (confirm('정말로 삭제하시겠습니까?')) {
    try {
      const postNum = route.params.id
      const deleteDate = new Date().toISOString()

      const res = await fetch(`http://localhost:8080/post/${postNum}/soft-delete`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          deleteDate
        })
      })

      if (!res.ok) throw new Error('삭제 실패')

      alert('게시글이 삭제되었습니다.')
      router.push('/posts')
    } catch (e) {
      console.error('❌ 삭제 실패:', e)
      alert('삭제에 실패했습니다.')
    }
  }
}

const handleApply = async () => {
  try {
    const postNum = route.params.id
    // 신청 API 호출
    const res = await fetch(`http://localhost:8080/applicants/${postNum}?clientNum=${currentUserId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    if (!res.ok) throw new Error('신청 실패')
    
    // 신청 성공 시 참여자 수 증가
    if (todoData.value) {
      todoData.value.applicants = (todoData.value.applicants || 0) + 1
    }
    alert('신청이 완료되었습니다.')
  } catch (e) {
    console.error('❌ 신청 실패:', e)
    alert('신청에 실패했습니다.')
  }
}

const handleCreateRoom = async () => {
  try {
    const postNum = route.params.id

    const res = await fetch('http://localhost:8080/room', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        postNum,
        clientNum: currentUserId
      })
    })

    if (!res.ok) throw new Error('공동방 생성 실패')

    const data = await res.json()
    alert('공동방이 생성되었습니다.')
    // TODO: 생성된 공동방으로 이동
    console.log('Created room data:', data)
  } catch (e) {
    console.error('❌ 공동방 생성 실패:', e)
    alert('공동방 생성에 실패했습니다.')
  }
}

const handleReport = () => {
  modalReportType.value = 'post'
  modalReportTypeNum.value = Number(route.params.id)
  showModal.value = true
}
</script>

<style scoped>
.todo-detail-page {
  min-height: calc(100vh - 60px);
  background-color: white;
  padding: 0 1rem;
  margin-top: 80px;
  position: relative;
  top: 40px;
}

.content-container {
  max-width: 800px;
  margin: 0 auto;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
}

.content-wrapper {
  padding: 2rem;
}

/* Search and Sort Section */
.top-controls {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
  padding: 0 20px;
}

.search-sort-container {
  display: flex;
  gap: 10px;
  align-items: center;
}

.search-input {
  padding: 8px 16px;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-size: 0.9rem;
  width: 200px;
}

.sort-select {
  padding: 8px 12px;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-size: 0.9rem;
  background-color: white;
  cursor: pointer;
}

.sort-select:hover {
  border-color: #adb5bd;
}

/* Header Section */
.header-section {
  text-align: center;
  margin-bottom: 3rem;
  margin-top: -30px;
  position: relative;
  padding: 0 1rem;
}

.category-tag {
  display: inline-block;
  padding: 0.4rem 0.8rem;
  background-color: #e9ecef;
  border-radius: 20px;
  font-size: 0.9rem;
  color: #495057;
  margin-bottom: 0.8rem;
}

.title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #212529;
  margin-bottom: 0.5rem;
  word-break: keep-all;
  line-height: 1.3;
}

.meta-info {
  color: #6c757d;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.meta-info .divider {
  margin: 0 0.5rem;
}

/* Status Grid */
.status-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.status-item {
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
}

.status-item h3 {
  font-size: 0.9rem;
  color: #495057;
  margin-bottom: 0.5rem;
}

.status-item p {
  font-size: 1.1rem;
  color: #212529;
  font-weight: 500;
}

.highlight {
  color: #228be6;
  font-weight: 700;
}

/* Main Content */
.main-content {
  margin-bottom: 2rem;
}

.content-section {
  margin-bottom: 2rem;
}

.content-section h2 {
  font-size: 1.2rem;
  font-weight: 700;
  color: #212529;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e9ecef;
}

.content-box {
  background-color: #f8f9fa;
  border-radius: 12px;
  padding: 2rem;
}

.content-text {
  color: #495057;
  line-height: 1.8;
  white-space: pre-line;
  font-size: 1rem;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #e9ecef;
}

.right-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background-color: #000000;
  color: white;
}

.btn-primary:hover {
  background-color: #dee2e6;
}

.btn-secondary {
  background-color: #000000;
  color: white;
}

.btn-secondary:hover {
  background-color: #dee2e6;
}

.btn-edit {
  background-color: #000000;
  color: white;
}

.btn-edit:hover {
  background-color: #dee2e6;
}

.btn-delete {
  background-color: #000000;
  color: white;
}

.btn-delete:hover {
  background-color: #dee2e6;
}

.btn-create {
  background-color: #000000;
  color: white;
}

.btn-create:hover {
  background-color: #dee2e6;
}

/* 신고 버튼 스타일 */
.report-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background-color: transparent;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  color: #6c757d;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.report-btn:hover {
  background-color: #f8f9fa;
  color: #dc3545;
}

.report-icon {
  font-size: 1rem;
}

.report-text {
  font-size: 0.8rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .todo-detail-page {
    padding: 1rem;
  }

  .content-wrapper {
    padding: 1.5rem;
  }

  .status-grid {
    grid-template-columns: 1fr;
  }

  .title {
    font-size: 1.5rem;
  }

  .action-buttons {
    flex-direction: column-reverse;
    gap: 1rem;
  }

  .right-buttons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    width: 100%;
  }

  .btn {
    width: 100%;
  }
}
</style> 