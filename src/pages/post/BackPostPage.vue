<!-- 백엔드 연동중인 페이지 -->

<template>
  <div class="board-container">
    <div class="board-header">
      <div class="left-section">
        <h1 class="board-title">모집 게시판</h1>
        <div class="category-tabs">
          <button
            class="tab"
            :class="{ active: selectedCategory === '전체' }"
            @click="selectedCategory = '전체'"
          >
            전체
          </button>

          <button
            v-for="category in categories"
            :key="category.categoryNum"
            class="tab"
            :class="{ active: selectedCategory === category.categoryName }"
            @click="selectedCategory = category.categoryName"
          >
            {{ category.categoryName }}
          </button>
        </div>
      </div>
      <div class="right-section">
        <div class="search-sort-container">
          <input type="search" v-model="searchKeyword" placeholder="검색어를 입력하세요" class="search-input" />
          <select v-model="sortOption" class="sort-select">
            <option value="latest">최신순</option>
            <option value="oldest">오래된순</option>
          </select>
        </div>
      </div>
    </div>

    <table class="board-table">
      <thead>
        <tr>
          <th>번호</th>
          <th>카테고리</th>
          <th>제목</th>
          <th>상태</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in paginatedFilteredItems" :key="item.id" @click="goToDetail(item.id)" style="cursor: pointer">
          <td>{{ item.id }}</td>
          <td>{{ item.category }}</td>
          <td>{{ item.title }}</td>
          <td>{{ item.status }}</td>
        </tr>
      </tbody>
    </table>

    <Pagenation
      v-if="totalPages > 1"
      :total-pages="totalPages"
      :current-page="currentPage"
      @change="movePage"
    />

    <button class="register-btn" @click="isModalOpen = true">등록</button>

    <PostModal
    v-model="isModalOpen"
    :categories="categories"
    @submit="handlePostSubmit"
  />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import PostModal from '@/components/post/PostModal.vue'
import Pagenation from '@/components/pagenation/Pagenation.vue'

const router = useRouter()
const items = ref([])
const isModalOpen = ref(false)
const pageSize = 10
const currentPage = ref(1)
const categories = ref([])
const selectedCategory = ref('전체')
const searchKeyword = ref('')
const sortOption = ref('latest')
const token = localStorage.getItem('accessToken');
const payload = JSON.parse(atob(token.split('.')[1]));
const clientId = payload.clientNum

onMounted(async () => {
  try {
    const res = await fetch('http://localhost:8080/post/public', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!res.ok) {
      throw new Error(data.message || '게시글 목록 조회 실패')
    }

    const data = await res.json()

    console.log('Received data:', data);

    if (!Array.isArray(data)) {
      throw new Error('서버 응답이 배열 형식이 아닙니다.')
    }

    items.value = data.map(item => ({
      id: item.postNum,
      category: item.categoryName,
      title: item.postTitle,
      is_closed: item.isClosed ?? false,
      startDate: item.recruitmentStartDate,
      endDate: item.recruitmentEndDate,
      status: item.isClosed ? '모집마감' : '모집중'
    }))

    // 🔥 카테고리 목록 가져오기
    const categoryRes = await fetch('http://localhost:8080/categories') 
    const categoryData = await categoryRes.json()
    if (Array.isArray(categoryData)) {
      categories.value = categoryData // categoryNum, categoryName 그대로 사용
    }
    } catch (e) {
      console.error('❌ 데이터 불러오기 실패:', e)
      items.value = []
    }
  })
  

const filteredItems = computed(() => {
  let list = [...items.value]

  if (selectedCategory.value !== '전체') {
    list = list.filter(item => item.category === selectedCategory.value)
  }

  if (searchKeyword.value.trim() !== '') {
    list = list.filter(item => item.title.includes(searchKeyword.value))
  }

  if (sortOption.value === 'latest') {
    list.sort((a, b) => b.id - a.id)
  } else {
    list.sort((a, b) => a.id - b.id)
  }

  return list.map(item => ({
    ...item,
    status: item.is_closed ? '모집마감' : '모집중'
  }))
})

const totalPages = computed(() => Math.ceil(filteredItems.value.length / pageSize))

const paginatedFilteredItems = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredItems.value.slice(start, end)
})

function movePage(page) {
  currentPage.value = page
}

const goToDetail = (id) => {
  if (!id) {
    alert('잘못된 게시글 번호입니다.');
    return;
  }
  router.push(`/post/${id}`)
}

const handlePostSubmit = async (formData) => {
  try {
    console.log('Submitting form data:', formData);

    const requestData = {
      categoryNum: formData.category.categoryNum,
      postTitle: formData.title,
      postContent: formData.content,
      recruitmentStartDate: formData.recruitStartDate,
      recruitmentEndDate: formData.recruitEndDate,
      startDate: formData.participateStartDate,
      endDate: formData.participateEndDate,
      recruitmentLimit: formData.maxParticipants,
      isPublic: formData.visibility === 'public',
      postPassword: formData.password || null,
      clientNum: clientId
    }

    console.log('Sending request data:', requestData);

    const res = await fetch('http://localhost:8080/post/createPost', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    })

    const responseData = await res.json()
    
    if (!res.ok) {
      throw new Error(responseData.message || '게시글 등록 실패');
    }

    console.log('Response data:', responseData);
    
    // 기존 목록에 새 게시글 추가
    items.value.unshift({
      id: responseData.post_num,
      category: responseData.category_name,
      title: responseData.post_title,
      is_closed: false,
      startDate: responseData.recruitment_start_date,
      endDate: responseData.recruitment_end_date,
      status: '모집중'
    })

    // showModal.value = false
    alert('게시글이 등록되었습니다.')
  } catch (e) {
    console.error('❌ 게시글 등록 실패:', e)
    alert(e.message || '게시글 등록에 실패했습니다.')
  }
}
</script>


<style scoped>
.board-container {
  padding: 120px 20px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.board-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
  width: 100%;
}

.left-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-bottom: 30px;
}

.board-title {
  font-size: 1.75rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 30px;
}

.category-tabs {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
  margin-bottom: 40px;
  width: 100%;
}

.tab {
  padding: 8px 16px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 16px;
  position: relative;
  text-align: center;
}

.tab:hover {
  color: #50D4C6;
}

.tab.active {
  color: #50D4C6;
  font-weight: bold;
}

.tab.active::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #50D4C6;
}

.right-section {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-left: auto;
  padding-right: 20px;
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

.board-table {
  margin-top: 30px;
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  text-align: center;
}

.board-table th,
.board-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.board-table th {
  border-bottom: 2px solid #ddd;
}

.board-table tbody tr {
  cursor: pointer;
  transition: color 0.2s ease;
}

.board-table tbody tr:hover {
  color: #50D4C6;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
  gap: 1rem;
}

.page-button {
  padding: 0.5rem 1rem;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 1rem;
  color: #666;
}

.page-button.active {
  font-weight: bold;
  color: #50D4C6;
}

.page-button:hover {
  color: #50D4C6;
}

.register-btn {
  padding: 8px 24px;
  background-color: #000;
  color: #fff;
  border: none;
  border-radius: 4px;
  float: right;
  cursor: pointer;
}

.register-btn:hover {
  background-color: #333;
}
</style>
`